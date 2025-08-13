
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

  const total = cartItems.reduce((sum, item) => sum + Number(item.preco) * (item.quantidade || 1), 0);

  if (cartItems.length === 0) {
    return (
      <div className="carrinho">
        <h2>Seu carrinho está vazio</h2>
        <Link to="/cardapio">Ver Cardápio</Link>
      </div>
    );
  }

  return (
    <div className="carrinho">
      <h2>Seu Carrinho</h2>

      <label htmlFor="infoEntrega" style={{ marginBottom: 10, display: 'block'}}>
        Informe a mesa ou endereço para entrega:
      </label>
      <input
        id="infoEntrega"
        type="text"
        value={infoEntrega}
        onChange={(e) => setInfoEntrega(e.target.value)}
        placeholder="Ex: Mesa 5 ou Rua das Flores, 123"
        style={{ width: '100%', padding: 8, marginBottom: 20}} />
        
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
      <Link to="/pagamento">
        <button className="finalizar-compra-btn">Finalizar Compra</button>
      </Link>
    </div>
  );
};

export default CarrinhoPage;