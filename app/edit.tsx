import React, { useState } from 'react';
import { View, Text, Button, Alert, TextInput, StyleSheet } from 'react-native';
import { router, Stack } from 'expo-router';
import { usePreventRemove } from '@react-navigation/native';

export default function EditProfileScreen() {
  const INITIAL_NAME: string = 'Mario Rossi';
  const [isDirty, setIsDirty] = useState<boolean>(false); 
  const [name, setName] = useState<string>(INITIAL_NAME);

  const handleTextChange = (text: string) => {
    setName(text);
    setIsDirty(text.trim() !== INITIAL_NAME); 
  };

  // 🔑 usePreventRemove: Intercetta il tentativo di navigazione (back)
  usePreventRemove(isDirty, (event: { data: { action: any } }) => {
    Alert.alert(
      'Modifiche non salvate',
      'Hai modifiche in sospeso. Sei sicuro di voler uscire e perderle?',
      [
        { text: 'Rimani qui', style: 'cancel' },
        {
          text: 'Esci comunque',
          style: 'destructive',
          onPress: () => {
            setIsDirty(false); // Rimuove il blocco
            router.back(); // Esegue l'azione di back
          },
        },
      ]
    );
  });

  const handleSave = () => {
      // Salva dati...
      console.log('Dati salvati:', name);
      setIsDirty(false); 
      router.back(); 
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Modifica Dati' }} />
      <View style={styles.container}>
        <Text style={styles.label}>Nome Utente:</Text>
        <TextInput 
          value={name}
          onChangeText={handleTextChange}
          placeholder="Inserisci il nome"
          style={styles.input}
        />
        {isDirty && <Text style={styles.warning}>! Hai modifiche non salvate !</Text>}
        
        <Button 
          title="Salva Modifiche" 
          onPress={handleSave} 
          disabled={!isDirty} 
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    label: { marginBottom: 5, fontSize: 16 },
    input: { borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 5, borderColor: '#ccc' },
    warning: { color: 'red', marginBottom: 10, fontWeight: 'bold' },
});