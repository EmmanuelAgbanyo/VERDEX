import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { GreenAsset } from '@/types';
import { COLORS } from '@/constants/theme';
import { Star, TrendingUp, TrendingDown, MapPin, Lock, ShieldCheck, ChevronRight } from 'lucide-react-native';
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
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.cardPressable, pressed && styles.pressedState]}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`${asset.name}, ${asset.symbol}, Price GH₵${asset.price.toFixed(2)}, change ${asset.change24h >= 0 ? 'up' : 'down'} ${asset.change24h.toFixed(2)}%`}
      >
        <GlassCard style={styles.cardInner}>
          <View style={styles.mainInfoRow}>
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

              <View style={styles.footerRow}>
                <View style={styles.governanceStatus}>
                  {hasUnlockedThesis ? (
                    <>
                      <ShieldCheck size={12} color="#047857" />
                      <Text style={styles.govStatusTextUnlocked}>Trade Enabled</Text>
                    </>
                  ) : (
                    <>
                      <Lock size={12} color="#B45309" />
                      <Text style={styles.govStatusTextLocked}>Thesis Required</Text>
                    </>
                  )}
                </View>

                <View style={styles.actionArrow}>
                  <Text style={styles.actionArrowText}>View</Text>
                  <ChevronRight size={14} color="#047857" />
                </View>
              </View>
            </View>

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
        </GlassCard>
      </Pressable>

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
    marginVertical: 4,
  },
  cardPressable: {
    width: '100%',
  },
  pressedState: {
    opacity: 0.95,
    transform: [{ scale: 0.99 }],
  },
  cardInner: {
    padding: 16,
    borderRadius: 16,
  },
  mainInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftColumn: {
    flex: 1,
    paddingRight: 16,
  },
  symbolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  symbolText: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.textBright,
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
    marginBottom: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
    marginTop: 2,
  },
  governanceStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  govStatusTextUnlocked: {
    fontSize: 11,
    fontWeight: '600',
    color: '#047857',
  },
  govStatusTextLocked: {
    fontSize: 11,
    fontWeight: '600',
    color: '#B45309',
  },
  actionArrow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionArrowText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
    marginRight: 2,
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

