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

const RegisterScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { register } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    return email.endsWith('@nie.ac.in');
  };

  const handleRegister = async () => {
    setErrors({});
    
    // Validation
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email must be from @nie.ac.in domain';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    const result = await register(name, email, password, phone);
    setLoading(false);
    
    if (!result.success) {
      Alert.alert('Registration Failed', result.error);
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
          <Text style={[styles.title, { color: colors.neonBlue }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Join NIE Lost & Found Community
          </Text>
          
          <View style={styles.form}>
            <Input
              label="Full Name"
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              error={errors.name}
              autoCapitalize="words"
            />
            
            <Input
              label="College Email"
              placeholder="your.name@nie.ac.in"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            <Input
              label="Phone (Optional)"
              placeholder="Your contact number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            
            <Input
              label="Password"
              placeholder="At least 6 characters"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              secureTextEntry
            />
            
            <Input
              label="Confirm Password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={errors.confirmPassword}
              secureTextEntry
            />
            
            <GlowButton
              title="Register"
              onPress={handleRegister}
              loading={loading}
              style={styles.registerButton}
            />
            
            <GlowButton
              title="Back to Login"
              onPress={() => navigation.goBack()}
              variant="outline"
              style={styles.backButton}
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
    paddingVertical: spacing.xl
  },
  content: {
    padding: spacing.xl,
    alignItems: 'center'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    letterSpacing: 1
  },
  subtitle: {
    fontSize: 16,
    marginBottom: spacing.xl
  },
  form: {
    width: '100%',
    maxWidth: 400
  },
  registerButton: {
    marginTop: spacing.md
  },
  backButton: {
    marginTop: spacing.md
  }
});

export default RegisterScreen;
