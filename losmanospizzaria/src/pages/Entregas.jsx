import React, { useState, useEffect } from 'react';

export default function Entregas() {
  const [entregas, setEntregas] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/pedidos')
      .then(res => res.json())
      .then(data => {
        const pedidosParaEntrega = data.filter(p => p.status === 'pronto_entrega' || p.status === 'saiu_entrega');
        setEntregas(pedidosParaEntrega);
      })
      .catch(err => console.error(err));
  }, []);

  const atualizarStatus = (id, novoStatus) => {
    fetch(`http://localhost:5000/pedidos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: novoStatus })
    })
      .then(res => res.json())
      .then(() => {
        setEntregas(prev => prev.map(p => p.id === id ? { ...p, status: novoStatus } : p));
      });
  };

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
      {entregas.length === 0 && <p>Nenhum pedido pronto para entrega.</p>}
      <div className="entregas-container">
        {entregas.map(entrega => (
          <div key={entrega.id} className="entrega-card">
            <div className="entrega-header">
              <h3>Entrega #{entrega.id}</h3>
              <span className="status-badge" style={{ backgroundColor: getStatusColor(entrega.status) }}>
                {getStatusText(entrega.status)}
              </span>
            </div>
            <div className="entrega-info">
              <p><strong>Cliente:</strong> {entrega.cliente}</p>
              <p><strong>Telefone:</strong> {entrega.telefone}</p>
              <p><strong>Endereço:</strong> {entrega.endereco}</p>
              <p>
                <strong>Pizzas:</strong> 
                {entrega.itens?.length 
                  ? entrega.itens.map(i => i.nome).join(', ') 
                  : entrega.pizzas?.join(', ') || '-'}
              </p>
              <p><strong>Total:</strong> R$ {entrega.total?.toFixed(2) || '-'}</p>
            </div>
            <div className="entrega-actions">
              {entrega.status === 'pronto_entrega' && (
                <button onClick={() => atualizarStatus(entrega.id, 'saiu_entrega')} className="btn-saiu">
                  Saiu para Entrega
                </button>
              )}
              {entrega.status === 'saiu_entrega' && (
                <button onClick={() => atualizarStatus(entrega.id, 'entregue')} className="btn-entregue">
                  Marcar como Entregue
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
