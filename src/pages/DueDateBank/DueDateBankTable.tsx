import React from 'react';
import Header from '../../components/Header/index.js';
import './style.sass';
import {
    EnvironmentOutlined,
} from '@ant-design/icons';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.tsx';
import { ColumnsType } from 'antd/es/table/InternalTable';
import { Select, Table, Tag } from 'antd';
import EditDelete from '../../components/EditDelete/EditDelete.tsx';
import { TableRowSelection } from 'antd/es/table/interface';

const DueDateBankTable: React.FC = () => {

    interface DataType {
        key: string;
        period: string;
        status: string[];
    }

    const columns: ColumnsType<DataType> = [
        {
            title: 'periodo',
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
                        let color = tag === 'Em aberto' ? 'green' : 'red';

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

    const data: DataType[] = [
        {
            key: '1',
            period: '10/11',
            status: ['Completo'],
        },
        {
            key: '2',
            period: '10/11',
            status: ['Completo'],
        },
        {
            key: '3',
            period: '10/11',
            status: ['Completo'],
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
            <Table rowSelection={{...rowSelection}} scroll={{ y: 400 }} style={{ marginTop: 20 }} pagination={false} columns={columns} dataSource={data} />
        </>
    );
};

export default DueDateBankTable;
