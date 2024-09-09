import React, { useState, useEffect } from 'react';
import './style.sass';
import { Button, Select, SelectProps, Table, Tag, Tooltip } from 'antd';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.tsx';
import Header from '../../components/Header/index.js';
import RequestsTable from './RequestsTable.tsx';
import { TopButtons } from '../../components/TopButtons/TopButtons.tsx';
import api from '../../connection/api'; // Importando API para fazer as requisições

const handleChange = (value: string) => {
    console.log(`selected ${value}`);
};

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
    const [value, setValue] = useState(['1', '2', 'em_aberto', 'reprovados']);
    const [counts, setCounts] = useState({ pendente: 0, aprovado: 0, reprovado: 0 }); // Estado para armazenar os contadores

    const selectProps: SelectProps = {
        value,
        onChange: setValue,
    };

    // Função para buscar contadores de solicitações
    const fetchRequestCounts = async () => {
        try {
            const organizationId = localStorage.getItem('organizationId'); // Obtém o ID da organização do localStorage
            const response = await api.get(`/api/request/countByStatus/${organizationId}`); // Faz a requisição para contar as solicitações
            setCounts(response.data); // Atualiza o estado com os contadores
        } catch (error) {
            console.error("Erro ao buscar contadores de solicitações", error);
        }
    };

    useEffect(() => {
        fetchRequestCounts(); // Busca os contadores ao montar o componente
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
                                <span>{counts.pendente}</span> {/* Contador de solicitações pendentes */}
                            </p>
                        </div>
                        <div className='balance-point'>
                            <p className='top-point-balace'>Solicitações aprovadas</p>
                            <p className='low-point-balace'>
                                <span>{counts.aprovado}</span> {/* Contador de solicitações aprovadas */}
                            </p>
                        </div>
                        <div className='balance-point'>
                            <p className='top-point-balace'>Solicitações reprovadas</p>
                            <p className='low-point-balace'>
                                <span>{counts.reprovado}</span> {/* Contador de solicitações reprovadas */}
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
                                        title={omittedValues.map(({ label }) => label).join(', ')}
                                    >
                                        <span>{`+${omittedValues.length} Filtros`}</span>
                                    </Tooltip>
                                )}
                            />
                        </div>
                    </div>

                    <RequestsTable />
                </div>
            </div>
        </div>
    );
};

export default Requests;
