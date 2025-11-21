// Enhanced dark theme colors with better contrast and readability
export const colors = {
  // Dark backgrounds - improved contrast
  darkBg: '#0D1117',
  darkBgAlt: '#010409',
  darkBgSecondary: '#161B22',
  
  // Card and component backgrounds
  cardBg: '#1C2128',
  inputBg: '#21262D',
  
  // Neon blue accents - PRIMARY accent color
  neonBlue: '#00D4FF',
  neonBlueSecondary: '#0096C7',
  neonBlueDim: 'rgba(0, 212, 255, 0.3)',
  neonBlueGlow: 'rgba(0, 212, 255, 0.5)',
  
  // Improved text colors for better readability
  text: '#F0F6FC',           // Primary text - very high contrast
  textPrimary: '#F0F6FC',    // Primary text
  textSecondary: '#C9D1D9',  // Secondary text - good contrast
  textMuted: '#7D8590',      // Muted text - sufficient contrast
  textDisabled: '#484F58',   // Disabled text
  
  // Light theme (when toggled)
  lightBg: '#FFFFFF',
  lightBgSecondary: '#F6F8FA',
  lightText: '#24292F',
  
  // Status colors with better contrast
  success: '#00D4FF',        // Keep neon blue for success
  error: '#F85149',         // Better red for dark theme
  warning: '#D29922',       // Better orange for dark theme
  info: '#58A6FF',          // Info blue
  
  // Utility colors with improved contrast
  border: 'rgba(0, 212, 255, 0.25)',
  borderSecondary: '#30363D',
  shadow: 'rgba(0, 0, 0, 0.9)',
  overlay: 'rgba(13, 17, 23, 0.9)',
  
  // Interactive states
  hover: 'rgba(0, 212, 255, 0.1)',
  pressed: 'rgba(0, 212, 255, 0.2)',
  disabled: '#21262D'
};

export const lightColors = {
  ...colors,
  darkBg: '#FFFFFF',
  darkBgAlt: '#F6F8FA',
  darkBgSecondary: '#F6F8FA',
  cardBg: '#FFFFFF',
  inputBg: '#F6F8FA',
  
  text: '#24292F',
  textPrimary: '#24292F',
  textSecondary: '#57606A',
  textMuted: '#656D76',
  textDisabled: '#8C959F',
  
  border: 'rgba(0, 212, 255, 0.3)',
  borderSecondary: '#D1D9E0',
  shadow: 'rgba(0, 0, 0, 0.12)',
  overlay: 'rgba(255, 255, 255, 0.95)',
  
  hover: 'rgba(0, 212, 255, 0.08)',
  pressed: 'rgba(0, 212, 255, 0.15)',
  disabled: '#F6F8FA'
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary
  },
  body: {
    fontSize: 16,
    color: colors.textSecondary
  },
  caption: {
    fontSize: 14,
    color: colors.textMuted
  },
  small: {
    fontSize: 12,
    color: colors.textMuted
  }
};

export const shadows = {
  glow: {
    shadowColor: colors.neonBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5
  },
  card: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3
  }
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999
};
