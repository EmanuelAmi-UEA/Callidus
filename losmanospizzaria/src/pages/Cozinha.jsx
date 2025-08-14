import React from 'react';

export default function Cozinha() {
  const [pedidos, setPedidos] = React.useState([]);

  const marcarComoPronto = (id) => {
    fetch(`http://localhost:5000/pedidos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "pronto_entrega" }) // mudando para pronto_entrega
    })
      .then(res => res.json())
      .then(() => {
        setPedidos(prev => prev.map(p => p.id === id ? { ...p, status: "pronto_entrega" } : p));
      });
  };

  React.useEffect(() => {
    fetch('http://localhost:5000/pedidos')
      .then(res => res.json())
      .then(data => setPedidos(data));
  }, []);

  return (
    <main className='principal'>
      <h2>Pedidos em preparação</h2>
      {pedidos.length === 0 && <p>Nenhum pedido encontrado.</p>}
      {pedidos.map((pedido) => (
        <div key={pedido.id} className='cardapio-item' style={{marginBottom: 24, background: '#fff7ec', borderRadius: 12, padding: 18, boxShadow: '0 2px 8px #f39c1233'}}>
          <h3 style={{color:'#d35400'}}>
            Pedido #{pedido.id} - {pedido.cliente || 'Cliente'} 
            {pedido.status && (
              <span style={{ marginLeft: 12, color: pedido.status === "pronto_entrega" ? "green" : "#d35400" }}>
                [{pedido.status}]
              </span>
            )}
          </h3>
          <ul style={{marginLeft: 0, paddingLeft: 18}}>
            {pedido.itens.map((item, idx) => (
              <li key={idx} style={{marginBottom: 8}}>
                <strong>{item.nome}</strong> &times; {item.quantidade}<br/>
                <span>Ingredientes: {item.ingredientes ? item.ingredientes.join(', ') : '-'}</span><br/>
                {item.extras && item.extras.length > 0 && (
                  <span>Extras: {item.extras.join(', ')}</span>
                )}
              </li>
            ))}
          </ul>
          {pedido.status !== "pronto_entrega" && (
            <button onClick={() => marcarComoPronto(pedido.id)} style={{ marginTop: 12, padding: '6px 12px' }}>
              Marcar como pronto para entrega
            </button>
          )}
        </div>
      ))}
    </main>
  );
}
