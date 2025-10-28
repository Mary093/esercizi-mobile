import React, { useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
// 🔑 Importa l'hook necessario da React Navigation
import { useFocusEffect } from '@react-navigation/native'; 
import { Stack } from 'expo-router';

// Definiamo il tipo per i nostri dati per TypeScript
interface Order {
  id: number;
  date: string;
  total: number;
}

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // La funzione che simula il recupero dei dati
  const fetchOrders = () => {
    setIsLoading(true);
    console.log('--- Esecuzione fetchOrders (Screen Focused) ---');
    
    // Simula un ritardo di rete e genera nuovi dati ogni volta
    setTimeout(() => {
      const newOrders: Order[] = [
        { 
          id: Date.now(), 
          date: new Date().toLocaleTimeString(), 
          total: parseFloat((Math.random() * 100).toFixed(2)) 
        },
        { 
          id: Date.now() + 1, 
          date: new Date().toLocaleTimeString(), 
          total: parseFloat((Math.random() * 50).toFixed(2)) 
        },
      ];
      setOrders(newOrders);
      setIsLoading(false);
    }, 1500);
  };

  // 🔑 useFocusEffect: Esegue fetchOrders OGNI VOLTA che la Tab "Ordini" viene messa a fuoco
  useFocusEffect(
    useCallback(() => {
      fetchOrders(); 
      
      // Funzione di cleanup (opzionale): viene eseguita quando la schermata perde il focus
      return () => {
        console.log('--- OrdersScreen ha perso il focus (cleanup) ---');
      };
    }, [])
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ff4500" />
        <Text style={{ marginTop: 10 }}>Caricamento ordini in corso...</Text>
      </View>
    );
  }

  return (
    <>
      {/* Imposta il titolo dell'header della Tab */}
      <Stack.Screen options={{ title: 'I Miei Ordini' }} /> 
      <View style={styles.container}>
        <Text style={styles.title}>Elenco Ordini Aggiornato ({orders.length}):</Text>
        {orders.map((order) => (
          <Text key={order.id} style={styles.orderText}>
            {`ID #${order.id % 1000} - Totale: ${order.total.toFixed(2)} € | Orario: ${order.date}`}
          </Text>
        ))}
        <Text style={styles.tip}>{"*Passa alla Tab 'Home' e torna qui per vedere il ricaricamento.*"}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f0f0' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 15, fontWeight: 'bold' },
  orderText: { marginBottom: 8, padding: 10, backgroundColor: '#fff', borderRadius: 5, shadowOpacity: 0.1, shadowRadius: 3 },
  tip: { marginTop: 30, fontSize: 13, color: '#666', fontStyle: 'italic', textAlign: 'center' }
});