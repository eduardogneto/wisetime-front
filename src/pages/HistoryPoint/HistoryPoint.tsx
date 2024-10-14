import React, { useEffect, useState } from 'react';
import { Select, message } from 'antd';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.tsx';
import Header from '../../components/Header';
import HistoryPointTable from './HistoryPointTable.tsx';
import { TopButtons } from '../../components/TopButtons/TopButtons.tsx';
import api from '../../connection/api';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween'; 

dayjs.extend(isBetween); 

const { Option } = Select;

interface Period {
  id: number;
  startDate: string; 
  endDate: string; 
}

const HistoryPoint: React.FC = () => {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  });
  const [defaultValue, setDefaultValue] = useState<string | undefined>(undefined);

  const getPeriodStatus = (startDate: string, endDate: string): string => {
    const today = dayjs();
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (today.isBetween(start, end, 'day', '[]')) {
      return ' - Atual';
    } else if (today.isAfter(end)) {
      return ' - Fechado';
    } else {
      return '';
    }
  };

  const handleChange = (value: string) => {
    const period = periods.find(p => p.id.toString() === value);
    if (period) {
      setSelectedPeriod({
        start: period.startDate,
        end: period.endDate,
      });
    }
  };

  const fetchPeriods = async () => {
    try {
      const organizationId = localStorage.getItem('organizationId');
      if (!organizationId) {
        throw new Error('Organização não encontrada.');
      }

      const response = await api.get(`/api/dueDateBank/periods/${organizationId}`);

      setPeriods(response.data);

      if (response.data.length > 0) {
        const firstPeriod = response.data[0];
        setSelectedPeriod({
          start: firstPeriod.startDate,
          end: firstPeriod.endDate,
        });
        setDefaultValue(firstPeriod.id.toString()); 
      }
    } catch (error) {
      console.error('Erro ao buscar os períodos:', error);
      message.error('Erro ao buscar os períodos.');
    }
  };

  useEffect(() => {
    fetchPeriods();
  }, []);

  return (
    <div>
      <Header />
      <div className='container-user'>
        <div className='table'>
          <Breadcrumb />
          <p style={{ marginLeft: 10 }}>Período</p>
          <div className='filters-history'>
            <div className='left-filters'>
              <Select
                onChange={handleChange}
                className='select'
                placeholder="Selecione o Período"
                value={defaultValue} 
                style={{ width: 250 }}
                loading={periods.length === 0}
              >
                {periods.map(period => (
                  <Option key={period.id} value={period.id.toString()}>
                    {`${dayjs(period.startDate).format('DD/MM/YYYY')} - ${dayjs(period.endDate).format('DD/MM/YYYY')}${getPeriodStatus(period.startDate, period.endDate)}`}
                  </Option>
                ))}
              </Select>
            </div>
            <div className='right-filters'>
              <TopButtons />
            </div>
          </div>
          <HistoryPointTable selectedPeriod={selectedPeriod} />
        </div>
      </div>
    </div>
  );
};

export default HistoryPoint;
