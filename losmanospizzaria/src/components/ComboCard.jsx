import React from 'react';
import '../css/PizzaCard.css';

// Card de resumo do combo, reutiliza estilos de pizza-card-individual minimizado
export default function ComboCard({ combo, onSelect }) {
  if(!combo) return null;
  return (
    <div className="pizza-card-individual" style={{maxWidth:380, padding:20}}>
      <h2 style={{fontSize:'1.5rem', marginBottom:4}}>{combo.nome}</h2>
      <p style={{marginBottom:8}}>{combo.descricao}</p>
      <div style={{width:'100%', background:'#fff', border:'1px solid #f1e0d0', borderRadius:6, padding:10, marginBottom:12}}>
        {combo.itens?.map((i, idx) => (
          <div key={`${combo.id}-it-${idx}`} style={{fontSize:14, marginBottom:4}}>
            <strong>{i.quantidade}x</strong> {i.tipo === 'pizza' ? `Pizza ${i.tamanho}` : i.descricao}
          </div>
        ))}
      </div>
      <div className="preco-total" style={{marginBottom:12}}>R$ {combo.preco?.toFixed(2)}</div>
      {onSelect && <button onClick={()=>onSelect(combo)}>Configurar</button>}
    </div>
  );
}
