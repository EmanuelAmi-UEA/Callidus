import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { CartProvider } from './context/CarrinhoContext'
import { AuthProvider } from './context/AuthProvider'

import Header from './components/Header'

import Cardapio from './pages/Cardapio'
import PizzaCard from './components/PizzaCard'
import Carrinho from './pages/Carrinho'
import Login from './pages/Login'
import Admin from './pages/Admin'
import Cozinha from './pages/Cozinha'
import Entregas from './pages/Entregas'
import NotFound from './pages/NotFound'
import ProtectedRoute from './routes/ProtectedRoute'

import pizzasData from './data/pizzas.json'
import './css/App.css'

function App() {
  return (
    <CartProvider>
      <Router>
        <AuthProvider>
          <div className="App">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Cardapio pizzas={pizzasData.pizzas} />} />
                <Route path="/cardapio" element={<Cardapio pizzas={pizzasData.pizzas} />} />
                <Route path="/pizza/:id" element={<PizzaCard />} />
                <Route path="/carrinho" element={<Carrinho />} />
                <Route path="/login" element={<Login />} />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/cozinha" 
                  element={
                    <ProtectedRoute>
                      <Cozinha />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/entregas" 
                  element={
                    <ProtectedRoute>
                      <Entregas />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </div>
        </AuthProvider>
      </Router>
    </CartProvider>
  )
}

export default App
