import React, { useState } from 'react';
import './signin.css'; // Arquivo de estilo
import logo from "../../assets/image1.png"; // Imagem importada
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

    async function logIn(email, password) {
        setLoadingAuth(true);

        const simulatedUser = {
            id: '12345',
            name: 'Usuário Exemplo',
            email: email,
        };

        setTimeout(() => {
            try {
                const data = simulatedUser;
                localStorage.setItem('token', data.id);
                localStorage.setItem('id', data.id);
                localStorage.setItem('name', data.name);
                localStorage.setItem('email', data.email);
                message.success(`Bem-vindo de volta ${data.name}!`);

                setTimeout(() => {
                    window.location.reload();
                    setLoadingAuth(false);
                }, 2000);
            } catch (err) {
                console.log(err);
                message.error('Ops, algo deu errado!');
                setLoadingAuth(false);
            }
        }, 1000);
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
