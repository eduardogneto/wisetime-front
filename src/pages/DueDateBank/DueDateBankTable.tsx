import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/index.js';
import './style.sass';
import { ColumnsType } from 'antd/es/table/InternalTable';
import { Table, Tag, message } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import api from '../../connection/api'; // Supondo que você tenha configurado o axios

const DueDateBankTable: React.FC = () => {
    interface DataType {
        key: string;
        period: string;
        status: string[];
    }

    const [data, setData] = useState<DataType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDueDateBanks = async () => {
            try {
                const organizationId = localStorage.getItem('organizationId');
                if (!organizationId) {
                    message.error('ID da organização não encontrado!');
                    return;
                }
    
                const response = await api.get(`/api/dueDateBank/organization/${organizationId}/duedates`);
                const responseData = response.data;
    
                if (!responseData || responseData.length === 0) {
                    message.warning('Nenhum período encontrado.');
                    return;
                }
    
                // Transformar os dados recebidos para o formato da tabela
                const transformedData = responseData.map((item: any) => ({
                    key: item.id,
                    period: `${new Date(item.startDate).toLocaleDateString()} - ${new Date(item.endDate).toLocaleDateString()}`, 
                    status: [item.tag],
                }));
    
                setData(transformedData);
            } catch (error) {
                console.error('Erro na requisição:', error);
                message.error('Erro ao carregar os períodos.');
            } finally {
                setLoading(false);
            }
        };
    
        fetchDueDateBanks();
    }, []);

    const columns: ColumnsType<DataType> = [
        {
            title: 'Período',
            dataIndex: 'period',
            key: 'period',
            align: 'center',
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            align: 'center',
            render: (_, { status }) => (
                <>
                    {status.map(tag => {
                        let color = tag === 'COMPLETO' ? 'green' : 'blue';
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
    ];

    const rowSelection: TableRowSelection<DataType> = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        onSelect: (record, selected, selectedRows) => {
            console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            console.log(selected, selectedRows, changeRows);
        },
    };

    return (
        <>
            <Table
                rowSelection={{ ...rowSelection }}
                scroll={{ y: 400 }}
                style={{ marginTop: 20 }}
                pagination={false}
                columns={columns}
                dataSource={data}
                loading={loading} // Adicionar o estado de loading
            />
        </>
    );
};

export default DueDateBankTable;
