import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import "./css/Header.css"

const Header = () => {
  const location = useLocation();
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(window.scrollY);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 80) {
        setShow(false); 
      } else {
        setShow(true); 
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header className={`app-header${show ? '' : ' header-hide'}`}>
      <div className='header-content'>
        <div className='logo-area'>
          <img src='/imagens/callidus-logo.png' alt='Logo' className='header-logo'/>
          <span className='app-title'>LIVRARIA</span>
        </div>
        <nav className='nav-links'>
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
          <Link to="/cadastrar" className={location.pathname === "/cadastrar" ? "active" : ""}>Cadastrar</Link>
          <Link to="/tabela-livros" className={location.pathname === "/tabela-livros" ? "active" : ""}>Gerenciar Livros</Link>

        </nav>
      </div>      
    </header>
  );
};

export default Header;