import React, { useState, useEffect } from 'react';
import React, { useState, useEffect } from 'react';

export default function Entregas() {
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/entregas')
      .then(res => res.json())
      .then(data => { setEntregas(data); setLoading(false); });
  }, []);

  const atualizarEntrega = async (id, update) => {
    const entrega = entregas.find(e => e.id === id);
    if (!entrega) return;
    const novaEntrega = { ...entrega, ...update };
    await fetch(`http://localhost:5000/entregas/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update)
    });
    setEntregas(entregas.map(e => e.id === id ? novaEntrega : e));
  };

  const handleSaiuEntrega = (id) => {
    const now = new Date();
    const horario = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    atualizarEntrega(id, { status: 'saiu_entrega', horario });
  };

  const handleEntregue = async (id) => {
    const entrega = entregas.find(e => e.id === id);
    if (!entrega) return;
    // Extrai bairro do endereço (espera formato: ...bairro...)
    let bairro = '';
    if (entrega.endereco) {
      // Tenta extrair bairro após última vírgula
      const partes = entrega.endereco.split(',');
      if (partes.length >= 3) bairro = partes[2].split('|')[0].trim();
    }
    // Horário de entrega
    const horarioEntregue = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    // Data do pedido (usa id como referência, ou pode ser adicionado no futuro)
    const dataPedido = new Date().toLocaleDateString();
    // Monta registro do histórico
    const historico = {
      id: entrega.id,
      valor: entrega.total,
      horarioPedido: entrega.horario || '',
      horarioEntregue,
      bairro,
      sabores: Array.isArray(entrega.pizzas) ? entrega.pizzas : [entrega.pizzas],
      data: dataPedido
    };
    // Salva no backend
    await fetch('http://localhost:5000/historicoPedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(historico)
    });
    atualizarEntrega(id, { status: 'entregue' });
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
      {loading ? <p>Carregando entregas...</p> : (
        <div className="entregas-container">
          {entregas.length === 0 && <p>Nenhuma entrega no momento.</p>}
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
                <p><strong>Horário saída:</strong> {entrega.horario || '-'}</p>
                <p><strong>Pizzas:</strong> {Array.isArray(entrega.pizzas) ? entrega.pizzas.join(', ') : entrega.pizzas}</p>
                <p><strong>Total:</strong> R$ {Number(entrega.total).toFixed(2)}</p>
              </div>
              <div className="entrega-actions">
                {entrega.status === 'pronto_entrega' && (
                  <button className="btn-saiu" onClick={() => handleSaiuEntrega(entrega.id)}>Saiu para Entrega</button>
                )}
                {entrega.status === 'saiu_entrega' && (
                  <button className="btn-entregue" onClick={() => handleEntregue(entrega.id)}>Marcar como Entregue</button>
                )}
                {entrega.status === 'entregue' && (
                  <span style={{color:'#4caf50'}}>Entregue</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
