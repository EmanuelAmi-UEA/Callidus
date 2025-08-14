
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

import GerenciarFuncionarios from '../pages/GerenciarFuncionarios';


const AppRoutes = () => {
	const { usuario } = useAuth();
	const isAdmin = usuario && usuario.email === 'admin@pizzaria.com';

	return (
		<Routes>
			{/* Rotas públicas para clientes */}
			<Route path="/" element={<Navigate to="/cardapio" />} />
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

			{/* Página não encontrada */}
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
};

export default AppRoutes;
