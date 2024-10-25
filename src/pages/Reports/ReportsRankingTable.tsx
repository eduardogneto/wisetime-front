import React, { useState, useEffect } from 'react';
import { ColumnsType } from 'antd/es/table';
import { Table, Tag, Avatar } from 'antd';
import api from '../../connection/api.js';

interface DataType {
    key: string;
    user: string;
    hours: string;
    tags: string[];
  }
  
  interface ReportsRankingTableProps {
    teamId: number;
  }

  const ReportsRankingTable: React.FC = () => {
    const [data, setData] = useState<DataType[]>([]);
  
    // Função para formatar o tempo
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
      const fetchData = async () => {
        try {
          const response = await api.get(`/api/reports/getUserBalances/${teamId}`);
          const userBalances = response.data;
  
          const newData = userBalances.map((item: any, index: number) => {
            const { userName, totalBalanceInSeconds } = item;
  
            const formattedTime = formatTime(totalBalanceInSeconds);
  
            const tags = [];
            if (totalBalanceInSeconds > 0) {
              tags.push('POSITIVAS');
            } else if (totalBalanceInSeconds < 0) {
              tags.push('NEGATIVAS');
            } else {
              tags.push('ZERO');
            }
  
            return {
              key: String(index),
              user: userName,
              hours: `${formattedTime.sign}${formattedTime.time}`,
              tags: tags
            };
          });
  
          setData(newData);
        } catch (error) {
          console.error('Erro ao buscar dados:', error);
        }
      };
  
      fetchData();
    }, [teamId]);
  
    const getInitials = (applicant: string) => {
      if (typeof applicant === 'string') {
        const nameParts = applicant.split(' ');
        const initials = nameParts.map(part => part.charAt(0)).join('');
        return initials.substring(0, 2).toUpperCase();
      }
      return 'NN';
    };
  
    const columns: ColumnsType<DataType> = [
      {
        title: 'Usuário',
        dataIndex: 'user',
        key: 'user',
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
        title: 'Horas',
        dataIndex: 'hours',
        key: 'hours',
      },
      {
        title: 'Tags',
        key: 'tags',
        dataIndex: 'tags',
        render: (_, { tags }) => (
          <>
            {tags.map(tag => {
              let color;
              if (tag === 'POSITIVAS') {
                color = 'green';
              } else if (tag === 'NEGATIVAS') {
                color = 'red';
              } else {
                color = 'gray';
                tag = 'ZERO';
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
    ];
  
    return (
      <>
        <Table
          className="tables-wise"
          style={{ maxHeight: 'calc(100% - 40%)' }}
          pagination={false}
          columns={columns}
          dataSource={data}
        />
      </>
    );
  };
  
  export default ReportsRankingTable;
  