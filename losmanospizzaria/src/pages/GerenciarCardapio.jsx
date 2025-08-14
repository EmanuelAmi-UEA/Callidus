import React, { useEffect, useState } from 'react';
import '../css/gerCardapio.css';
import { DataGrid } from '@mui/x-data-grid';
import pizzasData from '../data/pizzas.json';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

const API_URL = "http://localhost:5000/pizzas";

const columns = [
  { field: 'nome', headerName: 'Nome', flex: 1 },
  { field: 'preco', headerName: 'Preço (R$)', flex: 1, type: 'number' },
  {
    field: 'actions',
    headerName: 'Ações',
    flex: 1,
    sortable: false,
    renderCell: (params) => params.value,
  },
];

export default function GerenciarCardapio() {
  const [pizzas, setPizzas] = useState([]);
  const [editPizza, setEditPizza] = useState(null);
  const [editValues, setEditValues] = useState({ nome: '', preco: '', descricao: '', ingredientes: '' });

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setPizzas(data))
      .catch(() => setPizzas([]));
  }, []);

  // Remover pizza e registrar no histórico
  const handleRemove = async (id) => {
    const pizza = pizzas.find(p => p.id === id);
    if (pizza) {
      // Tenta buscar no histórico
      const res = await fetch(`http://localhost:5000/pizzasHistorico/${id}`);
      if (res.ok) {
        // Já existe, atualiza
        await fetch(`http://localhost:5000/pizzasHistorico/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pizza)
        });
      } else {
        // Não existe, cria
        await fetch(`http://localhost:5000/pizzasHistorico`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pizza)
        });
      }
    }
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setPizzas(pizzas.filter(p => p.id !== id));
  };
  // Restaurar pizza do histórico para o cardápio
  const handleRestore = async (pizza) => {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pizza)
    });
    setPizzas([...pizzas, pizza]);
  };
  // Histórico de pizzas
  const [historico, setHistorico] = useState([]);
  useEffect(() => {
    fetch('http://localhost:5000/pizzasHistorico')
      .then(res => res.json())
      .then(data => setHistorico(data))
      .catch(() => setHistorico([]));
  }, [pizzas]);

  // Pizzas do histórico que não estão no cardápio atual
  const pizzasRestauraveis = historico.filter(h => !pizzas.some(p => p.id === h.id));

  // Interface para restaurar pizzas do histórico
  const renderHistorico = () => (
    <div style={{marginTop:32}}>
      <h3>Pizzas Removidas / Histórico</h3>
      {pizzasRestauraveis.length === 0 && <p>Nenhuma pizza removida disponível para restaurar.</p>}
      <ul style={{listStyle:'none', padding:0}}>
        {pizzasRestauraveis.map(pizza => (
          <li key={pizza.id} style={{marginBottom:12, background:'#f8f8f8', borderRadius:8, padding:12, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <span><b>{pizza.nome}</b> — R$ {Number(pizza.preco).toFixed(2)}</span>
            <button className="gercardapio-btn" onClick={() => handleRestore(pizza)}>Restaurar</button>
          </li>
        ))}
      </ul>
    </div>
  );

  const handleEditOpen = (pizza) => {
    setEditPizza(pizza);
    setEditValues({
      nome: pizza.nome,
      preco: pizza.preco,
      descricao: pizza.descricao,
      ingredientes: pizza.ingredientes.join(', ')
    });
  };

  const handleEditClose = () => {
    setEditPizza(null);
  };

  const handleEditSave = async () => {
    const updatedPizza = {
      ...editPizza,
      ...editValues,
      preco: Number(editValues.preco),
      ingredientes: editValues.ingredientes.split(',').map(i => i.trim())
    };
    await fetch(`${API_URL}/${editPizza.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPizza)
    });
    setPizzas(pizzas.map(p => p.id === editPizza.id ? updatedPizza : p));
    setEditPizza(null);
  };

  const handleEditChange = (e) => {
    setEditValues({ ...editValues, [e.target.name]: e.target.value });
  };

  const rows = pizzas.map(pizza => ({
    ...pizza,
    actions: (
      <>
        <button className="gercardapio-btn" onClick={() => handleEditOpen(pizza)}>Editar</button>
        <button className="gercardapio-btn" style={{background: 'linear-gradient(90deg, #e74c3c 0%, #f39c12 100%)'}} onClick={() => handleRemove(pizza.id)}>Remover</button>
      </>
    ),
  }));

  return (
    <div className="gercardapio-container">
      <h2 className="gercardapio-title">Gerenciar Cardápio</h2>
      <div style={{ width: '100%', minHeight: 400 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={8}
          rowsPerPageOptions={[8]}
          disableSelectionOnClick
          autoHeight
          sx={{
            width: '100%',
            '& .MuiDataGrid-root': { border: 'none' },
            '& .MuiDataGrid-cell': { fontSize: '1rem' },
            '& .MuiDataGrid-columnHeaders': { background: '#f8f8f8', fontWeight: 700 },
            '& .MuiDataGrid-footerContainer': { background: '#fafafa' },
          }}
        />
      </div>
      {renderHistorico()}
      <Dialog open={!!editPizza} onClose={handleEditClose}>
        <DialogTitle>Editar Pizza</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nome"
            name="nome"
            value={editValues.nome}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Preço"
            name="preco"
            type="number"
            value={editValues.preco}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Descrição"
            name="descricao"
            value={editValues.descricao}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Ingredientes (separados por vírgula)"
            name="ingredientes"
            value={editValues.ingredientes}
            onChange={handleEditChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancelar</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">Salvar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
