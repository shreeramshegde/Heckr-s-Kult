import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';

export const AppLogo = ({ size = 120 }) => (
  <View style={styles.logoContainer}>
    <Svg width={size} height={size} viewBox="0 0 120 120">
      <Defs>
        <LinearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#00d4ff" stopOpacity="1" />
          <Stop offset="100%" stopColor="#0084ff" stopOpacity="1" />
        </LinearGradient>
        <LinearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#ff00ea" stopOpacity="1" />
          <Stop offset="100%" stopColor="#9d00ff" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      
      {/* Outer circle glow */}
      <Circle cx="60" cy="60" r="55" fill="url(#grad1)" opacity="0.2" />
      
      {/* Main circle */}
      <Circle cx="60" cy="60" r="50" fill="url(#grad1)" />
      
      {/* Magnifying glass handle */}
      <Path
        d="M 75 75 L 95 95"
        stroke="url(#grad2)"
        strokeWidth="8"
        strokeLinecap="round"
      />
      
      {/* Magnifying glass circle */}
      <Circle cx="55" cy="55" r="25" fill="none" stroke="#ffffff" strokeWidth="6" />
      
      {/* Question mark inside */}
      <Path
        d="M 52 42 Q 55 35, 60 35 Q 65 35, 65 42 Q 65 48, 55 50 L 55 58"
        stroke="#ffffff"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <Circle cx="55" cy="65" r="2.5" fill="#ffffff" />
    </Svg>
  </View>
);

export const FoundIcon = ({ focused, color, size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Defs>
      <LinearGradient id="foundGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor={focused ? "#00d4ff" : color} stopOpacity="1" />
        <Stop offset="100%" stopColor={focused ? "#0084ff" : color} stopOpacity="1" />
      </LinearGradient>
    </Defs>
    
    {/* Magnifying glass */}
    <Circle cx="10" cy="10" r="7" fill="none" stroke="url(#foundGrad)" strokeWidth="2" />
    <Path d="M 15 15 L 21 21" stroke="url(#foundGrad)" strokeWidth="2" strokeLinecap="round" />
    
    {/* Checkmark inside */}
    {focused && (
      <Path d="M 7 10 L 9.5 12.5 L 13 8" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" fill="none" />
    )}
  </Svg>
);

export const PostIcon = ({ focused, color, size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Defs>
      <LinearGradient id="postGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor={focused ? "#ff00ea" : color} stopOpacity="1" />
        <Stop offset="100%" stopColor={focused ? "#9d00ff" : color} stopOpacity="1" />
      </LinearGradient>
    </Defs>
    
    {/* Circle background */}
    <Circle cx="12" cy="12" r="10" fill={focused ? "url(#postGrad)" : "none"} stroke="url(#postGrad)" strokeWidth="2" />
    
    {/* Plus sign */}
    <Path d="M 12 7 L 12 17" stroke={focused ? "#ffffff" : color} strokeWidth="2.5" strokeLinecap="round" />
    <Path d="M 7 12 L 17 12" stroke={focused ? "#ffffff" : color} strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

export const UserIcon = ({ focused, color, size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Defs>
      <LinearGradient id="userGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor={focused ? "#00ff9d" : color} stopOpacity="1" />
        <Stop offset="100%" stopColor={focused ? "#00d4ff" : color} stopOpacity="1" />
      </LinearGradient>
    </Defs>
    
    {/* Head */}
    <Circle cx="12" cy="8" r="4" fill="url(#userGrad)" />
    
    {/* Body */}
    <Path 
      d="M 6 20 Q 6 15, 12 15 Q 18 15, 18 20" 
      fill="url(#userGrad)"
      stroke="url(#userGrad)"
      strokeWidth="1"
    />
    
    {/* Outer circle */}
    {focused && (
      <Circle cx="12" cy="12" r="11" fill="none" stroke="url(#userGrad)" strokeWidth="1.5" opacity="0.5" />
    )}
  </Svg>
);

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});
