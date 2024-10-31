import React, { useState } from 'react';
import './signin.css'; 
import logo from "../../assets/image1.png"; 
import api from '../../connection/api';
import { message } from 'antd'; 

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
            const response = await api.post('/auth/login', {
                email: email,
                password: password,
            });
    
            const { token, user } = response.data;
    
            await Promise.all([
                setLocalStorage('token', token), 
                setLocalStorage('id', user.id),
                setLocalStorage('name', user.name),
                setLocalStorage('email', user.email),
                setLocalStorage('organizationId', user.team.organizationId), 
                setLocalStorage('tag', user.tag),
                setLocalStorage('team', JSON.stringify(user.team)) 
            ]);
    
            message.success(`Bem-vindo de volta ${user.name}!`);
    
            setTimeout(() => {
                setLoadingAuth(false);
                window.location.href = '/dashboard';
            }, 2000);
    
        } catch (error) {
            setLoadingAuth(false);
            if (error.code != "ERR_NETWORK") {
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
