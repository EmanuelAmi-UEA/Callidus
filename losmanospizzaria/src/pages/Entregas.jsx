import React, { useState } from 'react';

const Entregas = () => {
  const [entregas] = useState([
    {
      id: 1,
      cliente: 'João Silva',
      endereco: 'Rua das Flores, 123 - Centro',
      telefone: '(11) 99999-1234',
      pizzas: ['Margherita', 'Pepperoni'],
      total: 55.80,
      status: 'saiu_entrega',
      entregador: 'Carlos',
      horario: '19:30'
    },
    {
      id: 2,
      cliente: 'Maria Santos',
      endereco: 'Av. Principal, 456 - Bairro Alto',
      telefone: '(11) 88888-5678',
      pizzas: ['Calabresa', 'Quatro Queijos'],
      total: 60.80,
      status: 'pronto_entrega',
      entregador: 'Roberto',
      horario: '19:45'
    },
    {
      id: 3,
      cliente: 'Pedro Costa',
      endereco: 'Rua da Paz, 789 - Vila Nova',
      telefone: '(11) 77777-9012',
      pizzas: ['Portuguesa'],
      total: 31.90,
      status: 'entregue',
      entregador: 'Ana',
      horario: '19:15'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pronto_entrega': return '#ffa500';
      case 'saiu_entrega': return '#2196f3';
      case 'entregue': return '#4caf50';
      default: return '#757575';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pronto_entrega': return 'Pronto para Entrega';
      case 'saiu_entrega': return 'Saiu para Entrega';
      case 'entregue': return 'Entregue';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className="entregas-page">
      <h1>Entregas</h1>
      <div className="entregas-container">
        {entregas.map(entrega => (
          <div key={entrega.id} className="entrega-card">
            <div className="entrega-header">
              <h3>Entrega #{entrega.id}</h3>
              <span 
                className="status-badge" 
                style={{ backgroundColor: getStatusColor(entrega.status) }}
              >
                {getStatusText(entrega.status)}
              </span>
            </div>
            <div className="entrega-info">
              <p><strong>Cliente:</strong> {entrega.cliente}</p>
              <p><strong>Telefone:</strong> {entrega.telefone}</p>
              <p><strong>Endereço:</strong> {entrega.endereco}</p>
              <p><strong>Entregador:</strong> {entrega.entregador}</p>
              <p><strong>Horário:</strong> {entrega.horario}</p>
              <p><strong>Pizzas:</strong> {entrega.pizzas.join(', ')}</p>
              <p><strong>Total:</strong> R$ {entrega.total.toFixed(2)}</p>
            </div>
            <div className="entrega-actions">
              <button className="btn-saiu">Saiu para Entrega</button>
              <button className="btn-entregue">Marcar como Entregue</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Entregas;
