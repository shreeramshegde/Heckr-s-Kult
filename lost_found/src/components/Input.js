import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius } from '../theme/theme';

const Input = ({ label, error, style, ...props }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: colors.textPrimary }]}>{label}</Text>
      )}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.darkBgSecondary,
            borderColor: error ? colors.error : colors.border,
            color: colors.textPrimary
          }
        ]}
        placeholderTextColor={colors.textMuted}
        {...props}
      />
      {error && (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.xs
  },
  input: {
    height: 50,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    fontSize: 16
  },
  error: {
    fontSize: 12,
    marginTop: spacing.xs
  }
});

export default Input;
