import React from 'react';
import { useCart } from '../context/CarrinhoContext';
import { Link } from 'react-router-dom';

const CarrinhoPage = () => {
  const {
    cartItems,
    removerDoCarrinho,
    incrementarQuantidade,
    decrementarQuantidade,
    estoque
  } = useCart();

  const total = cartItems.reduce((sum, item) => sum + Number(item.preco) * (item.quantidade || 1), 0);

  if (cartItems.length === 0) {
    return (
      <div className="carrinho">
        <h2>Seu carrinho está vazio</h2>
        <Link to="/catalogo">Ver catálogo</Link>
      </div>
    );
  }

  return (
    <div className="carrinho">
      <h2>Seu Carrinho</h2>
      <ul className="carrinho-lista">
        {cartItems.map(item => (
          <li key={item.id} className="carrinho-item">
            <img src={item.imagem} alt={item.nome} width={60} />
            <div className="item-info">
              <span>{item.nome}</span>
              <span className="preco">R$ {item.preco}</span>
              <div>
                <button onClick={() => decrementarQuantidade(item.id)} disabled={item.quantidade <= 1}>-</button>
                <span style={{ margin: '0 8px' }}>{item.quantidade || 1}</span>
                <button onClick={() => incrementarQuantidade(item.id)} disabled={item.quantidade >= (estoque[item.id] || 0)}>+</button>
                <span style={{ marginLeft: 12 }}>Subtotal: R$ {(Number(item.preco) * (item.quantidade || 1)).toFixed(2)}</span>
              </div>
              <span style={{ fontSize: '0.9em', color: '#888' }}>Estoque: {estoque[item.id] || 0}</span>
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