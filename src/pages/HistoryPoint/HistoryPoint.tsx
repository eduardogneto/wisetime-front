import React from 'react';
import './style.sass';
import { Button, Select, Table, Tag } from 'antd';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.tsx';
import Header from '../../components/Header';
import EditDelete from '../../components/EditDelete/EditDelete.tsx';
import { ColumnsType } from 'antd/es/table/InternalTable';

const HistoryPoint: React.FC = () => {
    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
    };

    interface DataType {
        key: string;
        date: string;
        entrys: number;
        outs: number;
        tags: string[];
    }

    const columns: ColumnsType<DataType> = [
        {
            title: 'Data',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Entradas',
            dataIndex: 'entrys',
            key: 'entrys',
            render: (text: number) => `${text} Entradas`,
        },
        {
            title: 'Saídas',
            dataIndex: 'outs',
            key: 'outs',
            render: (text: number) => `${text} Saídas`,
        },
        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            render: (_, { tags }) => (
                <>
                    {tags.map(tag => {
                        let color = tag === 'Completo' ? 'green' : 'red';
                        
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_) => (
                <EditDelete showDetail />
            ),
        },
    ];

    const data: DataType[] = [
        {
            key: '1',
            date: '10/11',
            entrys: 2,
            outs: 2,
            tags: ['Completo'],
        },
        {
            key: '2',
            date: '09/11',
            entrys: 1,
            outs: 2,
            tags: ['Incompleto'],
        },
        {
            key: '3',
            date: '08/11',
            entrys: 2,
            outs: 2,
            tags: ['Completo'],
        },
    ];

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
                            <div className='button-history'>
                                <button type='submit'>
                                    <p>Baixar</p>
                                </button>
                                <button type='submit'>
                                    <p>Exportar</p>
                                </button>
                            </div>
                        </div>
                    </div>
                    <Table style={{ marginTop: 10 }} columns={columns} dataSource={data} />
                </div>
            </div>
        </div>
    );
};

export default HistoryPoint;
