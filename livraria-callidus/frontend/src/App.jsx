import React, { useEffect, useState } from "react";
import { CartProvider } from "./context/CarrinhoContext";
import { useAuth } from "./context/AuthContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";
import Header from "./components/Header";
import Topo from "./components/Topo";
import Frontend from "./components/Frontend";
import Programacao from "./components/Programacao";
import Catalogo from "./components/Catalogo";
import Design from "./components/Design";
import NotFound from "./components/NotFound";
import Rodape from "./components/Rodape";
import axios from "axios";
import { Route, Routes, useNavigate, useLocation, useParams } from "react-router-dom";
import Home from "./components/Home";
import Livro from "./components/Livro";
import Pagamento from "./components/Pagamento";
import CarrinhoPage from "./components/CarrinhoPage";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import SplashScreen from "./components/SplashScreen";
import TabelaLivros from "./components/TabelaLivros";
import EditarLivro from "./components/EditarLivro";
import CadastrarLivro from "./components/CadastrarLivro";

const LivroRouteHandler = ({ livros }) => {
  const { livroSlug } = useParams();
  const livro = livros.find(l => l.slug === livroSlug);
  if (!livro) return <NotFound />;
  return <Livro livros={livro} />;
};

function AppContent() {
  const [livros, setLivros] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSplashAfterLogin, setShowSplashAfterLogin] = useState(false);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // SplashScreen inicial
  useEffect(() => {
    if (location.pathname === "/login") return;
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // SplashScreen após login
  useEffect(() => {
    if (isAuthenticated && showSplashAfterLogin) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
        setShowSplashAfterLogin(false);
        navigate("/");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, showSplashAfterLogin]);

  // Carrega livros apenas se autenticado
  useEffect(() => {
    if (!isAuthenticated) return;
    let isMounted = true;
    const carregarLivros = async () => {
      try {
        const response = await axios.get("/api/todosOsLivros.json");
        if (isMounted) setLivros(response.data);
      } catch (error) {
        if (isMounted) setError("Falha ao carregar os livros. Tente novamente mais tarde!");
      }
    };
    carregarLivros();
    return () => { isMounted = false; };
  }, [isAuthenticated]);

  // Atualiza livro editado
  const atualizarLivro = (livroEditado) => {
    setLivros(livros.map(l => l.isbn === livroEditado.isbn ? livroEditado : l));
  };

  // Remove livro da lista
  const removerLivro = (livroRemover) => {
    setLivros(livros.filter(l => l.isbn !== livroRemover.isbn));
  };

  // Adiciona novo livro
  const adicionarLivro = (novoLivro) => {
    setLivros([...livros, novoLivro]);
  };

  if (loading) return <SplashScreen />;

  return (
    <CartProvider>
      {isAuthenticated && <Header />}
      {isAuthenticated && <Topo />}
      <main className="principal">
        {error && <p className="erro">{error}</p>}
        <Routes>
          <Route path="/login" element={
            <Login
              onLoginSuccess={() => setShowSplashAfterLogin(true)}
            />
          } />
          {isAuthenticated && (
            <>
              <Route path="/" element={<Home livros={livros} />} />
              <Route path="/frontend" element={<Frontend livros={livros} />} />
              <Route path="/design" element={<Design livros={livros} />} />
              <Route path="/catalogo" element={<Catalogo livros={livros} />} />
              <Route path="/programacao" element={<Programacao livros={livros} />} />
              <Route path="/livro/:livroSlug" element={<LivroRouteHandler livros={livros} />} />
              <Route path="/notfound" element={<NotFound />} />
              <Route path="/pagamento" element={<Pagamento />} />
              <Route path="/carrinhopage" element={<CarrinhoPage />} />
              <Route element={<PrivateRoute />}>
                <Route path="/tabela-livros" element={<TabelaLivros livros={livros} removerLivro={removerLivro} />} />
                <Route path="/editar/:isbn" element={<EditarLivro livros={livros} atualizarLivro={atualizarLivro} />} />
                <Route path="/cadastrar" element={<CadastrarLivro adicionarLivro={adicionarLivro} />} />
              </Route>
            </>
          )}
        </Routes>
      </main>
      {isAuthenticated && <Rodape />}
      <ToastContainer autoClose={2000} />
    </CartProvider>
  );
}

export default AppContent;