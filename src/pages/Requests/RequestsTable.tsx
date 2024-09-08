import React, { useState } from 'react'
import { ColumnsType } from 'antd/es/table'
import { Table, Tag, Modal, Button, List, Avatar } from 'antd'
import EditDelete from '../../components/EditDelete/EditDelete.tsx'

interface DataType {
  key: string
  date: string
  applicant: string
  type: string
  tags: string[]
}

interface DetailData {
  id: string
  status: string
  hours: string
}

const data: DataType[] = [
  {
    key: '1',
    date: '10/11',
    applicant: 'Eduardo Neto',
    type: 'Atestado',
    tags: ['Em Aberto'],
  },
  {
    key: '2',
    date: '10/11',
    applicant: 'Eduardo Neto',
    type: 'Atestado',
    tags: ['Aprovado'],
  },
  {
    key: '3',
    date: '10/11',
    applicant: 'Eduardo Neto',
    type: 'Atestado',
    tags: ['Reprovado'],
  },
  {
    key: '4',
    date: '10/11',
    applicant: 'Eduardo Neto',
    type: 'Atestado',
    tags: ['a'],
  },
]

const mockDetailData: Record<string, DetailData[]> = {
  '10/11': [
    { id: '1', status: 'Entrada 1 - 10/11', hours: '08:00' },
    { id: '2', status: 'Saida 1 - 10/11', hours: '12:00' },
    { id: '3', status: 'Entrada 2 - 10/11', hours: '13:30' },
    { id: '4', status: 'Saida 2 - 10/11', hours: '18:00' },
    
  ],
  '09/11': [
    { id: '3', status: 'Entrada 1 - 09/11', hours: 'Saída 1 - 09/11' },
  ],
  '08/11': [
    { id: '4', status: 'Entrada 1 - 08/11', hours: 'Saída 1 - 08/11' },
    { id: '5', status: 'Entrada 2 - 08/11', hours: 'Saída 2 - 08/11' },
  ],
}

const HistoryPointTable: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [detailData, setDetailData] = useState<DetailData[]>([])

  const fetchDetailData = (date: string) => {
    const data = mockDetailData[date] || []
    setDetailData(data)
  }

  const handleDetail = (record: DataType) => {
    fetchDetailData(record.date)
    setIsModalVisible(true)
  }

  const getInitials = (applicant: string) => {
    const nameParts = applicant.split(' ');
    const initials = nameParts.map(part => part.charAt(0)).join('');
    return initials.substring(0, 2).toUpperCase();
};

  const columns: ColumnsType<DataType> = [
    {
      title: 'Data',
      dataIndex: 'date',
      key: 'date',
    },
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
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <>
          {tags.map(tag => {
            let color
            if(tag === 'Em Aberto'){
              color = 'blue'
            } else if (tag === 'Aprovado'){
              color = 'green'
            } else if (tag === 'Reprovado'){
              color = 'red'
            } else {
              color = 'yellow'
              tag = 'ERRO'
            }
            return <Tag color={color} key={tag}>{tag.toUpperCase()}</Tag>
          })}
        </>
      ),
    },
    {
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
  ]

  return (
    <>
      <Table style={{ marginTop: 10 }} columns={columns} dataSource={data} />
      
      <Modal
        title="Detalhes"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={<Button onClick={() => setIsModalVisible(false)}>Fechar</Button>}
      >
        <List
          itemLayout="horizontal"
          dataSource={detailData}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={`Status: ${item.status}`}
                description={`Horario: ${item.hours}`}
              />
            </List.Item>
          )}
        />
      </Modal>
    </>
  )
}

export default HistoryPointTable
