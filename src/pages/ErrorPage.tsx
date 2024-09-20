import { Button, Result } from 'antd';
import React from 'react';


const ErrorPage: React.FC = () => {


    return (
        <div>
            <Result
                status="404"
                title="Está perdido? clique no botão e volte ao inicio!"
                extra={<Button type="primary">Clique Aqui</Button>}
            />
        </div>
    );
};

export default ErrorPage;
