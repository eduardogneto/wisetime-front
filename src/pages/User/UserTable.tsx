import React, { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';
import api from '../../connection/api';

interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  tag: string;
}

interface UserTableProps {
  onSelectUser: (user: User | null) => void; // Função para selecionar o usuário
}

const UserTable: React.FC<UserTableProps> = ({ onSelectUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  const organizationId = localStorage.getItem('organizationId');

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/users/organization', {
        params: { organizationId },
      });
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar usuários.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (organizationId) {
      fetchUsers();
    } else {
      setError('Organization ID não encontrado.');
      setLoading(false);
    }
  }, [organizationId]);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Nome', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Cargo', dataIndex: ['role', 'name'], key: 'role' },
    {
      title: 'Tag',
      dataIndex: 'tag',
      key: 'tag',
      render: (tag: string) => {
        let color = 'geekblue';
        if (tag === 'COORDENADOR') {
          color = 'orange';
        } else if (tag === 'FUNCIONARIO') {
          color = 'pink';
        }
        return (
          <Tag color={color} key={tag}>
            {tag.toUpperCase()}
          </Tag>
        );
      },
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: User[]) => {
      setSelectedRowKeys(selectedRowKeys as number[]);
      if (selectedRows.length === 1) {
        onSelectUser(selectedRows[0]); // Passa o único usuário selecionado
      } else {
        onSelectUser(null); // Desabilita se não houver ou houver mais de um
      }
    },
  };

  const data = users.map(user => ({
    key: user.id,
    ...user,
  }));

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Table
      pagination={false}
      scroll={{ y: 400 }}
      columns={columns}
      dataSource={data}
      rowSelection={{
        type: 'checkbox',
        ...rowSelection,
      }}
      style={{ marginTop: 20 }}
    />
  );
};

export default UserTable;
