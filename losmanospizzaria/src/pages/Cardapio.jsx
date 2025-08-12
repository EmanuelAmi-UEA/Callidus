import React from 'react'
import { useCart } from '../context/CarrinhoContext';

const Cardapio = ({pizzas}) => {
  const { adicionarAoCarrinho } = useCart();
  return (
    <main className='principal'>
      <h2>Cardápio de Pizzas</h2>
      <div className='cardapio-grid'>
        {pizzas.map((pizza) =>(
          <div className='cardapio-item-retangular' key={pizza.id}>
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
              <button className='botao-adicionar'
                onClick={() => {
                  adicionarAoCarrinho({
                    id: pizza.id,
                    nome: pizza.nome,
                    preco: pizza.preco,
                    imagem: `/imagens/${pizza.imagem}`
                  });
                }}
              >Adicionar ao Carrinho</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};
export default Cardapio;