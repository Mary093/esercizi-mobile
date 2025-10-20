import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { Offerta } from './offerte';

// === 1. TIPIZZAZIONE DEL CARRELLO E PRODOTTI ===

// Tipo generico per un articolo nel carrello (può essere una pizza, un'offerta, ecc.)
export type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    isOffer: boolean; // Flag per identificare se è un'offerta
    // Potresti voler includere qui tutti i dettagli dell'offerta se è un'offerta
};

// Definisce lo stato del Context
export type CartContextType = {
    items: CartItem[]; // Lista degli articoli nel carrello
    total: number; // Totale calcolato del carrello
    offer: Offerta | null; // L'offerta speciale attualmente selezionata (Max 1)
    addToCart: (item: Omit<CartItem, 'quantity' | 'isOffer'> & { isOffer?: boolean }) => void;
    setOffer: (offerta: Offerta | null) => void; // Funzione per impostare l'offerta
    // Aggiungeremo altre funzioni come removeFromCart, clearCart, ecc.
};

// Stato iniziale
const initialCartContext: CartContextType = {
    items: [],
    total: 0,
    offer: null,
    addToCart: () => console.warn('addToCart non implementato'),
    setOffer: () => console.warn('setOffer non implementato'),
};

// === 2. CREAZIONE DEL CONTEXT ===
const CartContext = createContext<CartContextType>(initialCartContext);

// Hook per usare il Context
export const useCart = () => useContext(CartContext);

// === 3. PROVIDER DEL CONTEXT ===
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Stato del carrello: per semplicità usiamo useState, potremmo usare useReducer in futuro
    const [items, setItems] = useState<CartItem[]>([]);
    const [offer, setOffer] = useState<Offerta | null>(null);

    // Funzione per aggiungere un articolo generico al carrello
    const addToCart = (item: Omit<CartItem, 'quantity' | 'isOffer'> & { isOffer?: boolean }) => {
        // Logica semplificata: se l'oggetto ha un flag 'isOffer', si usa setOffer
        if (item.isOffer) {
            // Dovresti mappare l'item a un tipo Offerta, ma per ora lo ignoriamo.
            // L'importante è che ora usiamo la funzione setOffer per le offerte.
            console.warn("Usa setOffer() per le offerte speciali. Funzione addToCart ignorata per l'offerta.");
            return;
        }

        setItems(prevItems => {
            const existingItem = prevItems.find(i => i.id === item.id);
            if (existingItem) {
                // Se l'articolo esiste, aumenta la quantità
                return prevItems.map(i =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            // Altrimenti, aggiungi il nuovo articolo
            return [...prevItems, { ...item, quantity: 1, isOffer: false }];
        });
    };

    // Funzione per impostare (o rimuovere se null) l'offerta speciale
    const handleSetOffer = (offerta: Offerta | null) => {
        setOffer(offerta);
        console.log('Offerta impostata nel carrello:', offerta?.titolo);
    };


    // Calcolo del totale (memorizzato con useMemo per ottimizzazione)
    const total = useMemo(() => {
        let itemsTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        
        // Aggiungere l'offerta al totale se l'offerta ha un costo
        if (offer && offer.prezzoScontato > 0) {
            itemsTotal += offer.prezzoScontato;
        }
        
        return itemsTotal;
    }, [items, offer]);

    // Oggetto del Context fornito
    const contextValue = useMemo(() => ({
        items,
        total,
        offer,
        addToCart,
        setOffer: handleSetOffer,
    }), [items, total, offer]);

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};
