import React, { useEffect, useState } from 'react';
import { Table, Tag } from 'antd'; // Importe o Table e Tag do Ant Design
import api from '../../connection/api';

// Definindo a interface User para representar os dados que o backend retorna
interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  tag: string; // Supondo que o campo tag seja uma string única
}

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]); // Especificando que users é uma lista de User
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Definindo como string ou null

  // Supondo que o organization_id do usuário visualizador está no localStorage
  const organizationId = localStorage.getItem('organizationId');

  // Função para buscar usuários com o mesmo organizationId
  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/users/organization', {
        params: { organizationId }, // Envia o organization_id como parâmetro
      });
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar usuários.'); // Definindo erro como string
      setLoading(false);
    }
  };

  // Buscar os usuários quando o componente for montado
  useEffect(() => {
    if (organizationId) {
      fetchUsers();
    } else {
      setError('Organization ID não encontrado.');
      setLoading(false);
    }
  }, [organizationId]);

  // Definindo as colunas da tabela
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Cargo',
      dataIndex: ['role', 'name'], // Acessa o nome do cargo dentro do role
      key: 'role',
    },
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

  // Configurando rowSelection (caso necessário)
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: User[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
  };

  // Configurando o dataSource a partir dos usuários carregados
  const data = users.map(user => ({
    key: user.id, // Ant Design precisa de uma chave única para cada linha
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
      rowSelection={{ ...rowSelection }}
      style={{ marginTop: 20 }}
    />
  );
};

export default UserTable;
