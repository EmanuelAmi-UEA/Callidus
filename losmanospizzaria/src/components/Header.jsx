import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CarrinhoContext'
import '../css/header.css'

const Header = () => {
  const location = useLocation();
  const { cartItems } = useCart();
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
          <img src='/imagens/pizza-logo.png' alt='Logo' className='header-logo'/>
          <span className='app-title'>LOS MANOS PIZZARIA</span>
        </div>
        <nav className='nav-links'>
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>Cardápio</Link>
          <Link to="/admin" className={location.pathname === "/admin" ? "active" : ""}>Admin</Link>
          <Link to="/cozinha" className={location.pathname === "/cozinha" ? "active" : ""}>Cozinha</Link>
          <Link to="/entregas" className={location.pathname === "/entregas" ? "active" : ""}>Entregas</Link>
          <Link to="/login" className={location.pathname === "/login" ? "active" : ""}>Login</Link>
          <div className="cart-info">
            🛒 {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          </div>
        </nav>
      </div>      
    </header>
  );
};

export default Header;