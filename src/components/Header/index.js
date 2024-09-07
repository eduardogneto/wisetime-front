import './header.css';
import React, { useState, useEffect } from 'react';
import {
  ContainerOutlined,
  DesktopOutlined,
  ImportOutlined,
  MenuOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { Menu, Avatar } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const items = [
  {
    key: '1',
    icon: <PieChartOutlined />,
    label: 'Bater Ponto',
    path: '/dashboard'
  },
  {
    key: '2',
    icon: <ContainerOutlined />,
    label: 'Histórico de Ponto',
    path: '/historypoint'
  },
  {
    key: 'sub1',
    label: 'Painel de Gestor',
    icon: <DesktopOutlined />,
    children: [
      {
        key: '3',
        label: 'Usuários',
        path: '/management/users'
      },
      {
        key: '4',
        label: 'Vencimento de Banco',
        path: '/management/duedatebank'
      },
      {
        key: '5',
        label: 'Solicitações',
        path: '/management/requests'
      },
      {
        key: '6',
        label: 'Relatórios',
        path: '/management/reports'
      },
      {
        key: '7',
        label: 'Cargos e Organizações',
        path: '/management/positions'
      },
      {
        key: '8',
        label: 'Auditoria',
        path: '/management/audit'
      },
    ],
  },
  {
    key: '9',
    icon: <ImportOutlined />,
    label: 'Sair',
  },
];

export default function Header() {
  const [collapsed, setCollapsed] = useState(true); 
  const [selectedKeys, setSelectedKeys] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const key = items.find(item => item.path === path)?.key ||
                items.flatMap(item => item.children || []).find(child => child.path === path)?.key || 
                '1'; 
    setSelectedKeys([key]);
  }, [location.pathname]);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuClick = (e) => {
    const actions = {
      '1': () => navigate('/dashboard'),
      '2': () => navigate('/historypoint'),
      '3': () => navigate('/management/users'),
      '4': () => navigate('/management/duedatebank'),
      '5': () => navigate('/management/requests'),
      '9': handleExit,
    };

    if (actions[e.key]) {
      actions[e.key]();
    }
  };

  const handleExit = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    window.location.href = '/login';
  };

  return (
    <div className='header'>
      <div className='topBar'>
        <div className='leftbar'>
          <MenuOutlined
            onClick={toggleCollapsed}
            style={{ color: 'white', fontSize: 20, cursor: 'pointer' }}
          />
          <h1><span className='pink'>W</span>iseTime</h1>
        </div>
        <div className='rightbar'>
          <p>Eduardo</p>
          <Avatar style={{ backgroundColor: '#fb003f3d', color: '#b30735', marginLeft: 15}}>EN</Avatar>
        </div>
      </div>
      <div className='sidebar'>
        <Menu
          selectedKeys={selectedKeys}
          mode="inline"
          theme="dark"
          inlineCollapsed={collapsed}
          items={items}
          onClick={handleMenuClick}
        />
      </div>
    </div>
  );
}
