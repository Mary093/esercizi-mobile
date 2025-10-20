import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'tomato',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
          headerShown: false, // Esempio: nascondi l'header in Home
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Ordini',
          tabBarIcon: ({ color }) => <Ionicons name="receipt" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profilo"
        options={{
          title: 'Profilo',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
       <Tabs.Screen
        name="offerte"
        options={{
          title: 'Offerte',
          tabBarIcon: ({ color }) => <Ionicons name="checkmark" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="checkout"
        options={{
          title: 'checkout',
          tabBarIcon: ({ color }) => <Ionicons name="cart" size={24} color={color} />,
        }}
      />
      
      {/* Nuovo Posizionamento: La rotta dettagli pizza è ora nel Tab Navigator,
          ma impostiamo 'href: null' per nasconderla dalla Tab Bar in fondo. 
          Quando vi navighi, la Tab Bar resta visibile! 
      */}
    </Tabs>
  );
}