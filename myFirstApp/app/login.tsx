import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { useAuth } from './auth/AuthContext'; 

export default function LoginScreen() {
    const router = useRouter();
    const { isLoggedIn, login, logout } = useAuth();
    
    useEffect(() => {
        if (isLoggedIn) router.replace('/(tabs)');
    }, [isLoggedIn]);
    
    const handleLogin = async () => {
        await login('user@example.com', 'password123');
    };
    const handleLogout = async () => {
        await logout();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Accesso Applicazione</Text>

            {!isLoggedIn ? (
                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        { opacity: pressed ? 0.8 : 1.0, backgroundColor: pressed ? '#004d00' : '#006400' }
                    ]}
                    onPress={handleLogin}
                >
                    <Text style={styles.buttonText}>Accedi</Text>
                </Pressable>
            ) : (
                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        { opacity: pressed ? 0.8 : 1.0, backgroundColor: pressed ? '#bc0000' : '#cc0000' }
                    ]}
                    onPress={handleLogout}
                >
                    <Text style={styles.buttonText}>Logout</Text>
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: { 
        fontSize: 28, 
        marginBottom: 40, 
        fontWeight: 'bold',
        color: '#333',
    },
    button: {
        width: '70%',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#006400', 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    }
});
