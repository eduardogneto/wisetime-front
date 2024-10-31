import React from 'react';
import Header from '../../components/Header';
import './style.sass';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.tsx';
import { Select } from 'antd';
import DueDateBankTable from './DueDateBankTable.tsx';
import { TopButtons } from '../../components/TopButtons/TopButtons.tsx';


const DueDateBank: React.FC = () => {

  return (
    <div>
      <Header />
      <div className='container-wise'>
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
            </div>
          </div>
          <DueDateBankTable />
        </div>
      </div>
    </div>
  );
};

export default DueDateBank;
