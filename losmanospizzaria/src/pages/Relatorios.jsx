import React from 'react';
import financeiro from '../data/financeiro.json';
import { LineChart, Line } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
// Dados mockados para exemplo visual
const saboresMaisPedidos = [
  { nome: 'Calabresa', pedidos: 120 },
  { nome: 'Frango Catupiry', pedidos: 95 },
  { nome: 'Quatro Queijos', pedidos: 80 },
  { nome: 'Portuguesa', pedidos: 70 },
  { nome: 'Pepperoni', pedidos: 60 },
];
const bairrosMaisPedidos = [
  { bairro: 'Centro', pedidos: 110 },
  { bairro: 'Jardins', pedidos: 90 },
  { bairro: 'Vila Nova', pedidos: 75 },
  { bairro: 'Industrial', pedidos: 60 },
  { bairro: 'Parque Sul', pedidos: 55 },
];
const tempoEntrega = [
  { nome: 'Tempo Médio', minutos: 38 },
];
const COLORS = ['#d35400', '#f39c12', '#e67e22', '#f1c40f', '#ffe0b2'];

export default function Relatorios() {
  const { faturamento, gastos, fluxoCaixa } = financeiro;
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', background: '#fff', borderRadius: 18, boxShadow: '0 6px 32px rgba(211,84,0,0.10)', padding: 32 }}>
      <h2 style={{ color: '#d35400', marginBottom: 32 }}>Relatórios e Estatísticas</h2>

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
