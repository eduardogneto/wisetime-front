import React from 'react';
import'./style.sass';
import { Button, Popconfirm } from'antd';
import { DeleteOutlined, DownloadOutlined, EditOutlined, FileExcelOutlined } from'@ant-design/icons';

export interface ITopButtons {
    handleNew?: (arg?: any) =>void;
    handleEdit?: (arg?: any) =>void;
    handleDelete?: (arg?: any) =>void;
    handleSearch?: (arg?: any) =>void;
    isEditable?: boolean;
    isDeletable?: boolean;
    searchPlaceholder?: string;
    exportGridData?(value: any): void;
}

export const TopButtons: React.FC<ITopButtons> = ({
    handleNew,
    handleDelete,
    handleEdit,
    handleSearch,
    isEditable,
    isDeletable,
    searchPlaceholder,
    exportGridData,
}) => {

    return (
        <div className="button-group">
            {handleEdit && (
                <Button className="top-tool-buttons edit"onClick={handleEdit} icon={<EditOutlined style={{fontSize:23, color: '#FFF' }} />}
                    disabled={!isEditable}
                    title={"Editar"}
                />
            )}
            {handleDelete && (
                <Popconfirm placement="bottom" overlayClassName="popconfirm-delete"title={"Tem certeza que deseja deletar?"}
                    onConfirm={handleDelete}disabled={!isDeletable}okText={"Deletar"}
                    cancelText={"Cancelar"}
                    okButtonProps={{danger:true, className: 'popconfirm-delete-button' }}
                ><Button
                        disabled={!isDeletable}
                        className="top-tool-buttons trash"
                        icon={<DeleteOutlined style={{ fontSize: 23, color: '#FFF' }} />}
                    />
                </Popconfirm>
            )}
            {exportGridData && (
                <Button type="text" onClick={exportGridData} icon={<FileExcelOutlined style={{fontSize:23, color: '#FFF' }} />}
                />
            )}
            {handleNew && (
                <Button type="text"onClick={handleNew}icon={<DownloadOutlined style={{fontSize:23, color: '#FFF' }} />}
                />
            )}
        </div>
    );
};
