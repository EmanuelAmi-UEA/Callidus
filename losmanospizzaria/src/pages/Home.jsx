
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



// Importação dinâmica de imagens usando Vite (import.meta.glob)
const imagens = import.meta.glob('../assets/imagens/*.jpeg', { eager: true, as: 'url' });

function getSaborImg(sabor, pizzas) {
  const pizza = pizzas.find(p => p.nome === sabor);
  if (pizza && pizza.imagem) {
    // Monta o caminho relativo igual ao glob
    const caminho = `../assets/imagens/${pizza.imagem}`;
    return imagens[caminho] || "";
  }
  return "";
}

export default function Home() {
  const [promoIndex, setPromoIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [saboresMaisPedidos, setSaboresMaisPedidos] = useState([]);
  const [pizzas, setPizzas] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setPromoIndex((prev) => (prev + 1) % promocoes.length);
        setFade(true);
      }, 350); // tempo do fade-out
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Buscar sabores mais pedidos e pizzas do backend
  useEffect(() => {
    async function fetchData() {
      // Busca pizzas para pegar as imagens
      const pizzasRes = await fetch('http://localhost:5000/pizzas');
      const pizzasData = await pizzasRes.json();
      setPizzas(pizzasData);

      // Busca histórico de pedidos
      const historicoRes = await fetch('http://localhost:5000/historicoPedidos');
      const historicoData = await historicoRes.json();

      // Lógica igual ao relatório: sabores mais pedidos
      const sabores = Array.from(
        historicoData.flatMap(p => p.sabores).reduce((map, s) => map.set(s, (map.get(s)||0)+1), new Map()),
        ([nome, pedidos]) => ({ nome, pedidos })
      ).sort((a,b)=>b.pedidos-a.pedidos).slice(0,5);
      setSaboresMaisPedidos(sabores);
    }
    fetchData();
  }, []);

  return (
    <div className="home-container">
      <div className="promo-banner">
        <img
          src={promocoes[promoIndex].img}
          alt={promocoes[promoIndex].nome}
          className={`promo-img${fade ? ' fade-in' : ' fade-out'}`}
        />
        <div className="promo-nome">{promocoes[promoIndex].nome}</div>
        <div className="promo-selector">
          {promocoes.map((_, idx) => (
            <span key={idx} className={"promo-dot" + (promoIndex === idx ? " active" : "")}
              >
              {promoIndex === idx && (
                <span className="promo-progress" key={promoIndex}
                  style={{ animation: `fill-progress 4.95s linear` }}
                />
              )}
            </span>
          ))}
        </div>
      </div>
        <h2 className="home-title">Sabores Mais Pedidos</h2>
        <ul className="mais-pedidos-list">
          {saboresMaisPedidos.map((sabor) => (
            <li key={sabor.nome} className="mais-pedido-item">
              <img src={getSaborImg(sabor.nome, pizzas)} alt={sabor.nome} className="mais-pedido-img" />
              <span>{sabor.nome}</span>
            </li>
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
