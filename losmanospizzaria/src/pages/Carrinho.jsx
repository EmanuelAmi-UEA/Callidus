
import React from 'react';

// Função utilitária para garantir que a imagem venha do assets local
function getPizzaImage(imgName) {
  try {
    return new URL(`../assets/imagens/${imgName}`, import.meta.url).href;
  } catch {
    return '';
  }
}
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
  const bairrosManaus = [
    "Centro", "Adrianópolis", "Aleixo", "Alvorada", "Cachoeirinha", "Cidade Nova", "Compensa", "Coroado", "Dom Pedro", "Flores", "Japiim", "Parque 10", "Petrópolis", "Planalto", "Ponta Negra", "Praça 14", "Redenção", "São Geraldo", "São Jorge", "Tarumã", "Zumbi"
  ];
  const [contato, setContato] = React.useState("");
  const [erroEntrega, setErroEntrega] = React.useState("");

  const total = cartItems.reduce((sum, item) => sum + Number(item.preco) * (item.quantidade || 1), 0);

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
    if (!logradouro.trim() || !numero.trim() || !bairro.trim() || !contato.trim()) {
      setErroEntrega("Preencha todos os campos de endereço e o número de contato antes de finalizar!");
      e.preventDefault();
      return;
    }
    setErroEntrega("");
    setInfoEntrega(`${logradouro}, ${numero}, ${bairro} | Contato: ${contato}`);
  };

  return (
    <div className="carrinho">
      <h2>Seu Carrinho</h2>

      <div style={{marginBottom: 20, background: '#fff7ec', borderRadius: 8, padding: 16}}>
        <h4>Endereço para entrega</h4>
        <div style={{display: 'flex', gap: 8, marginBottom: 8}}>
          <input
            type="text"
            placeholder="Rua/Logradouro"
            value={logradouro}
            onChange={e => setLogradouro(e.target.value)}
            style={{flex: 2, padding: 8}}
          />
          <input
            type="text"
            placeholder="Número"
            value={numero}
            onChange={e => setNumero(e.target.value)}
            style={{flex: 1, padding: 8}}
          />
          <select
            value={bairro}
            onChange={e => setBairro(e.target.value)}
            style={{flex: 2, padding: 8}}
          >
            <option value="">Selecione o bairro</option>
            {bairrosManaus.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <input
          type="text"
          placeholder="Número de contato (WhatsApp)"
          value={contato}
          onChange={e => setContato(e.target.value)}
          style={{width: '100%', padding: 8, marginBottom: 8}}
        />
        {erroEntrega && <div style={{color: 'red', marginBottom: 8}}>{erroEntrega}</div>}
      </div>

      <ul className="carrinho-lista">
        {cartItems.map(item => (
          <li key={item.id} className="carrinho-item">
            <img src={getPizzaImage(item.imagem)} alt={item.nome} width={120} height={120} style={{ objectFit: 'cover' }} />  
            <div className="item-info">
              <span>{item.nome}</span>
              <span className="preco">R$ {item.preco}</span>
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
      <div className="carrinho-total">
        <strong>Total:</strong> R$ {total.toFixed(2)}
      </div>
      <Link to="/pagamento" onClick={handleFinalizar}>
        <button className="finalizar-compra-btn">Finalizar Compra</button>
      </Link>
    </div>
  );
};

export default CarrinhoPage;