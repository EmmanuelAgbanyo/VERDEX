import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ClimateSignal } from '@/types';
import { COLORS } from '@/constants/theme';
import { AirQualitySvg, RainfallSvg, HeatAnomalySvg, CarbonCanopySvg } from './SvgIcons';

export const SignalBadge: React.FC<{ signal: ClimateSignal }> = ({ signal }) => {
  const getIconAndColors = () => {
    switch (signal.type) {
      case 'air_quality':
        return {
          icon: <AirQualitySvg size={20} color="#0D5C46" secondaryColor="#34D399" />,
          bgColor: '#E6F4EA',
          textColor: '#0D5C46',
        };
      case 'rainfall':
        return {
          icon: <RainfallSvg size={20} color="#1A73E8" secondaryColor="#60A5FA" />,
          bgColor: '#E8F0FE',
          textColor: '#1A73E8',
        };
      case 'heat_anomaly':
        return {
          icon: <HeatAnomalySvg size={20} color="#E8711A" secondaryColor="#FBBF24" />,
          bgColor: '#FDF2E9',
          textColor: '#E8711A',
        };
      case 'carbon_offset':
        return {
          icon: <CarbonCanopySvg size={20} color="#0D5C46" secondaryColor="#34D399" />,
          bgColor: '#E6F4EA',
          textColor: '#0D5C46',
        };
      default:
        return {
          icon: <CarbonCanopySvg size={20} color="#0D5C46" secondaryColor="#34D399" />,
          bgColor: '#E6F4EA',
          textColor: '#0D5C46',
        };
    }
  };

  const { icon, bgColor, textColor } = getIconAndColors();
  const isPositive = signal.changePercent >= 0;

  return (
    <View style={styles.container}>
      <View style={[styles.iconBox, { backgroundColor: bgColor }]}>{icon}</View>
      <View style={styles.textContainer}>
        <Text style={styles.typeLabel}>{signal.name}</Text>
        <Text style={styles.valueText}>
          {signal.currentValue} {signal.unit}
        </Text>
        <Text style={[styles.statusText, { color: isPositive ? '#0D5C46' : COLORS.redAlert }]}>
          {signal.statusText}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(228, 234, 226, 0.8)',
    marginRight: 10,
    minWidth: 165,
    shadowColor: '#102A1F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  iconBox: {
    padding: 10,
    borderRadius: 14,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  typeLabel: {
    fontSize: 10,
    color: '#7C8E84',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  valueText: {
    fontSize: 16,
    color: '#1A2E26',
    fontWeight: '900',
    marginTop: 2,
    letterSpacing: -0.3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});
