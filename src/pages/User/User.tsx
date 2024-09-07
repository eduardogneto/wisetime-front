import Header from '../../components/Header';
import './style.sass';
import { Input, Modal } from 'antd';
import React, { useState } from 'react';
import {
    SearchOutlined,
} from '@ant-design/icons';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.tsx';
import UserTable from './UserTable.tsx';
import { TopButtons } from '../../components/TopButtons/TopButtons.tsx';




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
                        <div className='filters-history' style={{ marginTop: 10 }}>
                            <div className='left-filters'>
                                <Input size="middle" placeholder="Pesquisar" prefix={<SearchOutlined style={{ color: '#FF426B' }} />} style={{ height: 55, borderRadius: 15, backgroundColor: '#192831', border: 'none', color: 'white', marginRight: 15 }} />
                            </div>
                            <div className='right-filters'>
                                <TopButtons handleEdit={showModal} handleDelete={showModal} isEditable isDeletable />
                                <div className='button-history'>
                                    <button type='submit' onClick={showModal} style={{marginLeft:15}}>
                                        <p>Cadastrar</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    <UserTable />
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
