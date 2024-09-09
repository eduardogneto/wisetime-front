import React from 'react';
import './style.sass';
import { Button, Select, Table, Tag } from 'antd';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.tsx';
import Header from '../../components/Header';
import EditDelete from '../../components/EditDelete/EditDelete.tsx';
import { ColumnsType } from 'antd/es/table/InternalTable';
import HistoryPointTable from './HistoryPointTable.tsx';
import { TopButtons } from '../../components/TopButtons/TopButtons.tsx';

const HistoryPoint: React.FC = () => {
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
                            <p className='top-point-balace'>Saldo Anterior</p>
                            <p className='low-point-balace'>
                                <span className='pink'>- </span><span>01h23min</span>
                            </p>
                        </div>
                        <div className='balance-point'>
                            <p className='top-point-balace'>Saldo Período</p>
                            <p className='low-point-balace'>
                                <span className='pink'>+ </span><span>02h34min</span>
                            </p>
                        </div>
                        <div className='balance-point'>
                            <p className='top-point-balace'>Saldo Geral</p>
                            <p className='low-point-balace'>
                                <span className='pink'>+ </span><span>01h11min</span>
                            </p>
                        </div>
                    </div>
                    <p style={{ marginLeft: 10 }}>Período</p>
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
                    <HistoryPointTable />
                </div>
            </div>
        </div>
    );
};

export default HistoryPoint;
