import React from 'react'
import { useCart } from '../context/CarrinhoContext';

const Livro = ({livros}) => {
  const { adicionarAoCarrinho } = useCart();

  return(
    <main className='principal'>
      <div className='pag-livro'>
        <h2>{livros.titulo}</h2>
        <div className='livro'>
          <img
            src={"/imagens/" + livros.id +".jpg"}
            alt='Thumbnail da capa do livro...'
          />
          <ul>
            <li>ISBN: {livros.isbn}</li>
            <li>Ano: {livros.ano}</li>
            <li>Páginas: {livros.paginas}</li>
            <li>Preços: R${livros.preco},00</li>
          </ul>
          <h3>Descrição do livro</h3>
          <p>{livros.descricao}</p>
          <button className='botao-adicionar'
                            onClick={() => {
                              adicionarAoCarrinho({id: livros.id, nome: livros.titulo, preco: livros.preco, imagem: `/imagens/${livros.isbn.replace(/-/g,"")}.jpg`});
                            }}
                          >Adicionar ao Carrinho</button>
        </div>
      </div>
    </main>
  )
};
export default Livro;