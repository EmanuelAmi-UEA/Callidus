import React, { useState, useMemo, useEffect } from 'react';
// Lista local de ingredientes extras específica para seleção nos combos
const INGREDIENTES_EXTRAS = [
  { nome: 'Bacon', preco: 4 },
  { nome: 'Queijo', preco: 3 },
  { nome: 'Calabresa', preco: 3 },
  { nome: 'Milho', preco: 2 },
  { nome: 'Cebola', preco: 2 }
];
import pizzasData from '../data/pizzas.json';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CarrinhoContext';
import { getCombo } from '../api/api';

const getImage = (imgName) => {
  try { return new URL(`../assets/imagens/${imgName}`, import.meta.url).href; } catch { return ''; }
};

export default function ComboDetalhe(){
  const { id } = useParams();
  const navigate = useNavigate();
  const { adicionarAoCarrinho } = useCart();
  const [combo, setCombo] = useState(null);
  // selecionados: chave incremental de slot (0..n-1) -> id do sabor
  const [selecionados, setSelecionados] = useState({});
  const [extrasPorSlot, setExtrasPorSlot] = useState({}); // slot -> { Bacon: 1, Queijo:2 }

  const pizzas = pizzasData.pizzas;

  // Calcula total de "slots" de pizza exigidos pelo combo
  // Memo para evitar recalcular em renders
  const totalSlots = useMemo(() => {
    return combo?.itens
      ?.filter(i => i.tipo === 'pizza')
      .reduce((acc, i) => acc + i.quantidade, 0) || 0;
  }, [combo]);

  useEffect(()=>{
    async function load(){
      try {
        const dados = await getCombo(id);
        setCombo(dados);
      } catch(e){
        console.error('Erro ao carregar combo', e);
      }
    }
    load();
  },[id]);

  const handleSelecionar = (slot, saborId) => {
    setSelecionados(s => ({ ...s, [slot]: saborId }));
  };

  const alterarExtra = (slot, nome, delta) => {
    setExtrasPorSlot(old => {
      const atuais = old[slot] || {};
      const novaQtd = Math.max(0, (atuais[nome] || 0) + delta);
      return {
        ...old,
        [slot]: { ...atuais, [nome]: novaQtd }
      };
    });
  };

  const precoExtras = useMemo(() => {
    return Object.entries(extrasPorSlot).reduce((acc,[slot, extras]) => {
      return acc + Object.entries(extras).reduce((subtotal,[nome,qtd]) => {
        const ref = INGREDIENTES_EXTRAS.find(e=>e.nome===nome);
        return subtotal + (ref ? ref.preco * qtd : 0);
      },0);
    },0);
  }, [extrasPorSlot]);

  const pronto = totalSlots > 0 ? (Object.keys(selecionados).length === totalSlots && Object.values(selecionados).every(Boolean)) : true;

  const handleAdicionar = () => {
    // Mapeia cada slot ao tamanho da pizza definido no combo
    const slotToTamanho = [];
    if (combo?.itens) {
      let running = 0;
      combo.itens.forEach(it => {
        if (it.tipo === 'pizza') {
          for (let i = 0; i < it.quantidade; i++) {
            slotToTamanho[running + i] = it.tamanho;
          }
          running += it.quantidade;
        }
      });
    }

    const pizzasEscolhidas = Object.entries(selecionados).map(([slot, saborId]) => {
      const pizza = pizzas.find(p => String(p.id) === String(saborId));
      if (!pizza) return null;
      return {
        id: `combo${combo.id}-slot${slot}-${pizza.id}`,
        nome: pizza.nome,
        tamanho: slotToTamanho[slot] || '',
        extras: extrasPorSlot[slot] || {}
      };
    }).filter(Boolean);

    // Bebidas e outros itens não pizza
    const bebidas = (combo.itens || []).filter(i => i.tipo !== 'pizza').map(i => ({
      tipo: i.tipo,
      descricao: i.descricao,
      quantidade: i.quantidade
    }));

    // Gera itens para cozinha (flatten) igual pizzas normais
    const itensCozinha = [
      ...pizzasEscolhidas.map((p, idx) => ({
        id: `${combo.id}-pz-${idx}-${Date.now()}`,
        nome: p.nome,
        tamanho: p.tamanho,
        extras: p.extras,
        quantidade: 1,
        origemCombo: combo.nome,
        tipo: 'pizza'
      })),
      ...bebidas.map((b, idx) => ({
        id: `${combo.id}-bd-${idx}-${Date.now()}`,
        nome: b.descricao,
        quantidade: b.quantidade,
        origemCombo: combo.nome,
        tipo: b.tipo
      }))
    ];

    const itemCarrinho = {
      id: `combo-${combo.id}-${Date.now()}`,
      tipo: 'combo',
      nome: combo.nome,
      descricao: combo.descricao,
      base: combo.preco,
      preco: combo.preco + precoExtras,
      pizzas: pizzasEscolhidas,
      bebidas,
      extrasTotal: precoExtras,
      itensCozinha // usado para gerar comanda
    };

    adicionarAoCarrinho(itemCarrinho);
    navigate('/carrinho');
  };

  if(combo === null){
    return <div>Combo não encontrado.</div>;
  }

  const renderSlot = (slot) => {
    return (
      <div key={`slot-wrap-${slot}`} style={{display:'flex', flexDirection:'column', gap:4}}>
        <select
          value={selecionados[slot] || ''}
          onChange={e=>handleSelecionar(slot, e.target.value)}
        >
          <option value="">Selecione o sabor</option>
          {pizzas.map(p=> <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>
        <details style={{background:'#fafafa', padding:6, border:'1px solid #eee', borderRadius:4}}>
          <summary style={{cursor:'pointer'}}>Extras</summary>
          {INGREDIENTES_EXTRAS.map(extra => {
            const qtd = extrasPorSlot[slot]?.[extra.nome] || 0;
            return (
              <div key={extra.nome} style={{display:'flex', alignItems:'center', gap:6, fontSize:12, marginTop:4}}>
                <span style={{minWidth:70}}>{extra.nome}</span>
                <button type="button" onClick={()=>alterarExtra(slot, extra.nome, -1)} disabled={qtd===0}>-</button>
                <span>{qtd}</span>
                <button type="button" onClick={()=>alterarExtra(slot, extra.nome, 1)}>+</button>
                <span style={{color:'#777'}}>+R$ {extra.preco.toFixed(2)}</span>
              </div>
            );
          })}
        </details>
      </div>
    );
  };

  return (
    <div className="pizza-card-individual">
      <h2>{combo.nome}</h2>
      <p>{combo.descricao}</p>
      <h3>Itens</h3>
      <ol style={{listStyle:'none', padding:0}}>
        {(() => {
          const elements = [];
            let runningSlot = 0;
      combo.itens.forEach(item => {
              if(item.tipo !== 'pizza') {
                elements.push(
                  <li key={`item-${item.tipo}-${runningSlot}`} style={{marginBottom:12, border:'1px solid #eee', padding:8, borderRadius:6}}>
                    <div><strong>{item.quantidade}x</strong> {item.descricao}</div>
                  </li>
                );
              } else {
        const slots = Array.from({length:item.quantidade}).map((_,i)=> renderSlot(runningSlot + i));
                elements.push(
                  <li key={`pizza-${runningSlot}`} style={{marginBottom:12, border:'1px solid #eee', padding:8, borderRadius:6}}>
                    <strong>{item.quantidade}x Pizza {item.tamanho}</strong>
                    <div style={{display:'flex', flexWrap:'wrap', gap:8, marginTop:6}}>
            {slots}
                    </div>
                  </li>
                );
                runningSlot += item.quantidade;
              }
            });
            return elements;
        })()}
      </ol>
    <h3>Total: R$ {(combo.preco + precoExtras).toFixed(2)} {precoExtras>0 && <span style={{fontSize:14, color:'#555'}}> (Base R$ {combo.preco.toFixed(2)} + Extras R$ {precoExtras.toFixed(2)})</span>}</h3>
      <button disabled={!pronto} onClick={handleAdicionar}>Adicionar Combo ao Carrinho</button>
      <button style={{marginLeft:12}} onClick={()=>navigate(-1)}>Voltar</button>
    </div>
  );
}
