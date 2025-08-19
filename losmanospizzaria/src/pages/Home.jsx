
import React, { useEffect, useState } from "react";
import "../css/home.css";

// Imagens de promoções e nomes baseados nos arquivos da pasta
import chapolinImg from "../assets/imagens/promocoes/chapolin.png";
import etbiluImg from "../assets/imagens/promocoes/etbilu.png";
import faustoImg from "../assets/imagens/promocoes/fausto.png";
import mestremagoImg from "../assets/imagens/promocoes/mestremago.png";
import pulpfictionImg from "../assets/imagens/promocoes/pulpfiction.png";
import sauronImg from "../assets/imagens/promocoes/sauron.png";

const promocoes = [
  { nome: "Chapolin", img: chapolinImg },
  { nome: "ET Bilu", img: etbiluImg },
  { nome: "Fausto", img: faustoImg },
  { nome: "Mestre Mago", img: mestremagoImg },
  { nome: "Pulp Fiction", img: pulpfictionImg },
  { nome: "Sauron", img: sauronImg },
];

const combos = [
  {
    nome: "Combo Família",
    descricao: "2 Pizzas Grandes + 1 Coca-Cola 2L",
    preco: "R$ 90,00",
  },
  {
    nome: "Combo Amigos",
    descricao: "3 Pizzas Médias + 2 Refrigerantes Lata",
    preco: "R$ 110,00",
  },
  {
    nome: "Combo Casal",
    descricao: "1 Pizza Grande + 2 Refrigerantes Lata + 1 Sobremesa",
    preco: "R$ 65,00",
  },
];

const maisPedidos = [
  "Calabresa",
  "Frango com Catupiry",
  "Quatro Queijos",
  "Pepperoni",
  "Portuguesa",
];


export default function Home() {
  const [promoIndex, setPromoIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % promocoes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-container">
      <div className="promo-banner">
        <img
          src={promocoes[promoIndex].img}
          alt={promocoes[promoIndex].nome}
          className="promo-img"
        />
        <div className="promo-nome">{promocoes[promoIndex].nome}</div>
        <div className="promo-selector">
          {promocoes.map((_, idx) => (
            <span key={idx} className={"promo-dot" + (promoIndex === idx ? " active" : "")}
              >
              {promoIndex === idx && (
                <span className="promo-progress" key={promoIndex}
                  style={{ animation: `fill-progress 5s linear` }}
                />
              )}
            </span>
          ))}
        </div>
      </div>
        <h2 className="home-title">Sabores Mais Pedidos</h2>
        <ul className="mais-pedidos-list">
          {maisPedidos.map((sabor) => (
            <li key={sabor}>{sabor}</li>
          ))}
        </ul>
        <h2 className="home-title">Combos Especiais</h2>
        <div className="combos-list">
          {combos.map((combo) => (
            <div className="combo-card" key={combo.nome}>
              <h3>{combo.nome}</h3>
              <p>{combo.descricao}</p>
              <span className="combo-preco">{combo.preco}</span>
            </div>
          ))}
        </div>
  </div>
  );
}
