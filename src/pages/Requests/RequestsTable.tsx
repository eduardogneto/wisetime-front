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

interface Certificate {
  id: number;
  startDate: string;
  endDate: string;
  justification: string;
  status: string;
}

interface DataType {
  key: string;
  applicant: string;
  type: string;
  tags: string[];
  justification?: string;
  punches?: Punch[];
  status: string;
  certificate?: Certificate;
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
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const userId = localStorage.getItem('id');

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
        em_aberto: 'PENDENTE',
        aprovados: 'APROVADO',
        reprovados: 'REPROVADO',
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
        certificate: request.certificate,
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

  const showDetailModal = async (record: DataType) => {
    setSelectedRequest(record);

    if (record.type === 'ATESTADO' && record.certificate) {
      try {
        const response = await api.get(`/api/certificate/image/${record.certificate.id}`, {
          responseType: 'blob',
        });
        const imageBlob = response.data;
        const imageUrl = URL.createObjectURL(imageBlob);
        setImageSrc(imageUrl);
      } catch (error) {
        message.error('Erro ao buscar a imagem do atestado');
      }
    } else {
      setImageSrc(null);
    }
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    if (imageSrc) {
      URL.revokeObjectURL(imageSrc);
      setImageSrc(null);
    }
  };

  const approveRequest = async () => {
    if (!selectedRequest) return;

    try {
      await api.post(`/api/request/${selectedRequest.key}/approve`, {
        userId,
        status: 'APROVADO',
      });
      message.success('Solicitação aprovada com sucesso!');
      handleModalClose();
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
        userId,
        status: 'REPROVADO',
      });
      message.success('Solicitação reprovada com sucesso!');
      handleModalClose();
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
      align: 'center',
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
      align: 'center',
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
      align: 'center',
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
          allowDelete={false}
          allowEdit={false}
        />
      ),
    },
  ];

  return (
    <>
      <Table
        className="tables-wise"
        style={{ maxHeight: 'calc(100% - 40%)' }}
        pagination={false}
        columns={columns}
        dataSource={data}
        loading={loading}
      />

      {selectedRequest && (
        <Modal
          title="Detalhes da Solicitação"
          visible={isModalVisible}
          onCancel={handleModalClose}
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
          {selectedRequest.type === 'ADICAO_DE_PONTO' && (
            <>
              <h4 className={'punch-title'}>Justificativa</h4>
              <div className={'container-punchs'}>
                <span className={'list-item-description'}>
                  {selectedRequest.justification || 'Não informada'}
                </span>
              </div>
              <h4 className={'punch-title'}>Pontos Inseridos</h4>
              <List
                dataSource={selectedRequest.punches || []}
                renderItem={punch => (
                  <div className={'punch-container'}>
                    <List.Item>
                      <List.Item.Meta
                        title={<span className={'list-item-title'}>{punch.status === 'ENTRY' ? 'Entrada' : 'Saída'}</span>}
                        description={<span className={'list-item-description'}>{`Horário: ${dayjs(punch.hours).format('HH:mm')}`}</span>}
                      />
                    </List.Item>
                  </div>
                )}
              />
            </>
          )}

          {selectedRequest.type === 'ATESTADO' && selectedRequest.certificate && (
            <>
              <h4 className={'certificate-title'}>Data de Inicio</h4>
              <div className={'container-punchs'}>
                <span className={'list-item-description'}>
                  {dayjs(selectedRequest.certificate.startDate).format('DD/MM/YYYY')}
                </span>
              </div>
              <h4 className={'certificate-title'}>Data de Fim</h4>
              <div className={'container-punchs'}>
                <span className={'list-item-description'}>
                  {dayjs(selectedRequest.certificate.endDate).format('DD/MM/YYYY')}
                </span>
              </div>
              <h4 className={'punch-title'}>Justificativa</h4>
              <div className={'container-punchs'}>
                <span className={'list-item-description'}>
                  {selectedRequest.justification || 'Não informada'}
                </span>
              </div>
              {imageSrc && (
                <div className={'image-container'}>
                  <h4 className={'certificate-title'}>Imagem do Atestado</h4>
                  <img src={imageSrc} alt="Atestado" className={'image'} />
                </div>
              )}
            </>
          )}
        </Modal>
      )}
    </>
  );
};

export default RequestTable;
