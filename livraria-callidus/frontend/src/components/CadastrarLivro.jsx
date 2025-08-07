import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const categorias = ["frontend", "design", "programacao"];

//Inicializa Formulario de Cadastro de Livro
const CadastrarLivro = ({ adicionarLivro }) => {
  const [form, setForm] = useState({
    isbn: "",
    titulo: "",
    autor: "",
    categoria: "",
    ano: "",
    paginas: "",
    preco: "",
    descricao: "",
    estoque: "" 
  });
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  // Manipula as mudanças no formulário
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Manipula o envio do formulário
  const handleSubmit = e => {
    e.preventDefault();
    if (
      !form.isbn ||
      !form.titulo ||
      !form.autor ||
      !form.categoria ||
      !form.ano ||
      !form.paginas ||
      !form.preco ||
      !form.descricao ||
      !form.estoque 
    ) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }
    adicionarLivro({
      ...form,
      id: form.isbn,
      slug: form.titulo.toLowerCase().replace(/\s+/g, "-")
    });
    toast.success("Livro cadastrado com sucesso!");
    navigate("/tabela-livros");
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", background: "#fff", padding: 32, borderRadius: 12 }}>
      <h2>Cadastrar Novo Livro</h2>
      {erro && <p style={{ color: "red" }}>{erro}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>ISBN:</label>
          <input name="isbn" value={form.isbn} onChange={handleChange} required />
        </div>
        <div>
          <label>Título:</label>
          <input name="titulo" value={form.titulo} onChange={handleChange} required />
        </div>
        <div>
          <label>Autor:</label>
          <input name="autor" value={form.autor} onChange={handleChange} required />
        </div>
        <div>
          <label>Categoria:</label>
          <select name="categoria" value={form.categoria} onChange={handleChange} required>
            <option value="">Selecione</option>
            {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div>
          <label>Ano de lançamento:</label>
          <input name="ano" type="number" min="0" value={form.ano} onChange={handleChange} required />
        </div>
        <div>
          <label>Número de páginas:</label>
          <input name="paginas" type="number" min="1" value={form.paginas} onChange={handleChange} required />
        </div>
        <div>
          <label>Preço:</label>
          <input name="preco" type="number" min="0" step="0.01" value={form.preco} onChange={handleChange} required />
        </div>
        <div>
          <label>Estoque:</label>
          <input name="estoque" type="number" min="0" step="1" value={form.estoque} onChange={handleChange} required />
        </div>
        <div>
          <label>Descrição:</label>
          <textarea name="descricao" value={form.descricao} onChange={handleChange} rows={3} required />
        </div>
        <button type="submit" style={{ background: "#1976d2", color: "#fff", padding: "8px 20px", borderRadius: 6, marginTop: 16 }}>
          Cadastrar
        </button>
      </form>
    </div>
  );
};

export default CadastrarLivro;