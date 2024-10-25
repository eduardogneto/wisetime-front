import React, { useState, useEffect } from 'react';
import './style.sass';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.tsx';
import Header from '../../components/Header/index.js';
import ReportsRankingTable from './ReportsRankingTable.tsx';
import api from '../../connection/api.js';
import { Skeleton, message } from 'antd';

const Reports: React.FC = () => {
    const [positiveHours, setPositiveHours] = useState<number>(0);
    const [negativeHours, setNegativeHours] = useState<number>(0);
    const [totalHours, setTotalHours] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true); 

    const teamString = localStorage.getItem('team');
    let teamId: number | undefined;

    if (teamString) {
        try {
            const team = JSON.parse(teamString);
            teamId = team.id;
        } catch (error) {
            console.error('Erro ao analisar o JSON:', error);
            message.error('Erro ao analisar os dados da equipe.');
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            if (!teamId) {
                message.error('ID da equipe não encontrado.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true); 

                const fetchPositiveHours = api.get(`/api/reports/getPositiveHours/${teamId}`);
                const fetchNegativeHours = api.get(`/api/reports/getNegativeHours/${teamId}`);
                const fetchTotalHours = api.get(`/api/reports/getAllHours/${teamId}`);

                const [positiveRes, negativeRes, totalRes] = await Promise.all([
                    fetchPositiveHours,
                    fetchNegativeHours,
                    fetchTotalHours,
                ]);

                setPositiveHours(positiveRes.data);
                setNegativeHours(negativeRes.data);
                setTotalHours(totalRes.data);
            } catch (error) {
                console.error('Erro ao buscar dados dos relatórios:', error);
                message.error('Erro ao buscar dados dos relatórios.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [teamId]);

    const formatTime = (seconds: number) => {
        const isNegative = seconds < 0;
        const absoluteSeconds = Math.abs(seconds);

        const hours = Math.floor(absoluteSeconds / 3600);
        const minutes = Math.floor((absoluteSeconds % 3600) / 60);

        const sign = isNegative ? '-' : '+';
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');

        return { sign, time: `${formattedHours}h${formattedMinutes}min` };
    };

    const formattedTotalHours = formatTime(totalHours);

    return (
        <div className="reports-page">
            <Header />
            <div className="container-user">
                <div className="table">
                    <Breadcrumb />
                    <div className='containers-balance'>
                        {loading ? (
                            <>
                                <div className='balance-point'>
                                    <Skeleton.Input active  />
                                </div>
                                <div className='balance-point'>
                                    <Skeleton.Input active  />
                                </div>
                                <div className='balance-point'>
                                    <Skeleton.Input active  />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='balance-point'>
                                    <p className='top-point-balace'>Usuários com horas extras</p>
                                    <p className='low-point-balace'>
                                        <span>{positiveHours}</span>
                                    </p>
                                </div>
                                <div className='balance-point'>
                                    <p className='top-point-balace'>Usuários com horas negativas</p>
                                    <p className='low-point-balace'>
                                        <span>{negativeHours}</span>
                                    </p>
                                </div>
                                <div className='balance-point'>
                                    <p className='top-point-balace'>Total de horas do time</p>
                                    <p className='low-point-balace'>
                                        <span>
                                            <span className='pink'>{formattedTotalHours.sign}</span>
                                            {formattedTotalHours.time}
                                        </span>
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                    {loading ? (
                        <Skeleton active paragraph={{ rows: 10 }} />
                    ) : (
                        <ReportsRankingTable />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reports;
