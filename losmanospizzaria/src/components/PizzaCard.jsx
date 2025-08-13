import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import pizzasData from '../data/pizzas.json';


const TAMANHOS = [
	{ nome: 'Pequena', fator: 1, acrescimo: 0 },
	{ nome: 'Média', fator: 1.3, acrescimo: 8 },
	{ nome: 'Grande', fator: 1.6, acrescimo: 15 }
];

const BORDAS = [
	{ nome: 'Borda Recheada', preco: 5 },
	{ nome: 'Borda de Catupiry', preco: 6 },
	{ nome: 'Borda de Cheddar', preco: 6 }
];

const INGREDIENTES_EXTRAS = [
	{ nome: 'Bacon', preco: 4 },
	{ nome: 'Queijo', preco: 3 },
	{ nome: 'Calabresa', preco: 3 },
	{ nome: 'Milho', preco: 2 },
	{ nome: 'Cebola', preco: 2 }
];

const PizzaCard = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const pizza = pizzasData.pizzas.find(p => String(p.id) === String(id));

		const [tamanho, setTamanho] = useState(TAMANHOS[0]);
		const [borda, setBorda] = useState('');
		const [extras, setExtras] = useState({}); // { Bacon: 0, Queijo: 0, ... }

	if (!pizza) {
		return <div>Pizza não encontrada. <button onClick={() => navigate(-1)}>Voltar</button></div>;
	}


		const precoBase = pizza.preco * tamanho.fator + tamanho.acrescimo;
		const precoBorda = borda ? (BORDAS.find(b => b.nome === borda)?.preco || 0) : 0;
		const precoExtras = Object.entries(extras).reduce((acc, [nome, qtd]) => {
			const extra = INGREDIENTES_EXTRAS.find(e => e.nome === nome);
			return acc + (extra ? extra.preco * qtd : 0);
		}, 0);
		const precoTotal = precoBase + precoBorda + precoExtras;

		const handleBorda = (nome) => {
			setBorda(bordaAtual => bordaAtual === nome ? '' : nome);
		};

		const handleExtra = (nome, delta) => {
			setExtras(extras => {
				const atual = extras[nome] || 0;
				const novo = Math.max(0, atual + delta);
				return { ...extras, [nome]: novo };
			});
		};

	const adicionarAoCarrinho = () => {
		toast.success(`Pizza "${pizza.nome}" adicionada ao carrinho!`);
		// Aqui você pode integrar com o contexto/carrinho global se quiser
	};

		return (
			<div className="pizza-card-individual">
				   <img src={new URL(`../assets/imagens/${pizza.imagem}`, import.meta.url).href} alt={pizza.nome} className="pizza-img-grande" />
				<h2>{pizza.nome}</h2>
				<p>{pizza.descricao}</p>
				<p><strong>Ingredientes:</strong> {pizza.ingredientes.join(', ')}</p>

				<div style={{ margin: '20px 0' }}>
					<label><strong>Tamanho:</strong></label>
					<ul style={{ listStyle: 'none', padding: 0 }}>
						{TAMANHOS.map(t => (
							<li key={t.nome} style={{ margin: '8px 0' }}>
								<label>
									<input
										type="radio"
										name="tamanho"
										value={t.nome}
										checked={tamanho.nome === t.nome}
										onChange={() => setTamanho(t)}
									/>
									{t.nome} {t.acrescimo > 0 && `(+R$ ${t.acrescimo})`}
								</label>
							</li>
						))}
					</ul>
				</div>

				<div style={{ margin: '20px 0' }}>
					<label><strong>Recheio de Borda:</strong></label>
					<ul style={{ listStyle: 'none', padding: 0 }}>
						{BORDAS.map(b => (
							<li key={b.nome} style={{ margin: '8px 0' }}>
								<label>
									<input
										type="radio"
										name="borda"
										value={b.nome}
										checked={borda === b.nome}
										onChange={() => handleBorda(b.nome)}
									/>
									{b.nome} (+R$ {b.preco})
								</label>
							</li>
						))}
					</ul>
				</div>

				<div style={{ margin: '20px 0' }}>
					<label><strong>Ingredientes Adicionais:</strong></label>
					<ul style={{ listStyle: 'none', padding: 0 }}>
						{INGREDIENTES_EXTRAS.map(e => (
							<li key={e.nome} style={{ margin: '8px 0', display: 'flex', alignItems: 'center' }}>
								<span style={{ minWidth: 80 }}>{e.nome}</span>
								<button onClick={() => handleExtra(e.nome, -1)} disabled={!(extras[e.nome] > 0)} style={{ margin: '0 6px' }}>-</button>
								<span>{extras[e.nome] || 0}</span>
								<button onClick={() => handleExtra(e.nome, 1)} style={{ margin: '0 6px' }}>+</button>
								<span style={{ marginLeft: 8, color: '#888' }}>(+R$ {e.preco})</span>
							</li>
						))}
					</ul>
				</div>

				<h3>Preço: R$ {precoTotal.toFixed(2)}</h3>
				<button onClick={adicionarAoCarrinho}>Adicionar ao Carrinho</button>
				<button style={{marginLeft: 16}} onClick={() => navigate(-1)}>Voltar</button>
			</div>
		);
};

export default PizzaCard;