import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Pressable, useWindowDimensions } from 'react-native';
import { useApp } from '@/context/AppContext';
import { Header } from '@/components/Header';
import { SignalBadge } from '@/components/SignalBadge';
import { GlassCard } from '@/components/GlassCard';
import { COLORS, LAYOUT } from '@/constants/theme';
import {
  Leaf,
  ShieldCheck,
  ArrowRight,
  Activity,
  Clock,
  Zap,
  BarChart2,
  BookOpen,
  Briefcase,
  Sparkles,
  TrendingUp,
  MapPin,
  Award,
  ChevronRight,
  Heart,
} from 'lucide-react-native';
import { DataSaverBanner } from '@/components/DataSaverToggle';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  const {
    signals,
    assets,
    theses,
    orders,
    xp,
    streak,
    dailyChallenge,
    sessionTimeRemaining,
    isRefreshing,
    isDataSaver,
    refreshData,
    getPortfolioValue,
  } = useApp();

  const router = useRouter();
  const portfolioValue = getPortfolioValue();
  const activeThesesCount = theses.length;

  // Spotlight asset: highest signal score
  const spotlightAsset = [...assets].sort((a, b) => b.signalScore - a.signalScore)[0] || assets[0];
  const isSpotlightPositive = spotlightAsset ? spotlightAsset.change24h >= 0 : true;

  return (
    <View style={[styles.container, isDataSaver && styles.containerDataSaver]}>
      <DataSaverBanner />
      {/* Dynamic Ambient Background Blobs */}
      {!isDataSaver && (
        <>
          <View style={[styles.blurBlob, styles.blobGreen]} />
          <View style={[styles.blurBlob, styles.blobAmber]} />
        </>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, styles.mainWrapper]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshData}
            tintColor={COLORS.emeraldBright}
            colors={[COLORS.emeraldBright]}
          />
        }
      >
        {/* Welcome Header */}
        <Header portfolioValue={portfolioValue} sessionTimeRemaining={sessionTimeRemaining} />

        {/* QUICK ACTION DOCK WITH COMMUNITY IMPACT METRIC */}
        <View style={styles.quickDockRow}>
          <Pressable
            onPress={() => router.push('/(tabs)/markets')}
            style={({ pressed }) => [styles.quickDockBtn, pressed && styles.pressedState]}
            accessibilityRole="button"
            accessibilityLabel="Markets, Trade Green Assets"
          >
            <View style={[styles.quickDockIcon, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
              <BarChart2 size={20} color="#10B981" />
            </View>
            <Text style={styles.quickDockTitle}>Markets</Text>
            <Text style={styles.quickDockSub}>Trade Assets</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/(tabs)/learn')}
            style={({ pressed }) => [styles.quickDockBtn, pressed && styles.pressedState]}
            accessibilityRole="button"
            accessibilityLabel="Green Academy, Learn and Earn XP"
          >
            <View style={[styles.quickDockIcon, { backgroundColor: 'rgba(59, 130, 246, 0.12)' }]}>
              <BookOpen size={20} color="#3B82F6" />
            </View>
            <Text style={styles.quickDockTitle}>Academy</Text>
            <Text style={styles.quickDockSub}>+{xp} XP</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/(tabs)/portfolio')}
            style={({ pressed }) => [styles.quickDockBtn, pressed && styles.pressedState]}
            accessibilityRole="button"
            accessibilityLabel="Portfolio, Holdings"
          >
            <View style={[styles.quickDockIcon, { backgroundColor: 'rgba(245, 158, 11, 0.12)' }]}>
              <Briefcase size={20} color="#F59E0B" />
            </View>
            <Text style={styles.quickDockTitle}>Portfolio</Text>
            <Text style={styles.quickDockSub}>Holdings</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/(tabs)/portfolio')}
            style={({ pressed }) => [styles.quickDockBtn, pressed && styles.pressedState]}
            accessibilityRole="button"
            accessibilityLabel="1,540 Reached, Community Impact"
          >
            <View style={[styles.quickDockIcon, { backgroundColor: 'rgba(236, 72, 153, 0.12)' }]}>
              <Heart size={20} color="#EC4899" />
            </View>
            <Text style={styles.quickDockTitle}>Impact</Text>
            <Text style={styles.quickDockSub}>1,540 Reached</Text>
          </Pressable>
        </View>

        <View style={styles.sectionDivider} />

        {/* LIVE CLIMATE SENSORS */}
        <View
          style={styles.sectionHeaderRow}
          accessible={true}
          accessibilityRole="header"
          accessibilityLabel="Climate Signals"
        >
          <Text style={styles.sectionTitle}>Climate Signals</Text>
          <View style={styles.livePulseBadge}>
            <View style={styles.pulseDot} />
            <Text style={styles.updatedText}>LIVE</Text>
          </View>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.signalsScroll}
          contentContainerStyle={styles.signalsScrollContent}
        >
          {signals.map((sig) => (
            <View key={sig.id} style={styles.signalCardWrapper}>
              <SignalBadge signal={sig} />
            </View>
          ))}
        </ScrollView>

        {/* FEATURED ASSET SPOTLIGHT */}
        {spotlightAsset && (
          <GlassCard variant="dark" showGrid style={styles.spotlightCard}>
            <View style={styles.spotlightHeader}>
              <View style={styles.spotlightTagGroup}>
                <Sparkles size={14} color="#F59E0B" />
                <Text style={styles.spotlightTagText}>TOP SIGNAL ASSET</Text>
              </View>
              <View style={styles.signalGaugeBadge}>
                <Text style={styles.signalGaugeText}>Signal Score {spotlightAsset.signalScore}/100</Text>
              </View>
            </View>

            <View style={styles.spotlightMainRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.spotlightSymbol}>{spotlightAsset.symbol}</Text>
                <Text style={styles.spotlightName}>{spotlightAsset.name}</Text>
                <View style={styles.spotlightRegionRow}>
                  <MapPin size={12} color="#10B981" />
                  <Text style={styles.spotlightRegionText}>{spotlightAsset.regionLabel}</Text>
                </View>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.spotlightPrice}>GH₵{spotlightAsset.price.toFixed(2)}</Text>
                <View
                  style={[
                    styles.spotlightChangePill,
                    { backgroundColor: isSpotlightPositive ? 'rgba(52, 211, 153, 0.2)' : 'rgba(239, 68, 68, 0.2)' },
                  ]}
                >
                  <TrendingUp size={12} color={isSpotlightPositive ? '#34D399' : '#FCA5A5'} />
                  <Text
                    style={[
                      styles.spotlightChangeText,
                      { color: isSpotlightPositive ? '#34D399' : '#FCA5A5' },
                    ]}
                  >
                    {isSpotlightPositive ? '+' : ''}{spotlightAsset.change24h.toFixed(2)}%
                  </Text>
                </View>
              </View>
            </View>

            <Pressable
              onPress={() => router.push(`/asset/${spotlightAsset.id}` as any)}
              style={({ pressed }) => [styles.spotlightCta, pressed && { opacity: 0.88 }]}
              accessibilityRole="button"
              accessibilityLabel={`Inspect ${spotlightAsset.name}`}
            >
              <Text style={styles.spotlightCtaText}>Inspect Asset Diagnostic</Text>
              <ChevronRight size={16} color="#FFFFFF" />
            </Pressable>
          </GlassCard>
        )}

        {/* THESIS RESEARCH CARD */}
        <View
          style={styles.sectionHeaderRow}
          accessible={true}
          accessibilityRole="header"
          accessibilityLabel="Thesis Research"
        >
          <Text style={styles.sectionTitle}>Thesis Research</Text>
          <ShieldCheck size={18} color={COLORS.emeraldBright} />
        </View>

        <View style={styles.researchWidget}>
          <View style={styles.researchWidgetHeader}>
            <View style={styles.iconCircle}>
              <Leaf size={18} color="#0D5C46" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.widgetTitleRow}>
                <Text style={styles.widgetTitle}>Research Lock Active</Text>
                <View style={styles.badgePill}>
                  <Text style={styles.badgePillText}>{activeThesesCount}/3 Unlocked</Text>
                </View>
              </View>
              <Text style={styles.widgetSubtitle}>
                Submit a 3-sentence thesis on any asset to unlock order execution tickets.
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => router.push('/(tabs)/markets')}
            style={({ pressed }) => [styles.actionButton, pressed && { opacity: 0.85 }]}
            accessibilityRole="button"
            accessibilityLabel="Explore Markets"
          >
            <Text style={styles.actionButtonText}>Explore Markets</Text>
            <ArrowRight size={16} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* RECENT ORDERS */}
        <View
          style={styles.sectionHeaderRow}
          accessible={true}
          accessibilityRole="header"
          accessibilityLabel="Recent Orders"
        >
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <Activity size={18} color={COLORS.amberDataBright} />
        </View>

        {orders.length === 0 ? (
          <GlassCard showGrid style={styles.emptyOrdersCard}>
            <Clock size={20} color={COLORS.textMuted} />
            <Text style={styles.emptyOrdersText}>No trades executed in this session yet.</Text>
            <Text style={styles.emptyOrdersSub}>Unlock Research Lock on any asset to place an order.</Text>
          </GlassCard>
        ) : (
          <GlassCard style={styles.ordersCardWrapper}>
            <View style={styles.ordersList}>
              {orders.slice(0, 3).map((ord, idx) => (
                <React.Fragment key={ord.id}>
                  <View style={styles.orderRow}>
                    <View style={styles.orderLeft}>
                      <Text
                        style={[
                          styles.orderSide,
                          { color: ord.side === 'buy' ? COLORS.emeraldBright : COLORS.redAlert },
                        ]}
                      >
                        {ord.side.toUpperCase()}
                      </Text>
                      <View>
                        <Text style={styles.orderSymbol}>{ord.symbol}</Text>
                        <Text style={styles.orderMeta}>
                          {ord.quantity} units @ GH₵{ord.price.toFixed(2)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.orderRight}>
                      <Text style={styles.orderVal}>GH₵{ord.totalValue.toFixed(2)}</Text>
                      <Text style={styles.orderStatus}>{ord.status.toUpperCase()}</Text>
                    </View>
                  </View>
                  {idx < Math.min(orders.length - 1, 2) && <View style={styles.orderDivider} />}
                </React.Fragment>
              ))}
            </View>
          </GlassCard>
        )}

        {/* CLEAN FOOTER */}
        <Text style={styles.disclaimerText}>
          VERDEX Green Economy Trading Platform • Accra Node
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    maxWidth: 840,
    width: '100%',
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
    position: 'relative',
    overflow: 'hidden',
  },
  blurBlob: {
    position: 'absolute',
    borderRadius: 999,
  },
  blobGreen: {
    width: 300,
    height: 300,
    backgroundColor: 'rgba(16, 185, 129, 0.04)',
    top: -80,
    left: -80,
  },
  blobAmber: {
    width: 240,
    height: 240,
    backgroundColor: 'rgba(245, 158, 11, 0.03)',
    top: 380,
    right: -60,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  pressedState: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  quickDockRow: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 32,
  },
  quickDockBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E4EAE2',
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#102A1F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  quickDockIcon: {
    padding: 10,
    borderRadius: 16,
    marginBottom: 10,
  },
  quickDockTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1A2E26',
    textAlign: 'center',
  },
  quickDockSub: {
    fontSize: 9,
    fontWeight: '600',
    color: '#7C8E84',
    marginTop: 2,
    textAlign: 'center',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: 'rgba(228, 234, 226, 0.4)',
    marginHorizontal: 16,
    marginTop: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textBright,
    letterSpacing: -0.3,
  },
  livePulseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  updatedText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.5,
  },
  signalsScroll: {
    marginBottom: 32,
  },
  signalsScrollContent: {
    paddingHorizontal: 16,
    paddingRight: 32,
  },
  signalCardWrapper: {
    marginRight: 16,
  },
  spotlightCard: {
    marginHorizontal: 16,
    padding: 20,
    gap: 16,
    marginBottom: 32,
    borderRadius: 20,
  },
  spotlightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spotlightTagGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  spotlightTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#F59E0B',
    letterSpacing: 1,
  },
  signalGaugeBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  signalGaugeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#F59E0B',
  },
  spotlightMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spotlightSymbol: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  spotlightName: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
  },
  spotlightRegionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  spotlightRegionText: {
    fontSize: 11,
    color: '#34D399',
    fontWeight: '600',
  },
  spotlightPrice: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  spotlightChangePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 6,
  },
  spotlightChangeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  spotlightCta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    marginTop: 4,
  },
  spotlightCtaText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  researchWidget: {
    marginHorizontal: 16,
    padding: 20,
    gap: 16,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(228, 234, 226, 0.6)',
    borderRadius: 16,
    shadowColor: '#102A1F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 32,
  },
  researchWidgetHeader: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  iconCircle: {
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  widgetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  widgetTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0D5C46',
  },
  badgePill: {
    backgroundColor: '#0D5C46',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  widgetSubtitle: {
    fontSize: 13,
    color: '#286F58',
    marginTop: 4,
    lineHeight: 18,
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0D5C46',
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#0D5C46',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.20,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  emptyOrdersCard: {
    marginHorizontal: 16,
    alignItems: 'center',
    padding: 24,
    gap: 12,
    marginBottom: 32,
  },
  emptyOrdersText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textBright,
  },
  emptyOrdersSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  ordersCardWrapper: {
    marginHorizontal: 16,
    padding: 8,
    marginBottom: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(228, 234, 226, 0.6)',
  },
  ordersList: {
    gap: 0,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  orderDivider: {
    height: 1,
    backgroundColor: 'rgba(228, 234, 226, 0.5)',
    marginHorizontal: 12,
  },
  orderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  orderSide: {
    fontSize: 13,
    fontWeight: '900',
  },
  orderSymbol: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textBright,
  },
  orderMeta: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  orderRight: {
    alignItems: 'flex-end',
  },
  orderVal: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textBright,
  },
  orderStatus: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.emeraldBright,
    marginTop: 2,
  },
  disclaimerText: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    letterSpacing: 0.2,
    marginTop: 8,
    marginBottom: 32,
  },
  containerDataSaver: {
    backgroundColor: '#000000',
  },
});
