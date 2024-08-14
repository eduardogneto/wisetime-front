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
    },
    {
        title: 'Organização',
        dataIndex: 'organization',
        key: 'organization',
    },
    {
        title: 'Cargo',
        dataIndex: 'role',
        key: 'role',
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
    },
    {
        title: 'Action',
        key: 'action',
        render: (_) => (
            <EditDelete />
        ),
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

const User: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <Header />
            <div className='container-user'>
                <div className='table'>
                    <Breadcrumb />
                    <div style={{ display: 'flex' }}>
                        <Input size="middle" placeholder="Pesquisar" prefix={<SearchOutlined style={{ color: '#FF426B' }} />} style={{ height: 55, borderRadius: 15, backgroundColor: '#192831', border: 'none', color: 'white' }} />
                        <div className='button-user'>
                            <button type='submit' onClick={showModal}>
                                <p>Cadastrar</p>
                            </button>
                        </div>
                    </div>
                    <Table columns={columns} dataSource={data} />
                    <Modal className='modal' title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default User;
