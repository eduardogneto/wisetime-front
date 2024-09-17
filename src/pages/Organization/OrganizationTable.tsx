import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import api from '../../connection/api';
import dayjs from 'dayjs';

interface Organization {
    key: string;
    id: number;
    name: string;
    teamCount: number;
    createdAt: string;
}

const OrganizationTable: React.FC = () => {
    const [data, setData] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    // Função para buscar organizações do backend
    const fetchOrganizations = async () => {
        setLoading(true);
        try {
          const response = await api.get('/api/organizations/allOrganizations');
          const fetchedData = response.data.map((org: any) => ({
            key: org.id.toString(),
            id: org.id,
            name: org.name,
            teamCount: org.teams ? org.teams.length : 0, // Conta o número de times
            createdAt: dayjs(org.createdAt).format('DD/MM/YYYY'),
          }));
          setData(fetchedData);
          console.log(data)
        } catch (error) {
          message.error('Erro ao buscar organizações');
        } finally {
          setLoading(false);
        }
      };
      

    useEffect(() => {
        fetchOrganizations();
    }, []);

    // Função para adicionar um novo time
    const handleAddTeam = (organizationId: string) => {
        // Implemente a lógica para adicionar um novo time
        message.info(`Adicionar um novo time à organização ID: ${organizationId}`);
    };

    // Função chamada quando as linhas selecionadas mudam
    const onSelectChange = (selectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(selectedRowKeys);
    };

    const columns = [
        {
            title: 'Nome da Organização',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Times',
            dataIndex: 'teamCount',
            key: 'teamCount',
            render: (teamCount: number, record: Organization) => (
                <Space>
                    <span>{teamCount} Times</span>
                    <Button
                        type="text"
                        shape="circle"
                        icon={<PlusCircleOutlined style={{ color: '#b30735' }} />}
                        style={{
                            padding: 0,
                        }}
                        onClick={() => handleAddTeam(record.key)}
                    />
                </Space>
            ),
        },
        {
            title: 'Criado em',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
    ];

    // Configurações para a seleção de linhas
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    return (
        <>
            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                rowSelection={rowSelection}
                style={{ marginTop: 20 }}
            />
        </>
    );
};

export default OrganizationTable;
