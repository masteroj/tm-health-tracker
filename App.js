import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { DataProvider, useData } from './src/DataContext';
import DashboardScreen from './src/screens/DashboardScreen';
import LogScreen from './src/screens/LogScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { colors } from './src/theme';

const Tab = createBottomTabNavigator();

const ICONS = {
  Dashboard: 'grid-outline',
  Log: 'add-circle-outline',
  History: 'list-outline',
  Export: 'settings-outline',
};

function Tabs() {
  const { loading } = useData();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: '700' },
        headerTitle: () => (
          <View style={styles.headerTitle}>
            <Text style={styles.headerMain}>TM Health</Text>
            <Text style={styles.headerSub}>Active Lifestyle</Text>
          </View>
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border, height: 60, paddingBottom: 8, paddingTop: 6 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ color, size }) => <Ionicons name={ICONS[route.name]} size={size} color={color} />,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Log" component={LogScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Export" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <DataProvider>
        <StatusBar style="light" />
        <NavigationContainer>
          <Tabs />
        </NavigationContainer>
      </DataProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  headerTitle: { alignItems: 'flex-start' },
  headerMain: { color: colors.white, fontSize: 17, fontWeight: '700' },
  headerSub: { color: 'rgba(255,255,255,0.85)', fontSize: 11 },
});
