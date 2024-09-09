import React, { useState, useEffect } from 'react';
import { ColumnsType } from 'antd/es/table';
import { Table, Tag, Avatar, message, Modal, List, Button } from 'antd';
import EditDelete from '../../components/EditDelete/EditDelete.tsx';
import api from '../../connection/api'; // Supondo que você tenha configurado Axios

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
  status: string; // Nova propriedade para armazenar o status da solicitação
}

const RequestTable: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DataType | null>(null);

  // Função para buscar as solicitações do backend
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('id'); // Obtém o userId do localStorage
      if (!userId) {
        throw new Error('User ID não encontrado no localStorage');
      }

      const response = await api.get(`/api/request/list/${userId}`); // Faz a requisição com o userId
      const fetchedData = response.data.map((request: any) => ({
        key: request.id.toString(),
        applicant: request.user?.name || 'Desconhecido', // Verifica se o nome do usuário está presente
        type: request.requestType,
        tags: [request.status],
        justification: request.justification,
        punches: request.punches,
        status: request.status, // Armazena o status para verificar se é reprovado
      }));
      setData(fetchedData); // Atualiza o estado da tabela
    } catch (error) {
      message.error('Erro ao buscar as solicitações');
    } finally {
      setLoading(false);
    }
  };

  // Chama a função de busca quando o componente for montado
  useEffect(() => {
    fetchRequests();
  }, []);

  const getInitials = (applicant: string) => {
    if (typeof applicant === 'string') {
      const nameParts = applicant.split(' ');
      const initials = nameParts.map(part => part.charAt(0)).join('');
      return initials.substring(0, 2).toUpperCase();
    }
    return 'NN'; // Se não for string, retorna "NN" como iniciais padrão
  };

  const showDetailModal = (record: DataType) => {
    setSelectedRequest(record); // Armazena a solicitação selecionada
    setIsModalVisible(true); // Exibe o modal
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
      fetchRequests(); // Atualiza a lista de solicitações
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
      fetchRequests(); // Atualiza a lista de solicitações
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
            case 'ADICAO_DE_PONTO':
              return 'Adição de Ponto';
            case 'ATESTADO':
              return 'Atestado';
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
            return <Tag color={color} key={tag}>{tag.toUpperCase()}</Tag>;
          })}
        </>
      ),
    },
    {
      key: 'action',
      render: (_, record) => (
        <EditDelete
          showDetail
          onDetail={() => showDetailModal(record)} // Ao clicar em "Detalhar", abre o modal
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
          <h3 style={{ color: 'black' }}>Justificativa: {selectedRequest.justification || 'Não informada'}</h3>

          {selectedRequest.type === 'ADICAO_DE_PONTO' && (
            <>
              <h4>Pontos Inseridos</h4>
              <List
                dataSource={selectedRequest.punches || []}
                renderItem={punch => (
                  <List.Item>
                    <List.Item.Meta
                      title={punch.status === 'ENTRY' ? 'Entrada' : 'Saída'}
                      description={`Horário: ${punch.hours}`}
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
