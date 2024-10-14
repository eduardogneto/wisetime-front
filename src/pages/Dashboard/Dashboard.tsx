import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import './style.sass';
import { EnvironmentOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import api from '../../connection/api'; 
import dayjs from 'dayjs';

const name = localStorage.getItem('name');
const userId = localStorage.getItem('id'); 

const Dashboard: React.FC = () => {
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 
  const [punchLogs, setPunchLogs] = useState([]);

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleString('pt-BR', { month: 'long' });
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day} de ${month.charAt(0).toUpperCase() + month.slice(1)}, ${hours}h${minutes}min`;
  };

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDateTime(formatDate(now));
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchAddress(latitude, longitude);
        },
        (err) => {
          console.error('Erro ao obter localização:', err); 
          setError('Erro ao obter localização. Verifique as permissões.');
          fetchLocationByIP(); 
        }
      );
    } else {
      setError('Geolocalização não é suportada pelo navegador.');
      fetchLocationByIP(); 
    }
  };

  const fetchAddress = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      if (data.display_name) {
        setUserLocation(data.display_name); 
      } else {
        throw new Error('Endereço não encontrado.');
      }
    } catch (err) {
      console.error('Erro ao buscar endereço:', err); 
      setError('Erro ao buscar endereço.');
    }
  };

  const fetchLocationByIP = async () => {
    try {
      const response = await fetch(`https://ipapi.co/json/`); 
      const data = await response.json();
      if (data && data.city) {
        const address = `${data.city}, ${data.region}, ${data.country_name}`;
        setUserLocation(address); 
      } else {
        setError('Não foi possível obter a localização pelo IP.');
      }
    } catch (err) {
      console.error('Erro ao obter localização pelo IP:', err);
      setError('Erro ao buscar a localização aproximada pelo IP.');
    }
  };

  useEffect(() => {
    getUserLocation();
    fetchPunchLogs(); 
  }, []);

  const fetchPunchLogs = async () => {
    try {
      const response = await api.get(`/api/punch/history/${userId}/${new Date().toISOString().split('T')[0]}`);
      if (response.status === 200) {
        const sortedLogs = response.data.sort((a: any, b: any) => {
          const timeA = new Date(a.timestamp).getTime();
          const timeB = new Date(b.timestamp).getTime();
          return timeA - timeB; 
        });
        setPunchLogs(sortedLogs); 
      } else {
        setPunchLogs([]);
        message.error('Falha ao buscar os registros de ponto.');
      }
    } catch (error) {
      console.error('Erro ao buscar registros de ponto:', error);
      setPunchLogs([]);
      message.error('Erro ao buscar os registros de ponto.');
    }
  };

  const handlePunchClock = async () => {
    const userId = localStorage.getItem('id'); 
  
    if (!userId) {
      message.error('Usuário não encontrado.');
      return;
    }
  
    const timestamp = dayjs().subtract(3, 'hour').toISOString();
    const type = 'ENTRY'; 
  
    setLoading(true); 
  
    try {
      const response = await api.post('/api/punch/log', {
        userId,
        timestamp,
        type,
        location: userLocation, 
      });
  
      if (response.status === 200) {
        message.success('Batida de ponto registrada com sucesso!');
        fetchPunchLogs(); 
      } else {
        message.error('Falha ao registrar a batida de ponto.');
      }
    } catch (error) {
      console.error('Erro ao registrar ponto:', error);
      message.error('Erro ao registrar a batida de ponto.');
    } finally {
      setLoading(false); 
    }
  };

  const formatBalance = (balance: string) => {
    const symbol = balance.substring(0, 1); 
    const time = balance.substring(1); 
    const [hours, minutes] = time.split(':'); 
    const formattedTime = `${hours}h${minutes}min`; 
    return { symbol, formattedTime };
  };

  const [balances, setBalances] = useState({
    currentPeriodBalance: '+00:00',
    previousPeriodBalance: '+00:00',
    totalBalance: '+00:00',
  });

  const fetchBalances = async () => {
    setLoading(true);
    try {
      let userId = localStorage.getItem('id');
      let organizationId = localStorage.getItem('organizationId');

      if (!userId || !organizationId) {
        throw new Error('Usuário ou organização não encontrados.');
      }

      const response = await api.get(`/api/users/${userId}/balances`, {
        params: { organizationId },
      });

      setBalances(response.data);
    } catch (error) {
      console.error('Erro ao buscar os saldos:', error);
      message.error('Erro ao buscar os saldos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, []);

  return (
    <div>
      <Header />
      <div className='container-point'>
        <div className='left-point'>
          <div className='hello-user'>
            <div className='hello-line1'>
              <p>Olá</p>
              <p>{name}, </p>
            </div>
            <div className='hello-line2'>
              <p>Registre seu ponto</p>
              <p>agora!</p>
            </div>
          </div>
          <div className='date-point'>
            <div className='date-button'>
              <div className='date-hour'>
                <p>{currentDateTime}</p>
              </div>
              <div className='button-point'>
                <Button type="primary" onClick={handlePunchClock} loading={loading}>
                  <h1 style={{ fontSize: 40 }}>Bater Ponto</h1>
                </Button>
              </div>
            </div>
            <div className='right-point'>
              <div className='container-hours'>
                <p className='top-balace'>Saldo Período</p>
                <p className='low-balace'>
                  {
                    (() => {
                      const { symbol, formattedTime } = formatBalance(balances.currentPeriodBalance);
                      return (
                        <>
                          <span className='pink'>{symbol}</span>
                          <span>{formattedTime}</span>
                        </>
                      );
                    })()
                  }
                </p>
              </div>
              <div className='container-map'>
                <p className='top-balace'>Saldo Geral</p>
                <p className='low-balace'>
                  {
                    (() => {
                      const { symbol, formattedTime } = formatBalance(balances.totalBalance);
                      return (
                        <>
                          <span className='pink'>{symbol}</span>
                          <span>{formattedTime}</span>
                        </>
                      );
                    })()
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='container-infos'>
        <div className='left-info'>
          <div className="punch-logs">
            {punchLogs.length === 0 ? (
              <p>Nenhum ponto registrado!</p>
            ) : (
              punchLogs.map((log: any, index: number) => (
                <div className="punch-log" key={log.id}>
                  <CheckCircleOutlined
                    style={{
                      fontSize: 23,
                      color: log.location ? '#FF3366' : '#A9A9A9'
                    }}
                  />
                  <b>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</b>
                  <span className="type">{log.type === 'ENTRY' ? 'E' : 'S'}</span>
                </div>
              ))
            )}
          </div>
          <div className='localization-info'>
            <EnvironmentOutlined style={{ fontSize: 23, color: '#FF3366' }} />
            {error ? (
              <p>{error}</p>
            ) : (
              <p>{userLocation}</p> 
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
