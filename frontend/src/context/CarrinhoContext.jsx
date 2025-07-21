import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [estoque, setEstoque] = useState({});

    // Load estoque from JSON on mount
    useEffect(() => {
        axios.get('/api/estoque.json').then(res => {
            // Convert array to object for fast lookup
            const estoqueObj = {};
            res.data.forEach(item => {
                estoqueObj[item.id] = item.estoque;
            });
            setEstoque(estoqueObj);
        });
    }, []);

    // Add or increment book in cart, checking stock
    const adicionarAoCarrinho = (livro) => {
        setCartItems(oldItems => {
            const item = oldItems.find(i => i.id === livro.id);
            const maxEstoque = estoque[livro.id] || 0;
            if (item) {
                if (item.quantidade < maxEstoque) {
                    toast(`Mais uma unidade de "${livro.nome}" adicionada!`);
                    return oldItems.map(i =>
                        i.id === livro.id ? { ...i, quantidade: i.quantidade + 1 } : i
                    );
                } else {
                    toast('Estoque insuficiente!');
                    return oldItems;
                }
            } else {
                if (maxEstoque > 0) {
                    toast(`"${livro.nome}" foi adicionado ao carrinho!`);
                    return [...oldItems, { ...livro, quantidade: 1, estoque: maxEstoque }];
                } else {
                    toast('Produto sem estoque!');
                    return oldItems;
                }
            }
        });
    };

    const removerDoCarrinho = (livroId) => {
        setCartItems(oldItems => oldItems.filter(item => item.id !== livroId));
    };

    const incrementarQuantidade = (livroId) => {
        setCartItems(oldItems => oldItems.map(item => {
            if (item.id === livroId && item.quantidade < (estoque[livroId] || 0)) {
                return { ...item, quantidade: item.quantidade + 1 };
            }
            return item;
        }));
    };

    const decrementarQuantidade = (livroId) => {
        setCartItems(oldItems => oldItems
            .map(item =>
                item.id === livroId ? { ...item, quantidade: item.quantidade - 1 } : item
            )
            .filter(item => item.quantidade > 0)
        );
    };

    const value = {
        cartItems,
        adicionarAoCarrinho,
        removerDoCarrinho,
        incrementarQuantidade,
        decrementarQuantidade,
        estoque
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