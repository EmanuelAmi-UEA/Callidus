
import React from 'react';
import { toast } from 'react-toastify';
import '../css/carrinho.css';
import { getMesas } from '../api/api';
import { useCart } from '../context/CarrinhoContext';
import { useNavigate } from 'react-router-dom';
const CarrinhoPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    setCartItems,
    removerDoCarrinho,
    incrementarQuantidade,
    decrementarQuantidade,
    setInfoEntrega
  } = useCart();

  const [nomeCliente, setNomeCliente] = React.useState("");
  const [logradouro, setLogradouro] = React.useState("");
  const [numero, setNumero] = React.useState("");
  const [bairro, setBairro] = React.useState("");
  const [contato, setContato] = React.useState("");
  const [erroEntrega, setErroEntrega] = React.useState("");

  // Consts para funcionalidades principais de Garçom
  const [modoConsumo, setModoConsumo] = React.useState("entrega"); // "entrega" ou "restaurante"
  const [mesa, setMesa] = React.useState("");
  const [mesasDisponiveis, setMesasDisponiveis] = React.useState([]);
  const [qtdPessoas, setQtdPessoas] = React.useState(1);
  const [aceitaTaxa, setAceitaTaxa] = React.useState(false);
  // Pagamento
  // 'agora' = vai para tela de pagamento, 'entrega' = paga na entrega/estabelecimento
  const [opcaoPagamento, setOpcaoPagamento] = React.useState('agora');
  const [metodoPagamento, setMetodoPagamento] = React.useState('pix'); // pix, dinheiro, cartao

  // Lista fixa de bairros (já que bairrosManaus foi removido)
  const bairrosManaus = [
    "Centro", "Adrianópolis", "Aleixo", "Alvorada", "Cachoeirinha", "Cidade Nova", "Compensa", "Coroado", "Dom Pedro", "Flores", "Japiim", "Parque 10", "Petrópolis", "Planalto", "Ponta Negra", "Praça 14", "Redenção", "São Geraldo", "São Jorge", "Tarumã", "Zumbi"
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.preco) * (item.quantidade || 1), 0);

  React.useEffect(() => {
    if (modoConsumo === 'restaurante' && mesasDisponiveis.length === 0) {
      getMesas().then(setMesasDisponiveis).catch(()=>{});
    }
  }, [modoConsumo, mesasDisponiveis.length]);
  const total = aceitaTaxa ? subtotal * 1.1 : subtotal;

  if (cartItems.length === 0) {
    return (
      <div className="carrinho">
        <h2>Seu carrinho está vazio</h2>
  <a href="/cardapio">Ver Cardápio</a>
      </div>
    );
  }

  // Função para validar e montar infoEntrega antes de ir para pagamento
  const handleFinalizar = async (e) => {
    e.preventDefault && e.preventDefault();
    if (!nomeCliente.trim()) {
      setErroEntrega("Informe o nome do cliente!");
      return;
    }
    if (modoConsumo === "entrega") {
      if (!logradouro.trim() || !numero.trim() || !bairro.trim() || !contato.trim()) {
        setErroEntrega("Preencha todos os campos de endereço e o número de contato antes de finalizar!");
        return;
      }
      setErroEntrega("");
      setInfoEntrega(`${logradouro}, ${numero}, ${bairro} | Contato: ${contato}`);
      if (opcaoPagamento === 'agora') {
        navigate('/pagamento');
      } else {
        // Envia direto para a cozinha
        await enviarPedidoDireto();
      }
    } else {
      // Restaurante
      if (!mesa) {
        setErroEntrega("Selecione a mesa antes de finalizar!");
        return;
      }
      if (!qtdPessoas || qtdPessoas < 1) {
        setErroEntrega("Informe a quantidade de pessoas!");
        return;
      }
      setErroEntrega("");
      setInfoEntrega(`Mesa: ${mesa} | Pessoas: ${qtdPessoas}`);
      if (opcaoPagamento === 'agora') {
        navigate('/pagamento');
      } else {
        // Envia direto para a cozinha
        await enviarPedidoDireto();
      }
    }
  };

  // Função para enviar pedido direto para a cozinha
  async function enviarPedidoDireto() {
    if (!cartItems || cartItems.length === 0) return;
    const total = cartItems.reduce((sum, item) => sum + Number(item.preco) * (item.quantidade || 1), 0);
    const itensExpandidos = cartItems.flatMap(item => {
      if (item.tipo === 'combo' && item.itensCozinha) {
        return item.itensCozinha.map(it => ({ ...it, origemCombo: item.nome }));
      }
      return item;
    });
    // Define localPagamento e metodoPagamento
    let localPagamento = 'online';
    let metodoPag = '';
    if (modoConsumo === 'entrega') {
      if (opcaoPagamento === 'entrega') {
        localPagamento = 'entrega';
        metodoPag = metodoPagamento;
      } else {
        localPagamento = 'online';
        metodoPag = 'pagamento_online';
      }
    } else {
      if (opcaoPagamento === 'estabelecimento') {
        localPagamento = 'estabelecimento';
        metodoPag = '';
      } else {
        localPagamento = 'online';
        metodoPag = 'pagamento_online';
      }
    }
    const pedido = {
      cliente: nomeCliente,
      itens: itensExpandidos,
      infoEntrega: modoConsumo === 'entrega' ? `${logradouro}, ${numero}, ${bairro} | Contato: ${contato}` : `Mesa: ${mesa} | Pessoas: ${qtdPessoas}`,
      total,
      status: 'pendente',
      data: new Date().toISOString(),
      metodoPagamento: metodoPag,
      localPagamento
    };
    try {
      const resp = await fetch('http://localhost:5000/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido)
      });
      // Salva também no histórico
      await fetch('http://localhost:5000/historicoPedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: Math.random().toString(36).slice(2,8),
          cliente: nomeCliente,
          valor: total,
          horarioPedido: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          horarioEntregue: '',
          bairro: modoConsumo === 'entrega' ? bairro : '',
          sabores: itensExpandidos.map(i => i.nome),
          data: new Date().toLocaleDateString(),
          metodoPagamento: metodoPag,
          localPagamento
        })
      });
      if (resp.ok) {
        toast.success('Pedido enviado para a cozinha!', { position: 'top-center', autoClose: 2000 });
        setCartItems([]);
        setTimeout(() => { navigate('/'); }, 2000);
      } else {
        toast.error('Erro ao enviar pedido para a cozinha!', { position: 'top-center' });
      }
    } catch {
      toast.error('Erro ao enviar pedido para a cozinha!', { position: 'top-center' });
    }
  }

  return (
    <div className="carrinho">
      <h2>Seu Carrinho</h2>

      <div style={{marginBottom: 20, background: '#fff7ec', borderRadius: 8, padding: 16}}>
        <div style={{marginBottom:12}}>
          <input
            type="text"
            placeholder="Nome do cliente"
            value={nomeCliente}
            onChange={e => setNomeCliente(e.target.value)}
            style={{width:'100%', padding:8}}
          />
        </div>
         <h4>Forma de consumo</h4>
        <label>
          <input
            type="radio"
            value="entrega"
            checked={modoConsumo === "entrega"}
            onChange={() => setModoConsumo("entrega")}
          /> Entrega
        </label>
        <label style={{ marginLeft: 16 }}>
          <input
            type="radio"
            value="restaurante"
            checked={modoConsumo === "restaurante"}
            onChange={() => setModoConsumo("restaurante")}
          /> Restaurante
        </label>
      </div>


<div style={{ marginBottom: 20, background: '#fff7ec', borderRadius: 8, padding: 16 }}>

  {modoConsumo === "entrega" ? (
    <>
      <h4>Endereço para entrega</h4>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input
          type="text"
          placeholder="Rua/Logradouro"
          value={logradouro}
          onChange={e => setLogradouro(e.target.value)}
          style={{ flex: 2, padding: 8 }}
        />
        <input
          type="text"
          placeholder="Número"
          value={numero}
          onChange={e => setNumero(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <select
          value={bairro}
          onChange={e => setBairro(e.target.value)}
          style={{ flex: 2, padding: 8 }}
        >
          <option value="">Selecione o bairro</option>
          {bairrosManaus.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>
      <input
        type="text"
        placeholder="Número de contato (WhatsApp)"
        value={contato}
        onChange={e => setContato(e.target.value)}
        style={{ width: '100%', padding: 8, marginBottom: 8 }}
      />
      <div style={{marginTop:12, marginBottom:8}}>
        <label>
          <input
            type="radio"
            value="agora"
            checked={opcaoPagamento === 'agora'}
            onChange={()=>setOpcaoPagamento('agora')}
          /> Pagar agora
        </label>
        <label style={{marginLeft:16}}>
          <input
            type="radio"
            value="entrega"
            checked={opcaoPagamento === 'entrega'}
            onChange={()=>setOpcaoPagamento('entrega')}
          /> Pagar na entrega
        </label>
      </div>
      {opcaoPagamento === 'entrega' && (
        <div style={{marginTop:8}}>
          <label>Método de pagamento:</label>
          <select value={metodoPagamento} onChange={e=>setMetodoPagamento(e.target.value)} style={{marginLeft:8, padding:4}}>
            <option value="pix">Pix</option>
            <option value="dinheiro">Dinheiro</option>
            <option value="cartao">Cartão</option>
          </select>
        </div>
      )}
    </>
  ) : (
    <>
      <h4>Consumo no restaurante</h4>
      <div style={{display:'flex', gap:8, marginBottom:8}}>
        <select value={mesa} onChange={e=>setMesa(e.target.value)} style={{flex:1, padding:8}}>
          <option value="">Selecione a mesa</option>
          {mesasDisponiveis.map(m => (
            <option key={m.id} value={m.id}>{m.id}</option>
          ))}
        </select>
        <input
          type="number"
          min={1}
          value={qtdPessoas}
          onChange={e=>setQtdPessoas(Number(e.target.value))}
          style={{width:140, padding:8}}
          placeholder="Pessoas"
        />
      </div>
      <div style={{marginTop:12, marginBottom:8}}>
        <label>
          <input
            type="radio"
            value="agora"
            checked={opcaoPagamento === 'agora'}
            onChange={()=>setOpcaoPagamento('agora')}
          /> Pagar agora
        </label>
        <label style={{marginLeft:16}}>
          <input
            type="radio"
            value="estabelecimento"
            checked={opcaoPagamento === 'estabelecimento'}
            onChange={()=>setOpcaoPagamento('estabelecimento')}
          /> Pagar no estabelecimento
        </label>
      </div>
      {/* Não mostra métodos de pagamento para restaurante */}
    </>
  )}

  {erroEntrega && (
    <div style={{ color: 'red', marginBottom: 8 }}>{erroEntrega}</div>
  )}
</div>



      <ul className="carrinho-lista">
        {cartItems.map(item => (
          <li key={item.id} className="carrinho-item">
            <div className="item-info">
              <span>{item.nome}</span>
              <span className="preco">R$ {item.preco}</span>
              {/* Exibe detalhes da personalização */}
              <div style={{ fontSize: '0.95em', color: '#444', margin: '6px 0 8px 0' }}>
                {item.tamanho && <div><strong>Tamanho:</strong> {item.tamanho}</div>}
                {item.borda && <div><strong>Borda:</strong> {item.borda}</div>}
                {item.extras && Object.keys(item.extras).length > 0 && (() => {
                  const extrasList = Object.entries(item.extras)
                    .filter(([, qtd]) => qtd > 0)
                    .map(([nome, qtd]) => qtd > 1 ? nome + ' (x' + qtd + ')' : nome)
                    .join(', ');
                  return extrasList ? <div><strong>Extras:</strong> {extrasList}</div> : null;
                })()}
              </div>
              <div>
                <button onClick={() => decrementarQuantidade(item.id)} disabled={item.quantidade <= 1}>-</button>
                <span style={{ margin: '0 8px' }}>{item.quantidade || 1}</span>
                <button onClick={() => incrementarQuantidade(item.id)}>+</button>
                <span style={{ marginLeft: 12 }}>Subtotal: R$ {(Number(item.preco) * (item.quantidade || 1)).toFixed(2)}</span>
              </div>
            </div>
            <button
              className="remover-btn"
              onClick={() => removerDoCarrinho(item.id)}
            >
              Remover
            </button>
          </li>
        ))}
      </ul>

      <div style={{marginTop: 20, marginBottom: 20}}>
        <label>
          <input
            type="checkbox"
            checked={aceitaTaxa}
            onChange={() => setAceitaTaxa(!aceitaTaxa)}
            /> Aceito pagar 10% da taxa de serviço
        </label>
      </div>

      <div className="carrinho-total">
        <strong>Subtotal:</strong> R$ {subtotal.toFixed(2)} <br />
        {aceitaTaxa && <span>+ 10% taxa de serviço<br/></span>}
        <strong>Total:</strong> R$ {total.toFixed(2)}
      </div>
  <button className="finalizar-compra-btn" onClick={handleFinalizar}>Finalizar Compra</button>
    </div>
  );
};

export default CarrinhoPage;