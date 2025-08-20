import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

const API_URL = "http://localhost:5000/funcionarios";
const funcoes = ["Motoboy", "Cozinheiro", "Garçom", "Admin"];

export default function GerenciarFuncionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [editFuncionario, setEditFuncionario] = useState(null);
  const [editValues, setEditValues] = useState({ nome: '', funcao: '', salario: '' });
  const [openNovo, setOpenNovo] = useState(false);
  const [novoFuncionario, setNovoFuncionario] = useState({ nome: '', funcao: '', salario: '' });

  // Carregar funcionários do backend
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setFuncionarios(data))
      .catch(() => setFuncionarios([]));
  }, []);

  // Remover funcionário
  const handleRemove = async (id) => {
    await fetch(`${API_URL}/${Number(id)}`, { method: "DELETE" });
    // Recarrega lista do backend para garantir consistência
    const res = await fetch(API_URL);
    const data = await res.json();
    setFuncionarios(data);
  };

  // Abrir modal de edição
  const handleEditOpen = (func) => {
    setEditFuncionario(func);
    setEditValues({ nome: func.nome, funcao: func.funcao, salario: func.salario });
  };
  const handleEditClose = () => setEditFuncionario(null);

  // Salvar edição
  const handleEditSave = async () => {
    // Garante que o id nunca seja alterado e seja numérico
    const updatedFuncionario = {
      ...editFuncionario,
      ...editValues,
      id: Number(editFuncionario.id),
      salario: Number(editValues.salario)
    };
    try {
      const resp = await fetch(`${API_URL}/${updatedFuncionario.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFuncionario)
      });
      if (!resp.ok) throw new Error('Falha ao atualizar funcionário');
  const data = await resp.json();
  // Após salvar, recarrega a lista do backend para garantir atualização instantânea
  const res = await fetch(API_URL);
  const lista = await res.json();
  setFuncionarios(lista);
    } catch (e) {
      // Fallback: recarrega lista do backend
      alert('Erro ao atualizar funcionário. Recarregando lista.');
      const res = await fetch(API_URL);
      const data = await res.json();
      setFuncionarios(data);
    }
    setEditFuncionario(null);
  };
  const handleEditChange = (e) => setEditValues({ ...editValues, [e.target.name]: e.target.value });

  // Adicionar novo funcionário
  const handleNovoOpen = () => setOpenNovo(true);
  const handleNovoClose = () => { setOpenNovo(false); setNovoFuncionario({ nome: '', funcao: '', salario: '' }); };
  const handleNovoChange = (e) => setNovoFuncionario({ ...novoFuncionario, [e.target.name]: e.target.value });
  const handleNovoSave = async () => {
    const novo = { ...novoFuncionario, salario: Number(novoFuncionario.salario) };
    const resp = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novo)
    });
    const data = await resp.json();
    setFuncionarios([...funcionarios, data]);
    handleNovoClose();
  };

  return (
    <div className="gerfuncionarios-container" style={{maxWidth: 700, margin: '0 auto', background: '#fff', borderRadius: 18, boxShadow: '0 6px 32px rgba(39,174,96,0.10)', padding: 32}}>
      <h2 style={{ color: '#27ae60', marginBottom: 32 }}>Gerenciar Funcionários</h2>
      <Button variant="contained" color="primary" onClick={handleNovoOpen} style={{marginBottom: 24}}>Adicionar Funcionário</Button>
      <table style={{width:'100%', borderCollapse:'collapse'}}>
        <thead>
          <tr style={{background:'#eafaf1'}}>
            <th style={{padding:8, border:'1px solid #eee'}}>Nome</th>
            <th style={{padding:8, border:'1px solid #eee'}}>Função</th>
            <th style={{padding:8, border:'1px solid #eee'}}>Salário (R$)</th>
            <th style={{padding:8, border:'1px solid #eee'}}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {funcionarios.length === 0 && (
            <tr><td colSpan={4} style={{textAlign:'center', padding:16}}>Nenhum funcionário cadastrado.</td></tr>
          )}
          {funcionarios.map(func => (
            <tr key={func.id}>
              <td style={{padding:8, border:'1px solid #eee'}}>{func.nome}</td>
              <td style={{padding:8, border:'1px solid #eee'}}>{func.funcao}</td>
              <td style={{padding:8, border:'1px solid #eee'}}>R$ {Number(func.salario).toFixed(2)}</td>
              <td style={{padding:8, border:'1px solid #eee'}}>
                <Button size="small" variant="outlined" color="success" onClick={() => handleEditOpen(func)} style={{marginRight:8}}>Editar</Button>
                <Button size="small" variant="outlined" color="error" onClick={() => handleRemove(func.id)}>Excluir</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modal editar */}
      <Dialog open={!!editFuncionario} onClose={handleEditClose}>
        <DialogTitle>Editar Funcionário</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Nome" name="nome" value={editValues.nome} onChange={handleEditChange} fullWidth />
          <TextField margin="dense" label="Função" name="funcao" value={editValues.funcao} onChange={handleEditChange} select fullWidth SelectProps={{ native: true }}>
            <option value="">Selecione...</option>
            {funcoes.map(f => <option key={f} value={f}>{f}</option>)}
          </TextField>
          <TextField margin="dense" label="Salário" name="salario" type="number" value={editValues.salario} onChange={handleEditChange} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancelar</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">Salvar</Button>
        </DialogActions>
      </Dialog>
      {/* Modal novo */}
      <Dialog open={openNovo} onClose={handleNovoClose}>
        <DialogTitle>Novo Funcionário</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Nome" name="nome" value={novoFuncionario.nome} onChange={handleNovoChange} fullWidth />
          <TextField margin="dense" label="Função" name="funcao" value={novoFuncionario.funcao} onChange={handleNovoChange} select fullWidth SelectProps={{ native: true }}>
            <option value="">Selecione...</option>
            {funcoes.map(f => <option key={f} value={f}>{f}</option>)}
          </TextField>
          <TextField margin="dense" label="Salário" name="salario" type="number" value={novoFuncionario.salario} onChange={handleNovoChange} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNovoClose}>Cancelar</Button>
          <Button onClick={handleNovoSave} variant="contained" color="primary">Adicionar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
