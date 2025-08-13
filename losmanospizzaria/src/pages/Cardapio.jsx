
import React from 'react';
import { Link } from 'react-router-dom';

const Cardapio = ({ pizzas }) => {
  return (
    <main className='principal'>
      <h2>Cardápio de Pizzas</h2>
      <div className='cardapio-grid'>
        {pizzas.map((pizza) => (
          <Link
            to={`/pizza/${pizza.id}`}
            key={pizza.id}
            className='cardapio-item-retangular cardapio-link'
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className='cardapio-img-area'>
              <img
                src={`/imagens/${pizza.imagem}`}
                alt={`Pizza ${pizza.nome}`}
                className='cardapio-img'
              />
            </div>
            <div className='cardapio-info-area'>
              <h3 className='cardapio-nome'>{pizza.nome}</h3>
              <p className='cardapio-preco'>R$ {pizza.preco.toFixed(2)}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default Cardapio;