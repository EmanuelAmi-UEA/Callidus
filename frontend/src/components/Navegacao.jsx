import React from "react";
import {Link, NavLink} from 'react-router-dom'

const linkCorrente = ({isActive}) =>({
    color: isActive ? "#027399" : "inherit",
    fontWeight: isActive ? "bold" : "normal",
});

const Navegacao = () =>
    <nav aria-label = "Navegação Principal">
        <ul style={{
            listStyle: "none",
            padding: 0,
            display: "flex",
            gap: "lrem",
            margin: 0
        }}>
            <li>
                <NavLink
                    to='/'
                    style={linkCorrente}
                    end
                    aria-current ='page'
                >Home
                </NavLink>
            </li>
            <li>
                <NavLink
                    to='/frontend'
                    style={linkCorrente}
                    end
                    aria-current ='page'
                >Frontend
                </NavLink>
            </li>
            <li>
                <NavLink
                    to='/programacao'
                    style={linkCorrente}
                    end
                    aria-current ='page'
                > Programação
                </NavLink>
            </li>
            <li>
                <NavLink
                    to='/catalogo'
                    style={linkCorrente}
                    end
                    aria-current ='page'
                >Catalogo
                </NavLink>
            </li>
            <li>
                <NavLink
                    to='/design'
                    style={linkCorrente}
                    end
                    aria-current ='page'
                >Design
                </NavLink>
            </li>
             <li>
                <NavLink
                    to='/carrinhopage'
                    style={linkCorrente}
                    end
                    aria-current ='page'
                >Carrinho
                </NavLink>
            </li>
        </ul>
    </nav>
export default Navegacao;