import React, { createContext, useState, useContext } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    
    const adicionarAoCarrinho = (pizzas) => {
        setCartItems(oldItems => {
            const item = oldItems.find(i => i.id === pizzas.id);
            if (item) {
                toast(`Mais uma unidade de "${pizzas.nome}" adicionada!`, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    type: "success",
                    theme: "colored",
                    className: "meu-toast-personalizado"
                });
                return oldItems.map(i =>
                    i.id === pizzas.id ? { ...i, quantidade: i.quantidade + 1 } : i
                );
            } else {
                toast(`"${pizzas.nome}" foi adicionado ao carrinho!`, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    type: "success",
                    theme: "colored",
                    className: "meu-toast-personalizado"
                });
                return [...oldItems, { ...pizzas, quantidade: 1 }];
            }
        });
    };

    const removerDoCarrinho = (pizzaId) => {
        setCartItems(oldItems => oldItems.filter(item => item.id !== pizzaId));
    };

    const incrementarQuantidade = (pizzaId) => {
        setCartItems(oldItems => oldItems.map(item => {
            if (item.id === pizzaId) {
                return { ...item, quantidade: item.quantidade + 1 };
            }
            return item;
        }));
    };

    const decrementarQuantidade = (pizzaId) => {
        setCartItems(oldItems => oldItems
            .map(item =>
                item.id === pizzaId ? { ...item, quantidade: item.quantidade - 1 } : item
            )
            .filter(item => item.quantidade > 0)
        );
    };

    const value = {
        cartItems,
        adicionarAoCarrinho,
        removerDoCarrinho,
        incrementarQuantidade,
        decrementarQuantidade
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart(){
    return useContext(CartContext);
}