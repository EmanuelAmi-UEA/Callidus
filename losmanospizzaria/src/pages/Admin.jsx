import React from 'react';

const Admin = () => {
  return (
    <div className="admin-page">
      <h1>Painel Administrativo</h1>
      <div className="admin-content">
        <h2>Bem-vindo ao painel de administração da Los Manos Pizzaria</h2>
        <div className="admin-sections">
          <div className="admin-card">
            <h3>Gerenciar Pizzas</h3>
            <p>Adicionar, editar ou remover pizzas do cardápio</p>
            <button>Gerenciar Cardápio</button>
          </div>
          <div className="admin-card">
            <h3>Pedidos</h3>
            <p>Visualizar e gerenciar pedidos dos clientes</p>
            <button>Ver Pedidos</button>
          </div>
          <div className="admin-card">
            <h3>Relatórios</h3>
            <p>Relatórios de vendas e estatísticas</p>
            <button>Ver Relatórios</button>
          </div>
          <div className="admin-card">
            <h3>Usuários</h3>
            <p>Gerenciar funcionários e permissões</p>
            <button>Gerenciar Usuários</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
