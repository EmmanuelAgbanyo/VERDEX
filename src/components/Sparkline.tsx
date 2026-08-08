import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface SparklineProps {
  width?: number;
  height?: number;
  color?: string;
  fillColor?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  width = 120,
  height = 40,
  color = '#34D399',
  fillColor = 'rgba(52, 211, 153, 0.15)',
}) => {
  // Sophisticated realistic portfolio performance curve points
  const points = [
    { x: 0, y: 32 },
    { x: 15, y: 28 },
    { x: 30, y: 34 },
    { x: 45, y: 22 },
    { x: 60, y: 24 },
    { x: 75, y: 14 },
    { x: 90, y: 18 },
    { x: 105, y: 8 },
    { x: 120, y: 4 },
  ];

  // Map to SVG path string
  const linePath = points.reduce(
    (acc, point, index) =>
      index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`,
    ''
  );

  const areaPath = `${linePath} L 120 ${height} L 0 ${height} Z`;

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <LinearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <Stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </LinearGradient>
        </Defs>
        <Path d={areaPath} fill="url(#sparklineGrad)" />
        <Path d={linePath} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
