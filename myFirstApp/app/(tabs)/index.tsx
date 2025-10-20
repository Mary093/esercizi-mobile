import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import React from 'react';
import { useAuth } from '../auth/AuthContext';

export default function HomeScreen() {
    const router = useRouter();
    const { isLoggedIn, login, logout } = useAuth();

    const pizzaData = {
        id: 42,
        name: 'Quattro Stagioni',
        price: 10.50,
    };

    const goToDetails = () => {
        router.push({
            pathname: '/pizza/id',
            params: {
                id: pizzaData.id,
                pizzaName: pizzaData.name,
                pizzaPrice: pizzaData.price.toString(),
            },
        });
    };

    // 🔑 Funzione per eseguire il Logout
    const handleLogout = async () => {
        console.log('Esecuzione Logout da Home...');
        // Quando logout() finisce, lo stato isLoggedIn diventa false
        await logout();
        // L'AppNavigator si occuperà del reindirizzamento al Login
    };

    // 🔑 Componente Pressable riutilizzabile per i bottoni
    const CustomPressable = ({ title, onPress, color = '#1e90ff' }: { title: string, onPress: () => void, color?: string }) => (
        <Pressable 
            style={({ pressed }) => [
                styles.button, 
                { backgroundColor: color, opacity: pressed ? 0.8 : 1.0 }
            ]} 
            onPress={onPress}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </Pressable>
    );

    return (
        <>
            <Stack.Screen options={{ title: 'Home Pizzeria' }} />

            <View style={styles.container}>
                <Text style={styles.title}>Seleziona la Pizza:</Text>
                
                <View style={styles.buttonWrapper}>
                    <CustomPressable 
                        title={`Dettagli: ${pizzaData.name}`} 
                        onPress={goToDetails} 
                    />
                </View>
                
                <View style={styles.separator} />
                
                {isLoggedIn ? (
                  <View style={styles.buttonWrapper}>
                      <CustomPressable 
                          title="Esci dalla Sessione (LOGOUT)" 
                          onPress={handleLogout} 
                          color="#cc0000"
                      />
                  </View>
                ) : (
                  <View style={styles.buttonWrapper}>
                      <CustomPressable 
                          title="Accedi (LOGIN)" 
                          onPress={() => login('user@example.com', 'password123')} 
                          color="#006400"
                      />
                  </View>
                )}
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
        marginVertical: 10,
        width: '80%',
    },
    button: {
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc',
        width: '80%',
        marginVertical: 20,
    }
});
