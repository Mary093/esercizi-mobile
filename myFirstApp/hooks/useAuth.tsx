import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 1. Definisci il tipo per il contesto di autenticazione
interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  signIn: (token: string) => void;
  signOut: () => void;
}

// 2. Crea il contesto con valori predefiniti
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Fornisce l'Autenticazione a tutta l'App
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Stato chiave
  const [isLoading, setIsLoading] = useState(true); // Per la fase di controllo iniziale del token

  // Simula il caricamento e il controllo iniziale di un token persistente
  useEffect(() => {
    // Qui potresti controllare AsyncStorage per un token salvato
    setTimeout(() => {
      // Esempio: Se trovassi un token valido, setIsLoggedIn(true)
      setIsLoading(false); 
    }, 1000);
  }, []);

  const signIn = (token: string) => {
    // Qui salveresti il token (es. in AsyncStorage)
    console.log("Utente loggato con token:", token);
    setIsLoggedIn(true);
  };

  const signOut = () => {
    // Qui rimuoveresti il token salvato
    console.log("Utente sloggato.");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Hook personalizzato per accedere facilmente al contesto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve essere utilizzato all\'interno di un AuthProvider');
  }
  return context;
};