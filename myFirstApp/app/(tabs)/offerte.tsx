import { View, Text, StyleSheet, Pressable, FlatList, Image } from 'react-native';
import React, { useState,useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { offertePizzeria, Offerta } from '../offerte';
import { useCart } from '../CartContext';
import { useAuth } from '../auth/AuthContext';

// Componente per mostrare una singola offerta
type OffertaCardProps = {
    offerta: Offerta;
    isSelected: boolean;
    onToggle: (id: string) => void;
};

const OffertaCard: React.FC<OffertaCardProps> = ({ offerta, isSelected, onToggle }) => (
    <View style={styles.card}>
        <Image 
            source={{ uri: offerta.immagine }} 
            style={styles.image} 
            accessibilityLabel={offerta.titolo}
            onError={() => console.log(`Errore nel caricamento immagine: ${offerta.immagine}`)}
        />
        <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{offerta.titolo}</Text>
            <Text style={styles.cardSubtitle}>{offerta.nomeProdotto}</Text>
            <Text style={styles.cardDescription}>{offerta.descrizione}</Text>
            
            <View style={styles.cardBottomRow}>
                <Text style={styles.cardPrice}>
                    {offerta.prezzoScontato > 0 ? `€ ${offerta.prezzoScontato.toFixed(2)}` : 'Sconto Speciale'}
                </Text>

                {/* 🔑 Checkbox / Pressable per la selezione */}
                <Pressable
                    onPress={() => offerta.disponibilita && onToggle(offerta.id)}
                    style={styles.checkboxContainer}
                    disabled={!offerta.disponibilita}
                >
                    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                        {isSelected && <Ionicons name="checkmark" size={18} color="white" />}
                    </View>
                    <Text style={[styles.checkboxLabel, !offerta.disponibilita && styles.disabledText]}>
                        {offerta.disponibilita ? 'Seleziona' : 'Non disponibile'}
                    </Text>
                </Pressable>
            </View>
        </View>
    </View>
);

export default function OfferteScreen() {
    // Stato locale per tenere traccia dell'ID dell'offerta selezionata (una sola alla volta)
    const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);

    const handleToggleOffer = (id: string) => {
        // Se l'offerta è già selezionata, deselezionala (toggle)
        if (selectedOfferId === id) {
            setSelectedOfferId(null);
        } else {
            // Altrimenti, seleziona la nuova offerta
            setSelectedOfferId(id);
        }
    };

    const router = useRouter();
    const { setOffer } = useCart();

    const { isLoggedIn, bootstrapped } = useAuth();

    // 🔑 2. Logica di Protezione della Rotta con useEffect
    useEffect(() => {
        // Se la fase di bootstrap (caricamento iniziale) è completata
        if (bootstrapped) {
            // E l'utente NON è loggato
            if (!isLoggedIn) {
                // Reindirizza alla pagina di login
                router.replace('/login'); 
            }
        }
    }, [isLoggedIn, bootstrapped, router]); // Si attiva quando isLoggedIn o bootstrapped cambiano

    const handleRedeem = () => {
      if (selectedOfferId) {
        const offertaSelezionata = offertePizzeria.find(o => o.id === selectedOfferId);
        if (offertaSelezionata) {
          setOffer(offertaSelezionata); // Inserisce l’offerta nel carrello!
          setSelectedOfferId(null); // Resetta la selezione
          router.push('/checkout'); // Naviga direttamente al carrello
        }
      }
    };
    
    // Controlla se c'è almeno un'offerta selezionata per abilitare il pulsante
    const isRedeemButtonEnabled = !!selectedOfferId;

    // 🔑 3. Mostra un placeholder finché lo stato di login non è certo
    if (!bootstrapped || !isLoggedIn) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Caricamento offerte...</Text>
            </View>
        );
    }

    return (
        <>
            <Stack.Screen options={{ title: 'Offerte Speciali' }} />
            
            <FlatList
                data={offertePizzeria}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <OffertaCard 
                        offerta={item} 
                        isSelected={selectedOfferId === item.id}
                        onToggle={handleToggleOffer}
                    />
                )}
                ListHeaderComponent={() => (
                    <Text style={styles.headerText}>Scegli la tua promozione:</Text>
                )}
                ListFooterComponent={() => (
                    <View style={styles.footer}>
                        {/* 🔑 Pulsante Riscatta Offerta (Pressable) */}
                        <Pressable
                            onPress={handleRedeem}
                            style={({ pressed }) => [
                                styles.redeemButton,
                                { opacity: pressed ? 0.8 : 1.0 },
                                !isRedeemButtonEnabled && styles.redeemButtonDisabled
                            ]}
                            disabled={!isRedeemButtonEnabled}
                        >
                            <Text style={styles.redeemButtonText}>
                                Riscatta Offerta
                            </Text>
                        </Pressable>
                    </View>
                )}
            />
        </>
    );
}

const styles = StyleSheet.create({
    listContent: {
        paddingHorizontal: 15,
        paddingBottom: 100, // Spazio extra per il footer
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
        color: '#333',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    image: {
        width: '100%',
        height: 120,
        backgroundColor: '#eee',
        resizeMode: 'cover',
    },
    cardContent: {
        padding: 15,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#555',
        marginTop: 5,
        marginBottom: 10,
    },
    cardDescription: {
        fontSize: 12,
        color: '#777',
        marginBottom: 15,
    },
    cardBottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    cardPrice: {
        fontSize: 18,
        fontWeight: '900',
        color: '#ff4500', // Colore arancione per l'offerta
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        borderRadius: 5,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    checkboxSelected: {
        backgroundColor: '#4CAF50', // Verde per selezionato
        borderColor: '#4CAF50',
    },
    checkboxLabel: {
        marginLeft: 8,
        fontSize: 14,
        color: '#333',
    },
    disabledText: {
        color: '#aaa',
    },
    footer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    redeemButton: {
        width: '80%',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ff4500', // Arancione
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 6,
    },
    redeemButtonDisabled: {
        backgroundColor: '#ccc',
    },
    redeemButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
    }
});
