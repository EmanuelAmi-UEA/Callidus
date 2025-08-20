import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

import Home from '../pages/Home';
import Cardapio from '../pages/Cardapio';
import Carrinho from '../pages/Carrinho';
import Pagamento from '../pages/Pagamento';
import Login from '../pages/Login';
import Cozinha from '../pages/Cozinha';
import Admin from '../pages/Admin';
import Entregas from '../pages/Entregas';
import NotFound from '../pages/NotFound';
import GerenciarFuncionarios from '../pages/GerenciarFuncionarios';
import ComboDetalhe from '../pages/ComboDetalhe';

const AppRoutes = () => {
	const { usuario } = useAuth();
	const isAdmin = usuario && usuario.email === 'admin@pizzaria.com';

	return (
		<Routes>
			{/* Landing page de promoções */}
			<Route path="/" element={<Home />} />
			<Route path="/home" element={<Home />} />
			<Route path="/cardapio" element={<Cardapio />} />
			<Route path="/carrinho" element={<Carrinho />} />
			<Route path="/pagamento" element={<Pagamento />} />

			{/* Login para admin */}
			<Route path="/login" element={<Login />} />

			{/* Rotas protegidas para admin */}
			<Route path="/cozinha" element={
				<ProtectedRoute>
					{isAdmin ? <Cozinha /> : <Navigate to="/login" />}
				</ProtectedRoute>
			} />
			<Route path="/admin" element={
				<ProtectedRoute>
					{isAdmin ? <Admin /> : <Navigate to="/login" />}
				</ProtectedRoute>
			} />
			<Route path="/admin/gerenciar-funcionarios" element={
				<ProtectedRoute>
					{isAdmin ? <GerenciarFuncionarios /> : <Navigate to="/login" />}
				</ProtectedRoute>
			} />
			<Route path="/entregas" element={
				<ProtectedRoute>
					{isAdmin ? <Entregas /> : <Navigate to="/login" />}
				</ProtectedRoute>
			} />
			<Route path="/combo/:id" element={<ComboDetalhe />} />

			{/* Página não encontrada */}
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
};

export default AppRoutes;
