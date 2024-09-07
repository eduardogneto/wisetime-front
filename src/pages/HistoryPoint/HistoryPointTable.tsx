import React, { useState } from 'react'
import { ColumnsType } from 'antd/es/table'
import { Table, Tag, Modal, Button, List } from 'antd'
import EditDelete from '../../components/EditDelete/EditDelete.tsx'

interface DataType {
  key: string
  date: string
  entrys: number
  outs: number
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
    entrys: 2,
    outs: 2,
    tags: ['Completo'],
  },
  {
    key: '2',
    date: '09/11',
    entrys: 1,
    outs: 2,
    tags: ['Incompleto'],
  },
  {
    key: '3',
    date: '08/11',
    entrys: 2,
    outs: 2,
    tags: ['Completo'],
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
            let color = tag === 'Completo' ? 'green' : 'red'
            return <Tag color={color} key={tag}>{tag.toUpperCase()}</Tag>
          })}
        </>
      ),
    },
    {
      title: 'Action',
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
