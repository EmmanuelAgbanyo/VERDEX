import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { GreenAsset } from '@/types';
import { COLORS } from '@/constants/theme';
import { Star, ShieldCheck, TrendingUp, TrendingDown, MapPin } from 'lucide-react-native';
import { GlassCard } from './GlassCard';

interface AssetCardProps {
  asset: GreenAsset;
  onPress: () => void;
  onStarToggle: () => void;
  isStarred: boolean;
  hasUnlockedThesis?: boolean;
}

export const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  onPress,
  onStarToggle,
  isStarred,
  hasUnlockedThesis,
}) => {
  const isPositive = asset.change24h >= 0;

  return (
    <View style={styles.outerWrapper}>
      {/* Primary Card Pressable Layer */}
      <Pressable 
        onPress={onPress} 
        style={({ pressed }) => [styles.cardPressable, pressed && styles.pressedState]}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`${asset.name}, ${asset.symbol}, Virtual Price GH₵${asset.price.toFixed(2)}, change ${asset.change24h >= 0 ? 'up' : 'down'} ${asset.change24h.toFixed(2)}%`}
        accessibilityHint="Double tap to open detailed asset diagnostic"
      >
        <GlassCard style={styles.cardInner}>
          {/* Header Row: Symbol, Region, and Research Badge */}
          <View style={styles.headerRow}>
            <View style={styles.symbolContainer}>
              <Text style={styles.symbolText}>{asset.symbol}</Text>
              <View style={styles.regionBadge}>
                <MapPin size={11} color={COLORS.emeraldBright} />
                <Text style={styles.regionText}>{asset.regionLabel.split(',')[0]}</Text>
              </View>
            </View>

            <View style={styles.rightHeaderBox}>
              {hasUnlockedThesis ? (
                <View style={styles.unlockedBadge}>
                  <ShieldCheck size={12} color={COLORS.emeraldBright} />
                  <Text style={styles.unlockedBadgeText}>Thesis Unlocked</Text>
                </View>
              ) : (
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreBadgeText}>Signal {asset.signalScore}/100</Text>
                </View>
              )}
            </View>
          </View>

          {/* Asset Title */}
          <Text style={styles.assetName} numberOfLines={1}>
            {asset.name}
          </Text>

          {/* Pricing & Change Row */}
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceLabel}>Virtual Price</Text>
              <Text style={styles.priceValue}>GH₵{asset.price.toFixed(2)}</Text>
            </View>

            <View style={[styles.changePill, { backgroundColor: isPositive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)' }]}>
              {isPositive ? (
                <TrendingUp size={14} color={COLORS.emeraldBright} />
              ) : (
                <TrendingDown size={14} color={COLORS.redAlert} />
              )}
              <Text style={[styles.changeText, { color: isPositive ? COLORS.emeraldBright : COLORS.redAlert }]}>
                {isPositive ? '+' : ''}
                {asset.change24h.toFixed(2)}%
              </Text>
            </View>
          </View>

          {/* Metrics summary preview */}
          <View style={styles.metricsRow}>
            {asset.environmentalMetrics.slice(0, 2).map((m, idx) => (
              <View key={idx} style={styles.metricPill}>
                <Text style={styles.metricLabel}>{m.label}:</Text>
                <Text style={styles.metricVal}>{m.value}</Text>
              </View>
            ))}
          </View>
        </GlassCard>
      </Pressable>

      {/* Sibling Star Button Layer (Positioned independently on top right) */}
      <Pressable
        onPress={onStarToggle}
        hitSlop={12}
        style={({ pressed }) => [styles.starButton, pressed && styles.starPressed]}
        accessibilityRole="button"
        accessibilityState={{ selected: isStarred }}
        accessibilityLabel={isStarred ? "Remove from watchlist" : "Add to watchlist"}
      >
        <Star
          size={18}
          color={isStarred ? COLORS.amberData : COLORS.textMuted}
          fill={isStarred ? COLORS.amberData : 'transparent'}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    position: 'relative',
    marginVertical: 4,
  },
  cardPressable: {
    width: '100%',
  },
  pressedState: {
    opacity: 0.94,
    transform: [{ scale: 0.98 }],
  },
  cardInner: {
    padding: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    paddingRight: 32, // space reserved for sibling star button
  },
  symbolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  symbolText: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.textBright,
    letterSpacing: 0.3,
  },
  regionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.inputBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  regionText: {
    fontSize: 10,
    color: COLORS.emeraldBright,
    fontWeight: '600',
  },
  rightHeaderBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  scoreBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.amberDataBright,
  },
  unlockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  unlockedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.emeraldBright,
  },
  assetName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  priceValue: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textBright,
    letterSpacing: -0.3,
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
    fontWeight: '700',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(228, 234, 226, 0.5)',
    paddingTop: 10,
  },
  metricPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  metricVal: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textBright,
  },
  starButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 10,
    padding: 8,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(228, 234, 226, 0.7)',
    shadowColor: '#102A1F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  starPressed: {
    transform: [{ scale: 1.15 }],
  },
});
