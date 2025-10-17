import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../hooks/useAuth'; 
import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

function RootLayout() {
    const { isLoading } = useAuth(); 

    if (isLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }
    
    return (
        <Stack>
            {/* Login Screen (Definizione unica) */}
            <Stack.Screen
                name="login"
                options={{
                    headerShown: false,
                }}
            />

            {/* Gruppo Tabs '(app)' */}
            <Stack.Screen
                name="(app)"
                options={{
                    headerShown: false,
                }}
            />
            {/* Rota di fallback 404 */}
            <Stack.Screen name="[...missing]" options={{ title: '404', headerShown: false }} />
        </Stack>
    );
}

const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default function App() {
    return (
        <AuthProvider>
            <RootLayout />
        </AuthProvider>
    );
}