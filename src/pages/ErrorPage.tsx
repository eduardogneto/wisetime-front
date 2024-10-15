import { Button, Result } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage: React.FC = () => {

    const handleExit = () => {
        window.location.href = '/dashboard'; 
    };

    return (
        <div>
            <Result
                status="404"
                title={
                    <span style={{ color: 'white', fontWeight: 'bold' }}>
                        Está perdido? Clique no botão e volte ao início!
                    </span>
                }
                extra={<Button style={{width:100}} onClick={handleExit} type="dashed">Clique Aqui</Button>}
            />
        </div>
    );
};

export default ErrorPage;
