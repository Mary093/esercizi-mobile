import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Necessario per la persistenza

// === 1. TIPIZZAZIONE E STATO INIZIALE ===
// Definisce il tipo di utente
type User = { id: string; email: string }; 

// Definisce lo stato globale di autenticazione
type AuthState = { user: User | null; token: string | null; bootstrapped: boolean }; 

// Definisce le azioni possibili
type Action =
  | { type: 'LOGIN'; payload: { user: User; token: string } } 
  | { type: 'LOGOUT' } 
  | { type: 'BOOTSTRAP_DONE'; payload: { user: User | null; token: string | null } }; 

const initial: AuthState = { user: null, token: null, bootstrapped: false }; 

// === 2. REDUCER ===
function reducer(state: AuthState, action: Action): AuthState { 
  switch (action.type) {
    case 'LOGIN': 
        return { ...state, user: action.payload.user, token: action.payload.token }; 
    case 'LOGOUT': 
        return { ...state, user: null, token: null }; 
    case 'BOOTSTRAP_DONE': 
        // Imposta i dati da AsyncStorage e segna che il caricamento è completato
        return { user: action.payload.user, token: action.payload.token, bootstrapped: true }; 
    default:
        return state; 
  }
}

// === 3. CONTESTI ===
const AuthStateCtx = createContext<AuthState | undefined>(undefined); 
const AuthDispatchCtx = createContext<React.Dispatch<Action> | undefined>(undefined); 
// === 4. PROVIDER ===
export function AuthProvider({ children }: { children: React.ReactNode }) { 
  const [state, dispatch] = useReducer(reducer, initial); 

  // Bootstrap: carica la sessione da storage una volta all'avvio 
  useEffect(() => {
    (async () => {
      const [u, t] = await Promise.all([ // Legge i dati in parallelo 
        AsyncStorage.getItem('auth:user'), 
        AsyncStorage.getItem('auth:token'), 
      ]);

      const user = u ? (JSON.parse(u) as User) : null; // Parsa JSON user 
      const token = t ?? null; 

      // Notifica lo stato al reducer
      dispatch({ type: 'BOOTSTRAP_DONE', payload: { user, token } }); 
    })();
  }, []); // Esegue solo al montaggio iniziale 

  // useMemo per evitare re-render inutili dei consumer 
  const memoState = useMemo(() => state, [state]); 

  return (
    <AuthDispatchCtx.Provider value={dispatch}>
      <AuthStateCtx.Provider value={memoState}>{children}</AuthStateCtx.Provider>
    </AuthDispatchCtx.Provider>
  ); 
}

// === 5. HOOK useAuth PERSONALIZZATO ===
export function useAuth() { 
  const s = useContext(AuthStateCtx);
  const d = useContext(AuthDispatchCtx); 

  if (!s || !d) {
    // Emette un errore se l'hook non è usato all'interno del Provider
    throw new Error('useAuth deve essere usato dentro AuthProvider'); 
  }

  const isLoggedIn = !!s.token; // Deriva lo stato di login dal token

  // Funzione di Login (salva in AsyncStorage e aggiorna lo stato)
  const login = async (email: string, pwd: string) => { 
    // Simulazione di Login (in realtà qui faresti una fetch)
    const fakeUser: User = { id: '1', email }; // Definizione fakeUser
    const fakeToken: string = 'jwt-123'; 
    
    // Salva i dati in AsyncStorage in parallelo 
    await Promise.all([
      AsyncStorage.setItem('auth:user', JSON.stringify(fakeUser)), 
      AsyncStorage.setItem('auth:token', fakeToken), 
    ]);
    
    // Aggiorna lo stato globale
    d({ type: 'LOGIN', payload: { user: fakeUser, token: fakeToken } }); 
  };

  // Funzione di Logout (rimuove da AsyncStorage e aggiorna lo stato)
  const logout = async () => { 
    // Rimuove entrambi gli elementi da AsyncStorage in parallelo
    await Promise.all([AsyncStorage.removeItem('auth:user'), AsyncStorage.removeItem('auth:token')]); 
    
    // Aggiorna lo stato globale
    d({ type: 'LOGOUT' }); 
  };

  return { ...s, isLoggedIn, login, logout };
}