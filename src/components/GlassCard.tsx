import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Rect, Defs, Pattern, Path } from 'react-native-svg';
import { LAYOUT } from '@/constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'light' | 'dark' | 'emerald' | 'frost' | 'crystal';
  showGrid?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  variant = 'light',
  showGrid = false,
}) => {
  let gradientColors: [string, string] = ['rgba(255, 255, 255, 0.88)', 'rgba(255, 255, 255, 0.68)'];
  let borderColor = 'rgba(255, 255, 255, 0.85)';
  let shadowColor = '#0E2E21';
  let shadowOpacity = 0.06;

  if (variant === 'light') {
    gradientColors = ['rgba(255, 255, 255, 0.88)', 'rgba(255, 255, 255, 0.68)'];
    borderColor = 'rgba(255, 255, 255, 0.85)';
    shadowColor = '#0E2E21';
    shadowOpacity = 0.06;
  } else if (variant === 'dark') {
    gradientColors = ['rgba(11, 38, 30, 0.94)', 'rgba(6, 22, 17, 0.94)'];
    borderColor = 'rgba(52, 211, 153, 0.28)';
    shadowColor = '#000000';
    shadowOpacity = 0.22;
  } else if (variant === 'emerald') {
    gradientColors = ['rgba(13, 92, 70, 0.96)', 'rgba(6, 60, 45, 0.96)'];
    borderColor = 'rgba(167, 243, 208, 0.38)';
    shadowColor = '#07241A';
    shadowOpacity = 0.20;
  } else if (variant === 'frost') {
    gradientColors = ['rgba(255, 255, 255, 0.92)', 'rgba(247, 250, 246, 0.82)'];
    borderColor = 'rgba(228, 234, 226, 0.8)';
    shadowColor = '#102A1F';
    shadowOpacity = 0.05;
  } else if (variant === 'crystal') {
    gradientColors = ['rgba(255, 255, 255, 0.96)', 'rgba(255, 255, 255, 0.88)'];
    borderColor = 'rgba(255, 255, 255, 0.95)';
    shadowColor = '#0E2E21';
    shadowOpacity = 0.08;
  }

  return (
    <View style={[styles.cardContainer, { borderColor, shadowColor, shadowOpacity }, style]}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Glass Specular Reflection Highlight Overlay */}
      <View style={styles.glassSheenHighlight} />

      {showGrid && (
        <View style={StyleSheet.absoluteFill}>
          <Svg width="100%" height="100%" opacity={0.06}>
            <Defs>
              <Pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <Path d="M 20 0 L 0 0 0 20" fill="none" stroke="#10B981" strokeWidth="1" />
              </Pattern>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#gridPattern)" />
          </Svg>
        </View>
      )}

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: LAYOUT.borderRadius,
    borderWidth: 1.5,
    padding: 18,
    marginVertical: 6,
    position: 'relative',
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 18,
    elevation: 4,
  },
  glassSheenHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    zIndex: 2,
  },
});
