import React, { useEffect, useState } from 'react';
import './style.sass';
import { ColumnsType } from 'antd/es/table/InternalTable';
import { Avatar, Table, Tag, message } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import api from '../../connection/api';
import moment from 'moment';
import { CheckCircleOutlined, ClockCircleOutlined, SyncOutlined } from '@ant-design/icons';

interface DataType {
    key: string;
    name: string;       
    action: string;
    details: string;
    date: string;
}

const AuditTable: React.FC = () => {
    const [data, setData] = useState<DataType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDueDateBanks = async () => {
            try {
                const teamString = localStorage.getItem('team');
                let teamId: string | undefined;

                if (teamString) {
                    try {
                        const team = JSON.parse(teamString);
                        teamId = team.id;
                    } catch (error) {
                        console.error('Erro ao analisar o JSON:', error);
                    }
                }

                if (!teamId) {
                    message.warning('ID da equipe não encontrado.');
                    setData([]);
                    setLoading(false);
                    return;
                }

                const response = await api.get(`/api/audit/logs/${teamId}`);
                const responseData: DataType[] = response.data;

                if (!responseData || responseData.length === 0) {
                    message.warning('Nenhuma auditoria encontrada.');
                    setData([]);
                    return;
                }

                setData(responseData);
            } catch (error) {
                console.error('Erro na requisição:', error);
                message.error('Erro ao carregar as auditorias.');
            } finally {
                setLoading(false);
            }
        };

        fetchDueDateBanks();
    }, []);

    const getInitials = (applicant: string) => {
        if (typeof applicant === 'string') {
          const nameParts = applicant.split(' ');
          const initials = nameParts.map(part => part.charAt(0)).join('');
          return initials.substring(0, 2).toUpperCase();
        }
        return 'NN';
      };


    const columns: ColumnsType<DataType> = [
        {
            title: 'Usuário',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
            render: (text: string) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar style={{ backgroundColor: '#fb003f3d', color: '#b30735', marginRight: 15 }}>
                    {getInitials(text)}
                  </Avatar>
                  {text}
                </div>
              ),
        },
        {
            title: 'Ação',
            dataIndex: 'action',
            key: 'action',
            align: 'center',
        },
        {
            title: 'Detalhes',
            dataIndex: 'details',
            key: 'details',
            align: 'center',
        },
        {
            title: 'Data',
            dataIndex: 'date',
            key: 'date',
            align: 'center',
            render: (text: string) => moment(text).format('DD/MM/YYYY'),
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
                className='tables-wise'
                scroll={{ y: 400 }}
                pagination={false}
                columns={columns}
                dataSource={data}
                loading={loading}
            />
        </>
    );
};

export default AuditTable;
