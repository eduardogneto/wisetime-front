import React from 'react';
import './style.sass';
import { Button, Dropdown, Menu, message } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

const EditDelete: React.FC = () => {
    // Função de callback para o botão Editar
    const handleEdit = () => {
        message.info('Ação de editar');
        // Adicione aqui a lógica para a ação de editar
    };

    // Função de callback para o botão Deletar
    const handleDelete = () => {
        message.info('Ação de deletar');
        // Adicione aqui a lógica para a ação de deletar
    };

    // Define os itens do menu com callbacks
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <span onClick={handleEdit}>
                    Editar
                </span>
            ),
        },
        {
            key: '2',
            label: (
                <span onClick={handleDelete}>
                    Deletar
                </span>
            ),
        },
    ];

    return (
        <Dropdown menu={{ items }} placement="topLeft" trigger={['click']}>
            <Button
                type="text"
                icon={<EllipsisOutlined style={{ fontSize: 30, color: '#FF426B' }} />}
                style={{ marginLeft: 100 }}
            />
        </Dropdown>
    );
};

export default EditDelete;
