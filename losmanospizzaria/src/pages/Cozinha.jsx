
import React, { useState, useEffect } from 'react';

export default function Cozinha() {
  const [pedidos, setPedidos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [entregador, setEntregador] = useState("");
  const entregadores = ["Carlos", "Roberto", "Ana", "João", "Maria"];

  useEffect(() => {
    fetch('http://localhost:5000/pedidos')
      .then(res => res.json())
      .then(data => setPedidos(data));
  }, []);

  const abrirModal = (pedido) => {
    // Se for consumo no restaurante (infoEntrega inicia com "Mesa:"), não abre modal
    if (pedido.infoEntrega?.startsWith('Mesa:')) {
      confirmarEntregaMesa(pedido);
      return;
    }
    setPedidoSelecionado(pedido);
    setEntregador("");
    setShowModal(true);
  };

  const fecharModal = () => {
    setShowModal(false);
    setPedidoSelecionado(null);
    setEntregador("");
  };

  // Extrai número de contato do infoEntrega (espera formato: ... | Contato: 99999-9999)
  function extrairContato(infoEntrega) {
    if (!infoEntrega) return "";
    const match = infoEntrega.match(/Contato: ?([\d\-()+ ]+)/i);
    return match ? match[1].trim() : "";
  }

  const confirmarEntrega = async () => {
    if (!pedidoSelecionado || !entregador) return;
    // Monta objeto entrega
    const contato = extrairContato(pedidoSelecionado.infoEntrega);
    const novaEntrega = {
      id: pedidoSelecionado.id,
      cliente: pedidoSelecionado.nomeCliente || pedidoSelecionado.cliente || "",
      endereco: pedidoSelecionado.infoEntrega || "",
      telefone: contato,
      pizzas: pedidoSelecionado.itens.map(i => i.nome),
      total: pedidoSelecionado.total,
      status: "pronto_entrega",
      entregador,
      horario: ""
    };
    // Salva entrega no backend
    await fetch('http://localhost:5000/entregas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaEntrega)
    });
    // Remove pedido do backend
    await fetch(`http://localhost:5000/pedidos/${pedidoSelecionado.id}`, { method: 'DELETE' });
    setPedidos(prev => prev.filter(p => p.id !== pedidoSelecionado.id));
    fecharModal();
  };

  // Cria "entrega" (registro de acompanhamento) para pedidos de mesa sem selecionar entregador
  const confirmarEntregaMesa = async (pedido) => {
    const novaEntrega = {
      id: pedido.id,
      cliente: pedido.nomeCliente || pedido.cliente || "",
      endereco: pedido.infoEntrega || "",
      telefone: "", // não aplicável
      pizzas: pedido.itens.map(i => i.nome),
      total: pedido.total,
      status: "mesa", // status especial para consumo local
      entregador: "",
      horario: ""
    };
    await fetch('http://localhost:5000/entregas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaEntrega)
    });
    await fetch(`http://localhost:5000/pedidos/${pedido.id}`, { method: 'DELETE' });
    setPedidos(prev => prev.filter(p => p.id !== pedido.id));
  };

  return (
    <main className='principal'>
      <h2>Pedidos em preparação</h2>
      {pedidos.length === 0 && <p>Nenhum pedido encontrado.</p>}
      {pedidos.map((pedido) => (
        <div key={pedido.id} className='cardapio-item' style={{marginBottom: 24, background: '#fff7ec', borderRadius: 12, padding: 18, boxShadow: '0 2px 8px #f39c1233'}}>
          <h3 style={{color:'#d35400'}}>
            Pedido #{pedido.id}
            {` - ${(pedido.nomeCliente || pedido.cliente || 'Cliente')}`}
            {pedido.status && (
              <span style={{ marginLeft: 12, color: pedido.status === "pronto_entrega" ? "green" : "#d35400" }}>
                [{pedido.status}]
              </span>
            )}
          </h3>
          <ul style={{marginLeft: 0, paddingLeft: 18}}>
            {pedido.itens.map((item) => {
              const extrasStr = item.extras && Object.keys(item.extras).length > 0
                ? Object.entries(item.extras)
                    .filter(([, qtd]) => qtd > 0)
                    .map(([nome, qtd]) => qtd > 1 ? nome + ' (x' + qtd + ')' : nome)
                    .join(', ')
                : '';
              const key = item.id || (item.nome + '-' + (item.tamanho || '') + '-' + (item.origemCombo || ''));
              return (
                <li key={key} style={{marginBottom: 8}}>
                  <strong>{item.nome}</strong> &times; {item.quantidade}<br/>
                  {item.origemCombo && <span><strong>Combo:</strong> {item.origemCombo}<br/></span>}
                  {item.tamanho && <span><strong>Tamanho:</strong> {item.tamanho}<br/></span>}
                  {item.borda && <span><strong>Borda:</strong> {item.borda}<br/></span>}
                  {extrasStr && <span><strong>Extras:</strong> {extrasStr}<br/></span>}
                  {item.ingredientes && Array.isArray(item.ingredientes) && item.ingredientes.length > 0 && (
                    <span>Ingredientes: {item.ingredientes.join(', ')}<br/></span>
                  )}
                </li>
              );
            })}
          </ul>
          {pedido.status !== "pronto_entrega" && (
            <button onClick={() => abrirModal(pedido)} style={{ marginTop: 12, padding: '6px 12px' }}>
              Marcar como pronto
            </button>
          )}
        </div>
      ))}

      {/* Modal de seleção de entregador */}
      {showModal && (
        <div style={{position: 'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'#0008', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000}}>
          <div style={{background:'#fff', borderRadius:8, padding:32, minWidth:320, boxShadow:'0 2px 16px #0003'}}>
            <h3>Selecione o entregador</h3>
            <select value={entregador} onChange={e => setEntregador(e.target.value)} style={{width:'100%', padding:8, marginBottom:16}}>
              <option value="">Selecione...</option>
              {entregadores.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            <div style={{display:'flex', gap:12, justifyContent:'flex-end'}}>
              <button onClick={fecharModal} style={{padding:'6px 16px'}}>Cancelar</button>
              <button onClick={confirmarEntrega} disabled={!entregador} style={{padding:'6px 16px', background:'#27ae60', color:'#fff', border:'none', borderRadius:4}}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
