import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Zap, Signal, ShieldCheck } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { COLORS } from '@/constants/theme';

export const DataSaverToggle: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isDataSaver, toggleDataSaver } = useApp();

  return (
    <Pressable
      onPress={toggleDataSaver}
      style={({ pressed }) => [
        styles.pillContainer,
        isDataSaver ? styles.pillActive : styles.pillInactive,
        pressed && { opacity: 0.8 },
      ]}
      accessibilityRole="switch"
      accessibilityState={{ checked: isDataSaver }}
      accessibilityLabel="Toggle 2G Data Saver mode"
      accessibilityHint="Switches to high-contrast text-only 2G low-bandwidth mode"
      hitSlop={8}
    >
      <View style={[styles.iconCircle, isDataSaver && styles.iconCircleActive]}>
        <Zap size={compact ? 11 : 13} color={isDataSaver ? '#10B981' : COLORS.textMuted} />
      </View>
      <Text style={[styles.pillText, isDataSaver && styles.pillTextActive, compact && styles.compactText]}>
        {isDataSaver ? '2G Data Saver ON' : 'Data Saver'}
      </Text>
      <View style={[styles.statusDot, { backgroundColor: isDataSaver ? '#10B981' : '#9CA3AF' }]} />
    </Pressable>
  );
};

export const DataSaverBanner: React.FC = () => {
  const { isDataSaver, toggleDataSaver } = useApp();

  if (!isDataSaver) return null;

  return (
    <View style={styles.bannerContainer}>
      <View style={styles.bannerRow}>
        <Signal size={14} color="#10B981" />
        <Text style={styles.bannerText}>
          <Text style={styles.bannerBold}>2G Low-Bandwidth Mode Active:</Text> Text-only high contrast enabled. Full trading & learning functionality maintained.
        </Text>
        <Pressable onPress={toggleDataSaver} hitSlop={8} style={styles.bannerTurnOffBtn}>
          <Text style={styles.bannerTurnOffText}>Disable</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  pillInactive: {
    backgroundColor: '#F1F5F0',
    borderColor: '#E8EDE6',
  },
  pillActive: {
    backgroundColor: '#000000',
    borderColor: '#10B981',
  },
  iconCircle: {
    padding: 2,
  },
  iconCircleActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderRadius: 10,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  compactText: {
    fontSize: 10,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  bannerContainer: {
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bannerText: {
    fontSize: 11,
    color: '#FFFFFF',
    flex: 1,
    lineHeight: 15,
  },
  bannerBold: {
    fontWeight: '900',
    color: '#10B981',
  },
  bannerTurnOffBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  bannerTurnOffText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
