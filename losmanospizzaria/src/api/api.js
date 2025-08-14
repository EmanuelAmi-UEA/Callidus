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
