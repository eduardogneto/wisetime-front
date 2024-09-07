import React from 'react';
import './style.sass';
import { Button, Select, Table, Tag } from 'antd';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.tsx';
import Header from '../../components/Header/index.js';
import RequestsTable from './RequestsTable.tsx';
import { TopButtons } from '../../components/TopButtons/TopButtons.tsx';


const Requests: React.FC = () => {
    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
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
                                onChange={handleChange}
                                className='select'
                                options={[
                                    { value: '1', label: '01/08 - 01/09' },
                                    { value: '2', label: '01/07 - 01/08' },
                                    { value: '3', label: '01/06 - 01/07' },
                                ]}
                            />
                        </div>
                        <div className='right-filters'>
                            <TopButtons
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
