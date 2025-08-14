import React from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();
  return (
    <div className="admin-page">
      <h1>Painel Administrativo</h1>
      <div className="admin-content">
        <h2>Bem-vindo ao painel de administração da Los Manos Pizzaria</h2>
        <div className="admin-sections">
          <div className="admin-card">
            <h3>Gerenciar Pizzas</h3>
            <p>Adicionar, editar ou remover pizzas do cardápio</p>
            <button onClick={() => navigate('/admin/gercardapio')}>Gerenciar Cardápio</button>
          </div>
          {/* Card de Pedidos removido */}
          <div className="admin-card">
            <h3>Relatórios</h3>
            <p>Relatórios de vendas e estatísticas</p>
            <button onClick={() => navigate('/admin/relatorios')}>Ver Relatórios</button>
          </div>
          <div className="admin-card">
            <h3>Funcionários</h3>
            <p>Gerenciar funcionários e permissões</p>
            <button onClick={() => navigate('/admin/gerenciar-funcionarios')}>Gerenciar Funcionários</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
