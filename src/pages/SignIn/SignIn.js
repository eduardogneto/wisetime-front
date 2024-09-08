import React, { useState } from 'react';
import './signin.css'; // Arquivo de estilo
import logo from "../../assets/image1.png"; // Imagem importada
import api from '../../connection/api';
import { message } from 'antd'; // Biblioteca de mensagens (se necessário)

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loadingAuth, setLoadingAuth] = useState(false);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email !== '' && password !== '') {
            logIn(email, password);
        } else {
            message.error('Valores vazios');
        }
    };

    const setLocalStorage = (key, value) => {
        return new Promise((resolve) => {
            localStorage.setItem(key, value);
            resolve();
        });
    };

    async function logIn(email, password) {
        setLoadingAuth(true);
        try {
            const response = await api.post('/api/users/login', {
                email: email,
                password: password,
            });

            const data = response.data;

            // Definindo o localStorage com Promises
            await Promise.all([
                setLocalStorage('token', data.id),
                setLocalStorage('id', data.id),
                setLocalStorage('name', data.name),
                setLocalStorage('email', data.email),
                setLocalStorage('organizationId', data.organization_id)
            ]);

            message.success(`Bem-vindo de volta ${data.name}!`);

            // Depois que o localStorage estiver configurado, recarrega a página
            setTimeout(() => {
                setLoadingAuth(false);
                window.location.reload();
            }, 2000);

        } catch (error) {
            setLoadingAuth(false);
            console.log(error);
            if (error.response && error.response.status === 401) {
                message.error('Email ou senha inválidos. Por favor, tente novamente.');
            } else {
                message.error('Ops, algo deu errado!');
            }
        }
    }

    const sendEnter = (e) => {
        if (email !== '' && password !== '') {
            if (e.key === 'Enter') {
                e.preventDefault();
                logIn(email, password);
            }
        } else {
            message.error('Valores vazios');
        }
    };

    return (
        <div className="login">
            <div className="container-login">
                <div className="left-side">
                    <p className='low'>Encontre tudo</p>
                    <p className='low'>que precisa em</p>
                    <p className='high'>um só lugar!</p>
                    <img src={logo} alt="Imagem de fundo" className="bottom-image" />
                </div>

                <div className="right-side">
                    <div className="login-box">
                        <div className='wisetime'>
                            <h1 style={{color:"#FF426B"}}>WiseTime</h1>
                        </div>
                        <div className='form-wise'>
                            <form onSubmit={handleSubmit}>
                                <div className='email-form'>
                                    <p>Email</p>
                                    <input 
                                        type="email" 
                                        placeholder="Digite seu email" 
                                        value={email}
                                        onChange={handleEmailChange} 
                                        required 
                                    />
                                </div>
                                <div className='pass-form'>
                                    <p>Senha</p>
                                    <input 
                                        type="password" 
                                        placeholder="*********" 
                                        value={password}
                                        onChange={handlePasswordChange} 
                                        required 
                                    />
                                </div>
                            </form>
                        <div className='button-form'>
                        <button type='submit' onClick={handleSubmit} onKeyDown={sendEnter}>{loadingAuth ? 'Carregando...' : 'Entrar'}</button>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

