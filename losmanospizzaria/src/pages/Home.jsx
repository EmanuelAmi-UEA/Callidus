import React, { useEffect, useState } from "react";
import "../css/home.css";
import chapolinImg from "../assets/imagens/promocoes/chapolin.png";
import etbiluImg from "../assets/imagens/promocoes/etbilu.png";
import faustoImg from "../assets/imagens/promocoes/fausto.png";
import mestremagoImg from "../assets/imagens/promocoes/mestremago.png";
import pulpfictionImg from "../assets/imagens/promocoes/pulpfiction.png";
import sauronImg from "../assets/imagens/promocoes/sauron.png";
import { useNavigate } from 'react-router-dom';
import { getPizzas, getCombos } from '../api/api';

const promocoes = [
  { nome: "Chapolin", img: chapolinImg },
  { nome: "ET Bilu", img: etbiluImg },
  { nome: "Fausto", img: faustoImg },
  { nome: "Mestre Mago", img: mestremagoImg },
  { nome: "Pulp Fiction", img: pulpfictionImg },
  { nome: "Sauron", img: sauronImg },
];

// Importação dinâmica de imagens usando Vite (import.meta.glob)
const imagens = import.meta.glob('../assets/imagens/*.jpeg', { eager: true, as: 'url' });

function getSaborImg(sabor, pizzas) {
  const pizza = pizzas.find(p => p.nome === sabor);
  if (pizza?.imagem) {
    const caminho = `../assets/imagens/${pizza.imagem}`;
    return imagens[caminho] || "";
  }
  return "";
}

export default function Home() {
  const navigate = useNavigate();
  const [promoIndex, setPromoIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [saboresMaisPedidos, setSaboresMaisPedidos] = useState([]);
  const [pizzas, setPizzas] = useState([]);
  const [combos, setCombos] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setPromoIndex(prev => (prev + 1) % promocoes.length);
        setFade(true);
      }, 350);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const pizzasLista = await getPizzas();
        setPizzas(pizzasLista);
        const combosLista = await getCombos();
        setCombos(combosLista);
        const historicoRes = await fetch('http://localhost:5000/historicoPedidos');
        const historicoData = await historicoRes.json();
        const sabores = Array.from(
          historicoData.flatMap(p => p.sabores).reduce((map, s) => map.set(s, (map.get(s)||0)+1), new Map()),
          ([nome, pedidos]) => ({ nome, pedidos })
        ).sort((a,b)=>b.pedidos-a.pedidos).slice(0,5);
        setSaboresMaisPedidos(sabores);
      } catch(e){
        console.error('Falha ao carregar dados iniciais', e);
      }
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
            <span key={idx} className={"promo-dot" + (promoIndex === idx ? " active" : "")}>
              {promoIndex === idx && (
                <span className="promo-progress" key={promoIndex} style={{ animation: `fill-progress 4.95s linear` }} />
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
        {combos.map(combo => (
          <button
            key={combo.id}
            className="combo-card"
            onClick={()=>navigate(`/combo/${combo.id}`)}
            style={{textAlign:'left'}}
            aria-label={`Ver detalhes do ${combo.nome}`}
          >
            <h3>{combo.nome}</h3>
            <p style={{marginBottom:6}}>{combo.descricao}</p>
            {combo.itens && (
              <ul style={{paddingLeft:18, margin:'4px 0 8px'}}>
                {combo.itens.map((i,idx)=>(
                  <li key={`${combo.id}-item-${idx}`} style={{fontSize:12,color:'#555'}}>
                    {i.quantidade}x {i.tipo === 'pizza' ? `Pizza ${i.tamanho}` : i.descricao}
                  </li>
                ))}
              </ul>
            )}
            <span className="combo-preco">R$ {combo.preco.toFixed(2)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
