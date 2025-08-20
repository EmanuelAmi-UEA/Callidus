const API_URL = "http://localhost:5000";

export const getPizzas = async () => {
  const res = await fetch(`${API_URL}/pizzas`);
  return res.json();
};

export const postPedido = async (pedido) => {
  const res = await fetch(`${API_URL}/pedidos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pedido)
  });
  return res.json();
};

export const getPedidos = async () => {
  const res = await fetch(`${API_URL}/pedidos`);
  return res.json();
};

export const putPedido = async (id, dados) => {
  const res = await fetch(`${API_URL}/pedidos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  });
  return res.json();
};

export const postPizza = async (pizza) => {
  const res = await fetch(`${API_URL}/pizzas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pizza)
  });
  return res.json();
};

export const putPizza = async (id, pizza) => {
  const res = await fetch(`${API_URL}/pizzas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pizza)
  });
  return res.json();
};

export const deletePizza = async (id) => {
  await fetch(`${API_URL}/pizzas/${id}`, { method: "DELETE" });
};

// Combos
export const getCombos = async () => {
  const res = await fetch(`${API_URL}/combos`);
  if(!res.ok) throw new Error('Falha ao carregar combos');
  return res.json();
};

export const getCombo = async (id) => {
  const res = await fetch(`${API_URL}/combos/${id}`);
  if(res.status === 404) return null; // combo não encontrado
  if(!res.ok) throw new Error('Falha ao carregar combo');
  return res.json();
};

// Mesas
export const getMesas = async () => {
  const res = await fetch(`${API_URL}/mesas`);
  if(!res.ok) throw new Error('Falha ao carregar mesas');
  return res.json();
};
