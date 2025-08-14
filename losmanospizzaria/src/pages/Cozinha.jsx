
import React from 'react';

export default function Cozinha() {
  const [pedidos, setPedidos] = React.useState([]);

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
        <div className='cardapio-item' key={pedido.id} style={{marginBottom: 24, background: '#fff7ec', borderRadius: 12, padding: 18, boxShadow: '0 2px 8px #f39c1233'}}>
          <h3 style={{color:'#d35400'}}>Pedido #{pedido.id} - {pedido.cliente || 'Cliente'}</h3>
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
        </div>
      ))}
    </main>
  );
}