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

export default function Header() {
  const [collapsed, setCollapsed] = useState(true); 
  const [selectedKeys, setSelectedKeys] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const perm = localStorage.getItem('tag'); 

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
    ...(perm === 'COORDENADOR' || perm === 'ADMINISTRADOR' ? [{
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
        ...(perm === 'ADMINISTRADOR' ? [{
          key: '7',
          label: 'Times e Organizações',
          path: '/management/organization'
        }] : []),
        ...(perm === 'ADMINISTRADOR' ? [{
          key: '8',
          label: 'Auditoria',
          path: '/management/audit'
        }] : []),
      ],
    }] : []),
    {
      key: '9',
      icon: <ImportOutlined />,
      label: 'Sair',
    },
  ];

  const getNameFromLocalStorage = () => {
    const name = localStorage.getItem('name') || '';
    return {
      firstName: name ? name.split(' ')[0] : '',
      initials: name ? name.split(' ').map(part => part.charAt(0)).join('').substring(0, 2).toUpperCase() : '',
    };
  };

  const { firstName, initials } = getNameFromLocalStorage();

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
      '6': () => navigate('/management/reports'),
      '7': () => navigate('/management/organization'),
      '8': () => navigate('/management/audit'),
      '9': handleExit,
    };

    if (actions[e.key]) {
      actions[e.key]();
    }
  };

  const handleExit = () => {
    localStorage.clear(); 
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
          <p>{firstName}</p>
          <Avatar style={{ backgroundColor: '#fb003f3d', color: '#b30735', marginLeft: 15 }}>{initials}</Avatar>
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
