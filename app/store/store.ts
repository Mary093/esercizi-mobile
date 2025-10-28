import { configureStore, combineReducers } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import cartReducer from "./cartSlice";

// 1. Configurazione di Redux Persist (Persisti il carrello in locale)
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["cart"], // Solo il reducer 'cart' verrà persistito
};

// Crea un rootReducer con tutti i tuoi slice
const rootReducer = {
  cart: cartReducer,
  // Aggiungi qui altri slice (es. authReducer, userReducer...)
};

// Applica persistReducer ai reducer combinati
const persistedReducer = persistReducer(
  persistConfig,
  combineReducers(rootReducer)
);

// 2. Configurazione dello Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Necessario per ignorare gli errori di serializzazione con redux-persist
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// 3. Persistore
export const persistor = persistStore(store);

// 4. Tipi e Hooks personalizzati per TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Usa questi hook al posto di `useDispatch` e `useSelector` standard
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
