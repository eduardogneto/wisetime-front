import React, { useState, useEffect } from 'react';
import { ColumnsType } from 'antd/es/table';
import { Table, Tag, Avatar, message, Modal, List, Button } from 'antd';
import EditDelete from '../../components/EditDelete/EditDelete.tsx';
import api from '../../connection/api';
import dayjs from 'dayjs'; // Importamos o dayjs para manipulação de datas

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
}

const RequestTable: React.FC<RequestTableProps> = ({ filters }) => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DataType | null>(null);

  // Função para buscar as solicitações do backend
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('id');
      if (!userId) {
        throw new Error('User ID não encontrado no localStorage');
      }

      // Mapeamento dos valores selecionados para os esperados pelo backend
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

      // Separar os filtros selecionados
      const selectedTypes = filters
        .filter(value => Object.keys(typeMapping).includes(value))
        .map(value => typeMapping[value]);

      const selectedStatuses = filters
        .filter(value => Object.keys(statusMapping).includes(value))
        .map(value => statusMapping[value]);

      // Montar o objeto de filtros
      const filterData = {
        userId: userId,
        types: selectedTypes,
        statuses: selectedStatuses,
      };

      // Fazer a requisição POST para o endpoint de filtro
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

  // Reexecutar a busca sempre que os filtros forem atualizados
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

  // Função para aprovar uma solicitação
  const approveRequest = async () => {
    if (!selectedRequest) return;

    try {
      await api.post(`/api/request/${selectedRequest.key}/approve`, {
        status: 'APROVADO',
      });
      message.success('Solicitação aprovada com sucesso!');
      setIsModalVisible(false);
      fetchRequests();
    } catch (error) {
      message.error('Erro ao aprovar a solicitação');
    }
  };

  // Função para reprovar uma solicitação
  const rejectRequest = async () => {
    if (!selectedRequest) return;

    try {
      await api.post(`/api/request/${selectedRequest.key}/approve`, {
        status: 'REPROVADO',
      });
      message.success('Solicitação reprovada com sucesso!');
      setIsModalVisible(false);
      fetchRequests();
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
      <Table style={{ marginTop: 10 }} columns={columns} dataSource={data} loading={loading} />

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
