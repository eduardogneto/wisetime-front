import React from 'react';
import { ColumnsType } from 'antd/es/table';
import { Table, Tag, Avatar, message, Modal, List, Button } from 'antd';

interface DataType {
  key: string;
  user: string;
  hours: string;
  tags: string[];
}

interface RequestTableProps {
  filters: string[];
  onActionCompleted: () => void;
}

const ReportsRankingTable: React.FC = () => {

  const getInitials = (applicant: string) => {
    if (typeof applicant === 'string') {
      const nameParts = applicant.split(' ');
      const initials = nameParts.map(part => part.charAt(0)).join('');
      return initials.substring(0, 2).toUpperCase();
    }
    return 'NN';
  };


  const columns: ColumnsType<DataType> = [
    {
      title: 'Usuário',
      dataIndex: 'user',
      key: 'user',
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
      title: 'Horas',
      dataIndex: 'hours',
      key: 'hours'
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <>
          {tags.map(tag => {
            let color;
            if (tag === 'POSITIVAS') {
              color = 'green';
            } else if (tag === 'NEGATIVAS') {
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
  ];

  return (
    <>
      <Table
        className="tables-wise"
        style={{ maxHeight: 'calc(100% - 40%)' }}
        pagination={false}
        columns={columns}
      />
    </>
  );
};

export default ReportsRankingTable;
