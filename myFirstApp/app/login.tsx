import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import { useAuth } from '../hooks/useAuth'; // Usa l’hook vero

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const handleLogin = () => {
    signIn('demo-token'); // Passa un token simbolico
    router.replace('/(tabs)'); // Redirect dopo login
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 28, marginBottom: 40 }}>Accesso Applicazione</Text>
      <Button title="Accedi (e Resetta Stack)" onPress={handleLogin} />
    </View>
  );
}