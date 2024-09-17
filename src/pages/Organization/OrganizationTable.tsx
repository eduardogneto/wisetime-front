import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Modal, Input } from 'antd';
import { PlusCircleOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import api from '../../connection/api';
import dayjs from 'dayjs';

interface Organization {
    key: string;
    id: number;
    name: string;
    teamCount: number;
    createdAt: string;
}

interface TeamData {
    key: string;
    id?: number; // ID opcional para times existentes
    name: string;
    description: string;
}

interface OrganizationTableProps {
    setSelectedOrganizationId: (id: number | null) => void;
}

const OrganizationTable: React.FC<OrganizationTableProps> = ({ setSelectedOrganizationId }) => {
    const [data, setData] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [teams, setTeams] = useState<TeamData[]>([]);
    const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);

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
        } catch (error) {
            message.error('Erro ao buscar organizações');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganizations();
    }, []);

    // Função para buscar times da organização selecionada e abrir o modal
    const handleAddTeam = async (organizationId: string) => {
        try {
            const response = await api.get(`/api/organizations/${organizationId}/teams`);
            const fetchedTeams = response.data.map((team: any) => ({
                key: team.id.toString(),
                id: team.id, // Inclui o ID existente
                name: team.name,
                description: team.description,
            }));

            const selectedOrg = data.find(org => org.id.toString() === organizationId);
            setSelectedOrganization(selectedOrg || null);
            setTeams(fetchedTeams);
            setIsModalOpen(true);
        } catch (error) {
            message.error('Erro ao buscar times da organização');
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setTeams([]);
        setSelectedOrganization(null);
    };

    const handleAddNewTeam = () => {
        const newTeam: TeamData = {
            key: `${Date.now()}`,
            name: '',
            description: '',
            // Sem ID, pois será criado no backend
        };
        setTeams([...teams, newTeam]);
    };

    const handleDeleteTeam = (key: string) => {
        setTeams(teams.filter((team) => team.key !== key));
    };

    const handleTeamChange = (key: string, field: string, value: string) => {
        setTeams(
            teams.map((team) => (team.key === key ? { ...team, [field]: value } : team))
        );
    };

    // Função para salvar os times
    const handleSave = async () => {
        if (!selectedOrganization) return;

        // Validação básica para garantir que todos os nomes dos times estão preenchidos
        for (let team of teams) {
            if (!team.name) {
                message.error('O nome do time é obrigatório!');
                return;
            }
        }

        try {
            // Envia os times atualizados para o novo endpoint
            await api.put(`/api/organizations/${selectedOrganization.id}/teams`, teams);

            message.success('Times salvos com sucesso!');
            fetchOrganizations(); // Atualiza a tabela de organizações
            handleCancel(); // Fecha o modal após salvar
        } catch (error) {
            if(error.response.data == 'Erro ao atualizar times'){
                message.error('Você não pode retirar um time que já está vinculado a um usuário.');
            } else {
                message.error('Erro ao salvar os times. Tente novamente.');
            }
        }
    };

    // Função chamada quando as linhas selecionadas mudam
    const onSelectChange = (selectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(selectedRowKeys);
        if (selectedRowKeys.length > 0) {
            setSelectedOrganizationId(Number(selectedRowKeys[0]));
        } else {
            setSelectedOrganizationId(null);
        }
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

    const teamColumns = [
        {
            title: 'Nome do Time',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: TeamData) => (
                <Input
                    value={text}
                    onChange={(e) => handleTeamChange(record.key, 'name', e.target.value)}
                    placeholder="Nome do Time"
                />
            ),
        },
        {
            title: 'Descrição',
            dataIndex: 'description',
            key: 'description',
            render: (text: string, record: TeamData) => (
                <Input
                    value={text}
                    onChange={(e) => handleTeamChange(record.key, 'description', e.target.value)}
                    placeholder="Descrição"
                />
            ),
        },
        {
            title: 'Ações',
            key: 'actions',
            render: (_: any, record: TeamData) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteTeam(record.key)}
                />
            ),
        },
    ];

    return (
        <>
            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                rowSelection={{
                    selectedRowKeys,
                    onChange: onSelectChange,
                }}
                style={{ marginTop: 20 }}
            />

            <Modal
                title={`Times da Organização: ${selectedOrganization?.name}`}
                visible={isModalOpen}
                onCancel={handleCancel}
                width={800} // Largura fixa
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        Cancelar
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleSave}>
                        Salvar
                    </Button>,
                ]}
                bodyStyle={{
                    maxHeight: '500px', // Altura máxima da modal
                    overflowY: 'hidden', // Evita barra de rolagem na modal
                }}
            >
                <Button
                    type="dashed"
                    onClick={handleAddNewTeam}
                    icon={<PlusOutlined />}
                    style={{ marginBottom: 16 }}
                >
                    Adicionar Time
                </Button>

                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <Table
                        columns={teamColumns}
                        dataSource={teams}
                        pagination={false}
                        rowKey="key"
                        scroll={{ y: 300 }} // Define a altura da tabela para rolar internamente
                    />
                </div>
            </Modal>
        </>
    );
};

export default OrganizationTable;
