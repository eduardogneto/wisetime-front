import Header from '../../components/Header';
import './style.sass';
import { Input, Modal, Select, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.tsx';
import UserTable from './UserTable.tsx';
import { TopButtons } from '../../components/TopButtons/TopButtons.tsx';
import api from '../../connection/api';

interface Team {
  id: number;
  name: string;
}

const User: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loadingTeams, setloadingTeams] = useState(true);

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [teamId, setTeamId] = useState<number | null>(null);
  const [tag, setTag] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [refresh, setRefresh] = useState(0); 
  const organizationId = localStorage.getItem('organizationId');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setloadingTeams(true);
        const response = await api.get('/api/users/teams', {
          params: { organizationId },
        });
        setTeams(response.data);
      } catch (error) {
        console.error('Erro ao buscar cargos:', error);
      } finally {
        setloadingTeams(false);
      }
    };

    if (organizationId) {
      fetchTeams();
    }
  }, [organizationId]);

  const showModal = () => {
    if (selectedUser) {
      setName(selectedUser.name);
      setEmail(selectedUser.email);
      setTeamId(selectedUser.team?.id || null);
      setTag(selectedUser.tag);
      setPassword('');
    }
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    if (!email || !name || !teamId || !tag || (!selectedUser && !password)) {
      message.error('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    const userData: any = {
      email,
      name,
      teamId,
      tag,
    };

    if (!selectedUser || (selectedUser && password)) {
      userData.password = password;
    }

    if (selectedUser && selectedUser.id) {
      userData.id = selectedUser.id;
    }

    try {
      if (selectedUser && selectedUser.id) {
        await api.put(`/auth/users/${selectedUser.id}`, userData);
        message.success('Usuário editado com sucesso!');
      } else {
        await api.post('/auth/register', userData);
        message.success('Usuário registrado com sucesso!');
      }
      setIsModalOpen(false);
      resetFormFields();
      setRefresh(prev => prev + 1); 
    } catch (error) {
      console.error(error);
      message.error('Erro ao registrar ou editar o usuário.');
    }
  };

  const resetFormFields = () => {
    setEmail('');
    setName('');
    setPassword('');
    setTeamId(null);
    setTag('');
    setSelectedUser(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    resetFormFields();
  };

  return (
    <div>
      <Header />
      <div className='container-user'>
        <div className='table'>
          <Breadcrumb />
          <div className='filters-history' style={{ marginTop: 10 }}>
            <div className='left-filters'>
              <Input
                size="middle"
                placeholder="Pesquisar"
                prefix={<SearchOutlined style={{ color: '#FF426B' }} />}
                style={{
                  height: 55,
                  borderRadius: 15,
                  backgroundColor: '#192831',
                  border: 'none',
                  color: 'white',
                  marginRight: 15,
                }}
              />
            </div>
            <div className='right-filters'>
              <TopButtons
                handleEdit={showModal}
                handleDelete={showModal}
                isEditable={!!selectedUser}
                isDeletable
              />
              <div className='button-history'>
                <button type='submit' onClick={showModal} style={{ marginLeft: 15 }}>
                  <p>Cadastrar</p>
                </button>
              </div>
            </div>
          </div>
          <UserTable onSelectUser={setSelectedUser} refresh={refresh} /> 
          <Modal
            className='modal'
            title={selectedUser ? "Editar usuário" : "Cadastrar novo usuário"}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <div className='input-modal'>
              <h4>Nome</h4>
              <Input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className='input-modal'>
              <h4>Email</h4>
              <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className='input-modal'>
              <h4>Senha</h4>
              <Input
                placeholder={selectedUser ? "Deixe em branco para manter a senha atual" : "Senha"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password" 
              />
            </div>
            <div className='input-modal'>
              <h4>Cargo</h4>
              <Select
                style={{ width: '100%' }}
                placeholder="Selecione o cargo"
                loading={loadingTeams}
                value={teamId}
                onChange={(value) => setTeamId(value)}
                options={teams.map(team => ({ value: team.id, label: team.name }))}
              />
            </div>
            <div className='input-modal'>
              <h4>Tag</h4>
              <Select
                style={{ width: '100%' }}
                placeholder="Selecione a tag"
                value={tag}
                onChange={(value) => setTag(value)}
                options={[
                  { value: 'ADMINISTRADOR', label: 'Administrador' },
                  { value: 'COORDENADOR', label: 'Coordenador' },
                  { value: 'FUNCIONARIO', label: 'Funcionário' },
                ]}
              />
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default User;
