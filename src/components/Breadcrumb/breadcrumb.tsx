import React from 'react';
import './style.sass';
import { Breadcrumb, Dropdown, Menu } from 'antd';
import { UserOutlined, HomeOutlined } from '@ant-design/icons';

const BreadcrumbComponent: React.FC = () => {
    // Obtém o caminho atual do URL após a barra "/"
    const path = window.location.pathname.slice(1);

    // Mapeamento de caminhos para nomes de tela
    const pathToNameMap: { [key: string]: string } = {
        users: 'Usuários',
        dashboard: 'Painel de Controle',
        settings: 'Configurações',
        historypoint: 'Histórico de Ponto',
        duedatebank: 'Vencimento de Banco',
        requests: 'Solicitações',
        organization: 'Times e Organizações',
        // Adicione outros mapeamentos conforme necessário
    };

    // Itens do menu para a gestão
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
            {/* Adicione outros itens conforme necessário */}
        </Menu>
    );

    // Divide o caminho em partes
    const pathParts = path.split('/');

    // Função para obter o nome da tela baseado no caminho
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
