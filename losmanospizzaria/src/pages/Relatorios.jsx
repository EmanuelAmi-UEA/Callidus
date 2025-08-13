import React, { useState } from 'react';
import financeiro from '../data/financeiro.json';
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
  const [pedidos, setPedidos] = useState([]);
  const { faturamento, gastos, fluxoCaixa } = financeiro;
  React.useEffect(() => {
    fetch('http://localhost:3001/pedidos')
      .then(res => res.json())
      .then(data => setPedidos(data));
  }, []);
  // Dashboard Resumido
  const pedidosPeriodo = pedidos.length;
  const totalFaturado = pedidos.reduce((acc, p) => acc + (p.total || 0), 0);
  const ticketMedio = pedidosPeriodo ? (totalFaturado / pedidosPeriodo) : 0;
  const lucroLiquido = totalFaturado - (gastos.funcionarios + gastos.materiais + gastos.aluguel);
  // Lucro líquido por dia (mock)
  const lucroPorDia = fluxoCaixa.map(f => ({ data: f.data, lucro: f.entrada - f.saida }));
  // Pedidos por horário (mock)
  const pedidosPorHora = Array.from({length: 24}, (_,h) => ({ hora: `${h}h`, pedidos: pedidos.filter(p => new Date(p.dataHora).getHours() === h).length }));
  // Comparativo de períodos (mock)
  const comparativo = [
    { periodo: 'Este mês', valor: faturamento.mes },
    { periodo: 'Mês anterior', valor: 18000 }
  ];
  // Alertas visuais
  const alertaFaturamento = faturamento.mes < comparativo[1].valor;
  const alertaGastos = gastos.materiais > 4000;
  // Sabores mais pedidos
  const saboresMaisPedidos = Array.from(
    pedidos.flatMap(p => p.itens).reduce((map, i) => map.set(i.nome, (map.get(i.nome)||0)+i.quantidade), new Map()),
    ([nome, pedidos]) => ({ nome, pedidos })
  ).sort((a,b)=>b.pedidos-a.pedidos).slice(0,5);
  // Bairros mais pedidos (mock: não há bairro no pedido, mas pode ser adicionado)
  const bairrosMaisPedidos = [];
  // Tempo médio de entrega (mock)
  const tempoEntrega = [{ nome: 'Tempo Médio', minutos: 38 }];
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', background: '#fff', borderRadius: 18, boxShadow: '0 6px 32px rgba(211,84,0,0.10)', padding: 32 }}>
      <h2 style={{ color: '#d35400', marginBottom: 32 }}>Relatórios e Estatísticas</h2>

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
        <div style={{ flex: 1, minWidth: 180, background: '#eafaf1', borderRadius: 12, padding: 18, textAlign: 'center', boxShadow: '0 2px 8px rgba(39,174,96,0.10)' }}>
          <div style={{ color: '#27ae60', fontWeight: 700 }}>Lucro Líquido</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: lucroLiquido < 0 ? '#e74c3c' : '#27ae60' }}>R$ {lucroLiquido.toLocaleString('pt-BR', {minimumFractionDigits:2})}</div>
        </div>
      </div>

      {/* Gráfico de Lucro Líquido */}
      <div style={{ background: '#f8f8f8', borderRadius: 12, padding: 24, marginBottom: 32 }}>
        <h3 style={{ color: '#27ae60', marginBottom: 16 }}>Lucro Líquido (últimos 7 dias)</h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={lucroPorDia} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="lucro" stroke="#27ae60" fill="#eafaf1" name="Lucro Líquido" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Pedidos por Horário */}
      <div style={{ background: '#fff7ec', borderRadius: 12, padding: 24, marginBottom: 32 }}>
        <h3 style={{ color: '#d35400', marginBottom: 16 }}>Pedidos por Horário</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={pedidosPorHora} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="hora" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="pedidos" fill="#d35400" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Comparativo de Períodos */}
      <div style={{ background: '#f8f8f8', borderRadius: 12, padding: 24, marginBottom: 32 }}>
        <h3 style={{ color: '#d35400', marginBottom: 16 }}>Comparativo de Faturamento</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={comparativo} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="periodo" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="valor" fill={alertaFaturamento ? '#e74c3c' : '#27ae60'} />
          </BarChart>
        </ResponsiveContainer>
        {alertaFaturamento && (
          <div style={{ color: '#e74c3c', fontWeight: 600, marginTop: 8 }}>
            Alerta: O faturamento deste mês está menor que o mês anterior!
          </div>
        )}
      </div>

      {/* Alertas Visuais de Gastos */}
      {alertaGastos && (
        <div style={{ color: '#e74c3c', fontWeight: 600, marginBottom: 24 }}>
          Alerta: O gasto com materiais está acima do esperado!
        </div>
      )}

      {/* Cards de Faturamento */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 32, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 180, background: '#fff7ec', borderRadius: 12, padding: 18, textAlign: 'center', boxShadow: '0 2px 8px rgba(211,84,0,0.06)' }}>
          <div style={{ color: '#d35400', fontWeight: 700 }}>Faturamento do Dia</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>R$ {faturamento.dia.toLocaleString('pt-BR', {minimumFractionDigits:2})}</div>
        </div>
        <div style={{ flex: 1, minWidth: 180, background: '#fff7ec', borderRadius: 12, padding: 18, textAlign: 'center', boxShadow: '0 2px 8px rgba(211,84,0,0.06)' }}>
          <div style={{ color: '#d35400', fontWeight: 700 }}>Faturamento da Semana</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>R$ {faturamento.semana.toLocaleString('pt-BR', {minimumFractionDigits:2})}</div>
        </div>
        <div style={{ flex: 1, minWidth: 180, background: '#fff7ec', borderRadius: 12, padding: 18, textAlign: 'center', boxShadow: '0 2px 8px rgba(211,84,0,0.06)' }}>
          <div style={{ color: '#d35400', fontWeight: 700 }}>Faturamento do Mês</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>R$ {faturamento.mes.toLocaleString('pt-BR', {minimumFractionDigits:2})}</div>
        </div>
        <div style={{ flex: 1, minWidth: 180, background: '#fff7ec', borderRadius: 12, padding: 18, textAlign: 'center', boxShadow: '0 2px 8px rgba(211,84,0,0.06)' }}>
          <div style={{ color: '#d35400', fontWeight: 700 }}>Faturamento do Ano</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>R$ {faturamento.ano.toLocaleString('pt-BR', {minimumFractionDigits:2})}</div>
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

      {/* Fluxo de Caixa */}
      <div style={{ background: '#fff7ec', borderRadius: 12, padding: 24, marginBottom: 32 }}>
        <h3 style={{ color: '#d35400', marginBottom: 16 }}>Fluxo de Caixa (últimos 7 dias)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={fluxoCaixa} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="data" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="entrada" stroke="#27ae60" strokeWidth={3} name="Entradas" />
            <Line type="monotone" dataKey="saida" stroke="#e74c3c" strokeWidth={3} name="Saídas" />
          </LineChart>
        </ResponsiveContainer>
      </div>
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
