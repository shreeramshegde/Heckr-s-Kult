import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import GlowButton from '../components/GlowButton';
import Input from '../components/Input';
import { spacing } from '../theme/theme';

const LoginScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    return email.endsWith('@nie.ac.in');
  };

  const handleLogin = async () => {
    setErrors({});
    
    // Validation
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email must be from @nie.ac.in domain';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    
    if (!result.success) {
      Alert.alert('Login Failed', result.error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.darkBg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.neonBlue }]}>🔍 Lost & Found</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            NIE College Community
          </Text>
          
          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="your.name@nie.ac.in"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              secureTextEntry
            />
            
            <GlowButton
              title="Login"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
            />
            
            <GlowButton
              title="Create Account"
              onPress={() => navigation.navigate('Register')}
              variant="outline"
              style={styles.registerButton}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  content: {
    padding: spacing.xl,
    alignItems: 'center'
  },
  logoContainer: {
    marginBottom: spacing.lg,
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 229, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20
  },
  subtitle: {
    fontSize: 16,
    marginBottom: spacing.xl
  },
  form: {
    width: '100%',
    maxWidth: 400
  },
  loginButton: {
    marginTop: spacing.md
  },
  registerButton: {
    marginTop: spacing.md
  }
});

export default LoginScreen;
