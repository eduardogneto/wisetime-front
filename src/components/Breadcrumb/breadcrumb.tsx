import React from 'react';
import './style.sass';
import { Breadcrumb, Dropdown, Menu } from 'antd';
import { UserOutlined, HomeOutlined } from '@ant-design/icons';

const BreadcrumbComponent: React.FC = () => {
    const path = window.location.pathname.slice(1);

    const pathToNameMap: { [key: string]: string } = {
        users: 'Usuários',
        dashboard: 'Painel de Controle',
        settings: 'Configurações',
        historypoint: 'Histórico de Ponto',
        duedatebank: 'Vencimento de Banco',
        requests: 'Solicitações',
        organization: 'Times e Organizações',
        reports: 'Relatórios',
    };

    const menuItems = (
        <Menu>
            <Menu.Item key="1">
                <a href="/management/dashboard">Painel de Controle</a>
            </Menu.Item>
            <Menu.Item key="2">
                <a href="/management/users">Usuários</a>
            </Menu.Item>
            <Menu.Item key="3">
                <a href="/management/settings">Configurações</a>
            </Menu.Item>
        </Menu>
    );

    const pathParts = path.split('/');

    const getScreenName = (part: string) => pathToNameMap[part] || part;

    return (
        <div className="breadcrumb-container">
            <Breadcrumb>
                <Breadcrumb.Item href="/dashboard">
                    <HomeOutlined />
                </Breadcrumb.Item>
                {pathParts[0] === 'management' && (
                    <Breadcrumb.Item>
                        <Dropdown overlay={menuItems}>
                            <a >Painel de Gestor</a>
                        </Dropdown>
                    </Breadcrumb.Item>
                )}
                {pathParts[0] === 'management' && pathParts.length > 1 ? (
                    <Breadcrumb.Item>
                        <span >{getScreenName(pathParts[pathParts.length - 1])}</span>
                    </Breadcrumb.Item>
                ) : (
                    <Breadcrumb.Item>
                        <span >{getScreenName(pathParts[0])}</span>
                    </Breadcrumb.Item>
                )}
            </Breadcrumb>
        </div>
    );
};

export default BreadcrumbComponent;
