import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { GreenAsset } from '@/types';
import { COLORS } from '@/constants/theme';
import {
  Star,
  TrendingUp,
  TrendingDown,
  MapPin,
  Lock,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Info,
  CloudRain,
  Sprout,
  Sun,
  Zap,
  Trees,
  Waves,
  Flame,
} from 'lucide-react-native';

interface AssetCardProps {
  asset: GreenAsset;
  onPress: () => void;
  onStarToggle: () => void;
  isStarred: boolean;
  hasUnlockedThesis?: boolean;
}

// Mini contextual sparkline component
const MiniSparkline: React.FC<{ isPositive: boolean }> = ({ isPositive }) => {
  const color = isPositive ? '#10B981' : '#EF4444';
  const linePath = isPositive
    ? 'M 0 20 L 12 16 L 24 18 L 36 10 L 48 12 L 60 4 L 72 6 L 84 2'
    : 'M 0 4 L 12 6 L 24 2 L 36 12 L 48 10 L 60 18 L 72 16 L 84 22';

  return (
    <View style={styles.sparklineBox}>
      <Svg width={72} height={20} viewBox="0 0 84 24">
        <Path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
};

// Map assets to specific environmental drivers using real SVG vector icons
const getEnvironmentalDriverSpecs = (category: string) => {
  switch (category) {
    case 'cocoa':
      return [
        { Icon: CloudRain, label: 'Rainfall', direction: '↑' },
        { Icon: Sprout, label: 'Cocoa outlook', direction: '↑' },
      ];
    case 'solar':
      return [
        { Icon: Sun, label: 'Solar irradiance', direction: '↑' },
        { Icon: Zap, label: 'Grid reliability', direction: '↑' },
      ];
    case 'mangrove':
      return [
        { Icon: Trees, label: 'Mangrove restoration', direction: '↑' },
        { Icon: Waves, label: 'Coastal resilience', direction: '↑' },
      ];
    case 'savannah':
      return [
        { Icon: Flame, label: 'Firebreak active', direction: '↑' },
        { Icon: Trees, label: 'Shea canopy', direction: '↑' },
      ];
    default:
      return [
        { Icon: Sprout, label: 'Ecosystem signal', direction: '↑' },
        { Icon: TrendingUp, label: 'Market demand', direction: '↑' },
      ];
  }
};

export const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  onPress,
  onStarToggle,
  isStarred,
  hasUnlockedThesis,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const isPositive = asset.change24h >= 0;
  const drivers = getEnvironmentalDriverSpecs(asset.category);

  // Compute signal breakdown scores based on signalScore
  const climateResilienceScore = Math.min(98, Math.max(70, asset.signalScore + 2));
  const marketMomentumScore = Math.min(95, Math.max(65, Math.round(asset.signalScore * 0.92)));
  const envAlignmentScore = Math.min(99, Math.max(75, asset.signalScore + 4));

  const signalLabel = asset.signalScore >= 85 ? 'STRONG SIGNAL' : 'MODERATE SIGNAL';

  return (
    <View style={styles.cardContainer}>
      {/* ROW 1: Symbol, Region Tag, & Independent Star Toggle */}
      <View style={styles.topHeaderBar}>
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [styles.headerTapArea, pressed && styles.pressedState]}
          accessibilityRole="button"
          accessibilityLabel={`${asset.name}, ${asset.symbol}`}
        >
          <View style={styles.symbolRegionGroup}>
            <Text style={styles.symbolText}>{asset.symbol}</Text>
            <View style={styles.regionBadge}>
              <MapPin size={11} color="#0D5C46" />
              <Text style={styles.regionText}>{asset.regionLabel.split(',')[0]}</Text>
            </View>
          </View>
          <Text style={styles.assetName}>{asset.name}</Text>
        </Pressable>

        {/* Independent Star Button */}
        <Pressable
          onPress={onStarToggle}
          hitSlop={12}
          style={({ pressed }) => [styles.starBtn, pressed && styles.pressedState]}
          accessibilityRole="button"
          accessibilityState={{ selected: isStarred }}
          accessibilityLabel={isStarred ? 'Remove from watchlist' : 'Add to watchlist'}
        >
          <Star
            size={18}
            color={isStarred ? COLORS.amberData : '#94A3B8'}
            fill={isStarred ? COLORS.amberData : 'transparent'}
          />
        </Pressable>
      </View>

      {/* ROW 2: Price + Movement + Mini Sparkline */}
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.priceRowPressable, pressed && styles.pressedState]}
      >
        <View style={styles.priceRow}>
          <View style={styles.priceGroup}>
            <Text style={styles.priceValue}>GH₵{asset.price.toFixed(2)}</Text>
            <View
              style={[
                styles.changePill,
                { backgroundColor: isPositive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)' },
              ]}
            >
              {isPositive ? (
                <TrendingUp size={12} color="#059669" />
              ) : (
                <TrendingDown size={12} color="#DC2626" />
              )}
              <Text style={[styles.changeText, { color: isPositive ? '#059669' : '#DC2626' }]}>
                {isPositive ? '+' : ''}
                {asset.change24h.toFixed(2)}%
              </Text>
            </View>
          </View>

          <MiniSparkline isPositive={isPositive} />
        </View>
      </Pressable>

      {/* ROW 3: Environmental Signal Container */}
      <View style={styles.signalContainer}>
        {/* Independent Expand Toggle Header */}
        <Pressable
          onPress={() => setIsExpanded(!isExpanded)}
          style={({ pressed }) => [styles.signalHeader, pressed && styles.pressedState]}
          accessibilityRole="button"
          accessibilityLabel={`Signal Score ${asset.signalScore}, tap to ${isExpanded ? 'collapse' : 'expand'} breakdown`}
        >
          <View style={styles.signalBadgeGroup}>
            <View style={styles.signalDot} />
            <Text style={styles.signalScoreText}>● {asset.signalScore} / 100</Text>
            <Text style={styles.signalLabelText}>{signalLabel}</Text>
          </View>

          <View style={styles.expandToggle}>
            {isExpanded ? <ChevronUp size={14} color="#64748B" /> : <ChevronDown size={14} color="#64748B" />}
          </View>
        </Pressable>

        {/* Environmental Drivers Chips with Real SVG Vector Icons */}
        <View style={styles.driversRow}>
          <Text style={styles.driversHeading}>WHY IT'S MOVING</Text>
          <View style={styles.driversChipsGroup}>
            {drivers.map((drv, idx) => {
              const DriverIcon = drv.Icon;
              return (
                <View key={idx} style={styles.driverChip}>
                  <DriverIcon size={12} color="#0D5C46" />
                  <Text style={styles.driverChipText}>
                    {drv.label} <Text style={styles.driverDir}>{drv.direction}</Text>
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Expandable Breakdown Drawer */}
        {isExpanded && (
          <View style={styles.expandedDrawer}>
            <View style={styles.drawerTitleRow}>
              <Info size={12} color="#0D5C46" />
              <Text style={styles.drawerTitle}>SIGNAL BREAKDOWN</Text>
            </View>

            <View style={styles.breakdownItem}>
              <View style={styles.breakdownLabelRow}>
                <Text style={styles.breakdownLabel}>Climate resilience</Text>
                <Text style={styles.breakdownScore}>{climateResilienceScore}</Text>
              </View>
              <View style={styles.breakdownTrack}>
                <View style={[styles.breakdownBar, { width: `${climateResilienceScore}%` }]} />
              </View>
            </View>

            <View style={styles.breakdownItem}>
              <View style={styles.breakdownLabelRow}>
                <Text style={styles.breakdownLabel}>Market momentum</Text>
                <Text style={styles.breakdownScore}>{marketMomentumScore}</Text>
              </View>
              <View style={styles.breakdownTrack}>
                <View style={[styles.breakdownBar, { width: `${marketMomentumScore}%` }]} />
              </View>
            </View>

            <View style={styles.breakdownItem}>
              <View style={styles.breakdownLabelRow}>
                <Text style={styles.breakdownLabel}>Environmental alignment</Text>
                <Text style={styles.breakdownScore}>{envAlignmentScore}</Text>
              </View>
              <View style={styles.breakdownTrack}>
                <View style={[styles.breakdownBar, { width: `${envAlignmentScore}%` }]} />
              </View>
            </View>

            <Text style={styles.breakdownWhyText}>
              {asset.whyThisMattersSnippet ||
                'High satellite telemetry signals and cooperative restoration activity support this climate valuation score.'}
            </Text>
          </View>
        )}
      </View>

      {/* ROW 4: Thesis Governance Action Bar */}
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.actionBarPressable, pressed && styles.pressedState]}
        accessibilityRole="button"
        accessibilityLabel={hasUnlockedThesis ? 'Trade asset' : 'Build thesis'}
      >
        <View style={styles.actionBar}>
          {hasUnlockedThesis ? (
            <View style={styles.thesisUnlockedBadge}>
              <ShieldCheck size={14} color="#059669" />
              <Text style={styles.thesisUnlockedText}>✓ THESIS VERIFIED</Text>
            </View>
          ) : (
            <View style={styles.thesisLockedBadge}>
              <Lock size={13} color="#D97706" />
              <Text style={styles.thesisLockedText}>🔒 THESIS REQUIRED</Text>
            </View>
          )}

          <View style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>
              {hasUnlockedThesis ? 'TRADE' : 'BUILD THESIS'}
            </Text>
            <ChevronRight size={14} color={hasUnlockedThesis ? '#0D5C46' : '#D97706'} />
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E1E8DE',
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#0E2E21',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    padding: 16,
  },
  pressedState: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  topHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  headerTapArea: {
    flex: 1,
    paddingRight: 10,
  },
  symbolRegionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  symbolText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0D211A',
    letterSpacing: -0.2,
  },
  regionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  regionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D5C46',
  },
  starBtn: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
  },
  assetName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  priceRowPressable: {
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  priceValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0D211A',
    letterSpacing: -0.4,
  },
  changePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  sparklineBox: {
    paddingRight: 4,
  },
  signalContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  signalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  signalBadgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  signalDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  signalScoreText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0D211A',
  },
  signalLabelText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.6,
  },
  expandToggle: {
    padding: 2,
  },
  driversRow: {
    marginTop: 8,
  },
  driversHeading: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  driversChipsGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  driverChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  driverChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  driverDir: {
    fontWeight: '800',
    color: '#059669',
  },
  expandedDrawer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 8,
  },
  drawerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  drawerTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0D5C46',
    letterSpacing: 0.8,
  },
  breakdownItem: {
    gap: 2,
  },
  breakdownLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownLabel: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },
  breakdownScore: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D211A',
  },
  breakdownTrack: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  breakdownBar: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 2,
  },
  breakdownWhyText: {
    fontSize: 11,
    color: '#64748B',
    fontStyle: 'italic',
    marginTop: 4,
    lineHeight: 16,
  },
  actionBarPressable: {
    paddingTop: 4,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  thesisUnlockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  thesisUnlockedText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.5,
  },
  thesisLockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  thesisLockedText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D97706',
    letterSpacing: 0.5,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ctaButtonText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0D5C46',
    letterSpacing: 0.5,
  },
});
