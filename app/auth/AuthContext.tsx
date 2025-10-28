import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Necessario per la persistenza

// === 1. TIPIZZAZIONE E STATO INIZIALE ===
// Definisce il tipo di utente
type User = { id: string; email: string; userName: string | null };

// Definisce lo stato globale di autenticazione
type AuthState = {
  user: User | null;
  token: string | null;
  bootstrapped: boolean;
};

// Definisce le azioni possibili
type Action =
  | { type: "LOGIN"; payload: { user: User; token: string } }
  | { type: "LOGOUT" }
  | { type: "SET_USERNAME"; payload: { userName: string } } // Nuova Azione
  | {
      type: "BOOTSTRAP_DONE";
      payload: { user: User | null; token: string | null };
    };

const initial: AuthState = { user: null, token: null, bootstrapped: false };

// === 2. REDUCER ===
function reducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      };
    case "LOGOUT":
      return { ...state, user: null, token: null };
    case "SET_USERNAME": // Nuova logica per l'aggiornamento del nome utente
      if (!state.user) return state; // Non fa nulla se non è loggato
      return {
        ...state,
        user: { ...state.user, userName: action.payload.userName },
      };
    case "BOOTSTRAP_DONE":
      // Imposta i dati da AsyncStorage e segna che il caricamento è completato
      return {
        user: action.payload.user,
        token: action.payload.token,
        bootstrapped: true,
      };
    default:
      return state;
  }
}

// === 3. CONTEXT (Stato e Dispatch) ===
const AuthStateCtx = createContext<AuthState | null>(null);
const AuthDispatchCtx = createContext<React.Dispatch<Action> | null>(null);
// === 4. PROVIDER ===
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  // LOGICA DI CARICAMENTO (BOOTSTRAP) da AsyncStorage
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const [userJson, token] = await Promise.all([
          AsyncStorage.getItem("auth:user"),
          AsyncStorage.getItem("auth:token"),
        ]);

        const user: User | null = userJson ? JSON.parse(userJson) : null;

        dispatch({ type: "BOOTSTRAP_DONE", payload: { user, token } });
      } catch (e) {
        console.error("Errore nel caricamento dei dati di Auth:", e);
        dispatch({
          type: "BOOTSTRAP_DONE",
          payload: { user: null, token: null },
        });
      }
    };
    loadAuthData();
  }, []);

  return (
    <AuthStateCtx.Provider value={state}>
      <AuthDispatchCtx.Provider value={dispatch}>
        {children}
      </AuthDispatchCtx.Provider>
    </AuthStateCtx.Provider>
  ); 
}

// === 5. HOOK useAuth PERSONALIZZATO ===
export function useAuth() {
  const s = useContext(AuthStateCtx);
  const d = useContext(AuthDispatchCtx);

  if (!s || !d) {
    // Emette un errore se l'hook non è usato all'interno del Provider
    throw new Error("useAuth deve essere usato dentro AuthProvider");
  }

  const isLoggedIn = !!s.token; // Deriva lo stato di login dal token

  // Funzione di Login (salva in AsyncStorage e aggiorna lo stato)
  const login = async (email: string, pwd: string) => {
    // Simulazione di Login (in realtà qui faresti una fetch)
    const fakeUser: User = { id: "1", email, userName: 'Mario Rossi' }; // Definizione fakeUser
    const fakeToken: string = "jwt-123";

    // Salva i dati in AsyncStorage in parallelo
    await Promise.all([
      AsyncStorage.setItem("auth:user", JSON.stringify(fakeUser)),
      AsyncStorage.setItem("auth:token", fakeToken),
    ]);

    // Aggiorna lo stato globale
    d({ type: "LOGIN", payload: { user: fakeUser, token: fakeToken } });
  };

  // Funzione di Logout (rimuove da AsyncStorage e aggiorna lo stato)
  const logout = async () => {
    // Rimuove entrambi gli elementi da AsyncStorage in parallelo
    await Promise.all([
      AsyncStorage.removeItem("auth:user"),
      AsyncStorage.removeItem("auth:token"),
    ]);

    // Aggiorna lo stato globale
    d({ type: "LOGOUT" });
  };

 // Funzione per AGGIORNARE IL NOME UTENTE (Nuova funzione richiesta)
  const updateUsername = async (newUsername: string) => {
      if (!s.user) return;

      // 1. Aggiorna lo stato in memoria
      d({ type: 'SET_USERNAME', payload: { userName: newUsername } });

      // 2. Salva in AsyncStorage
      try {
          const updatedUser: User = { ...s.user, userName: newUsername };
          await AsyncStorage.setItem('auth:user', JSON.stringify(updatedUser));
          // Sincronizza con mock backend qui (simulazione)
          await mockUpdateProfile(updatedUser); 
      } catch (error) {
          console.error("Errore salvataggio username:", error);
      }
  };

  // Funzione di Mock per simulare la sincronizzazione
  const mockUpdateProfile = async (user: User) => {
      console.log(`[Mock Backend] Sincronizzazione profilo utente ${user.id} con il backend...`);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simula il ritardo di rete
      console.log(`[Mock Backend] Profilo aggiornato in remoto per ${user.userName}.`);
  };

  return useMemo(() => ({
    state: s,
    isLoggedIn,
    login,
    logout,
    updateUsername, // Espone la nuova funzione
    user: s.user,
    bootstrapped: s.bootstrapped,
  }), [s, isLoggedIn]);
}