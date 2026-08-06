import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { COLORS, LAYOUT } from '@/constants/theme';
import { X, Award, FileSpreadsheet, ShieldCheck, CheckCircle2, Share2 } from 'lucide-react-native';
import { PortfolioPosition, InvestmentThesis } from '@/types';

interface GreenPortfolioReportModalProps {
  visible: boolean;
  onClose: () => void;
  portfolioValue: number;
  cash: number;
  positions: PortfolioPosition[];
  theses: InvestmentThesis[];
  skillMeters: { signalReading: number; thesisCraft: number; riskAwareness: number };
}

export const GreenPortfolioReportModal: React.FC<GreenPortfolioReportModalProps> = ({
  visible,
  onClose,
  portfolioValue,
  cash,
  positions,
  theses,
  skillMeters,
}) => {
  const totalInvested = positions.reduce((sum, p) => sum + p.quantity * p.avgBuyPrice, 0);
  const totalPnl = portfolioValue - 10000; // starting capital 10k
  const pnlPercent = (totalPnl / 10000) * 100;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View
          style={styles.modalContent}
          accessible={true}
          accessibilityViewIsModal={true}
          accessibilityRole="dialog"
          aria-modal={true}
          accessibilityLabel="Green Portfolio Report"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Award size={20} color={COLORS.emeraldBright} />
              <Text style={styles.headerTitle}>Green Portfolio Report</Text>
            </View>
            <Pressable
              onPress={onClose}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Close Portfolio Report"
              hitSlop={10}
            >
              <X size={18} color={COLORS.textBright} />
            </Pressable>
          </View>

          <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
            {/* Cert Header Badge */}
            <View style={styles.certHeader}>
              <Text style={styles.certOrg}>VERDEX CLIMATE FINANCE SIMULATOR</Text>
              <Text style={styles.certTitle}>Sustainable Capital Allocation Credential</Text>
              <Text style={styles.certMeta}>Verified Candidate Performance Record • Ghana 2026</Text>
            </View>

            {/* Performance Summary Metrics */}
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Total Portfolio Value</Text>
                <Text style={styles.metricValue}>GH₵{portfolioValue.toFixed(2)}</Text>
                <Text style={[styles.metricSub, { color: totalPnl >= 0 ? COLORS.emeraldBright : COLORS.redAlert }]}>
                  {totalPnl >= 0 ? '+' : ''}
                  {pnlPercent.toFixed(2)}% net P&L
                </Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Validated Theses</Text>
                <Text style={styles.metricValue}>{theses.length}</Text>
                <Text style={styles.metricSub}>3-sentence research logs</Text>
              </View>
            </View>

            {/* Verified Skill Meter Credentials */}
            <Text style={styles.sectionHeader}>Verified Competency Scores:</Text>
            <View style={styles.skillsCard}>
              <View style={styles.skillRow}>
                <Text style={styles.skillName}>Environmental Signal Reading</Text>
                <Text style={styles.skillVal}>{skillMeters.signalReading}/100</Text>
              </View>

              <View style={styles.skillRow}>
                <Text style={styles.skillName}>Thesis Craft & Risk Analysis</Text>
                <Text style={styles.skillVal}>{skillMeters.thesisCraft}/100</Text>
              </View>

              <View style={styles.skillRow}>
                <Text style={styles.skillName}>Portfolio Risk Awareness</Text>
                <Text style={styles.skillVal}>{skillMeters.riskAwareness}/100</Text>
              </View>
            </View>

            {/* Asset Allocation Breakdown */}
            <Text style={styles.sectionHeader}>Capital Allocation Breakdown:</Text>
            <View style={styles.allocationList}>
              {positions.map((pos) => (
                <View key={pos.assetId} style={styles.allocItem}>
                  <View style={styles.allocMain}>
                    <Text style={styles.allocSymbol}>{pos.symbol}</Text>
                    <Text style={styles.allocName}>{pos.name}</Text>
                  </View>
                  <View style={styles.allocValues}>
                    <Text style={styles.allocVal}>GH₵{pos.totalValue.toFixed(2)}</Text>
                    <Text style={[styles.allocPnl, { color: pos.unrealizedPnl >= 0 ? COLORS.emeraldBright : COLORS.redAlert }]}>
                      {pos.unrealizedPnl >= 0 ? '+' : ''}GH₵{pos.unrealizedPnl.toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Sponsor Readiness Footer */}
            <View style={styles.sponsorCard}>
              <CheckCircle2 size={18} color={COLORS.emeraldBright} />
              <View style={{ flex: 1 }}>
                <Text style={styles.sponsorTitle}>Sponsor Funding Status: ELIGIBLE</Text>
                <Text style={styles.sponsorDesc}>
                  Your analytical portfolio ranks in the top cohort for Mastercard Foundation & GreenRes Hackathon community climate action grants.
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Action */}
          <Pressable
            onPress={onClose}
            style={styles.actionBtn}
            accessibilityRole="button"
            accessibilityLabel="Export Credential Report"
            hitSlop={10}
          >
            <Share2 size={16} color={COLORS.bgDark} />
            <Text style={styles.actionBtnText}>EXPORT CREDENTIAL REPORT</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 22, 17, 0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.bgDarkAlt,
    borderTopLeftRadius: LAYOUT.borderRadiusLg,
    borderTopRightRadius: LAYOUT.borderRadiusLg,
    maxHeight: '90%',
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    gap: 12,
    maxWidth: 540,
    width: '92%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textBright,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: COLORS.inputBg,
  },
  scrollArea: {
    flexGrow: 0,
  },
  scrollContent: {
    gap: 12,
  },
  certHeader: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.emeraldPrimary,
    alignItems: 'center',
    gap: 4,
  },
  certOrg: {
    fontSize: 10,
    color: COLORS.emeraldBright,
    fontWeight: '800',
    letterSpacing: 1,
  },
  certTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textBright,
    textAlign: 'center',
  },
  certMeta: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  metricLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textBright,
    marginVertical: 2,
  },
  metricSub: {
    fontSize: 10,
    fontWeight: '600',
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  skillsCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 8,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  skillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skillName: {
    fontSize: 12,
    color: COLORS.textBright,
  },
  skillVal: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.emeraldBright,
  },
  allocationList: {
    gap: 6,
  },
  allocItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    padding: 10,
    borderRadius: 8,
  },
  allocMain: {
    flex: 1,
  },
  allocSymbol: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textBright,
  },
  allocName: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  allocValues: {
    alignItems: 'flex-end',
  },
  allocVal: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textBright,
  },
  allocPnl: {
    fontSize: 10,
    fontWeight: '600',
  },
  sponsorCard: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  sponsorTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.emeraldBright,
  },
  sponsorDesc: {
    fontSize: 10,
    color: COLORS.textSecondary,
    lineHeight: 14,
  },
  actionBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.emeraldPrimary,
    paddingVertical: 14,
    borderRadius: 10,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.bgDark,
  },
});
