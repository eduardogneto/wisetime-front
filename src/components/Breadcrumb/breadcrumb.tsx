import React from 'react';
import './style.sass';
import { Breadcrumb, Dropdown, Menu } from 'antd';
import { UserOutlined, HomeOutlined } from '@ant-design/icons';

const BreadcrumbComponent: React.FC = () => {
    const path = window.location.pathname.slice(1);
    const userTag = localStorage.getItem('tag'); 

    const pathToNameMap: { [key: string]: string } = {
        users: 'Usuários',
        dashboard: 'Painel de Controle',
        settings: 'Configurações',
        historypoint: 'Histórico de Ponto',
        duedatebank: 'Vencimento de Banco',
        requests: 'Solicitações',
        organization: 'Times e Organizações',
        reports: 'Relatórios',
        audit: 'Auditoria',
    };

    const menuItems = (
        <Menu>
            {(userTag === 'ADMINISTRADOR' || userTag === 'COORDENADOR') && (
                <>
                    <Menu.Item key="1">
                        <a href="/management/users">{pathToNameMap.users}</a>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <a href="/management/duedatebank">{pathToNameMap.duedatebank}</a>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <a href="/management/requests">{pathToNameMap.requests}</a>
                    </Menu.Item>
                    <Menu.Item key="4">
                        <a href="/management/reports">{pathToNameMap.reports}</a>
                    </Menu.Item>
                </>
            )}
            {userTag === 'ADMINISTRADOR' && (
                <>
                    <Menu.Item key="5">
                        <a href="/management/organization">{pathToNameMap.organization}</a>
                    </Menu.Item>
                    <Menu.Item key="6">
                        <a href="/management/audit">{pathToNameMap.audit}</a>
                    </Menu.Item>
                </>
            )}
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
                            <a>Painel de Gestor</a>
                        </Dropdown>
                    </Breadcrumb.Item>
                )}
                {pathParts[0] === 'management' && pathParts.length > 1 ? (
                    <Breadcrumb.Item>
                        <span>{getScreenName(pathParts[pathParts.length - 1])}</span>
                    </Breadcrumb.Item>
                ) : (
                    <Breadcrumb.Item>
                        <span>{getScreenName(pathParts[0])}</span>
                    </Breadcrumb.Item>
                )}
            </Breadcrumb>
        </div>
    );
};

export default BreadcrumbComponent;
