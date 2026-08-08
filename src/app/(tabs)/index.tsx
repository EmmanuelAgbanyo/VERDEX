import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/Header';
import { Sparkline } from '@/components/Sparkline';
import { COLORS } from '@/constants/theme';
import {
  BarChart2,
  BookOpen,
  Heart,
  Bookmark,
  CloudRain,
  Wind,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Clock,
  Radio,
  Users,
  MapPin,
} from 'lucide-react-native';

export default function DashboardScreen() {
  const {
    assets,
    xp,
    sessionTimeRemaining,
    isRefreshing,
    refreshData,
    getPortfolioValue,
  } = useApp();

  const router = useRouter();
  const rawPortfolioVal = getPortfolioValue();
  const portfolioVal = rawPortfolioVal > 0 ? rawPortfolioVal : 20411.61;

  // Format session timer as 28:19 or similar
  const minutes = Math.floor(sessionTimeRemaining / 60);
  const seconds = sessionTimeRemaining % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  // Dynamically select the top signal asset from market state (highest signalScore)
  const topAsset = [...assets].sort((a, b) => b.signalScore - a.signalScore)[0] || assets[0] || {
    id: 'asset-volta-mangrove',
    symbol: 'V-CARBON',
    name: 'Volta Estuary Mangrove Carbon Token',
    regionLabel: 'Ada Foah, Volta Delta',
    price: 28.75,
    change24h: 8.42,
    signalScore: 95,
    whyThisMattersSnippet: 'Strong climate resilience and improving market conditions.',
  };

  const isTopAssetPositive = topAsset.change24h >= 0;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshData}
            tintColor={COLORS.emeraldPrimary}
            colors={[COLORS.emeraldPrimary]}
          />
        }
      >
        {/* 1. HEADER */}
        <Header onNotificationPress={() => {}} />

        {/* 2. PORTFOLIO OVERVIEW — PRIMARY HERO */}
        <View style={styles.portfolioCard}>
          <View style={styles.portfolioCardHeader}>
            <Text style={styles.portfolioCardLabel}>TOTAL PORTFOLIO</Text>
            <View style={styles.liveBadge}>
              <Radio size={11} color="#34D399" />
              <Text style={styles.liveBadgeText}>LIVE</Text>
            </View>
          </View>

          <Text style={styles.portfolioValue}>
            GH₵{portfolioVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>

          <View style={styles.portfolioRow}>
            <View style={styles.changeBadge}>
              <TrendingUp size={13} color="#34D399" />
              <Text style={styles.changeText}>+GH₵1,274.36 · +6.42% today</Text>
            </View>
          </View>

          {/* Sparkline & Footer Row */}
          <View style={styles.portfolioFooter}>
            <View style={styles.portfolioFooterInfo}>
              <Text style={styles.updatedText}>Updated 28 sec ago</Text>
              <View style={styles.marketCloseRow}>
                <Clock size={11} color="rgba(167, 243, 208, 0.7)" />
                <Text style={styles.marketCloseText}>Market closes in {timeFormatted}</Text>
              </View>
            </View>

            <View style={styles.sparklineWrapper}>
              <Sparkline width={110} height={36} color="#34D399" />
            </View>
          </View>
        </View>

        {/* 3. QUICK ACTIONS */}
        <View style={styles.quickActionsRow}>
          <Pressable
            onPress={() => router.push('/(tabs)/markets')}
            style={({ pressed }) => [styles.quickActionBtn, pressed && styles.pressedState]}
            accessibilityRole="button"
            accessibilityLabel="Markets, Trade Assets"
          >
            <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(16, 185, 129, 0.10)' }]}>
              <BarChart2 size={18} color="#0D5C46" strokeWidth={2.2} />
            </View>
            <Text style={styles.quickActionTitle}>Markets</Text>
            <Text style={styles.quickActionSub}>Trade Assets</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/(tabs)/learn')}
            style={({ pressed }) => [styles.quickActionBtn, pressed && styles.pressedState]}
            accessibilityRole="button"
            accessibilityLabel="Learn, XP progress"
          >
            <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(59, 130, 246, 0.10)' }]}>
              <BookOpen size={18} color="#2563EB" strokeWidth={2.2} />
            </View>
            <Text style={styles.quickActionTitle}>Learn</Text>
            <Text style={styles.quickActionSub}>+{xp || 450} XP</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/(tabs)/portfolio')}
            style={({ pressed }) => [styles.quickActionBtn, pressed && styles.pressedState]}
            accessibilityRole="button"
            accessibilityLabel="Impact, Your Contribution"
          >
            <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(236, 72, 153, 0.10)' }]}>
              <Heart size={18} color="#DB2777" strokeWidth={2.2} />
            </View>
            <Text style={styles.quickActionTitle}>Impact</Text>
            <Text style={styles.quickActionSub}>Contribution</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/(tabs)/markets')}
            style={({ pressed }) => [styles.quickActionBtn, pressed && styles.pressedState]}
            accessibilityRole="button"
            accessibilityLabel="Watchlist, Saved Assets"
          >
            <View style={[styles.quickActionIcon, { backgroundColor: 'rgba(245, 158, 11, 0.10)' }]}>
              <Bookmark size={18} color="#D97706" strokeWidth={2.2} />
            </View>
            <Text style={styles.quickActionTitle}>Watchlist</Text>
            <Text style={styles.quickActionSub}>Saved Assets</Text>
          </Pressable>
        </View>

        {/* 4. CLIMATE SIGNALS */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Climate Signals</Text>
          <View style={styles.sectionLiveBadge}>
            <View style={styles.pulseDot} />
            <Text style={styles.sectionLiveText}>LIVE</Text>
          </View>
        </View>

        <View style={styles.climateGrid}>
          {/* Card 1: Air Quality */}
          <View style={styles.climateCard}>
            <View style={styles.climateCardHeader}>
              <View style={[styles.climateIconBg, { backgroundColor: 'rgba(16, 185, 129, 0.10)' }]}>
                <Wind size={16} color="#0D5C46" />
              </View>
              <Text style={styles.climateLabel}>AIR QUALITY</Text>
            </View>

            <View style={styles.climateMainRow}>
              <Text style={styles.climateVal}>42 AQI</Text>
              <View style={styles.statusPillGood}>
                <Text style={styles.statusPillGoodText}>Good</Text>
              </View>
            </View>

            <Text style={styles.climateComparisonGood}>↓ 8% vs 7-day avg</Text>
          </View>

          {/* Card 2: Rainfall */}
          <View style={styles.climateCard}>
            <View style={styles.climateCardHeader}>
              <View style={[styles.climateIconBg, { backgroundColor: 'rgba(2, 132, 199, 0.10)' }]}>
                <CloudRain size={16} color="#0284C7" />
              </View>
              <Text style={styles.climateLabel}>RAINFALL</Text>
            </View>

            <View style={styles.climateMainRow}>
              <Text style={styles.climateVal}>114 mm</Text>
              <View style={styles.statusPillAbove}>
                <Text style={styles.statusPillAboveText}>Above avg</Text>
              </View>
            </View>

            <Text style={styles.climateComparisonAbove}>↑ 12% vs avg</Text>
          </View>
        </View>

        {/* 5. CLIMATE INSIGHT */}
        <View style={styles.insightCard}>
          <View style={styles.insightHeaderRow}>
            <View style={styles.insightTag}>
              <CloudRain size={13} color="#0284C7" />
              <Text style={styles.insightTagText}>CLIMATE INSIGHT</Text>
            </View>
          </View>

          <Text style={styles.insightTitle}>Rainfall is above normal</Text>
          <Text style={styles.insightBody}>
            Rainfall is currently 12% above the historical average in the monitored region.
          </Text>

          <Pressable
            onPress={() => router.push('/(tabs)/markets')}
            style={({ pressed }) => [styles.insightCta, pressed && styles.pressedState]}
            accessibilityRole="button"
            accessibilityLabel="View climate insight"
          >
            <Text style={styles.insightCtaText}>View climate insight</Text>
            <ArrowRight size={14} color="#0D5C46" />
          </Pressable>
        </View>

        {/* 6. TOP SIGNAL ASSET (DYNAMIC REAL MARKET DATA) */}
        <View style={styles.topSignalCard}>
          <View style={styles.topSignalHeader}>
            <View style={styles.topSignalTagGroup}>
              <Sparkles size={14} color="#F59E0B" />
              <Text style={styles.topSignalTagText}>TOP SIGNAL</Text>
            </View>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreBadgeText}>Signal Score {topAsset.signalScore}/100</Text>
            </View>
          </View>

          <View style={styles.assetTitleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.assetName}>{topAsset.name}</Text>
              <View style={styles.assetRegionRow}>
                <MapPin size={12} color="#34D399" />
                <Text style={styles.assetRegionText}>{topAsset.regionLabel}</Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.assetPrice}>GH₵{topAsset.price.toFixed(2)}</Text>
              <Text style={[styles.assetChange, { color: isTopAssetPositive ? '#34D399' : '#FCA5A5' }]}>
                {isTopAssetPositive ? '+' : ''}{topAsset.change24h.toFixed(2)}%
              </Text>
            </View>
          </View>

          <View style={styles.whyGroup}>
            <Text style={styles.whyTitle}>Why it's trending</Text>
            <Text style={styles.whyBody}>
              {topAsset.whyThisMattersSnippet || 'Strong climate resilience and improving market conditions.'}
            </Text>
          </View>

          {/* 3 Progress Indicators */}
          <View style={styles.indicatorsGroup}>
            <View style={styles.indicatorRow}>
              <Text style={styles.indicatorLabel}>Climate resilience</Text>
              <Text style={styles.indicatorVal}>90%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressBar, { width: '90%' }]} />
            </View>

            <View style={styles.indicatorRow}>
              <Text style={styles.indicatorLabel}>Market momentum</Text>
              <Text style={styles.indicatorVal}>80%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressBar, { width: '80%' }]} />
            </View>

            <View style={styles.indicatorRow}>
              <Text style={styles.indicatorLabel}>Environmental alignment</Text>
              <Text style={styles.indicatorVal}>90%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressBar, { width: '90%' }]} />
            </View>
          </View>

          <Pressable
            onPress={() => router.push(`/asset/${topAsset.id}` as any)}
            style={({ pressed }) => [styles.topSignalCta, pressed && styles.pressedState]}
            accessibilityRole="button"
            accessibilityLabel={`View signal for ${topAsset.name}`}
          >
            <Text style={styles.topSignalCtaText}>View signal</Text>
            <ChevronRight size={16} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* 7. YOUR IMPACT */}
        <View style={styles.impactCard}>
          <View style={styles.impactHeaderRow}>
            <Text style={styles.impactHeaderTitle}>Your Impact</Text>
            <View style={styles.impactIconBg}>
              <Users size={16} color="#0D5C46" />
            </View>
          </View>

          <View style={styles.impactMainRow}>
            <View>
              <Text style={styles.impactMetricVal}>1,540</Text>
              <Text style={styles.impactMetricLabel}>People reached</Text>
            </View>

            <View style={styles.impactSubBadge}>
              <TrendingUp size={12} color="#059669" />
              <Text style={styles.impactSubText}>+12% this month</Text>
            </View>
          </View>

          <Pressable
            onPress={() => router.push('/(tabs)/portfolio')}
            style={({ pressed }) => [styles.impactCta, pressed && styles.pressedState]}
            accessibilityRole="button"
            accessibilityLabel="View impact"
          >
            <Text style={styles.impactCtaText}>View impact</Text>
            <ArrowRight size={14} color="#0D5C46" />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8F5',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110, // Ensure space for floating tab bar
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  pressedState: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },

  /* PORTFOLIO HERO CARD */
  portfolioCard: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 20,
    padding: 20,
    borderRadius: 24,
    backgroundColor: '#072C22',
    shadowColor: '#072017',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
  },
  portfolioCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  portfolioCardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A7F3D0',
    letterSpacing: 1.2,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(52, 211, 153, 0.16)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  liveBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#34D399',
    letterSpacing: 0.5,
  },
  portfolioValue: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.8,
    marginVertical: 4,
  },
  portfolioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 16,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(52, 211, 153, 0.16)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#34D399',
  },
  portfolioFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  portfolioFooterInfo: {
    gap: 4,
  },
  updatedText: {
    fontSize: 11,
    color: 'rgba(167, 243, 208, 0.7)',
    fontWeight: '500',
  },
  marketCloseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  marketCloseText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#A7F3D0',
  },
  sparklineWrapper: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },

  /* QUICK ACTIONS */
  quickActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  quickActionBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E1E8DE',
    shadowColor: '#0E2E21',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  quickActionIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0D211A',
    textAlign: 'center',
  },
  quickActionSub: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B8276',
    marginTop: 2,
    textAlign: 'center',
  },

  /* CLIMATE SIGNALS */
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0D211A',
    letterSpacing: -0.3,
  },
  sectionLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(16, 185, 129, 0.10)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  sectionLiveText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0D5C46',
    letterSpacing: 0.5,
  },
  climateGrid: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  climateCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E1E8DE',
    shadowColor: '#0E2E21',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  climateCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  climateIconBg: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  climateLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6B8276',
    letterSpacing: 0.8,
  },
  climateMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  climateVal: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0D211A',
  },
  statusPillGood: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusPillGoodText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D5C46',
  },
  statusPillAbove: {
    backgroundColor: 'rgba(2, 132, 199, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusPillAboveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },
  climateComparisonGood: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  climateComparisonAbove: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0284C7',
  },

  /* CLIMATE INSIGHT */
  insightCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E1E8DE',
    borderLeftWidth: 4,
    borderLeftColor: '#0284C7',
    shadowColor: '#0E2E21',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  insightHeaderRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  insightTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(2, 132, 199, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  insightTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284C7',
    letterSpacing: 0.8,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0D211A',
    marginBottom: 4,
  },
  insightBody: {
    fontSize: 13,
    color: '#4A5D54',
    lineHeight: 19,
    marginBottom: 12,
  },
  insightCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  insightCtaText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0D5C46',
  },

  /* TOP SIGNAL ASSET */
  topSignalCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#072C22',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#072017',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 6,
  },
  topSignalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  topSignalTagGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  topSignalTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F59E0B',
    letterSpacing: 1,
  },
  scoreBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.16)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  scoreBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F59E0B',
  },
  assetTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  assetName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  assetRegionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  assetRegionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34D399',
  },
  assetPrice: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  assetChange: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  whyGroup: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  whyTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A7F3D0',
    marginBottom: 2,
  },
  whyBody: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.88)',
    lineHeight: 18,
  },
  indicatorsGroup: {
    gap: 10,
    marginBottom: 18,
  },
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  indicatorLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  indicatorVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#34D399',
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#34D399',
    borderRadius: 3,
  },
  topSignalCta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  topSignalCtaText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* YOUR IMPACT */
  impactCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E1E8DE',
    shadowColor: '#0E2E21',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  impactHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  impactHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0D211A',
  },
  impactIconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(13, 92, 70, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  impactMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  impactMetricVal: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0D211A',
    letterSpacing: -0.5,
  },
  impactMetricLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B8276',
    marginTop: 2,
  },
  impactSubBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.10)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  impactSubText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  impactCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  impactCtaText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0D5C46',
  },
});
