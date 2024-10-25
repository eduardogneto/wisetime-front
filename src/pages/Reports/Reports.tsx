import React, { useState, useEffect } from 'react';
import './style.sass';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.tsx';
import Header from '../../components/Header/index.js';
import ReportsRankingTable from './ReportsRankingTable.tsx';
import api from '../../connection/api.js';

const Reports: React.FC = () => {
    const [positiveHours, setPositiveHours] = useState<number>(0);
    const [negativeHours, setNegativeHours] = useState<number>(0);
    const [totalHours, setTotalHours] = useState<number>(0);

    const teamString = localStorage.getItem('team');
      if (teamString) {
        try {
            const team = JSON.parse(teamString);
            var teamId = team.id;
        } catch (error) {
            console.error('Erro ao analisar o JSON:', error);
        }
      }

    useEffect(() => {
        const fetchPositiveHours = async () => {
            try {
                const response = await api.get(`/api/reports/getPositiveHours/${teamId}`);
                setPositiveHours(response.data);
            } catch (error) {
                console.error('Erro ao buscar horas positivas:', error);
            }
        };

        const fetchNegativeHours = async () => {
            try {
                const response = await api.get(`/api/reports/getNegativeHours/${teamId}`);
                setNegativeHours(response.data);
            } catch (error) {
                console.error('Erro ao buscar horas negativas:', error);
            }
        };

        const fetchTotalHours = async () => {
            try {
                const response = await api.get(`/api/reports/getAllHours/${teamId}`);
                setTotalHours(response.data);
            } catch (error) {
                console.error('Erro ao buscar total de horas:', error);
            }
        };

        fetchPositiveHours();
        fetchNegativeHours();
        fetchTotalHours();
    }, [teamId]);

    const formatTime = (seconds) => {
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
                    </div>
                    <ReportsRankingTable />
                </div>
            </div>
        </div>
    );
};

export default Reports;
