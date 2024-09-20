// src/pages/Reports/Reports.tsx
import React, { useState, useEffect } from 'react';
import './style.sass';
import { Tabs, Select } from 'antd';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.tsx';
import Header from '../../components/Header/index.js';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,  
    PointElement,
    LineElement,
} from 'chart.js';
import api from '../../connection/api';
import ReportTab from '../../pages/Reports/ReportTab.tsx';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const { TabPane } = Tabs;
const { Option } = Select;

const Reports: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('Semana Atual');
    const [reportData, setReportData] = useState<any>({});

    useEffect(() => {
        api.get('/report-data')
            .then(response => {
                setReportData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Erro ao carregar os dados do relatório:', error);
                setLoading(false);
            });
    }, []);

    const reports = [
        {
            key: '1',
            title: 'Distribuição de Horas Trabalhadas',
            chartType: 'bar',
            chartData: reportData.distributionHours || {
                labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
                datasets: [
                    {
                        label: 'Horas Trabalhadas',
                        backgroundColor: 'rgba(52, 152, 219, 0.7)',
                        borderColor: 'rgba(52, 152, 219, 1)',
                        borderWidth: 1,
                        data: [40, 50, 36, 52],
                    },
                    {
                        label: 'Horas Extras',
                        backgroundColor: 'rgba(231, 76, 60, 0.7)',
                        borderColor: 'rgba(231, 76, 60, 1)',
                        borderWidth: 1,
                        data: [10, 15, 5, 20],
                    },
                ],
            },
            chartOptions: {
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true },
                },
            },
            tableColumns: [
                { title: 'Usuário', dataIndex: 'user', key: 'user' },
                { title: 'Horas Trabalhadas', dataIndex: 'hours', key: 'hours' },
                { title: 'Horas Extras', dataIndex: 'extraHours', key: 'extraHours' },
            ],
            tableData: reportData.distributionHoursTable || [
                { key: '1', user: 'Usuário A', hours: 40, extraHours: 10 },
                { key: '2', user: 'Usuário B', hours: 50, extraHours: 15 },
                { key: '3', user: 'Usuário C', hours: 36, extraHours: 5 },
                { key: '4', user: 'Usuário D', hours: 52, extraHours: 20 },
            ],
        },
        {
            key: '2',
            title: 'Frequência de Solicitações',
            chartType: 'bar',
            chartData: reportData.requestFrequency || {
                labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril'],
                datasets: [
                    {
                        label: 'Atestado',
                        backgroundColor: '#3498db',
                        data: [20, 30, 25, 35],
                    },
                    {
                        label: 'Abono',
                        backgroundColor: '#2ecc71',
                        data: [15, 25, 20, 30],
                    },
                    {
                        label: 'Férias',
                        backgroundColor: '#f1c40f',
                        data: [10, 20, 15, 25],
                    },
                    {
                        label: 'Ponto Manual',
                        backgroundColor: '#e74c3c',
                        data: [5, 10, 8, 12],
                    },
                ],
            },
            chartOptions: {
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true },
                },
            },
            tableColumns: [
                { title: 'Tipo de Solicitação', dataIndex: 'type', key: 'type' },
                { title: 'Quantidade', dataIndex: 'quantity', key: 'quantity' },
            ],
            tableData: reportData.requestFrequencyTable || [
                { key: '1', type: 'Atestado', quantity: 20 },
                { key: '2', type: 'Abono', quantity: 15 },
                { key: '3', type: 'Férias', quantity: 10 },
                { key: '4', type: 'Ponto Manual', quantity: 5 },
            ],
        },
        {
            key: '3',
            title: 'Aprovações/Reprovações de Solicitações',
            chartType: 'pie',
            chartData: reportData.approvalRatio || {
                labels: ['Aprovadas', 'Reprovadas'],
                datasets: [
                    {
                        data: [70, 30],
                        backgroundColor: ['#2ecc71', '#e74c3c'],
                        hoverBackgroundColor: ['#27ae60', '#c0392b'],
                    },
                ],
            },
            chartOptions: {
                maintainAspectRatio: false,
            },
            tableColumns: [
                { title: 'Status', dataIndex: 'status', key: 'status' },
                { title: 'Quantidade', dataIndex: 'quantity', key: 'quantity' },
            ],
            tableData: reportData.approvalRatioTable || [
                { key: '1', status: 'Aprovadas', quantity: 70 },
                { key: '2', status: 'Reprovadas', quantity: 30 },
            ],
        },
        {
            key: '4',
            title: 'Pontualidade',
            chartType: 'line',
            chartData: reportData.punctuality || {
                labels: ['Dia 1', 'Dia 2', 'Dia 3', 'Dia 4', 'Dia 5'],
                datasets: [
                    {
                        label: 'No Horário',
                        borderColor: '#2ecc71',
                        data: [8, 9, 7, 10, 6],
                        fill: false,
                    },
                    {
                        label: 'Atrasado',
                        borderColor: '#e74c3c',
                        data: [2, 1, 3, 0, 4],
                        fill: false,
                    },
                    {
                        label: 'Adiantado',
                        borderColor: '#f1c40f',
                        data: [1, 2, 1, 3, 2],
                        fill: false,
                    },
                ],
            },
            chartOptions: {
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true },
                },
            },
            tableColumns: [
                { title: 'Status', dataIndex: 'status', key: 'status' },
                { title: 'Quantidade', dataIndex: 'quantity', key: 'quantity' },
            ],
            tableData: reportData.punctualityTable || [
                { key: '1', status: 'No Horário', quantity: 8 },
                { key: '2', status: 'Atrasado', quantity: 2 },
                { key: '3', status: 'Adiantado', quantity: 1 },
            ],
        },
        {
            key: '5',
            title: 'Ausências por Mês',
            chartType: 'bar',
            chartData: reportData.absences || {
                labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril'],
                datasets: [
                    {
                        label: 'Ausências',
                        backgroundColor: '#8e44ad',
                        data: [5, 3, 4, 2],
                    },
                ],
            },
            chartOptions: {
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true },
                },
            },
            tableColumns: [
                { title: 'Mês', dataIndex: 'month', key: 'month' },
                { title: 'Ausências', dataIndex: 'absences', key: 'absences' },
            ],
            tableData: reportData.absencesTable || [
                { key: '1', month: 'Janeiro', absences: 5 },
                { key: '2', month: 'Fevereiro', absences: 3 },
                { key: '3', month: 'Março', absences: 4 },
                { key: '4', month: 'Abril', absences: 2 },
            ],
        },
        {
            key: '6',
            title: 'Tempo Médio de Resposta às Solicitações',
            chartType: 'line',
            chartData: reportData.responseTime || {
                labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril'],
                datasets: [
                    {
                        label: 'Tempo Médio (dias)',
                        borderColor: '#3498db',
                        data: [2, 3, 2.5, 4],
                        fill: false,
                    },
                ],
            },
            chartOptions: {
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true },
                },
            },
            tableColumns: [
                { title: 'Mês', dataIndex: 'month', key: 'month' },
                { title: 'Tempo Médio (dias)', dataIndex: 'averageTime', key: 'averageTime' },
            ],
            tableData: reportData.responseTimeTable || [
                { key: '1', month: 'Janeiro', averageTime: 2 },
                { key: '2', month: 'Fevereiro', averageTime: 3 },
                { key: '3', month: 'Março', averageTime: 2.5 },
                { key: '4', month: 'Abril', averageTime: 4 },
            ],
        },
        {
            key: '7',
            title: 'Carga Horária por Time',
            chartType: 'pie',
            chartData: reportData.teamWorkload || {
                labels: ['Time A', 'Time B', 'Time C'],
                datasets: [
                    {
                        data: [120, 150, 90],
                        backgroundColor: ['#1abc9c', '#3498db', '#9b59b6'],
                        hoverBackgroundColor: ['#16a085', '#2980b9', '#8e44ad'],
                    },
                ],
            },
            chartOptions: {
                maintainAspectRatio: false,
            },
            tableColumns: [
                { title: 'Time', dataIndex: 'team', key: 'team' },
                { title: 'Carga Horária', dataIndex: 'workload', key: 'workload' },
            ],
            tableData: reportData.teamWorkloadTable || [
                { key: '1', team: 'Time A', workload: 120 },
                { key: '2', team: 'Time B', workload: 150 },
                { key: '3', team: 'Time C', workload: 90 },
            ],
        },
        {
            key: '8',
            title: 'Turnover',
            chartType: 'line',
            chartData: reportData.turnover || {
                labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril'],
                datasets: [
                    {
                        label: 'Turnover',
                        borderColor: '#e67e22',
                        data: [5, 7, 6, 8],
                        fill: false,
                    },
                ],
            },
            chartOptions: {
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true },
                },
            },
            tableColumns: [
                { title: 'Mês', dataIndex: 'month', key: 'month' },
                { title: 'Turnover', dataIndex: 'turnover', key: 'turnover' },
            ],
            tableData: reportData.turnoverTable || [
                { key: '1', month: 'Janeiro', turnover: 5 },
                { key: '2', month: 'Fevereiro', turnover: 7 },
                { key: '3', month: 'Março', turnover: 6 },
                { key: '4', month: 'Abril', turnover: 8 },
            ],
        },
        {
            key: '9',
            title: 'Férias Programadas',
            chartType: 'bar',
            chartData: reportData.scheduledVacations || {
                labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril'],
                datasets: [
                    {
                        label: 'Férias',
                        backgroundColor: '#e74c3c',
                        data: [2, 3, 1, 4],
                    },
                ],
            },
            chartOptions: {
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true },
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context: any) {
                                return `Férias: ${context.parsed.y}`;
                            }
                        }
                    }
                }
            },
            tableColumns: [
                { title: 'Mês', dataIndex: 'month', key: 'month' },
                { title: 'Férias Programadas', dataIndex: 'vacations', key: 'vacations' },
            ],
            tableData: reportData.scheduledVacationsTable || [
                { key: '1', month: 'Janeiro', vacations: 2 },
                { key: '2', month: 'Fevereiro', vacations: 3 },
                { key: '3', month: 'Março', vacations: 1 },
                { key: '4', month: 'Abril', vacations: 4 },
            ],
        },
        {
            key: '10',
            title: 'Saldo de Horas',
            chartType: 'line',
            chartData: reportData.hoursBalance || {
                labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril'],
                datasets: [
                    {
                        label: 'Saldo de Horas',
                        borderColor: '#2c3e50',
                        data: [100, 120, 110, 130],
                        fill: false,
                    },
                ],
            },
            chartOptions: {
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true },
                },
            },
            tableColumns: [
                { title: 'Mês', dataIndex: 'month', key: 'month' },
                { title: 'Saldo de Horas', dataIndex: 'balance', key: 'balance' },
            ],
            tableData: reportData.hoursBalanceTable || [
                { key: '1', month: 'Janeiro', balance: 100 },
                { key: '2', month: 'Fevereiro', balance: 120 },
                { key: '3', month: 'Março', balance: 110 },
                { key: '4', month: 'Abril', balance: 130 },
            ],
        },
    ];

    return (
        <div className="reports-page">
            <Header />
            <div className="container-user">
                <div className="table">
                    <Breadcrumb />
                    <Tabs defaultActiveKey="1">
                        {reports.map(report => (
                            <TabPane tab={report.title} key={report.key}>
                                <ReportTab
                                    title={report.title}
                                    chartType={report.chartType}
                                    chartData={report.chartData}
                                    chartOptions={report.chartOptions}
                                    tableData={report.tableData}
                                    tableColumns={report.tableColumns}
                                />
                            </TabPane>
                        ))}
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default Reports;
