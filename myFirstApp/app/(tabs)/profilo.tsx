import { router, Stack } from 'expo-router';
import { View, Text, Button, StyleSheet } from 'react-native';
import React from 'react';

export default function ProfileScreen() {
    return (
        <>
            {/* Imposta il titolo dell'header della Tab */}
            <Stack.Screen options={{ title: 'Il Mio Profilo' }} /> 
            
            <View style={styles.container}>
                <Text style={styles.title}>Dati Utente e Gestione Indirizzi</Text>
                
                {/* 🔑 Pulsante per l'Esercizio 3: Naviga al form di modifica */}
                <View style={styles.buttonWrapper}>
                    <Button 
                        title="Modifica Dati (Test Blocco Back)" 
                        onPress={() => router.push('/edit')} 
                        color="#1e90ff"
                    />
                </View>

                {/* Pulsante per l'Esercizio 4: Modale Nuovo Indirizzo */}
                <View style={styles.buttonWrapper}>
                    <Button 
                        title="Aggiungi Nuovo Indirizzo (Modale)" 
                        onPress={() => router.push('/modale/new-address')} 
                        color="#3cb371"
                    />
                </View>
                
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' },
    title: { fontSize: 20, marginBottom: 30, fontWeight: 'bold' },
    buttonWrapper: {
        marginVertical: 10,
        width: '80%',
    }
});