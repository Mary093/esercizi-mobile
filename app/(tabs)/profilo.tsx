import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { View, ScrollView, Text, Button, StyleSheet, Image, Pressable, Alert, TextInput } from 'react-native';
// 🔑 Importa le API per la fotocamera e la galleria
import * as ImagePicker from 'expo-image-picker'; 
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../auth/AuthContext';

export default function ProfileScreen() {
    const { user, updateUsername, logout } = useAuth(); // Prendi user, updateUsername e logout dal Context
    const [image, setImage] = useState<string | null>(null);
    const [newUsername, setNewUsername] = useState<string>(user?.userName || '');
    const [isEditing, setIsEditing] = useState<boolean>(false);

    // Funzione per salvare il nuovo nome utente
    const handleSaveUsername = () => {
        if (newUsername.trim() !== '' && newUsername !== user?.userName) {
            updateUsername(newUsername.trim());
            Alert.alert("Successo", "Nome utente aggiornato e salvato in locale/remoto (mock).");
        }
        setIsEditing(false);
    };

    // Funzione di Logout (aggiunta per completezza)
    const handleLogout = async () => {
        await logout();
        router.replace('/login');
    };

    // Funzione per richiedere i permessi e scattare una foto
    const takePhoto = async () => {
        // Richiede il permesso di accedere alla fotocamera
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
        
        if (cameraPermission.status !== 'granted') {
            Alert.alert("Permesso Negato", "È necessario il permesso della Fotocamera per scattare foto.");
            return;
        }

        // Apre l'interfaccia della fotocamera
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true, // Permette all'utente di ritagliare l'immagine
            aspect: [4, 3],
            quality: 0.7, // Riduce la qualità per un caricamento più veloce
        });

        // Se la foto non è stata annullata, salva l'URI
        if (!result.canceled) {
            setImage(result.assets[0].uri);
            console.log("URI Foto scattata:", result.assets[0].uri);
        }
    };

    // Funzione per richiedere i permessi e scegliere un'immagine dalla galleria
    const pickImage = async () => {
        // Richiede il permesso di accedere alla libreria foto/media
        const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (libraryPermission.status !== 'granted') {
            Alert.alert("Permesso Negato", "È necessario il permesso per accedere alla Galleria.");
            return;
        }

        // Apre la galleria
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, // Permette all'utente di ritagliare l'immagine
            aspect: [4, 3],
            quality: 0.7, // Riduce la qualità per un caricamento più veloce
        });

        // Se l'operazione non è stata annullata, salva l'URI
        if (!result.canceled) {
            setImage(result.assets[0].uri);
            console.log("URI Immagine galleria:", result.assets[0].uri);
        }
    };


    return (
        <>
            <Stack.Screen options={{ title: 'Il Mio Profilo' }} /> 
            
            <ScrollView 
                contentContainerStyle={styles.scrollContainer} 
                style={styles.container}
            >
                <Text style={styles.title}>Benvenuto nel tuo Profilo</Text>

                {/* Componente Image per mostrare la foto */}
                <Image 
                    // 🚨 PERCORSO CORRETTO: '../../assets/images/placeholder-profile.png'
                    source={image ? { uri: image } : require('../../assets/images/placeholder-profile.png')}
                    style={styles.profileImage}
                />

                {/* Visualizzazione e Modifica Nome Utente */}
                <View style={styles.usernameContainer}>
                    <Text style={styles.sectionTitle}>
                        Nome Utente: 
                        {!isEditing && user?.userName ? (
                             <Text style={{ fontWeight: 'normal' }}> {user.userName}</Text>
                        ) : null}
                    </Text>

                    {isEditing ? (
                        <View style={styles.editRow}>
                            <TextInput
                                style={styles.input}
                                onChangeText={setNewUsername}
                                value={newUsername}
                                placeholder="Inserisci nuovo nome utente"
                                autoFocus
                            />
                            <Pressable 
                                onPress={handleSaveUsername} 
                                style={({ pressed }) => [styles.saveButton, { opacity: pressed ? 0.8 : 1.0 }]}
                            >
                                <Text style={styles.buttonText}>Salva</Text>
                            </Pressable>
                        </View>
                    ) : (
                        <Pressable 
                            onPress={() => setIsEditing(true)} 
                            style={({ pressed }) => [styles.editButton, { opacity: pressed ? 0.8 : 1.0 }]}
                        >
                            <Text style={styles.buttonText}>Modifica Nome</Text>
                        </Pressable>
                    )}
                </View>
                {/* Fine Visualizzazione e Modifica Nome Utente */}

                <Text style={styles.sectionTitle}>Email: {user?.email || 'Non loggato'}</Text>

                <View style={styles.buttonRow}>
                    {/* Pulsante per scattare una foto */}
                    <Pressable style={styles.button} onPress={takePhoto}>
                        <Ionicons name="camera-outline" size={20} color="white" style={{ marginRight: 5 }} />
                        <Text style={styles.buttonText}>Scatta Foto</Text>
                    </Pressable>

                    {/* Pulsante per scegliere dalla galleria */}
                    <Pressable style={styles.button} onPress={pickImage}>
                        <Ionicons name="images-outline" size={20} color="white" style={{ marginRight: 5 }} />
                        <Text style={styles.buttonText}>Scegli da Galleria</Text>
                    </Pressable>
                </View>
                
                {/* *** FUNZIONI E BOTTONI PREESISTENTI MANTENUTI ***
                */}
                <Text style={styles.sectionTitle}>Dati Utente e Gestione Indirizzi</Text>

                <View style={styles.buttonWrapper}>
                    <Button 
                        title="Modifica Dati (Test Blocco Back)" 
                        onPress={() => router.push('/edit')} 
                        color="#1e90ff"
                    />
                </View>
                <View style={styles.buttonWrapper}>
                    <Button 
                        title="Aggiungi Nuovo Indirizzo (Modale)" 
                        onPress={() => router.push('/modale/new-address')} 
                        color="#3cb371"
                    />
                </View>

                {/* Bottone di Logout */}
                <View style={styles.buttonWrapper}>
                    <Button 
                        title="LOGOUT" 
                        onPress={handleLogout} 
                        color="#cc0000"
                    />
                </View>
                
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    title: { fontSize: 22, marginBottom: 20, fontWeight: 'bold', color: '#333' },
    sectionTitle: { fontSize: 18, marginTop: 10, marginBottom: 15, fontWeight: '600', color: '#555' },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75, // Per renderla rotonda
        marginBottom: 30,
        borderWidth: 4,
        borderColor: '#ff4500',
    },
    scrollContainer: { 
        padding: 20, 
        alignItems: 'center', 
        paddingBottom: 50,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 10,
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#007AFF', // Blu iOS
        padding: 10,
        borderRadius: 8,
        minWidth: '45%',
        alignItems: 'center',
        flexDirection: 'row', // Allinea icona e testo
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    buttonWrapper: {
        marginVertical: 8,
        width: '85%',
    },
    // Nuovi stili per l'aggiornamento dell'username
    usernameContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    editRow: {
        flexDirection: 'row',
        width: '80%',
        marginTop: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginRight: 10,
        backgroundColor: 'white',
    },
    editButton: {
        backgroundColor: '#007AFF', // Blu
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginTop: 5,
    },
    saveButton: {
        backgroundColor: '#3cb371', // Verde
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
});