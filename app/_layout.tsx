import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
// 🔑 Importa i componenti Redux e lo Store
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";

// La funzione di export è il punto di ingresso, qui stabiliamo il Provider
export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}

// Componente interno che gestisce la logica di navigazione e USA l'hook
function AppNavigator() {
  const { isLoggedIn, bootstrapped } = useAuth();

  // === Logica di Navigazione Condizionale (Bootstrap) ===

  // 1. Schermata di Caricamento (Bootstrap)
  if (!bootstrapped) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#ff4500" />
      </View>
    );
  }

  // 2. REINDIRIZZAMENTO GLOBALE
  // Se non siamo loggati, reindirizziamo SEMPRE a /login (tranne per la schermata 404)
  if (!isLoggedIn) {
    return (
      <Stack>
        {/* Mostra solo login e rotte pubbliche come register/forgot-password.
                Usiamo l'header per il titolo (non per i Tabs)
                */}
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen
          name="[...missing]"
          options={{ title: "404", headerShown: false }}
        />
      </Stack>
    );
  }

  // 3. UTENTE LOGGATO
  // Se siamo loggati, reindirizziamo SEMPRE al gruppo Tabs.
  // L'unica eccezione sono le rotte che devono essere modali o a schermo intero (come edit).
  return (
    <Stack>
      {/* 🔑 La rotta predefinita per l'utente loggato */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Rotte protette fuori dai tabs: /edit */}
      <Stack.Screen name="edit" options={{ title: "Modifica Dati" }} />

      {/* Rotte modali, se le crei */}
      <Stack.Screen name="modal" options={{ headerShown: false }} />

      {/* In questo modo, se un utente loggato prova ad andare su /login, 
            Expo Router non trova la rotta nel suo Stack (perché non è definita qui) 
            e rimane nella root del gruppo (tabs).
            */}

      <Stack.Screen
        name="[...missing]"
        options={{ title: "404", headerShown: false }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
