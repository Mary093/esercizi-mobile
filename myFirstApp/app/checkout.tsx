// app/checkout.tsx
import { Stack, useRouter } from 'expo-router';
import { View, Text, StyleSheet, Button } from 'react-native';
import React from 'react';

export default function CheckoutScreen() {
  const router = useRouter();

  return (
    <>
      {/* 1. L'intestazione viene gestita dallo Stack Navigator superiore */}
      <Stack.Screen 
        options={{ 
          title: 'Il tuo Carrello',
          // L'header (intestazione) sarà visibile, ma la Tab Bar sottostante no.
        }} 
      />
      
      <View style={styles.container}>
        <Text style={styles.text}>Sei nella schermata Checkout.</Text>
        <Text style={styles.text}>La Tab Bar sottostante è scomparsa!</Text>
        
        <View style={styles.buttonWrapper}>
            <Button title="Torna alla Home" onPress={() => router.replace('/')} color="#007aff" />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff' 
  },
  text: { 
    fontSize: 20,
    marginBottom: 10 
  },
  buttonWrapper: {
      marginTop: 20,
      width: '60%'
  }
});