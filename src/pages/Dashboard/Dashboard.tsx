import React from 'react';
import Header from '../../components/Header';
import './style.sass';
import {
  EnvironmentOutlined,
} from '@ant-design/icons';

const Dashboard: React.FC = () => {
  return (
    <div>
      <Header />
      <div className='container-point'>
        <div className='left-point'>
          <div className='hello-user'>
            <div className='hello-line1'>
              <p>Olá</p>
              <p>Eduardo Neto, </p>
            </div>
            <div className='hello-line2'>
              <p>Registre seu ponto</p>
              <p>agora!</p>
            </div>
          </div>
          <div className='date-point'>
            <div className='date-button'>
              <div className='date-hour'>
                <p>11 de Agosto, 18h51min</p>
              </div>
              <div className='button-point'>
                <button type='submit' >
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
            <EnvironmentOutlined style={{fontSize:23, color:'#FF3366'}}/>
            <p> Rua Maria Rosalina Speck, 405, Costa e Silva, Joinville - SC</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
