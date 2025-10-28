// app/modal/new-address.tsx
import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';

export default function NewAddressScreen() {
  const [address, setAddress] = useState<string>('');

  const handleSaveAndClose = () => {
    if (!address.trim()) {
      Alert.alert('Errore', 'Inserisci un indirizzo valido.');
      return;
    }
    // Logica di salvataggio
    console.log('Indirizzo salvato:', address);
    
    // 🔑 Chiude la modale (torna indietro al navigatore chiamante)
    router.back(); 
  };

  return (
    <View style={styles.container}>
      {/* L'header è gestito da _layout.tsx, qui c'è solo il contenuto */}
      <Text style={styles.title}>Inserisci Nuovo Indirizzo</Text>
      <TextInput
        placeholder="Via, città, CAP..."
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />
      <Button 
        title="Salva Indirizzo" 
        onPress={handleSaveAndClose} 
        disabled={!address.trim()} 
        color="#3cb371"
      />
      <View style={styles.cancelButton}>
          <Button title="Annulla" onPress={() => router.back()} color="#888" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: 'white' },
    title: { fontSize: 20, marginBottom: 15, fontWeight: 'bold' },
    input: { borderWidth: 1, padding: 10, marginBottom: 20, borderRadius: 5, borderColor: '#ccc' },
    cancelButton: { marginTop: 15 }
});