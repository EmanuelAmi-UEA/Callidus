
import React from 'react';
import { useCart } from '../context/CarrinhoContext';
import { Link } from 'react-router-dom';
const CarrinhoPage = () => {
  const {
    cartItems,
    removerDoCarrinho,
    incrementarQuantidade,
    decrementarQuantidade,
    infoEntrega,
    setInfoEntrega
  } = useCart();

  const [logradouro, setLogradouro] = React.useState("");
  const [numero, setNumero] = React.useState("");
  const [bairro, setBairro] = React.useState("");
  const [contato, setContato] = React.useState("");
  const [erroEntrega, setErroEntrega] = React.useState("");

  // Consts para funcionalidades principais de Garçom
  const [modoConsumo, setModoConsumo] = React.useState("entrega"); // "entrega" ou "restaurante"
  const [mesa, setMesa] = React.useState("");
  const [aceitaTaxa, setAceitaTaxa] = React.useState(false);

  // Lista fixa de bairros (já que bairrosManaus foi removido)
  const bairrosManaus = [
    "Centro", "Adrianópolis", "Aleixo", "Alvorada", "Cachoeirinha", "Cidade Nova", "Compensa", "Coroado", "Dom Pedro", "Flores", "Japiim", "Parque 10", "Petrópolis", "Planalto", "Ponta Negra", "Praça 14", "Redenção", "São Geraldo", "São Jorge", "Tarumã", "Zumbi"
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.preco) * (item.quantidade || 1), 0);
  const total = aceitaTaxa ? subtotal * 1.1 : subtotal;

  if (cartItems.length === 0) {
    return (
      <div className="carrinho">
        <h2>Seu carrinho está vazio</h2>
        <Link to="/cardapio">Ver Cardápio</Link>
      </div>
    );
  }

  // Função para validar e montar infoEntrega antes de ir para pagamento
  const handleFinalizar = (e) => {
  if (modoConsumo === "entrega") {
    // Valida somente os campos de entrega
    if (!logradouro.trim() || !numero.trim() || !bairro.trim() || !contato.trim()) {
      setErroEntrega("Preencha todos os campos de endereço e o número de contato antes de finalizar!");
      e.preventDefault();
      return;
    }
    setErroEntrega("");
    setInfoEntrega(`${logradouro}, ${numero}, ${bairro} | Contato: ${contato}`);
  } else {
    // Valida o número da mesa
    if (!mesa.trim()) {
      setErroEntrega("Informe o número da mesa antes de finalizar!");
      e.preventDefault();
      return;
    }
    setErroEntrega("");
    setInfoEntrega(`Mesa: ${mesa}`);
  }
    
    setErroEntrega("");
    setInfoEntrega(`${logradouro}, ${numero}, ${bairro} | Contato: ${contato}`);
  };

  return (
    <div className="carrinho">
      <h2>Seu Carrinho</h2>

      <div style={{marginBottom: 20, background: '#fff7ec', borderRadius: 8, padding: 16}}>
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
    </>
  ) : (
    <>
      <h4>Consumo no restaurante</h4>
      <input
        type="text"
        placeholder="Número da mesa"
        value={mesa}
        onChange={e => setMesa(e.target.value)}
        style={{ width: '100%', padding: 8, marginBottom: 8 }}
      />
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
                {item.extras && Object.keys(item.extras).length > 0 && (
                  <div><strong>Extras:</strong> {Object.entries(item.extras).filter(([qtd]) => qtd > 0).map(([nome, qtd]) => `${nome}${qtd > 1 ? ` (x${qtd})` : ''}`).join(', ')}</div>
                )}
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
      <Link to="/pagamento" onClick={handleFinalizar}>
        <button className="finalizar-compra-btn">Finalizar Compra</button>
      </Link>
    </div>
  );
};

export default CarrinhoPage;