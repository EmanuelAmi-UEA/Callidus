import React, { useState } from 'react';
// import financeiro from '../data/financeiro.json';
// Busca pedidos do backend (db.json via JSON Server)
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';
// Dados mockados para exemplo visual
const PERIODOS = [
  { label: 'Dia', value: 'dia' },
  { label: 'Semana', value: 'semana' },
  { label: 'Mês', value: 'mes' },
  { label: 'Ano', value: 'ano' },
];
const COLORS = ['#d35400', '#f39c12', '#e67e22', '#f1c40f', '#ffe0b2'];

export default function Relatorios() {
  const [periodo, setPeriodo] = useState('mes');
  const [historico, setHistorico] = useState([]);
  // Gastos fixos podem ser mantidos, mas todo o resto será calculado do histórico
  const gastos = { funcionarios: 6000, materiais: 3500, aluguel: 2000 };
  // Função para somar o valor dos pedidos em um dado período (apenas do histórico)
  function somaFaturamento(periodo) {
    const agora = new Date();
    if (periodo === 'dia') {
      const hoje = agora.toLocaleDateString('pt-BR');
      return historico.filter(p => p.data === hoje)
        .reduce((acc, p) => acc + (Number(p.valor) || 0), 0);
    }
    let limite = new Date();
    if (periodo === 'semana') limite.setDate(agora.getDate() - 7);
    else if (periodo === 'mes') limite.setDate(agora.getDate() - 30);
    else if (periodo === 'ano') limite.setDate(agora.getDate() - 365);
    return historico.filter(p => {
      const data = p.data ? new Date(p.data.split('/').reverse().join('-')) : null;
      return data && data > limite;
    }).reduce((acc, p) => acc + (Number(p.valor) || 0), 0);
  }
  React.useEffect(() => {
    fetch('http://localhost:5000/historicoPedidos')
      .then(res => res.json())
      .then(data => setHistorico(data));
  }, []);
  // Filtro por período (apenas do histórico)
  function filtrarPorPeriodo(lista, periodo) {
    const agora = new Date();
    if (periodo === 'dia') {
      const hoje = agora.toLocaleDateString('pt-BR');
      return lista.filter(p => p.data === hoje);
    }
    let limite = new Date();
    if (periodo === 'semana') limite.setDate(agora.getDate() - 7);
    else if (periodo === 'mes') limite.setDate(agora.getDate() - 30);
    else if (periodo === 'ano') limite.setDate(agora.getDate() - 365);
    return lista.filter(p => {
      const data = p.data ? new Date(p.data.split('/').reverse().join('-')) : null;
      return data && data > limite;
    });
  }

  const historicoFiltrado = filtrarPorPeriodo(historico, periodo);
  const pedidosPeriodo = historicoFiltrado.length;
  const totalFaturado = historicoFiltrado.reduce((acc, p) => acc + (Number(p.valor) || 0), 0);
  const ticketMedio = pedidosPeriodo ? (totalFaturado / pedidosPeriodo) : 0;
  // Bairros mais pedidos
  const bairrosMaisPedidos = Array.from(
    historicoFiltrado.reduce((map, p) => map.set(p.bairro, (map.get(p.bairro)||0)+1), new Map()),
    ([bairro, pedidos]) => ({ bairro, pedidos })
  ).sort((a,b)=>b.pedidos-a.pedidos).slice(0,5);
  // Sabores mais pedidos
  const saboresMaisPedidos = Array.from(
    historicoFiltrado.flatMap(p => p.sabores).reduce((map, s) => map.set(s, (map.get(s)||0)+1), new Map()),
    ([nome, pedidos]) => ({ nome, pedidos })
  ).sort((a,b)=>b.pedidos-a.pedidos).slice(0,5);
  // Tempo médio de entrega calculado do histórico
  let tempoEntrega = [{ nome: 'Tempo Médio', minutos: '-' }];
  if (historicoFiltrado.length > 0 && historicoFiltrado[0].horarioPedido && historicoFiltrado[0].horarioEntregue) {
    // Calcular média em minutos
    const tempos = historicoFiltrado.map(p => {
      if (!p.horarioPedido || !p.horarioEntregue) return null;
      const [h1, m1] = p.horarioPedido.split(':').map(Number);
      const [h2, m2] = p.horarioEntregue.split(':').map(Number);
      if (isNaN(h1) || isNaN(m1) || isNaN(h2) || isNaN(m2)) return null;
      let t1 = h1 * 60 + m1;
      let t2 = h2 * 60 + m2;
      if (t2 < t1) t2 += 24 * 60; // caso passe da meia-noite
      return t2 - t1;
    }).filter(x => x !== null);
    if (tempos.length > 0) {
      const media = Math.round(tempos.reduce((a, b) => a + b, 0) / tempos.length);
      tempoEntrega = [{ nome: 'Tempo Médio', minutos: media }];
    }
  }
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', background: '#fff', borderRadius: 18, boxShadow: '0 6px 32px rgba(211,84,0,0.10)', padding: 32 }}>
      <h2 style={{ color: '#d35400', marginBottom: 32 }}>Relatórios e Estatísticas</h2>

      {/* Tabela detalhada dos pedidos filtrados */}
      <div style={{marginBottom: 32, background: '#f8f8f8', borderRadius: 12, padding: 24}}>
        <h3 style={{color:'#d35400', marginBottom: 16}}>Pedidos do período selecionado</h3>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%', borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'#ffe0b2'}}>
                <th style={{padding:8, border:'1px solid #eee'}}>Data</th>
                <th style={{padding:8, border:'1px solid #eee'}}>Horário Pedido</th>
                <th style={{padding:8, border:'1px solid #eee'}}>Horário Entregue</th>
                <th style={{padding:8, border:'1px solid #eee'}}>Bairro</th>
                <th style={{padding:8, border:'1px solid #eee'}}>Sabores</th>
                <th style={{padding:8, border:'1px solid #eee'}}>Valor</th>
              </tr>
            </thead>
            <tbody>
              {historicoFiltrado.length === 0 && (
                <tr><td colSpan={6} style={{textAlign:'center', padding:16}}>Nenhum pedido neste período.</td></tr>
              )}
              {historicoFiltrado.map((p, idx) => (
                <tr key={idx}>
                  <td style={{padding:8, border:'1px solid #eee'}}>{p.data}</td>
                  <td style={{padding:8, border:'1px solid #eee'}}>{p.horarioPedido || '-'}</td>
                  <td style={{padding:8, border:'1px solid #eee'}}>{p.horarioEntregue || '-'}</td>
                  <td style={{padding:8, border:'1px solid #eee'}}>{p.bairro || '-'}</td>
                  <td style={{padding:8, border:'1px solid #eee'}}>{Array.isArray(p.sabores) ? p.sabores.join(', ') : p.sabores}</td>
                  <td style={{padding:8, border:'1px solid #eee'}}>R$ {Number(p.valor).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filtro de Período */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ fontWeight: 600, marginRight: 8 }}>Período:</label>
        <select value={periodo} onChange={e => setPeriodo(e.target.value)} style={{ fontSize: 16, padding: '4px 12px', borderRadius: 6 }}>
          {PERIODOS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
      </div>

      {/* Dashboard Resumido */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 32, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 180, background: '#eafaf1', borderRadius: 12, padding: 18, textAlign: 'center', boxShadow: '0 2px 8px rgba(39,174,96,0.10)' }}>
          <div style={{ color: '#27ae60', fontWeight: 700 }}>Total de Pedidos</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{pedidosPeriodo}</div>
        </div>
        <div style={{ flex: 1, minWidth: 180, background: '#eafaf1', borderRadius: 12, padding: 18, textAlign: 'center', boxShadow: '0 2px 8px rgba(39,174,96,0.10)' }}>
          <div style={{ color: '#27ae60', fontWeight: 700 }}>Ticket Médio</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>R$ {ticketMedio.toLocaleString('pt-BR', {minimumFractionDigits:2})}</div>
        </div>
  </div>



      {/* Cards de Faturamento */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 32, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 180, background: '#fff7ec', borderRadius: 12, padding: 18, textAlign: 'center', boxShadow: '0 2px 8px rgba(211,84,0,0.06)' }}>
          <div style={{ color: '#d35400', fontWeight: 700 }}>Faturamento do Dia</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>R$ {somaFaturamento('dia').toLocaleString('pt-BR', {minimumFractionDigits:2})}</div>
        </div>
        <div style={{ flex: 1, minWidth: 180, background: '#fff7ec', borderRadius: 12, padding: 18, textAlign: 'center', boxShadow: '0 2px 8px rgba(211,84,0,0.06)' }}>
          <div style={{ color: '#d35400', fontWeight: 700 }}>Faturamento da Semana</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>R$ {somaFaturamento('semana').toLocaleString('pt-BR', {minimumFractionDigits:2})}</div>
        </div>
        <div style={{ flex: 1, minWidth: 180, background: '#fff7ec', borderRadius: 12, padding: 18, textAlign: 'center', boxShadow: '0 2px 8px rgba(211,84,0,0.06)' }}>
          <div style={{ color: '#d35400', fontWeight: 700 }}>Faturamento do Mês</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>R$ {somaFaturamento('mes').toLocaleString('pt-BR', {minimumFractionDigits:2})}</div>
        </div>
        <div style={{ flex: 1, minWidth: 180, background: '#fff7ec', borderRadius: 12, padding: 18, textAlign: 'center', boxShadow: '0 2px 8px rgba(211,84,0,0.06)' }}>
          <div style={{ color: '#d35400', fontWeight: 700 }}>Faturamento do Ano</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>R$ {somaFaturamento('ano').toLocaleString('pt-BR', {minimumFractionDigits:2})}</div>
        </div>
      </div>

      {/* Gastos Fixos */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 32, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 180, background: '#ffe0b2', borderRadius: 12, padding: 18, textAlign: 'center', boxShadow: '0 2px 8px rgba(211,84,0,0.06)' }}>
          <div style={{ color: '#b94a00', fontWeight: 700 }}>Gasto com Funcionários</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>R$ {gastos.funcionarios.toLocaleString('pt-BR', {minimumFractionDigits:2})}</div>
        </div>
        <div style={{ flex: 1, minWidth: 180, background: '#ffe0b2', borderRadius: 12, padding: 18, textAlign: 'center', boxShadow: '0 2px 8px rgba(211,84,0,0.06)' }}>
          <div style={{ color: '#b94a00', fontWeight: 700 }}>Gasto com Materiais</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>R$ {gastos.materiais.toLocaleString('pt-BR', {minimumFractionDigits:2})}</div>
        </div>
        <div style={{ flex: 1, minWidth: 180, background: '#ffe0b2', borderRadius: 12, padding: 18, textAlign: 'center', boxShadow: '0 2px 8px rgba(211,84,0,0.06)' }}>
          <div style={{ color: '#b94a00', fontWeight: 700 }}>Aluguel</div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>R$ {gastos.aluguel.toLocaleString('pt-BR', {minimumFractionDigits:2})}</div>
        </div>
      </div>

  {/* Fluxo de Caixa removido: só mostrar dados reais do histórico */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'space-between' }}>
        <div style={{ flex: 1, minWidth: 320, background: '#fff7ec', borderRadius: 12, padding: 24 }}>
          <h3>Sabores Mais Pedidos</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={saboresMaisPedidos}>
              <XAxis dataKey="nome" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="pedidos" fill="#d35400" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: 1, minWidth: 320, background: '#fff7ec', borderRadius: 12, padding: 24 }}>
          <h3>Bairros com Mais Pedidos</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={bairrosMaisPedidos} dataKey="pedidos" nameKey="bairro" cx="50%" cy="50%" outerRadius={80} label>
                {bairrosMaisPedidos.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: 1, minWidth: 320, background: '#fff7ec', borderRadius: 12, padding: 24 }}>
          <h3>Tempo Médio de Entrega</h3>
          <div style={{ fontSize: 48, fontWeight: 700, color: '#d35400', marginTop: 48, textAlign: 'center' }}>
            {tempoEntrega[0].minutos} min
          </div>
          <div style={{ color: '#888', textAlign: 'center', marginTop: 8 }}>Baseado nos últimos 30 dias</div>
        </div>
      </div>
    </div>
  );
}
