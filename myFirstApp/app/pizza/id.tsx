import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function PizzaDetailsScreen() {
  // id è il parametro dinamico estratto dall'URL (/pizza/42)
  // pizzaName e pizzaPrice sono i query params passati
  const { id, pizzaName, pizzaPrice } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dettagli Pizza</Text>
      <Text style={styles.text}>ID Pizza (dal URL): **{id}**</Text>
      <Text style={styles.text}>Nome Pizza (da params): **{pizzaName}**</Text>
      <Text style={styles.text}>Prezzo (da params): **€{pizzaPrice}**</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  text: { fontSize: 18, marginBottom: 10 },
});