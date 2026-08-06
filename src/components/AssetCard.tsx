import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { GreenAsset } from '@/types';
import { COLORS } from '@/constants/theme';
import { Star, ShieldCheck, TrendingUp, TrendingDown, MapPin, ChevronDown, ChevronUp, Heart, Sparkles, Users, TreePine, Briefcase } from 'lucide-react-native';
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
          <View style={styles.mainInfoRow}>
            {/* Left Side: Symbol, Name, Badges */}
            <View style={styles.leftColumn}>
              <View style={styles.symbolContainer}>
                <Text style={styles.symbolText}>{asset.symbol}</Text>
                <View style={styles.regionBadge}>
                  <MapPin size={10} color={COLORS.emeraldBright} />
                  <Text style={styles.regionText}>{asset.regionLabel.split(',')[0]}</Text>
                </View>
              </View>

              <Text style={styles.assetName} numberOfLines={1}>
                {asset.name}
              </Text>
              
              <View style={styles.badgeWrapper}>
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

            {/* Right Side: Price & Change */}
            <View style={styles.rightColumn}>
              <View style={styles.priceContainer}>
                <Text style={styles.priceValue}>GH₵{asset.price.toFixed(2)}</Text>
              </View>

              <View
                style={[
                  styles.changePill,
                  { backgroundColor: isPositive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)' },
                ]}
              >
                {isPositive ? (
                  <TrendingUp size={12} color={COLORS.emeraldBright} />
                ) : (
                  <TrendingDown size={12} color={COLORS.redAlert} />
                )}
                <Text style={[styles.changeText, { color: isPositive ? COLORS.emeraldBright : COLORS.redAlert }]}>
                  {isPositive ? '+' : ''}
                  {asset.change24h.toFixed(2)}%
                </Text>
              </View>
            </View>
          </View>

          {/* Metrics & Why This Matters Toggle */}
          <View style={styles.metricsRow}>
            <View style={styles.metricPill}>
              <Sparkles size={12} color="#10B981" />
              <Text style={styles.metricVal}>{asset.environmentalMetrics[0]?.value || 'Signal Active'}</Text>
            </View>

            {/* Why This Matters Toggle Button */}
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              style={styles.expandToggleBtn}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Heart size={12} color="#059669" />
              <Text style={styles.expandToggleText}>{isExpanded ? 'Hide Impact' : 'Why This Matters'}</Text>
              {isExpanded ? <ChevronUp size={12} color="#059669" /> : <ChevronDown size={12} color="#059669" />}
            </Pressable>
          </View>

          {/* WHY THIS MATTERS EXPANDABLE COMMUNITY IMPACT FOOTER */}
          {isExpanded && (
            <View style={styles.expandedDrawer}>
              <View style={styles.impactTitleRow}>
                <Heart size={13} color="#10B981" />
                <Text style={styles.impactTitle}>Community Impact</Text>
              </View>
              <Text style={styles.impactSnippetText}>
                {asset.whyThisMattersSnippet || asset.communityImpact}
              </Text>

              {/* Quick 3-Metric Impact Snapshot */}
              {asset.impactBreakdown && (
                <View style={styles.quickImpactGrid}>
                  <View style={styles.quickImpactCell}>
                    <Users size={12} color="#3B82F6" />
                    <Text style={styles.quickImpactText}>{asset.impactBreakdown.peopleReached}</Text>
                  </View>
                  <View style={styles.quickImpactCell}>
                    <TreePine size={12} color="#10B981" />
                    <Text style={styles.quickImpactText}>{asset.impactBreakdown.environmentalBenefit.split(',')[0]}</Text>
                  </View>
                  <View style={styles.quickImpactCell}>
                    <Briefcase size={12} color="#F59E0B" />
                    <Text style={styles.quickImpactText}>{asset.impactBreakdown.jobsSupported}</Text>
                  </View>
                </View>
              )}
            </View>
          )}
        </GlassCard>
      </Pressable>

      {/* Star Watchlist Toggle */}
      <Pressable
        onPress={onStarToggle}
        hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
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
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardPressable: {
    width: '100%',
  },
  pressedState: {
    opacity: 0.95,
    transform: [{ scale: 0.99 }],
  },
  cardInner: {
    padding: 20,
    borderRadius: 18,
  },
  mainInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingRight: 36, // Ensure space for the top-right star
  },
  leftColumn: {
    flex: 1,
    paddingRight: 16,
    gap: 4,
  },
  symbolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  symbolText: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.textBright,
    lineHeight: 20,
    letterSpacing: 0.2,
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
  assetName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 6,
  },
  badgeWrapper: {
    alignSelf: 'flex-start',
  },
  scoreBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
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
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  unlockedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.emeraldBright,
  },
  rightColumn: {
    alignItems: 'flex-end',
    gap: 6,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.textBright,
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  changePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  changeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F0F3EE',
    paddingTop: 16,
    marginTop: 16,
  },
  metricPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricVal: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textBright,
  },
  expandToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'transparent',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  expandToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.emeraldBright,
  },
  expandedDrawer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F3EE',
    gap: 10,
  },
  impactTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  impactTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D5C46',
  },
  impactSnippetText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  quickImpactGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  quickImpactCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F0F3EE',
  },
  quickImpactText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textBright,
  },
  starButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    padding: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  starPressed: {
    transform: [{ scale: 1.1 }],
    opacity: 0.8,
  },
});
