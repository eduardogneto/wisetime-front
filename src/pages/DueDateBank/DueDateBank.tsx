import React from 'react';
import Header from '../../components/Header';
import './style.sass';
import {
  EnvironmentOutlined,
} from '@ant-design/icons';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.tsx';
import { ColumnsType } from 'antd/es/table/InternalTable';
import { Select, Table, Tag } from 'antd';
import EditDelete from '../../components/EditDelete/EditDelete.tsx';
import DueDateBankTable from './DueDateBankTable.tsx';
import { TopButtons } from '../../components/TopButtons/TopButtons.tsx';

const DueDateBank: React.FC = () => {

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
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
                onChange={handleChange}
                className='select'
                options={[
                  { value: '1', label: 'Empresa Teste' },
                  { value: '2', label: 'Empresa Teste' },
                  { value: '3', label: 'Empresa Teste' },
                ]}
              />
            </div>
            <div className='right-filters'>
              <TopButtons
                 />
              <div className='button-history'>
                <button type='submit' style={{marginLeft:15}}>
                  <p>Adicionar</p>
                </button>
              </div>
            </div>
          </div>
          <DueDateBankTable />
        </div>
      </div>
    </div>
  );
};

export default DueDateBank;
