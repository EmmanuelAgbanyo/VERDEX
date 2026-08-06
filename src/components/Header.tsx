import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { COLORS, LAYOUT } from '@/constants/theme';
import { TrendingUp, Radio } from 'lucide-react-native';
import { BellSvg, MapPinSvg } from './SvgIcons';
import { GlassCard } from './GlassCard';

interface HeaderProps {
  portfolioValue: number;
  sessionTimeRemaining: number; // seconds
}

export const Header: React.FC<HeaderProps> = ({ portfolioValue, sessionTimeRemaining }) => {
  const minutes = Math.floor(sessionTimeRemaining / 60);
  const seconds = sessionTimeRemaining % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <View style={styles.container}>
      {/* Top Bar: Executive Welcome Greeting & Location Tag */}
      <View style={styles.topRow}>
        <View style={styles.welcomeGroup}>
          <Text style={styles.welcomeTitle}>Welcome, Team VERDEX</Text>
        </View>

        <View style={styles.topRightGroup}>
          <View style={styles.locationTag}>
            <MapPinSvg size={12} color="#10B981" />
            <Text style={styles.locationText}>Accra, GH</Text>
          </View>

          <Pressable
            style={styles.bellBtn}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            accessibilityHint="View system alerts"
          >
            <BellSvg size={16} color="#1A2E26" />
          </Pressable>
        </View>
      </View>

      {/* Main Glassmorphic Session Valuation Card */}
      <GlassCard
        variant="emerald"
        showGrid
        style={styles.sessionCard}
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel={`Live Market. Session value: GH₵${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}, Time remaining: ${timeFormatted} left. Increase since session start: 6.42%`}
        accessibilityLiveRegion="polite"
      >
        <View style={styles.cardHeaderRow}>
          <View style={styles.liveMarketBadge}>
            <Radio size={12} color="#34D399" />
            <Text style={styles.liveMarketText}>LIVE MARKET</Text>
          </View>
          <Text style={styles.timerText}>{timeFormatted} left</Text>
        </View>

        <Text style={styles.valueLabel}>PORTFOLIO VALUATION</Text>
        <Text style={styles.valueNumber}>
          GH₵{portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </Text>

        <View style={styles.cardFooterRow}>
          <View style={styles.changePill}>
            <TrendingUp size={12} color="#34D399" />
            <Text style={styles.changeText}>+6.42%</Text>
          </View>
          <Text style={styles.changeLabel}>session return</Text>

          {/* Graphic Bar Chart Visual */}
          <View style={styles.miniChart}>
            <View style={[styles.bar, { height: 8 }]} />
            <View style={[styles.bar, { height: 14 }]} />
            <View style={[styles.bar, { height: 10 }]} />
            <View style={[styles.bar, { height: 18 }]} />
            <View style={[styles.bar, { height: 24, backgroundColor: '#34D399' }]} />
          </View>
        </View>
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  welcomeGroup: {
    justifyContent: 'center',
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1A2E26',
    letterSpacing: -0.4,
  },
  topRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E4EAE2',
    shadowColor: '#102A1F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  locationText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1A2E26',
  },
  bellBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4EAE2',
    shadowColor: '#102A1F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  sessionCard: {
    padding: 20,
    borderRadius: 22,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  liveMarketBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(52, 211, 153, 0.18)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  liveMarketText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#34D399',
    letterSpacing: 0.5,
  },
  timerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#A7F3D0',
  },
  valueLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A7F3D0',
    letterSpacing: 1,
    opacity: 0.8,
  },
  valueNumber: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    marginVertical: 4,
    letterSpacing: -0.5,
  },
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  changePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(52, 211, 153, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
  },
  changeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#34D399',
  },
  changeLabel: {
    fontSize: 11,
    color: '#A7F3D0',
    opacity: 0.8,
    flex: 1,
  },
  miniChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 24,
  },
  bar: {
    width: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
  },
});
