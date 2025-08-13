import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Cardapio = () => {
  const [pizzas, setPizzas] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/pizzas") // pega as pizzas do json-server
      .then(res => res.json())
      .then(data => setPizzas(data))
      .catch(err => console.error("Erro ao buscar pizzas:", err));
  }, []);

  // Função para garantir que a imagem sempre venha do assets local
  const getPizzaImage = (imgName) => {
    try {
      return new URL(`../assets/imagens/${imgName}`, import.meta.url).href;
    } catch {
      return '';
    }
  };

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
                src={getPizzaImage(pizza.imagem)}
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
