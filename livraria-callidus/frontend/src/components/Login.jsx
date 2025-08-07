import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext' 
import "/src/Login.css"

const Login = () => {
  const[email, setEmail]  = useState("")
  const[senha,setSenha] = useState("")
  const[mostrarSenha, setMostrarSenha] = useState(false)
  const[erro, setErro] = useState("")

  const navigate = useNavigate();
  const {login} = useAuth();

  const handleSubmit = (e) =>{
    e.preventDefault();

    if(email === "admin@livraria.com" && senha === "123456"){
        login({nome:"Administrador", email},"fake-jwt-token");
        navigate("/");
    }else{
        setErro("E-mail ou senha inválidos");
    }
  }

  return (
    <div className='login-container fade-in'>
        <form onSubmit={handleSubmit} className='login-form'>
            <h2>Login</h2>
            {erro && <p className='erro'>{erro}</p>}
            <div>
                <label htmlFor='email'>Email:</label>
                <input
                    type='email'
                    id='email'
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}
                    required
                    autoFocus
                />
            </div>
            <div>
                <label htmlFor='senha'>Senha:</label>
                <div className='senha-wrapper'>
                    <input
                        type={mostrarSenha ? "text" : "password"}
                        id='senha'
                        value={senha}
                        onChange={(e)=> setSenha(e.target.value)}
                        required
                    />
                    <button
                        type='button'
                        className='toggle-senha'
                        onClick={()=>setMostrarSenha((prev)=>!prev)}
                        aria-label={mostrarSenha ? "Ocultar senha":"Mostrar senha"}
                    >
                        {mostrarSenha ? "😐":"😑"}
                    </button>
                </div>
            </div>
            <button type='submit' className='botao'>
                Entrar
            </button>
        </form>      
    </div>
  );
};

export default Login;