import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Tipizzazione minima per Offerta, necessaria per il carrello
export type Offerta = {
    id: string;
    titolo: string;
    prezzoScontato: number;
    descrizione: string;
};

export type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    isOffer: boolean;
};

export interface CartState {
    items: CartItem[];
    offer: Offerta | null;
    isSyncing: boolean;
    lastSync: number | null;
    syncError: string | null;
}

const initialState: CartState = {
    items: [],
    offer: null,
    isSyncing: false,
    lastSync: null,
    syncError: null,
};

// --- Funzione Mock Backend (Sincronizza con un mock backend) ---
const mockBackendSave = (state: CartState) => {
    return new Promise<{ message: string, serverState: CartState }>((resolve) => {
        setTimeout(() => {
            console.log("Mock Backend: Carrello salvato.");
            resolve({
                message: "Carrello sincronizzato con successo!",
                serverState: state,
            });
        }, 1000); // Ritardo simulato
    });
};

// --- Async Thunk per la Sincronizzazione ---
export const syncCart = createAsyncThunk(
    'cart/syncCart',
    async (cartState: CartState, { rejectWithValue }) => {
        try {
            const response = await mockBackendSave(cartState);
            return response;
        } catch (error) {
            return rejectWithValue("Errore di sincronizzazione con il backend mock.");
        }
    }
);

// --- Slice del Carrello (Implementa Redux Toolkit per il carrello) ---
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<Omit<CartItem, 'quantity' | 'isOffer'>>) => {
            const newItem = action.payload;
            const existingItem = state.items.find(item => item.id === newItem.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ ...newItem, quantity: 1, isOffer: false });
            }
        },
        setOffer: (state, action: PayloadAction<Offerta | null>) => {
            state.offer = action.payload;
        },
        removeItem: (state, action: PayloadAction<string>) => {
            const idToRemove = action.payload;
            const existingItem = state.items.find(item => item.id === idToRemove);
            if (existingItem && existingItem.quantity > 1) {
                existingItem.quantity -= 1;
            } else {
                state.items = state.items.filter(item => item.id !== idToRemove);
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.offer = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(syncCart.pending, (state) => {
                state.isSyncing = true;
                state.syncError = null;
            })
            .addCase(syncCart.fulfilled, (state) => {
                state.isSyncing = false;
                state.lastSync = Date.now();
            })
            .addCase(syncCart.rejected, (state, action) => {
                state.isSyncing = false;
                state.syncError = action.payload as string;
            });
    },
});

export const { addItem, setOffer, removeItem, clearCart } = cartSlice.actions;

// Selector per calcolare il totale
export const selectCartTotal = (state: CartState) => {
    let itemsTotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (state.offer && state.offer.prezzoScontato > 0) {
        itemsTotal += state.offer.prezzoScontato;
    }
    return itemsTotal;
};

export default cartSlice.reducer;