import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import './style.sass';
import { EnvironmentOutlined } from '@ant-design/icons';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.tsx';
import { Select, Table, Tag, Modal, Input, DatePicker, message } from 'antd';
import DueDateBankTable from './DueDateBankTable.tsx';
import { TopButtons } from '../../components/TopButtons/TopButtons.tsx';
import api from '../../connection/api'; 
import moment, { Moment } from 'moment'; 

const { RangePicker } = DatePicker;

const DueDateBank: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState<Moment | null>(null);
  const [endDate, setEndDate] = useState<Moment | null>(null);
  const [tag, setTag] = useState('');
  const [loading, setLoading] = useState(false);

  const organizationId = localStorage.getItem('organizationId'); 

  const handleTagChange = (value: string) => {
    setTag(value);
  };

  const handleDateChange = (dates: [Moment | null, Moment | null] | null) => {
    if (dates) {
      setStartDate(dates[0]);
      setEndDate(dates[1]);
    } else {
      setStartDate(null);
      setEndDate(null);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    resetFields();
  };

  const resetFields = () => {
    setStartDate(null);
    setEndDate(null);
    setTag('');
  };

  const handleSubmit = async () => {
    if (!startDate || !endDate || !tag) {
      message.error('Por favor, preencha todos os campos!');
      return;
    }

    const payload = {
      organizationId: organizationId,
      startDate: startDate.format('YYYY-MM-DD'), 
      endDate: endDate.format('YYYY-MM-DD'), 
      tag,
    };

    setLoading(true);

    try {
      await api.post('/api/dueDateBank/create', payload);
      message.success('Período adicionado com sucesso!');
      setIsModalOpen(false);
      resetFields();
    } catch (error) {
      console.error('Erro ao adicionar o período:', error);
      message.error('Erro ao adicionar o período.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className='container-user'>
        <div className='table'>
          <Breadcrumb />
          <div className='filters-history' style={{ marginTop: 10 }}>
            <div className='left-filters'>
              <Select
                className='select'
                placeholder="Selecione a Organização"
                options={[
                  { value: '1', label: 'Empresa Teste 1' },
                  { value: '2', label: 'Empresa Teste 2' },
                  { value: '3', label: 'Empresa Teste 3' },
                ]}
              />
            </div>
            <div className='right-filters'>
              <TopButtons />
              <div className='button-history'>
                <button type='button' onClick={handleOpenModal} style={{ marginLeft: 15 }}>
                  <p>Adicionar</p>
                </button>
              </div>
            </div>
          </div>
          <DueDateBankTable />
        </div>
      </div>

      <Modal
        title="Adicionar Período de Ponto"
        visible={isModalOpen}
        onCancel={handleCancel}
        onOk={handleSubmit}
        confirmLoading={loading}
        okText="Salvar"
        cancelText="Cancelar"
      >
        <div className='input-modal'>
          <h4>Período</h4>
          <RangePicker format="DD/MM/YYYY" onChange={handleDateChange} />
        </div>
        <div className='input-modal'>
          <h4>Status</h4>
          <Select
            placeholder="Selecione o status"
            onChange={handleTagChange}
            value={tag}
            options={[
              { value: 'COMPLETO', label: 'Completo' },
              { value: 'ANDAMENTO', label: 'Em andamento' },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
};

export default DueDateBank;
