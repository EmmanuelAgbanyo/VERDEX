import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { GreenAsset } from '@/types';
import { COLORS } from '@/constants/theme';
import { Star, ShieldCheck, TrendingUp, TrendingDown, MapPin, ChevronDown, ChevronUp, Heart, Leaf, Shield } from 'lucide-react-native';
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
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const isPositive = asset.change24h >= 0;

  // Educational community impact copy for each asset category
  const getCommunityImpactText = () => {
    switch (asset.category) {
      case 'cocoa':
        return 'Empowers 1,200+ Eastern Region smallholder cocoa farmers with solar-powered shade irrigation and direct organic fair-trade pricing.';
      case 'solar':
        return 'Provides clean, off-grid solar electricity to 15,000+ homes and schools across the Northern Tamale agricultural buffer zone.';
      case 'mangrove':
        return 'Restores 450 hectares of Volta Delta mangroves, preventing coastal erosion and protecting local fishing livelihoods.';
      case 'savannah':
        return 'Protects Northern Mole ecological corridors from wildfire degradation while funding women-led shea agroforestry collectives.';
      default:
        return 'Directly funds community climate adaptation infrastructure and sustainable West African farming jobs.';
    }
  };

  return (
    <View style={styles.outerWrapper}>
      {/* Primary Card Pressable Layer */}
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.cardPressable, pressed && styles.pressedState]}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`${asset.name}, ${asset.symbol}, Price GH₵${asset.price.toFixed(2)}, change ${asset.change24h >= 0 ? 'up' : 'down'} ${asset.change24h.toFixed(2)}%`}
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
              <Text style={styles.priceLabel}>PRICE</Text>
              <Text style={styles.priceValue}>GH₵{asset.price.toFixed(2)}</Text>
            </View>

            <View
              style={[
                styles.changePill,
                { backgroundColor: isPositive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)' },
              ]}
            >
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

          {/* Metrics Summary Row */}
          <View style={styles.metricsRow}>
            {asset.environmentalMetrics.slice(0, 2).map((m, idx) => (
              <View key={idx} style={styles.metricPill}>
                <Text style={styles.metricLabel}>{m.label}:</Text>
                <Text style={styles.metricVal}>{m.value}</Text>
              </View>
            ))}

            {/* Expand / Collapse Details Button */}
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              style={styles.expandToggleBtn}
              hitSlop={12}
            >
              <Text style={styles.expandToggleText}>{isExpanded ? 'Hide Info' : 'Impact Info'}</Text>
              {isExpanded ? <ChevronUp size={14} color="#059669" /> : <ChevronDown size={14} color="#059669" />}
            </Pressable>
          </View>

          {/* COLLAPSIBLE EDUCATIONAL COMMUNITY IMPACT DRAWER */}
          {isExpanded && (
            <View style={styles.expandedDrawer}>
              <View style={styles.impactTitleRow}>
                <Heart size={14} color="#10B981" />
                <Text style={styles.impactTitle}>Community Impact & Purpose</Text>
              </View>
              <Text style={styles.impactDesc}>{getCommunityImpactText()}</Text>

              {/* All Environmental Metrics Detail Grid */}
              <View style={styles.metricsDetailGrid}>
                {asset.environmentalMetrics.map((m, idx) => (
                  <View key={idx} style={styles.detailMetricBox}>
                    <Text style={styles.detailMetricLabel}>{m.label}</Text>
                    <Text style={styles.detailMetricVal}>{m.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </GlassCard>
      </Pressable>

      {/* Sibling Star Button Layer */}
      <Pressable
        onPress={onStarToggle}
        hitSlop={12}
        style={({ pressed }) => [styles.starButton, pressed && styles.starPressed]}
        accessibilityRole="button"
        accessibilityState={{ selected: isStarred }}
        accessibilityLabel={isStarred ? 'Remove from watchlist' : 'Add to watchlist'}
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
    transform: [{ scale: 0.985 }],
  },
  cardInner: {
    padding: 16,
    borderRadius: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    paddingRight: 32,
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
    fontWeight: '700',
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
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(228, 234, 226, 0.6)',
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
    fontWeight: '700',
    color: COLORS.textBright,
  },
  expandToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.10)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  expandToggleText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  expandedDrawer: {
    marginTop: 12,
    backgroundColor: 'rgba(245, 248, 244, 0.95)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D8E2D5',
    gap: 8,
  },
  impactTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  impactTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0D5C46',
  },
  impactDesc: {
    fontSize: 11,
    color: '#364B41',
    lineHeight: 16,
  },
  metricsDetailGrid: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  detailMetricBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E4EAE2',
  },
  detailMetricLabel: {
    fontSize: 9,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  detailMetricVal: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textBright,
    marginTop: 2,
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
