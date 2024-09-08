import React, { useState } from 'react';
import './style.sass';
import { Button, Select, SelectProps, Table, Tag, Tooltip } from 'antd';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.tsx';
import Header from '../../components/Header/index.js';
import RequestsTable from './RequestsTable.tsx';
import { TopButtons } from '../../components/TopButtons/TopButtons.tsx';

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

    const selectProps: SelectProps = {
        value,
        onChange: setValue,
    };

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
                                <span>37</span>
                            </p>
                        </div>
                        <div className='balance-point'>
                            <p className='top-point-balace'>Solicitações aprovadas</p>
                            <p className='low-point-balace'>
                                <span>10</span>
                            </p>
                        </div>
                        <div className='balance-point'>
                            <p className='top-point-balace'>Solicitações reprovadas</p>
                            <p className='low-point-balace'>
                                <span>2</span>
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
