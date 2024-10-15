import React, { useState, useEffect } from 'react';
import './style.sass';
import { Tabs, Select } from 'antd';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.tsx';
import Header from '../../components/Header/index.js';


const Reports: React.FC = () => {
    

    return (
        <div className="reports-page">
            <Header />
            <div className="container-user">
                <div className="table">
                    <Breadcrumb />
                   
                </div>
            </div>
        </div>
    );
};

export default Reports;
