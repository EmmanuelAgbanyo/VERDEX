import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl, useWindowDimensions } from 'react-native';
import { useApp } from '@/context/AppContext';
import { GlassCard } from '@/components/GlassCard';
import { GreenPortfolioReportModal } from '@/components/GreenPortfolioReportModal';
import { CareerOverlayModal } from '@/components/CareerOverlayModal';
import { COLORS, LAYOUT } from '@/constants/theme';
import { Briefcase, Award, ArrowUpRight, ShieldCheck, Star, PieChart, Trophy, FileText, CheckCircle2, Lock, Heart, Users, TreePine, Shield } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function PortfolioScreen() {
  const {
    cash,
    positions,
    theses,
    skillMeters,
    isRefreshing,
    refreshData,
    getPortfolioValue,
  } = useApp();

  const router = useRouter();
  const [reportModalVisible, setReportModalVisible] = useState<boolean>(false);
  const [careerModalVisible, setCareerModalVisible] = useState<boolean>(false);

  const portfolioValue = getPortfolioValue();
  const netPnl = portfolioValue - 10000;
  const netPnlPercent = (netPnl / 10000) * 100;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshData}
            tintColor={COLORS.emeraldBright}
            colors={[COLORS.emeraldBright]}
          />
        }
      >
        {/* Screen Header */}
        <View style={styles.headerArea}>
          <Text style={styles.screenTitle}>Portfolio</Text>
          <Text style={styles.screenDesc}>
            Track position performance, sponsor readiness, and verified green finance badges.
          </Text>
        </View>

        {/* PORTFOLIO PERFORMANCE SUMMARY */}
        <GlassCard variant="emerald" showGrid style={styles.perfCard}>
          <View style={styles.perfHeader}>
            <View>
              <Text style={styles.perfLabel}>TOTAL PORTFOLIO VALUE</Text>
              <Text style={styles.perfVal}>GH₵{portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
            </View>

            <View style={[styles.pnlPill, { backgroundColor: netPnl >= 0 ? 'rgba(52, 211, 153, 0.25)' : 'rgba(239, 68, 68, 0.25)' }]}>
              <Text style={[styles.pnlPillText, { color: netPnl >= 0 ? '#34D399' : '#FCA5A5' }]}>
                {netPnl >= 0 ? '+' : ''}GH₵{netPnl.toFixed(2)} ({netPnlPercent.toFixed(2)}%)
              </Text>
            </View>
          </View>

          <View style={styles.subGrid}>
            <View style={styles.subBox}>
              <Text style={styles.subLabel}>AVAILABLE CASH</Text>
              <Text style={styles.subVal}>GH₵{cash.toFixed(2)}</Text>
            </View>

            <View style={styles.subBox}>
              <Text style={styles.subLabel}>ACTIVE POSITIONS</Text>
              <Text style={styles.subVal}>{positions.length}</Text>
            </View>

            <View style={styles.subBox}>
              <Text style={styles.subLabel}>VALIDATED THESES</Text>
              <Text style={styles.subVal}>{theses.length}</Text>
            </View>
          </View>

          {/* Report Trigger Button */}
          <Pressable
            onPress={() => setReportModalVisible(true)}
            style={({ pressed }) => [styles.reportBtn, pressed && { opacity: 0.9 }]}
            accessibilityRole="button"
            accessibilityLabel="View Green Portfolio Report"
            accessibilityHint="Opens a modal with your green portfolio report"
          >
            <FileText size={16} color="#0D5C46" />
            <Text style={styles.reportBtnText}>VIEW GREEN PORTFOLIO REPORT</Text>
          </Pressable>
        </GlassCard>

        {/* POINT 4: YOUR COLLECTIVE COMMUNITY IMPACT CARD */}
        <GlassCard style={styles.collectiveImpactCard}>
          <View style={styles.impactCardHeader}>
            <Heart size={16} color="#EC4899" />
            <Text style={styles.impactCardTitle}>Your Collective Impact</Text>
          </View>
          <Text style={styles.impactCardSub}>
            Your virtual capital allocations have generated real-world resilience benefits across Ghanaian cooperatives:
          </Text>

          <View style={styles.impactMetricsGrid}>
            <View style={styles.impactStatBox}>
              <Users size={16} color="#3B82F6" />
              <Text style={styles.impactStatNum}>1,540</Text>
              <Text style={styles.impactStatLabel}>People Impacted</Text>
            </View>
            <View style={styles.impactStatBox}>
              <TreePine size={16} color="#10B981" />
              <Text style={styles.impactStatNum}>320 tCO₂</Text>
              <Text style={styles.impactStatLabel}>Carbon Avoided/yr</Text>
            </View>
            <View style={styles.impactStatBox}>
              <Shield size={16} color="#F59E0B" />
              <Text style={styles.impactStatNum}>1,200 ha</Text>
              <Text style={styles.impactStatLabel}>Resilient Land</Text>
            </View>
          </View>
        </GlassCard>

        {/* SPONSOR READINESS & LEADERBOARD RANK */}
        <View style={styles.gridRow}>
          <GlassCard style={styles.gridCard}>
            <View style={styles.cardHeaderRow}>
              <Trophy size={16} color="#F59E0B" />
              <Text style={styles.cardHeaderTitle}>Leaderboard</Text>
            </View>
            <Text style={styles.rankBig}>#4</Text>
            <Text style={styles.rankSub}>Top 2% of 1,240 Analysts</Text>
          </GlassCard>

          <GlassCard style={styles.gridCard}>
            <View style={styles.cardHeaderRow}>
              <CheckCircle2 size={16} color="#10B981" />
              <Text style={styles.cardHeaderTitle}>Sponsor Pool</Text>
            </View>
            <Text style={[styles.rankBig, { color: '#10B981' }]}>92%</Text>
            <Text style={styles.rankSub}>Mastercard Grant Eligible</Text>
          </GlassCard>
        </View>

        {/* POSITIONS LIST */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Asset Allocation</Text>
        </View>

        {positions.length === 0 ? (
          <GlassCard showGrid style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No open asset positions</Text>
            <Text style={styles.emptySub}>Visit Markets to research and allocate capital.</Text>
          </GlassCard>
        ) : (
          <View style={styles.positionsList}>
            {positions.map((pos) => {
              const isPositive = pos.unrealizedPnl >= 0;
              return (
                <Pressable
                  key={pos.assetId}
                  onPress={() => router.push(`/asset/${pos.assetId}` as any)}
                  style={({ pressed }) => [styles.posRow, pressed && { opacity: 0.9 }]}
                  accessibilityRole="button"
                  accessibilityLabel={`Position for ${pos.name}`}
                  accessibilityHint={`View details for ${pos.symbol}`}
                >
                  <View style={styles.posLeft}>
                    <Text style={styles.posSymbol}>{pos.symbol}</Text>
                    <Text style={styles.posName}>{pos.name}</Text>
                    <Text style={styles.posMeta}>
                      {pos.quantity} units @ GH₵{pos.avgBuyPrice.toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.posRight}>
                    <Text style={styles.posTotal}>GH₵{pos.totalValue.toFixed(2)}</Text>
                    <Text style={[styles.posPnl, { color: isPositive ? COLORS.emeraldBright : COLORS.redAlert }]}>
                      {isPositive ? '+' : ''}GH₵{pos.unrealizedPnl.toFixed(2)} ({pos.unrealizedPnlPercent.toFixed(2)}%)
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* BADGES SECTION */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Verified Green Badges</Text>
        </View>

        <View style={styles.badgeList}>
          {/* Unlocked Badge */}
          <GlassCard style={styles.badgeCard}>
            <View style={styles.badgeHeader}>
              <View style={styles.badgeIconCircle}>
                <Star size={18} color="#F59E0B" fill="#F59E0B" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.badgeTitle}>Climate Signal Reader</Text>
                <Text style={styles.badgeDesc}>You traded based on environmental data analysis.</Text>
              </View>
            </View>

            <Pressable
              onPress={() => setCareerModalVisible(true)}
              style={({ pressed }) => [styles.careerLinkBtn, pressed && { opacity: 0.8 }]}
              accessibilityLabel="See Career Paths for Climate Signal Reader"
              accessibilityRole="button"
              accessibilityHint="Opens a modal with career pathways"
            >
              <Text style={styles.careerLinkText}>[See Career Paths →]</Text>
            </Pressable>
          </GlassCard>

          {/* Locked Badge */}
          <GlassCard style={styles.badgeCardLocked}>
            <View style={styles.badgeHeader}>
              <View style={styles.badgeIconLocked}>
                <Lock size={18} color={COLORS.textMuted} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.badgeTitleLocked}>Diversification Pro</Text>
                <Text style={styles.badgeDescLocked}>Trade across 3 different asset classes to unlock.</Text>
              </View>
            </View>
          </GlassCard>
        </View>
      </ScrollView>

      {/* Report Modal */}
      <GreenPortfolioReportModal
        visible={reportModalVisible}
        onClose={() => setReportModalVisible(false)}
        portfolioValue={portfolioValue}
        cash={cash}
        positions={positions}
        theses={theses}
        skillMeters={skillMeters}
      />

      {/* Career Overlay Modal */}
      <CareerOverlayModal
        visible={careerModalVisible}
        onClose={() => setCareerModalVisible(false)}
        badgeTitle="Climate Signal Reader"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
    maxWidth: 840,
    width: '100%',
    alignSelf: 'center',
  },
  headerArea: {
    marginBottom: 12,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textBright,
    letterSpacing: -0.5,
  },
  screenDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 17,
  },
  perfCard: {
    padding: 20,
    gap: 14,
    marginBottom: 14,
    borderRadius: 20,
  },
  perfHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  perfLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#A7F3D0',
    letterSpacing: 1,
  },
  perfVal: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    marginVertical: 4,
    letterSpacing: -0.5,
  },
  pnlPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pnlPillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  subGrid: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    paddingTop: 10,
  },
  subBox: {
    flex: 1,
  },
  subLabel: {
    fontSize: 9,
    color: '#A7F3D0',
    fontWeight: '700',
  },
  subVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 1,
  },
  reportBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#0D5C46',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  reportBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0D5C46',
    letterSpacing: 0.5,
  },
  collectiveImpactCard: {
    padding: 16,
    gap: 10,
    marginBottom: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(253, 242, 248, 0.7)',
    borderColor: 'rgba(236, 72, 153, 0.2)',
  },
  impactCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  impactCardTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#BE185D',
  },
  impactCardSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  impactMetricsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  impactStatBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FBCFE8',
    alignItems: 'center',
    gap: 2,
  },
  impactStatNum: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.textBright,
    marginTop: 2,
  },
  impactStatLabel: {
    fontSize: 9,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  gridRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  gridCard: {
    flex: 1,
    padding: 14,
    gap: 6,
    borderRadius: 18,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardHeaderTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textBright,
  },
  rankBig: {
    fontSize: 28,
    fontWeight: '900',
    color: '#F59E0B',
    letterSpacing: -0.5,
  },
  rankSub: {
    fontSize: 10,
    color: COLORS.textMuted,
    lineHeight: 14,
  },
  sectionHeaderRow: {
    marginTop: 14,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textBright,
  },
  emptyCard: {
    padding: 20,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textBright,
  },
  emptySub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  positionsList: {
    gap: 6,
    marginBottom: 12,
  },
  posRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E4EAE2',
    shadowColor: '#102A1F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  posLeft: {
    flex: 1,
  },
  posSymbol: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textBright,
  },
  posName: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  posMeta: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  posRight: {
    alignItems: 'flex-end',
  },
  posTotal: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textBright,
  },
  posPnl: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgeList: {
    gap: 8,
  },
  badgeCard: {
    padding: 14,
    gap: 8,
  },
  badgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  badgeIconCircle: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textBright,
  },
  badgeDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  careerLinkBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderRadius: 6,
    marginTop: 4,
  },
  careerLinkText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.emeraldBright,
  },
  badgeCardLocked: {
    padding: 14,
    opacity: 0.5,
  },
  badgeIconLocked: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F0',
  },
  badgeTitleLocked: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  badgeDescLocked: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
});
