import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CarrinhoContext';

const Frontend = ({livros}) => {
  const { adicionarAoCarrinho } = useCart();
  const navigate = useNavigate();
  return (
    <main className='principal'>
      <h2>Categoria Frontend</h2>
      {livros
        .filter((cat) => cat.categoria === "frontend")
        .map((livro) =>(
          <div className='card' key={livro.id}>
            <div className='thumb'>
              <img
                src={"/imagens/" + livro.id +".jpg"}
                alt='"Thumbnail da capa do livro...'
              />            
            </div>
            {livros
              .filter((c) => c.slug === livro.slug)
              .map((livro) =>(
                <span key={livro.slug}  >
                  <Link to={`/livro/${livro.slug}`}>
                    {
                      <div className='detalhes'>
                        <h3>{livro.titulo}</h3>
                        <p>{livro.descricao.slice(0,130)+"..."}</p>
                        <p>Leia mais</p>
                        <p className='preco'>Preço: R$ {livro.preco}</p>
                      </div>
                    }
                  </Link>
                  <button className='botao-adicionar'
                          onClick={() => {
                            adicionarAoCarrinho({id: livro.id, nome: livro.titulo, preco: livro.preco, imagem: `/imagens/${livro.isbn.replace(/-/g,"")}.jpg`});
                          }}
                        >Adicionar ao Carrinho</button>
                </span> 
              ))}
          </div>
        ))}
    </main>
  );
};
export default Frontend;