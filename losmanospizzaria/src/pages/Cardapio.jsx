import React from 'react'
import { useCart } from '../context/CarrinhoContext';

const Cardapio = ({pizzas}) => {
  const { adicionarAoCarrinho } = useCart();
  return (
    <main className='principal'>
      <h2>Cardápio de Pizzas</h2>
      {pizzas.map((pizza) =>(
        <div className='cardapio-item' key={pizza.id}>
          <div className='thumb'>
            <img
              src={`/imagens/${pizza.imagem}`}
              alt={`Pizza ${pizza.nome}`}
            />            
          </div>
          <div className='detalhes'>
            <h3>{pizza.nome}</h3>
            <p>{pizza.descricao}</p>
            <p><strong>Ingredientes:</strong> {pizza.ingredientes.join(", ")}</p>
            <p className='preco'>Preço: R$ {pizza.preco.toFixed(2)}</p>
          </div>
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
      ))}
    </main>
  );
};
export default Cardapio;