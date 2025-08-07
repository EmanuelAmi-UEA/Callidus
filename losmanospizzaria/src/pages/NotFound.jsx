import React from 'react'
import { Link } from 'react-router-dom';

const NotFound = () => (
  <main className='principal'>
    <img 
      src="/public/imagens/notfound404.jpg"
      alt="Página não encontrada"
      className="not-found-image"
      />
    <h2>Página não enontrada!</h2>
    <p><Link to="/">Ir para Home Page</Link></p>
  </main>
);

export default NotFound;
