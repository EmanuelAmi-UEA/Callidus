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
    setPizzas(pizzasData.pizzas.map(p => ({ ...p, id: p.id })));
  }, []);

  const handleRemove = (id) => {
    setPizzas(pizzas.filter(p => p.id !== id));
    // Aqui você pode adicionar lógica para remover do backend
  };

  const handleEditOpen = (pizza) => {
    setEditPizza(pizza);
    setEditValues({
      nome: pizza.nome,
      preco: pizza.preco,
      descricao: pizza.descricao,
      ingredientes: pizza.ingredientes.join(', '),
    });
  };

  const handleEditClose = () => {
    setEditPizza(null);
  };

  const handleEditSave = () => {
    setPizzas(pizzas.map(p =>
      p.id === editPizza.id
        ? { ...p, ...editValues, preco: Number(editValues.preco), ingredientes: editValues.ingredientes.split(',').map(i => i.trim()) }
        : p
    ));
    setEditPizza(null);
    // Aqui você pode adicionar lógica para salvar no backend
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
