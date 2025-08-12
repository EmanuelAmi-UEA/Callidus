import React, { useState } from 'react';

const Cozinha = () => {
  const [pedidos] = useState([
    {
      id: 1,
      cliente: 'João Silva',
      pizzas: ['Margherita', 'Pepperoni'],
      status: 'preparando',
      horario: '19:30'
    },
    {
      id: 2,
      cliente: 'Maria Santos',
      pizzas: ['Calabresa', 'Quatro Queijos'],
      status: 'fila',
      horario: '19:45'
    },
    {
      id: 3,
      cliente: 'Pedro Costa',
      pizzas: ['Portuguesa'],
      status: 'pronto',
      horario: '19:15'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'fila': return '#ffa500';
      case 'preparando': return '#2196f3';
      case 'pronto': return '#4caf50';
      default: return '#757575';
    }
  };

  return (
    <div className="cozinha-page">
      <h1>Cozinha - Pedidos</h1>
      <div className="pedidos-container">
        {pedidos.map(pedido => (
          <div key={pedido.id} className="pedido-card">
            <div className="pedido-header">
              <h3>Pedido #{pedido.id}</h3>
              <span 
                className="status-badge" 
                style={{ backgroundColor: getStatusColor(pedido.status) }}
              >
                {pedido.status.toUpperCase()}
              </span>
            </div>
            <p><strong>Cliente:</strong> {pedido.cliente}</p>
            <p><strong>Horário:</strong> {pedido.horario}</p>
            <p><strong>Pizzas:</strong> {pedido.pizzas.join(', ')}</p>
            <div className="pedido-actions">
              <button className="btn-preparar">Preparar</button>
              <button className="btn-pronto">Pronto</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cozinha;
