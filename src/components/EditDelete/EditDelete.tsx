import React from 'react';
import './style.sass';
import { Button, Dropdown, Menu, message } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

// Define as props para o componente
interface EditDeleteProps {
    showDetail?: boolean; // Prop opcional para controlar a exibição do botão "Detalhar"
}

const EditDelete: React.FC<EditDeleteProps> = ({ showDetail = false }) => {
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

    // Função de callback para o botão Detalhar
    const handleDetail = () => {
        message.info('Ação de detalhar');
        // Adicione aqui a lógica para a ação de detalhar
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
        ...(showDetail ? [{
            key: '3',
            label: (
                <span onClick={handleDetail}>
                    Detalhar
                </span>
            ),
        }] : []),
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
