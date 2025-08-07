import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditarLivro = ({ livros, atualizarLivro }) => {
  const { isbn } = useParams();
  const navigate = useNavigate();
  const livroOriginal = livros.find(l => l.isbn === isbn);

  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    if (livroOriginal) {
      setTitulo(livroOriginal.titulo);
      setAutor(livroOriginal.autor);
      setDescricao(livroOriginal.descricao || "");
    }
  }, [livroOriginal]);

  if (!livroOriginal) {
    return <div>Livro não encontrado.</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const livroEditado = {
      ...livroOriginal,
      titulo,
      autor,
      descricao,
    };
    if (typeof atualizarLivro === "function") {
      atualizarLivro(livroEditado);
    }
    navigate("/tabela-livros");
  };

  return (
    <div className="editar-livro-container" style={{ maxWidth: 500, margin: "40px auto", background: "#fff", padding: 32, borderRadius: 12 }}>
      <h2>Editar Livro</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="titulo">Título:</label>
          <input
            id="titulo"
            type="text"
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 16 }}
          />
        </div>
        <div>
          <label htmlFor="autor">Autor:</label>
          <input
            id="autor"
            type="text"
            value={autor}
            onChange={e => setAutor(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 16 }}
          />
        </div>
        <div>
          <label htmlFor="descricao">Descrição:</label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            rows={4}
            style={{ width: "100%", marginBottom: 16 }}
          />
        </div>
        <button type="submit" className="botao editar" style={{ background: "#1976d2", color: "#fff", padding: "8px 20px", borderRadius: 6 }}>
          Salvar Alterações
        </button>
      </form>
    </div>
  );
};

export default EditarLivro;