// app/checkout.tsx
import { Stack, useRouter } from 'expo-router';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import React from 'react';
import { useCart } from '../CartContext';
import { Ionicons } from '@expo/vector-icons';

export default function CheckoutScreen() {
  const router = useRouter();
  const { offer, total, setOffer } = useCart(); // 🔑 Legge lo stato dell'offerta

  const handleGoHome = () => {
    // Torna alla Home e pulisce lo stack di navigazione
    router.replace('/(tabs)');
  };
  
  const handleRemoveOffer = () => {
    setOffer(null); // Rimuove l'offerta dal carrello
  };

  // Componente Pressable riutilizzabile per il bottone Torna alla Home
  const HomePressable = ({ title, onPress }: { title: string, onPress: () => void }) => (
    <Pressable 
        style={({ pressed }) => [
            styles.homeButton, 
            { opacity: pressed ? 0.8 : 1.0 }
        ]} 
        onPress={onPress}
    >
        <Ionicons name="arrow-back" size={20} color="white" style={{ marginRight: 10 }} />
        <Text style={styles.homeButtonText}>{title}</Text>
    </Pressable>
  );

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
        <Text style={styles.mainTitle}>Il Tuo Ordine (Checkout)</Text>
        
        {/* 🔑 SEZIONE OFFERTA SELEZIONATA */}
        <View style={styles.offerContainer}>
          {offer ? (
            <>
              <Text style={styles.offerHeader}>🎁 Offerta Speciale Selezionata:</Text>
              
              <View style={styles.offerCard}>
                <Text style={styles.offerTitle}>{offer.titolo} ({offer.id})</Text>
                <Text style={styles.offerDescription}>{offer.descrizione}</Text>
                <View style={styles.offerPriceRow}>
                    <Text style={styles.offerPrice}>Prezzo Scontato: € {offer.prezzoScontato.toFixed(2)}</Text>
                    
                    {/* Pulsante per rimuovere l'offerta */}
                    <Pressable style={styles.removeButton} onPress={handleRemoveOffer}>
                        <Ionicons name="close-circle" size={24} color="#cc0000" />
                    </Pressable>
                </View>
              </View>
              
              <Text style={styles.totalText}>
                  Totale Carrello (solo offerta): <Text style={styles.totalValue}>€ {total.toFixed(2)}</Text>
              </Text>
            </>
          ) : (
            <Text style={styles.noOfferText}>Nessuna offerta speciale selezionata al momento.</Text>
          )}
        </View>

        {/* Bottone CONFERMA ORDINE sotto (visibile solo se almeno c'è una offerta) */}
        {offer && (
          <View style={styles.buttonWrapper}>
              <Pressable
                  style={({ pressed }) => [styles.confirmButton, { opacity: pressed ? 0.85 : 1 }]}
                  onPress={() => Alert.alert('Ordine confermato')}
              >
                  <Text style={styles.confirmButtonText}>Conferma Ordine</Text>
              </Pressable>
          </View>
        )}
        {/* 🔑 TASTO TORNA ALLA HOME (Pressable) */}
        <View style={styles.buttonWrapper}>
            <HomePressable title="Torna alla Home" onPress={handleGoHome} />
        </View>
        
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5' 
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    marginTop: 20,
  },
  offerContainer: {
    width: '100%',
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 40,
  },
  offerHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4CAF50',
  },
  offerCard: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginBottom: 15,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  offerDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  offerPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  offerPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ff4500',
  },
  removeButton: {
    padding: 5,
  },
  noOfferText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#777',
    textAlign: 'center',
    paddingVertical: 20,
  },
  totalText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'right',
    marginTop: 10,
  },
  totalValue: {
    color: '#006400',
    fontWeight: '900',
  },
  buttonWrapper: {
    width: '80%',
    marginTop: 'auto', // Sposta il pulsante in basso
    marginBottom: 20,
  },
  homeButton: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e90ff', // Blu
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  homeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  confirmButton: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1eae60', // Verde
    marginBottom: 18,
    marginTop: 10,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
});
