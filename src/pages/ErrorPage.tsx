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
                title="Está perdido? clique no botão e volte ao inicio!"
                extra={<Button onClick={handleExit} type="primary">Clique Aqui</Button>}
            />
        </div>
    );
};

export default ErrorPage;
