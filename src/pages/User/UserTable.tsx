import Header from '../../components/Header';
import './style.sass';
import { Button, Table, Tag, Input, Dropdown, Modal, Avatar } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import {
    SearchOutlined,
    EllipsisOutlined,
} from '@ant-design/icons';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.tsx';
import EditDelete from '../../components/EditDelete/EditDelete.tsx';
import { TableRowSelection } from 'antd/es/table/interface';

interface DataType {
    key: string;
    name: string;
    organization: string;
    role: string;
    tags: string[];
}

// Função para obter as iniciais do nome
const getInitials = (name: string) => {
    const nameParts = name.split(' ');
    const initials = nameParts.map(part => part.charAt(0)).join('');
    return initials.substring(0, 2).toUpperCase();
};

const columns: ColumnsType<DataType> = [
    {
        title: 'Nome',
        dataIndex: 'name',
        key: 'name',
        render: (text: string) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar style={{ backgroundColor: '#fb003f3d', color: '#b30735', marginRight: 15 }}>
                    {getInitials(text)}
                </Avatar>
                {text}
            </div>
        ),
        align: 'center'
    },
    {
        title: 'Organização',
        dataIndex: 'organization',
        key: 'organization',
        align: 'center'
    },
    {
        title: 'Cargo',
        dataIndex: 'role',
        key: 'role',
        align: 'center'
    },
    {
        title: 'Tags',
        key: 'tags',
        dataIndex: 'tags',
        render: (_, { tags }) => (
            <>
                {tags.map(tag => {
                    let color = tag === 'Coordenador' ? 'orange' : 'geekblue';
                    if (tag === 'Funcionário') {
                        color = 'pink';
                    }
                    return (
                        <Tag color={color} key={tag}>
                            {tag.toUpperCase()}
                        </Tag>
                    );
                })}
            </>
        ),
        align: 'center'
    },
];

const data: DataType[] = [
    {
        key: '1',
        name: 'John Brown',
        organization: 'Teste1',
        role: 'CTO',
        tags: ['Administrador'],
    },
    {
        key: '2',
        name: 'Jim Green',
        organization: 'Teste1',
        role: 'Analista I',
        tags: ['Funcionário'],
    },
    {
        key: '3',
        name: 'Joe Black',
        organization: 'Teste1',
        role: 'Project Owner',
        tags: ['Coordenador'],
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

const UserTable: React.FC = () => {


    return (
        <div>
            <Table pagination={false} scroll={{ y: 400 }} columns={columns} dataSource={data} rowSelection={{...rowSelection}} style={{ marginTop: 20 }} />
        </div>
    );
};

export default UserTable;
