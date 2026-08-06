import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, LAYOUT, SHADOWS } from '@/constants/theme';

interface TerminalCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'accent' | 'amber' | 'dark';
}

export const TerminalCard: React.FC<TerminalCardProps> = ({ children, style, variant = 'default' }) => {
  let colors: [string, string] = [COLORS.cardBg, COLORS.cardBgHover];
  let borderColor = COLORS.cardBorder;

  if (variant === 'accent') {
    colors = ['#0D3B2E', '#164E3D'];
    borderColor = COLORS.emeraldPrimary;
  } else if (variant === 'amber') {
    colors = ['#1F291E', '#2B2815'];
    borderColor = COLORS.amberData;
  } else if (variant === 'dark') {
    colors = ['#081D15', '#0B261C'];
    borderColor = COLORS.cardBorder;
  }

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, { borderColor }, SHADOWS.terminalCard, style]}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: LAYOUT.borderRadius,
    borderWidth: 1,
    padding: 16,
    marginVertical: 6,
    overflow: 'hidden',
  },
});
