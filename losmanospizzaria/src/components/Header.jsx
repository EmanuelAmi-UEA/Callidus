
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CarrinhoContext'
import { useAuth } from '../context/AuthContext'
import '../css/header.css'
import logo from '../assets/imagens/logo.jpeg';

const Header = () => {

  const location = useLocation();
  const { cartItems } = useCart();
  const { usuario, logout } = useAuth();
  const isAdmin = usuario && usuario.email === 'admin@pizzaria.com';
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(window.scrollY);

  const totalItems = cartItems.reduce((total, item) => total + item.quantidade, 0);

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
          <img src={logo} alt='Logo' className='header-logo'/>
          <span className='app-title'>LOS MANOS PIZZARIA</span>
        </div>
        <nav className='nav-links'>
          <Link to="/home" className={location.pathname === "/" || location.pathname === "/home" ? "active" : ""}>Home</Link>
          {/* Links para cliente (não autenticado como admin) */}
          {!isAdmin && (
            <>
              <Link to="/" className={location.pathname === "/" ? "active" : ""}>Cardápio</Link>
              <Link to="/carrinho" className={location.pathname === "/carrinho" ? "active" : ""}>Carrinho</Link>
              <Link to="/login" className={location.pathname === "/login" ? "active" : ""}>Admin</Link>
              <div className="cart-info">
                🛒 {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
              </div>
            </>
          )}
          {/* Links para admin autenticado */}
          {isAdmin && (
            <>
              <Link to="/admin" className={location.pathname === "/admin" ? "active" : ""}>Admin</Link>
              <Link to="/cozinha" className={location.pathname === "/cozinha" ? "active" : ""}>Cozinha</Link>
              <Link to="/entregas" className={location.pathname === "/entregas" ? "active" : ""}>Entregas</Link>
              <button
                className="logout-btn"
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', font: 'inherit', padding: 0, marginLeft: 10 }}
                onClick={() => {
                  if (window.confirm('Deseja sair da área administrativa?')) {
                    logout();
                    window.location.href = '/cardapio';
                  }
                }}
              >Sair</button>
            </>
          )}
        </nav>
      </div>      
    </header>
  );
};

export default Header;