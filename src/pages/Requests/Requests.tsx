import React, { useState, useEffect } from 'react';
import './style.sass';
import { Select, SelectProps, Tooltip } from 'antd';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.tsx';
import Header from '../../components/Header/index.js';
import RequestsTable from './RequestsTable.tsx';
import api from '../../connection/api';

interface ItemProps {
  label: string;
  value: string;
}

// Opções separadas por categorias
const options: SelectProps['options'] = [
  {
    label: 'Tipos',
    options: [
      { label: 'Edição', value: '1' },
      { label: 'Deletar', value: '2' },
      { label: 'Abono', value: '3' },
      { label: 'Atestado', value: '4' },
    ],
  },
  {
    label: 'Status',
    options: [
      { label: 'Em Aberto', value: 'em_aberto' },
      { label: 'Aprovados', value: 'aprovados' },
      { label: 'Reprovados', value: 'reprovados' },
    ],
  },
];

const sharedProps: SelectProps = {
  mode: 'multiple',
  style: { width: '100%' },
  options,
  placeholder: 'Selecione os filtros...',
  maxTagCount: 'responsive',
};

const Requests: React.FC = () => {
  const [value, setValue] = useState<string[]>([]); // Inicializa vazio
  const [counts, setCounts] = useState({ pendente: 0, aprovado: 0, reprovado: 0 });

  const selectProps: SelectProps = {
    value,
    onChange: setValue,
  };

  // Função para buscar contadores de solicitações
  const fetchRequestCounts = async () => {
    try {
      const organizationId = localStorage.getItem('organizationId');
      const response = await api.get(`/api/request/countByStatus/${organizationId}`);
      setCounts(response.data);
    } catch (error) {
      console.error("Erro ao buscar contadores de solicitações", error);
    }
  };

  useEffect(() => {
    fetchRequestCounts();
  }, []);

  return (
    <div>
      <Header />
      <div className='container-user'>
        <div className='table'>
          <Breadcrumb />
          <div className='containers-balance'>
            <div className='balance-point'>
              <p className='top-point-balace'>Solicitações em aberto</p>
              <p className='low-point-balace'>
                <span>{counts.pendente}</span>
              </p>
            </div>
            <div className='balance-point'>
              <p className='top-point-balace'>Solicitações aprovadas</p>
              <p className='low-point-balace'>
                <span>{counts.aprovado}</span>
              </p>
            </div>
            <div className='balance-point'>
              <p className='top-point-balace'>Solicitações reprovadas</p>
              <p className='low-point-balace'>
                <span>{counts.reprovado}</span>
              </p>
            </div>
          </div>
          <p style={{ marginLeft: 10 }}>Filtros</p>
          <div className='filters-history'>
            <div className='left-filters'>
              <Select
                {...sharedProps}
                {...selectProps}
                className='select-props'
                maxTagPlaceholder={(omittedValues) => (
                  <Tooltip
                    overlayStyle={{ pointerEvents: 'none' }}
                    title={omittedValues.map((value) => {
                      const option = options
                        .flatMap(group => group.options)
                        .find(opt => opt.value === value);
                      return option?.label || value;
                    }).join(', ')}
                  >
                    <span>{`+${omittedValues.length} Filtros`}</span>
                  </Tooltip>
                )}
              />
            </div>
          </div>

          <RequestsTable filters={value} /> {/* Passando os filtros selecionados */}
        </div>
      </div>
    </div>
  );
};

export default Requests;
