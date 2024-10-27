import React, { useState, useEffect } from 'react';
import './style.sass';
import { Select, SelectProps, Tooltip, Skeleton, message } from 'antd';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.tsx';
import Header from '../../components/Header/index.js';
import RequestsTable from './RequestsTable.tsx';
import api from '../../connection/api';

interface ItemProps {
  label: string;
  value: string;
}

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
  const [value, setValue] = useState<string[]>([]); 
  const [counts, setCounts] = useState({ pendente: 0, aprovado: 0, reprovado: 0 });
  const [loading, setLoading] = useState<boolean>(true); 

  const selectProps: SelectProps = {
    value,
    onChange: setValue,
  };

  const fetchRequestCounts = async () => {
    try {
      setLoading(true); 
      const teamString = localStorage.getItem('team');
      let teamId: number | undefined;

      if (teamString) {
        try {
          const team = JSON.parse(teamString);
          teamId = team.id;
        } catch (error) {
          console.error('Erro ao analisar o JSON:', error);
          message.error('Erro ao processar os dados da equipe.');
          setLoading(false);
          return;
        }
      } else {
        message.error('Dados da equipe não encontrados.');
        setLoading(false);
        return;
      }

      const response = await api.get(`/api/request/countByStatus/${teamId}`);
      setCounts(response.data);
    } catch (error) {
      console.error("Erro ao buscar contadores de solicitações", error);
      message.error('Erro ao buscar contadores de solicitações.');
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchRequestCounts();
  }, []);

  return (
    <div className="requests-page">
      <Header />
      <div className='container-user'>
        <div className='table'>
          <Breadcrumb />
          <div className='containers-balance'>
            {loading ? (
              <>
                <div className='balance-point'>
                  <Skeleton active title={false} paragraph={{ rows: 1, width: '60%' }} />
                </div>
                <div className='balance-point'>
                  <Skeleton active title={false} paragraph={{ rows: 1, width: '60%' }} />
                </div>
                <div className='balance-point'>
                  <Skeleton active title={false} paragraph={{ rows: 1, width: '60%' }} />
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
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

          {loading ? (
            <div className='skeleton-table'>
              <Skeleton active paragraph={{ rows: 5 }} />
            </div>
          ) : (
            <RequestsTable filters={value} onActionCompleted={fetchRequestCounts} /> 
          )}
        </div>
      </div>
    </div>
  );
};

export default Requests;
