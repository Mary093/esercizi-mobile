import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import React from 'react';

export default function HomeScreen() {
  const router = useRouter();

  const pizzaData = {
    id: 42,
    name: 'Quattro Stagioni',
    price: 10.50,
  };

  const goToDetails = () => {
    router.push({
      pathname: '/pizza/id', // Path dinamico con slash iniziale
      params: {
        id: pizzaData.id, // Parametro dinamico richiesto dal file [id].tsx
        pizzaName: pizzaData.name,
        pizzaPrice: pizzaData.price.toString(),
      },
    });
  };

  // 🔑 Funzione chiave per il Checkout
  const goToCheckout = () => {
    // Naviga a una rotta definita nella root di /app, quindi FUORI dal Tab Navigator
    router.push('/checkout');
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Home Pizzeria' }} />

      <View style={styles.container}>
                <Text style={styles.title}>Seleziona la Pizza:</Text>
                
                <View style={styles.buttonWrapper}>
                    <Button title={`Dettagli: ${pizzaData.name}`} onPress={goToDetails} />
                </View>

                <Text style={styles.subtitle}>Nascondi Tab Bar</Text>
                <View style={styles.buttonWrapper}>
                    <Button title="Vai al Checkout" onPress={goToCheckout} color="#ff4500" />
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
  },
  title: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 20,
  },
  subtitle: {
      fontSize: 16,
      marginTop: 15,
      marginBottom: 5,
      fontWeight: '600',
  },
  buttonWrapper: {
      marginVertical: 5,
      width: '80%',
  }
});