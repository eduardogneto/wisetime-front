import React, { useEffect, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { Table, Tag, Modal, Button, message, Input, Form, Select } from 'antd';
import EditDelete from '../../components/EditDelete/EditDelete.tsx';
import api from '../../connection/api';
import dayjs from 'dayjs';

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
  const [detailData, setDetailData] = useState<DetailData[]>([]);
  const [addedPunches, setAddedPunches] = useState<DetailData[]>([]);
  const [loading, setLoading] = useState(false);
  const [justification, setJustification] = useState('');
  const [selectedDate, setSelectedDate] = useState(''); // Estado para armazenar a data selecionada

  // Função para buscar histórico resumido
  const fetchHistoryData = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('id');
      const response = await api.get(`/api/punch/history/summary/${userId}`);
      const fetchedData = response.data.map((item: any) => ({
        key: item.date,
        date: dayjs(item.date).format('DD/MM/YYYY'),
        entrys: item.entryCount,
        outs: item.exitCount,
        tags: [item.status],
      }));

      const sortedData = fetchedData.sort((a, b) => {
        const dateA = dayjs(a.date, 'DD/MM/YYYY');
        const dateB = dayjs(b.date, 'DD/MM/YYYY');
        return dateB.unix() - dateA.unix();
      });

      setData(sortedData);
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
      const formattedDate = dayjs(date, 'DD/MM/YYYY').format('YYYY-MM-DD');
      const response = await api.get(`/api/punch/history/${userId}/${formattedDate}`);
      const fetchedDetails = response.data.map((item: any) => ({
        id: item.id,
        status: item.type === 'ENTRY' ? 'Entrada' : 'Saída',
        hours: dayjs(item.timestamp).format('HH:mm'),
        editable: false,
      }));

      setDetailData(fetchedDetails);

      if (response.data[0]) {
        setJustification(response.data[0].justification || '');
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
      status: 'Entrada',
      hours: '',
      editable: true,
    };
    setDetailData([...detailData, newPunch]);
    setAddedPunches([...addedPunches, newPunch]);
  };

  // Função para atualizar os valores dos campos editáveis
  const updatePunch = (id: string, field: string, value: any) => {
    const updatedData = detailData.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setDetailData(updatedData);

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

      // Convertendo a data selecionada para o formato 'YYYY-MM-DD'
      const date = dayjs(selectedDate, 'DD/MM/YYYY').format('YYYY-MM-DD');

      const requestPayload = {
        id,
        requestType: 'ADICAO_DE_PONTO',
        justification,
        punches: addedPunches.map(punch => {
          const fullDateTime = `${date}T${punch.hours}:00`;

          return {
            status: punch.status,
            hours: fullDateTime,
          };
        }),
      };

      // Verifica se alguma data é inválida
      const hasEmptyTime = requestPayload.punches.some(punch => punch.hours === `${date}T:00`);
      if (hasEmptyTime) {
        message.error('Há horários vazios. Por favor, preencha antes de enviar.');
        return;
      }

      // Envia a solicitação ao backend
      await api.post('/api/request/create', requestPayload);

      message.success('Solicitação enviada ao coordenador.');
      setIsModalVisible(false);
      setAddedPunches([]);
      setJustification('');
    } catch (error) {
      message.error('Erro ao enviar a solicitação.');
    }
  };

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const handleDetail = (record: DataType) => {
    setSelectedDate(record.date); // Armazenando a data selecionada
    fetchPunchDetails(record.date);
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
            onChange={(e) => updatePunch(record.id, 'hours', e.target.value)}
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
