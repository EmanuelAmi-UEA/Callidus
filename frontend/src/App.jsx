import React, { useEffect, useState } from "react";
import { CartProvider } from "./context/CarrinhoContext";
import Navegacao from "./components/Navegacao";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";
import Topo from "./components/Topo";
import Frontend from "./components/Frontend";
import Programacao from "./components/Programacao";
import Catalogo from "./components/Catalogo";
import Design from "./components/Design";
import NotFound from "./components/NotFound";
import Rodape from "./components/Rodape";
import axios from "axios";
import { Route, Routes, useParams } from "react-router-dom";
import Home from "./components/Home";
import Livro from "./components/Livro";
import Pagamento from "./components/Pagamento";
import CarrinhoPage from "./components/CarrinhoPage";

const LivroRouteHandler = ({ livros }) => {
  const { livroSlug } = useParams();
  const livro = livros.find(l => l.slug === livroSlug);

  if (!livro) return <NotFound />;

  return <Livro livros={livro} />;
};



const App = () => {
  const [livros, setLivros] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const carregarLivros = async () => {
      try {
        const response = await axios.get("/api/todosOsLivros.json");
        setLivros(response.data);
      } catch (error) {
        console.error("Erro ao carregar livros:", error);
        setError("Falha ao carregar os livros. Tente novamente mais tarde!");
      }
    };
    carregarLivros();
  }, []);

  return (
    <CartProvider>
      <Topo />
      <main className="principal">
        {error && <p className="erro">{error}</p>}
        <Routes>
          <Route path="/" element={<Home livros={livros} />} />
          <Route path="/frontend" element={<Frontend livros={livros} />} />
          <Route path="/design" element={<Design livros={livros} />} />
          <Route path="/catalogo" element={<Catalogo livros={livros} />} />
          <Route path="/programacao" element={<Programacao livros={livros} />} />
          <Route path="/livro/:livroSlug" element={<LivroRouteHandler livros={livros} />} />
          <Route path="/notfound" element={<NotFound />} />
          <Route path="/pagamento" element={<Pagamento />} />
          <Route path="/carrinhopage" element={<CarrinhoPage />} />
        </Routes>
      </main>
      <Rodape />
      <ToastContainer autoClose={2000} />
    </CartProvider>
  );
};

export default App;