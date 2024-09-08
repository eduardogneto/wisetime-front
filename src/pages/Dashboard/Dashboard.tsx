import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import './style.sass';
import { EnvironmentOutlined } from '@ant-design/icons';

const name = localStorage.getItem('name');

const Dashboard: React.FC = () => {
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [error, setError] = useState('');

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

  // Função para buscar endereço com a API Nominatim
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

  // Obtém a localização quando o componente é montado
  useEffect(() => {
    getUserLocation();
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
                <button type='submit'>
                  <p>Bater Ponto</p>
                </button>
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
          <p>Nenhum ponto registrado!</p>
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
