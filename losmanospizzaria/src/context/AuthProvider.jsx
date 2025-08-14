import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useNavigate} from 'react-router-dom'
import { AuthContext } from './AuthContext';

const AuthProvider = ({children}) => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);

  //recupera usuario e token do localStorage ao iniciar
  useEffect(() => {
    const tokenSalvo = localStorage.getItem("token");
    const usuarioSalvo = localStorage.getItem("usuario");
    if (usuarioSalvo && tokenSalvo) {
      setToken(tokenSalvo);
      setUsuario(JSON.parse(usuarioSalvo));
    }
  }, []);
  
  //função para login
  const login = useCallback((usuarioData, tokenData) => {
    // Gera token se não existir
    let token = tokenData;
    if (!token) {
      token = Math.random().toString(36).substring(2) + Date.now();
    }
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuarioData));
    setUsuario(usuarioData);
    setToken(token);
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
export { AuthProvider };