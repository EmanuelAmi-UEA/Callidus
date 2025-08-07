import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams,
  useLocation
} from "react-router-dom";
import TabelaLivros from "./components/TabelaLivros";
import CadastrarLivros from "./components/CadastrarLivros";
import SplashScreen from "./screen/SplashScreen";
import Header from "./components/Header";
import Login from "./login/Login";
import AuthProvider from "./context/AuthContext";
import PrivateRoute from "./route/PrivateRoute";
import "./App.css";

// --- Componente principal ---
const App = () => {
  const [livros, setLivros] = useState([
    { id: 1, isbn: "978-85-7522-403-8", titulo: "HTML5 - 2ª Edição", autor: "Maurício Samy Silva" },
    { id: 2, isbn: "978-85-7522-807-4", titulo: "Introdução ao Pentest", autor: "Daniel Moreno" },
    { id: 3, isbn: "978-85-7522-780-8", titulo: "Internet das Coisas", autor: "Ricardo Ogliari" }
  ]);

  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setCarregando(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const inserirLivro = (livro) => {
    livro.id = livros.length + 1;
    setLivros((prev) => [...prev, livro]);
  };

  const editarLivro = (livro) => {
    const atualizados = livros.map((p) => (p.id === livro.id ? livro : p));
    setLivros(atualizados);
  };

  const removerLivro = (livro) => {
    if (window.confirm("Remover esse livro?")) {
      setLivros((prev) => prev.filter((p) => p.isbn !== livro.isbn));
    }
  };

  if (carregando) return <SplashScreen />;

  return (
    <Router>
      <AuthProvider>
        <AppLayout
          livros={livros}
          inserirLivro={inserirLivro}
          editarLivro={editarLivro}
          removerLivro={removerLivro}
        />
      </AuthProvider>
    </Router>
  );
};

// --- Layout com rotas protegidas e header ---
const AppLayout = ({ livros, inserirLivro, editarLivro, removerLivro }) => {
  const location = useLocation();
  const mostrarHeader = location.pathname !== "/login";

  return (
    <>
      {mostrarHeader && <Header />}
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Grupo de rotas protegidas */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<TabelaLivros livros={livros} removerLivro={removerLivro} />} />
          <Route
            path="/cadastrar"
            element={
              <CadastrarLivros
                inserirLivro={inserirLivro}
                livro={{ id: 0, isbn: "", titulo: "", autor: "" }}
              />
            }
          />
          <Route
            path="/editar/:isbnLivro"
            element={
              <CadastrarLivrosWrapper livros={livros} editarLivro={editarLivro} />
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

// --- Wrapper para edição ---
const CadastrarLivrosWrapper = ({ livros, editarLivro }) => {
  const { isbnLivro } = useParams();
  const navigate = useNavigate();
  const livro = livros.find((livro) => livro.isbn === isbnLivro);

  if (!livro) {
    navigate("/");
    return null;
  }

  return <CadastrarLivros livro={livro} editarLivro={editarLivro} />;
};

// --- Página de não encontrado ---
const NotFound = () => (
  <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <h2>404 - Página não encontrada</h2>
    <p>A página que você procura não existe.</p>
  </div>
);

export default App;