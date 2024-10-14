import React, { useState, useEffect } from 'react';
import { ColumnsType } from 'antd/es/table';
import { Table, Tag, Avatar, message, Modal, List, Button } from 'antd';
import EditDelete from '../../components/EditDelete/EditDelete.tsx';
import api from '../../connection/api';
import dayjs from 'dayjs';

interface Punch {
  status: string;
  hours: string;
}

interface DataType {
  key: string;
  applicant: string;
  type: string;
  tags: string[];
  justification?: string;
  punches?: Punch[];
  status: string;
}

interface RequestTableProps {
  filters: string[];
  onActionCompleted: () => void;
}

const RequestTable: React.FC<RequestTableProps> = ({ filters, onActionCompleted }) => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DataType | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const teamString = localStorage.getItem('team');
      let teamId;
      if (teamString) {
        try {
            const team = JSON.parse(teamString);
            teamId = team.id;
        } catch (error) {
            console.error('Erro ao analisar o JSON:', error);
        }
      } else {
          console.log('Nenhum item "team" encontrado no localStorage.');
      }

      const typeMapping: { [key: string]: string } = {
        '1': 'ADICAO_DE_PONTO',
        '2': 'DELETAR',
        '3': 'ABONO',
        '4': 'ATESTADO',
      };

      const statusMapping: { [key: string]: string } = {
        'em_aberto': 'PENDENTE',
        'aprovados': 'APROVADO',
        'reprovados': 'REPROVADO',
      };

      const selectedTypes = filters
        .filter(value => Object.keys(typeMapping).includes(value))
        .map(value => typeMapping[value]);

      const selectedStatuses = filters
        .filter(value => Object.keys(statusMapping).includes(value))
        .map(value => statusMapping[value]);

      const filterData = {
        teamId: teamId,
        types: selectedTypes,
        statuses: selectedStatuses,
      };

      const response = await api.post('/api/request/filter', filterData);

      const fetchedData = response.data.map((request: any) => ({
        key: request.id.toString(),
        applicant: request.user?.name || 'Desconhecido',
        type: request.requestType,
        tags: [request.status],
        justification: request.justification,
        punches: request.punches,
        status: request.status,
      }));
      setData(fetchedData);
    } catch (error) {
      message.error('Erro ao buscar as solicitações');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filters]);

  const getInitials = (applicant: string) => {
    if (typeof applicant === 'string') {
      const nameParts = applicant.split(' ');
      const initials = nameParts.map(part => part.charAt(0)).join('');
      return initials.substring(0, 2).toUpperCase();
    }
    return 'NN';
  };

  const showDetailModal = (record: DataType) => {
    setSelectedRequest(record);
    setIsModalVisible(true);
  };

  const approveRequest = async () => {
    if (!selectedRequest) return;

    try {
      await api.post(`/api/request/${selectedRequest.key}/approve`, {
        status: 'APROVADO',
      });
      message.success('Solicitação aprovada com sucesso!');
      setIsModalVisible(false);
      fetchRequests(); 
      onActionCompleted(); 
    } catch (error) {
      message.error('Erro ao aprovar a solicitação');
    }
  };

  const rejectRequest = async () => {
    if (!selectedRequest) return;

    try {
      await api.post(`/api/request/${selectedRequest.key}/approve`, {
        status: 'REPROVADO',
      });
      message.success('Solicitação reprovada com sucesso!');
      setIsModalVisible(false);
      fetchRequests(); 
      onActionCompleted(); 
    } catch (error) {
      message.error('Erro ao reprovar a solicitação');
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: 'Solicitante',
      dataIndex: 'applicant',
      key: 'applicant',
      render: (text: string) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar style={{ backgroundColor: '#fb003f3d', color: '#b30735', marginRight: 15 }}>
            {getInitials(text)}
          </Avatar>
          {text}
        </div>
      ),
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const formatType = (type: string) => {
          switch (type) {
            case 'EDICAO':
              return 'Edição';
            case 'DELETAR':
              return 'Deletar';
            case 'ABONO':
              return 'Abono';
            case 'ATESTADO':
              return 'Atestado';
            case 'ADICAO_DE_PONTO':
              return 'Adição de Ponto';
            default:
              return type;
          }
        };
        return formatType(type);
      },
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <>
          {tags.map(tag => {
            let color;
            if (tag === 'PENDENTE') {
              color = 'blue';
            } else if (tag === 'APROVADO') {
              color = 'green';
            } else if (tag === 'REPROVADO') {
              color = 'red';
            } else {
              color = 'yellow';
              tag = 'ERRO';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      key: 'action',
      render: (_, record) => (
        <EditDelete
          showDetail
          onDetail={() => showDetailModal(record)}
          allowDelete
          allowEdit
        />
      ),
    },
  ];

  return (
    <>
      <Table className='tables-wise' style={{maxHeight:'calc(100% - 40%)'}} pagination={false} columns={columns} dataSource={data} loading={loading} />

      {selectedRequest && (
        <Modal
          title="Detalhes da Solicitação"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={
            selectedRequest.status === 'PENDENTE' && [
              <Button key="reject" onClick={rejectRequest} danger>
                Reprovar
              </Button>,
              <Button key="approve" type="primary" onClick={approveRequest}>
                Aprovar
              </Button>,
            ]
          }
        >
          <h3 style={{ color: 'black' }}>
            Justificativa: {selectedRequest.justification || 'Não informada'}
          </h3>

          {selectedRequest.type === 'ADICAO_DE_PONTO' && (
            <>
              <h4>Pontos Inseridos</h4>
              <List
                dataSource={selectedRequest.punches || []}
                renderItem={punch => (
                  <List.Item>
                    <List.Item.Meta
                      title={punch.status === 'ENTRY' ? 'Entrada' : 'Saída'}
                      description={`Horário: ${dayjs(punch.hours).format('HH:mm')}`} 
                    />
                  </List.Item>
                )}
              />
            </>
          )}
        </Modal>
      )}
    </>
  );
};

export default RequestTable;
