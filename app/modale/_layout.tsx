import { Stack } from 'expo-router';
import React from 'react';

export default function ModalLayout() {
  return (
    <Stack screenOptions={{
      // 🔑 CHIAVE: Imposta la presentazione modale (slide dal basso su iOS/Android)
      presentation: 'modal',
    }}>
      {/* Rota per new-address.tsx: personalizziamo l'header della modale */}
      <Stack.Screen 
        name="new-address" 
        options={{ 
          title: 'Aggiungi Indirizzo',
        }} 
      />
    </Stack>
  );
}