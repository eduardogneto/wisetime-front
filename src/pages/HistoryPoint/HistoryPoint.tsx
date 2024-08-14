import React from 'react';
import './style.sass';
import { Dropdown, Menu } from 'antd';
import { UserOutlined, HomeOutlined } from '@ant-design/icons';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.tsx';
import Header from '../../components/Header';

const HistoryPoint: React.FC = () => {



    return (
        <div>
            <Header />
            <div className='container-user'>
                <div className='table'>
                    <Breadcrumb />
                </div>
            </div>
        </div>
    );
};

export default HistoryPoint;
