import React from 'react'
import './style.sass'
import { Button, Dropdown, Menu, message } from 'antd'
import { EllipsisOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'

interface EditDeleteProps {
  showDetail?: boolean
  allowEdit?: boolean
  allowDelete?: boolean
  onDetail?: () => void
  onEdit?: () => void
}

const EditDelete: React.FC<EditDeleteProps> = ({
  showDetail = false,
  allowEdit = false,
  allowDelete = false,
  onDetail,
  onEdit,
}) => {
  const handleEdit = () => {
    if (onEdit) {
      onEdit()
    } else {
      message.info('Ação de editar')
    }
  }

  const handleDelete = () => {

    message.info('Ação de deletar')
  }

  const handleDetail = () => {
    if (onDetail) {
      onDetail()
    } else {
      message.info('Ação de detalhar')
    }
  }

  const menuItems: MenuProps['items'] = [
    ...(allowEdit ? [{
      key: '1',
      label: (
        <span onClick={handleEdit}>
          Editar
        </span>
      ),
    }] : []),
    ...(allowDelete ? [{
      key: '2',
      label: (
        <span onClick={handleDelete}>
          Deletar
        </span>
      ),
    }] : []),
    ...(showDetail ? [{
      key: '3',
      label: (
        <span onClick={handleDetail}>
          Detalhar
        </span>
      ),
    }] : []),
  ]

  return (
    <Dropdown menu={{ items: menuItems }} placement="topLeft" trigger={['click']}>
      <Button
        type="text"
        icon={<EllipsisOutlined style={{ fontSize: 30, color: '#FF426B' }} />}
        style={{ marginLeft: 100 }}
      />
    </Dropdown>
  )
}

export default EditDelete
