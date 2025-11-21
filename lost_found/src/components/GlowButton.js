import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius } from '../theme/theme';

const GlowButton = ({ title, onPress, loading = false, variant = 'primary', style, disabled }) => {
  const { colors } = useTheme();

  const renderButton = () => (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'primary' && styles.primaryButton,
        variant === 'secondary' && { ...styles.secondaryButton, borderColor: colors.neonBlue },
        variant === 'outline' && { ...styles.outlineButton, borderColor: colors.border },
        disabled && styles.disabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {variant === 'primary' && !disabled ? (
        <LinearGradient
          colors={[colors.neonBlue, colors.neonBlueSecondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {loading ? (
            <ActivityIndicator color={colors.darkBg} />
          ) : (
            <Text style={[styles.buttonText, { color: colors.darkBg }]}>{title}</Text>
          )}
        </LinearGradient>
      ) : (
        <>
          {loading ? (
            <ActivityIndicator color={colors.neonBlue} />
          ) : (
            <Text style={[styles.buttonText, { color: disabled ? colors.textMuted : colors.neonBlue }]}>
              {title}
            </Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );

  return renderButton();
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  primaryButton: {
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8
  },
  secondaryButton: {
    borderWidth: 2,
    backgroundColor: 'transparent'
  },
  outlineButton: {
    borderWidth: 1,
    backgroundColor: 'transparent'
  },
  gradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5
  },
  disabled: {
    opacity: 0.5
  }
});

export default GlowButton;
