import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Table } from 'antd';

interface ReportTabProps {
    title: string;
    chartType: 'bar' | 'pie' | 'line';
    chartData: any;
    chartOptions?: any;
    tableData: any[];
    tableColumns: any[];
}

const ReportTab: React.FC<ReportTabProps> = ({ title, chartType, chartData, chartOptions, tableData, tableColumns }) => {
    const renderChart = () => {
        switch(chartType) {
            case 'bar':
                return <Bar data={chartData} options={chartOptions} height={400} />;
            case 'pie':
                return <Pie data={chartData} options={chartOptions} height={400} />;
            case 'line':
                return <Line data={chartData} options={chartOptions} height={400} />;
            default:
                return null;
        }
    };

    return (
        <div>
            <h2>{title}</h2>
            <div className="report-content">
                <div className="chart-container">
                    {renderChart()}
                </div>
                <div className="table-container">
                    <Table className='tables-wise' dataSource={tableData} columns={tableColumns} pagination={false} />
                </div>
            </div>
        </div>
    );
};

export default ReportTab;
