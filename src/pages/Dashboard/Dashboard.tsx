import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import './style.sass';
import { EnvironmentOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import api from '../../connection/api'; // Supondo que você tenha configurado o Axios

const name = localStorage.getItem('name');
const userId = localStorage.getItem('id'); // Pega o userId do localStorage

const Dashboard: React.FC = () => {
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Estado de loading para o botão
  const [punchLogs, setPunchLogs] = useState([]); // Armazena os registros de ponto

  // Função para formatar data e hora
  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleString('pt-BR', { month: 'long' });
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day} de ${month.charAt(0).toUpperCase() + month.slice(1)}, ${hours}h${minutes}min`;
  };

  // Atualiza data e hora
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDateTime(formatDate(now));
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Função para pegar localização do usuário
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchAddress(latitude, longitude);
        },
        (err) => {
          setError('Erro ao obter localização. Verifique as permissões.');
        }
      );
    } else {
      setError('Geolocalização não é suportada pelo navegador.');
    }
  };

  const fetchAddress = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      setUserLocation(data.display_name); // Exibe o endereço completo retornado pela API
    } catch (err) {
      setError('Erro ao buscar endereço.');
    }
  };

  useEffect(() => {
    getUserLocation();
    fetchPunchLogs(); // Buscar registros de ponto ao carregar o componente
  }, []);

  // Função para buscar registros de ponto do usuário no dia atual
  // Função para buscar registros de ponto do usuário no dia atual e ordená-los por horário
  const fetchPunchLogs = async () => {
    try {
      const response = await api.get(`/api/punch/history/${userId}/${new Date().toISOString().split('T')[0]}`);
      if (response.status === 200) {
        // Ordena os registros de ponto pelo horário (timestamp)
        const sortedLogs = response.data.sort((a: any, b: any) => {
          const timeA = new Date(a.timestamp).getTime();
          const timeB = new Date(b.timestamp).getTime();
          return timeA - timeB; // Ordena em ordem crescente
        });
        setPunchLogs(sortedLogs); // Salva os registros de ponto ordenados na variável de estado
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


  // Função para enviar a requisição de Bater Ponto
  const handlePunchClock = async () => {
    if (!userId) {
      message.error('Usuário não encontrado.');
      return;
    }

    const timestamp = new Date().toISOString(); // Pega o horário atual no formato ISO
    const type = 'ENTRY'; // Aqui você pode mudar para ENTRY ou EXIT baseado na lógica de entrada e saída

    setLoading(true); // Inicia o loading no botão

    try {
      const response = await api.post('/api/punch/log', {
        userId,
        timestamp,
        type,
        location: userLocation || null, // Envia a localização, pode ser null se não obtiver
      });

      if (response.status === 200) {
        message.success('Batida de ponto registrada com sucesso!');
        fetchPunchLogs(); // Atualiza a lista de batidas após o registro
      } else {
        message.error('Falha ao registrar a batida de ponto.');
      }
    } catch (error) {
      console.error('Erro ao registrar ponto:', error);
      message.error('Erro ao registrar a batida de ponto.');
    } finally {
      setLoading(false); // Finaliza o loading no botão
    }
  };

  const getInitials = (applicant: string) => {
    if (typeof applicant === 'string') {
      const nameParts = applicant.split(' ');
      const initials = nameParts.map(part => part.charAt(0)).join('');
      return initials.substring(0, 2).toUpperCase();
    }
    return 'NN'; // Se não for string, retorna "NN" como iniciais padrão
  };

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
                  <h1 style={{fontSize:40}}>Bater Ponto</h1>
                </Button>
              </div>
            </div>
            <div className='right-point'>
              <div className='container-hours'>
                <p className='top-balace'>Saldo Período</p>
                <p className='low-balace'>
                  <span className='pink'>+ </span><span>04h32min</span>
                </p>
              </div>
              <div className='container-map'>
                <p className='top-balace'>Saldo Geral</p>
                <p className='low-balace'>
                  <span className='pink'>+ </span><span>14h32min</span>
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
                      color: log.location ? '#FF3366' : '#A9A9A9' // Se há localização, usa a cor padrão, senão usa cinza
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
              <p>{userLocation}</p> // Exibe o endereço
            )}
          </div>
        </div>
      </div>


    </div>
  );
};

export default Dashboard;
