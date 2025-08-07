import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simula login (você pode adaptar para API real)
  const login = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
    // Você pode salvar o token no localStorage se quiser persistência
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    // Remova o token do localStorage se estiver usando
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}