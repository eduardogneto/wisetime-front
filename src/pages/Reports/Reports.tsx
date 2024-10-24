import React, { useState, useEffect } from 'react';
import './style.sass';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.tsx';
import Header from '../../components/Header/index.js';
import ReportsRankingTable from './ReportsRankingTable.tsx';


const Reports: React.FC = () => {


    return (
        <div className="reports-page">
            <Header />
            <div className="container-user">
                <div className="table">
                    <Breadcrumb />
                    <div className='containers-balance'>
                        <div className='balance-point'>
                            <p className='top-point-balace'>Usuarios com horas extras</p>
                            <p className='low-point-balace'>
                                <span>1</span>
                            </p>
                        </div>
                        <div className='balance-point'>
                            <p className='top-point-balace'>Usuarios com horas negativas</p>
                            <p className='low-point-balace'>
                                <span>2</span>
                            </p>
                        </div>
                        <div className='balance-point'>
                            <p className='top-point-balace'>total de horas do time</p>
                            <p className='low-point-balace'>
                                <span>3</span>
                            </p>
                        </div>
                    </div>
                        <ReportsRankingTable/>
                </div>
            </div>
        </div>
    );
};

export default Reports;
