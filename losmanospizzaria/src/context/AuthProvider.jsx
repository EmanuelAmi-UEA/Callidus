import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useNavigate} from 'react-router-dom'
import { AuthContext } from './AuthContext';

const AuthProvider = ({children}) => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);

  //recupera usuario e token do localStorage ao iniciar
  useEffect(() =>{
    const tokenSalvo = localStorage.getItem("token");
    const usuarioSalvo = localStorage.getItem("usuario");

    if(tokenSalvo && usuarioSalvo){
      setToken(tokenSalvo);
      setUsuario(JSON.parse(usuarioSalvo));
    }

  },[]);
  
  //função para login
  const login = useCallback((usuarioData, tokenData) => {
    localStorage.setItem("token", tokenData);
    localStorage.setItem("usuario", JSON.stringify(usuarioData));
    setUsuario(usuarioData);
    setToken(tokenData);
  },[]);

  //função de logout
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
    setToken(null);
    navigate("/login");
  },[navigate]);

  //memoriza o contexto para evitar renderizações
  const contextValue = useMemo(() => ({
    usuario, 
    token, 
    login, 
    logout,
    isAuthenticated: !!usuario && !!token,
  }), [usuario, token, login, logout]);

  return(
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );  
};

export default AuthProvider;