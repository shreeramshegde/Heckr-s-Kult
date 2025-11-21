import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { AuthNavigator, MainNavigator } from './src/navigation/AppNavigator';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

function AppContent() {
  const { isAuthenticated, loading, token } = useAuth();
  const { colors } = useTheme();

  // Debug logging
  React.useEffect(() => {
    console.log('Auth state changed:', { isAuthenticated, hasToken: !!token, loading });
  }, [isAuthenticated, token, loading]);

  if (loading) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.darkBg }]}>
        <ActivityIndicator size="large" color={colors.neonBlue} />
      </View>
    );
  }

  console.log('Rendering navigator - isAuthenticated:', isAuthenticated);

  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
