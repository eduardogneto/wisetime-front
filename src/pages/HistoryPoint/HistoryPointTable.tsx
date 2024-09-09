import React, { useEffect, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { Table, Tag, Modal, Button, message, Input, Form, Select } from 'antd';
import EditDelete from '../../components/EditDelete/EditDelete.tsx';
import api from '../../connection/api'; // Supondo que você tenha configurado Axios
import dayjs from 'dayjs'; // Substitui moment por dayjs

interface DataType {
  key: string;
  date: string;
  entrys: number;
  outs: number;
  tags: string[];
}

interface DetailData {
  id: string;
  status: string;
  hours: string;
  editable?: boolean;
}

const { Option } = Select;

const HistoryPointTable: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [detailData, setDetailData] = useState<DetailData[]>([]); // Batidas existentes
  const [addedPunches, setAddedPunches] = useState<DetailData[]>([]); // Novas batidas adicionadas
  const [loading, setLoading] = useState(false);
  const [justification, setJustification] = useState('');

  // Função para buscar histórico resumido
  const fetchHistoryData = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('id');
      const response = await api.get(`/api/punch/history/summary/${userId}`);
      const fetchedData = response.data.map((item: any) => ({
        key: item.date,
        date: item.date,
        entrys: item.entryCount,
        outs: item.exitCount,
        tags: [item.status], // Completo ou Incompleto
      }));
      setData(fetchedData);
    } catch (error) {
      message.error('Erro ao buscar o histórico.');
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar detalhes das batidas
  const fetchPunchDetails = async (date: string) => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('id');
      const response = await api.get(`/api/punch/history/${userId}/${date}`);
      const fetchedDetails = response.data.map((item: any) => ({
        id: item.id,
        status: item.type === 'ENTRY' ? 'Entrada' : 'Saída',
        hours: dayjs(item.timestamp).format('HH:mm'), // Usando dayjs para formatar a hora
        editable: false,
      }));

      setDetailData(fetchedDetails);

      if (response.data[0]) {
        setJustification(response.data[0].justification || ''); // Justificativa
      }

      setIsModalVisible(true);
    } catch (error) {
      message.error('Erro ao buscar os detalhes das batidas.');
    } finally {
      setLoading(false);
    }
  };

  // Adicionar uma nova batida
  const addNewPunch = () => {
    const newPunch: DetailData = {
      id: (Math.random() * 1000).toString(),
      status: 'Entrada', // Padrão inicial como 'Entrada', o usuário pode alterar
      hours: '', // Define o horário como vazio para o input
      editable: true,
    };
    setDetailData([...detailData, newPunch]);
    setAddedPunches([...addedPunches, newPunch]); // Adiciona apenas a nova batida
  };

  // Função para atualizar os valores dos campos editáveis
  const updatePunch = (id: string, field: string, value: any) => {
    const updatedData = detailData.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setDetailData(updatedData);

    // Atualiza as novas batidas também, se necessário
    const updatedNewPunches = addedPunches.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setAddedPunches(updatedNewPunches);
  };

  // Enviar a justificativa ao coordenador
  const sendRequest = async () => {
    try {
      if (addedPunches.length === 0) {
        message.warning('Adicione uma nova batida antes de enviar a justificativa.');
        return;
      }
      if (!justification) {
        message.warning('Preencha a justificativa antes de enviar.');
        return;
      }

      const id = localStorage.getItem('id');

      const requestPayload = {
        id,
        requestType: 'ADICAO_DE_PONTO', // Tipo de requisição
        justification,                  // Justificativa do usuário
        punches: addedPunches.map(punch => {
          // Aqui pegamos o valor do input de horas e concatenamos com a data
          const today = dayjs().format('YYYY-MM-DD'); // Data de hoje
          const fullDateTime = `${today}T${punch.hours}:00`; // Formato final para envio
          
          return {
            status: punch.status,
            hours: fullDateTime, // Simplesmente pegamos o valor do input e concatenamos
          };
        }),
      };

      // Verifica se alguma data é inválida
      const hasEmptyTime = requestPayload.punches.some(punch => punch.hours === 'T:00');
      if (hasEmptyTime) {
        message.error('Há horários vazios. Por favor, preencha antes de enviar.');
        return;
      }

      // Envia a solicitação ao backend
      await api.post('/api/request/create', requestPayload);

      message.success('Solicitação enviada ao coordenador.');
      setIsModalVisible(false);
      setAddedPunches([]); // Limpa as batidas adicionadas após envio
    } catch (error) {
      message.error('Erro ao enviar a solicitação.');
    }
  };

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const handleDetail = (record: DataType) => {
    fetchPunchDetails(record.date); // Busca os detalhes do dia selecionado
  };

  // Colunas para a tabela de histórico de pontos
  const columns: ColumnsType<DataType> = [
    {
      title: 'Data',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Entradas',
      dataIndex: 'entrys',
      key: 'entrys',
      render: (text: number) => `${text} Entradas`,
    },
    {
      title: 'Saídas',
      dataIndex: 'outs',
      key: 'outs',
      render: (text: number) => `${text} Saídas`,
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <>
          {tags.map(tag => {
            let color = tag === 'Completo' ? 'green' : 'red';
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
      title: 'Ação',
      key: 'action',
      render: (_, record) => (
        <EditDelete
          showDetail
          onDetail={() => handleDetail(record)}
          allowDelete
          allowEdit
        />
      ),
    },
  ];

  // Colunas para a tabela de batidas no modal
  const punchColumns: ColumnsType<DetailData> = [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) =>
        record.editable ? (
          <Select
            value={record.status}
            onChange={(value) => updatePunch(record.id, 'status', value)}
            style={{ width: '100%' }}
          >
            <Option value="Entrada">Entrada</Option>
            <Option value="Saída">Saída</Option>
          </Select>
        ) : (
          <span>{record.status}</span>
        ),
    },
    {
      title: 'Horário',
      dataIndex: 'hours',
      key: 'hours',
      render: (_, record) =>
        record.editable ? (
          <Input
            value={record.hours}
            onChange={(e) => updatePunch(record.id, 'hours', e.target.value)} // Permite a digitação
            placeholder="HH:mm"
          />
        ) : (
          <span>{record.hours}</span>
        ),
    },
  ];

  return (
    <>
      <Table
        style={{ marginTop: 10 }}
        columns={columns}
        dataSource={data}
        loading={loading}
      />

      <Modal
        title="Detalhes do Dia"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={
          <>
            <Button onClick={addNewPunch} type="primary">
              Nova Batida
            </Button>
            <Button onClick={sendRequest} type="primary">
              Enviar Justificativa
            </Button>
            <Button onClick={() => setIsModalVisible(false)}>Fechar</Button>
          </>
        }
      >
        <Table
          columns={punchColumns}
          dataSource={detailData}
          pagination={false}
          rowKey="id"
        />

        {addedPunches.length > 0 && (
          <Form layout="vertical" style={{ marginTop: 16 }}>
            <Form.Item label="Justificativa">
              <Input.TextArea
                rows={4}
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="Descreva o motivo da alteração."
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default HistoryPointTable;
