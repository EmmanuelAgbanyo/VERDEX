import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { COLORS, LAYOUT } from '@/constants/theme';
import { X, Briefcase, Award, ArrowUpRight, ShieldCheck } from 'lucide-react-native';

interface CareerOverlayModalProps {
  visible: boolean;
  onClose: () => void;
  badgeTitle?: string;
}

export const CareerOverlayModal: React.FC<CareerOverlayModalProps> = ({
  visible,
  onClose,
  badgeTitle = 'Climate Signal Reader',
}) => {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose} accessibilityLabel="Close modal background">
        {/* Centered Modal Content Card (Sibling Pressable prevents backdrop click propagation) */}
        <Pressable
          style={styles.modalCard}
          onPress={(e) => e.stopPropagation()}
          accessible={true}
          accessibilityViewIsModal={true}
          accessibilityRole="dialog"
          aria-modal={true}
          accessibilityLabel={`Career Path: ${badgeTitle}`}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.badgeHeaderRow}>
              <Award size={20} color={COLORS.amberDataBright} />
              <Text style={styles.badgeTitleText}>{badgeTitle}</Text>
            </View>
            <Pressable
              onPress={onClose}
              style={styles.closeBtn}
              accessibilityLabel="Close career path modal"
              accessibilityRole="button"
              hitSlop={10}
            >
              <X size={18} color={COLORS.textBright} />
            </Pressable>
          </View>

          <ScrollView style={styles.scrollArea}>
            {/* Skill Acquired Box */}
            <View style={styles.skillBox}>
              <View style={styles.skillTitleRow}>
                <ShieldCheck size={14} color={COLORS.emeraldBright} />
                <Text style={styles.skillTitle}>Validated Skill Competency</Text>
              </View>
              <Text style={styles.skillDescription}>
                Analyzed environmental sensor data (Air Quality, Rainfall Anomaly, Solar Yield) to inform structured capital allocation decisions under market uncertainty.
              </Text>
            </View>

            {/* Relevant Career Roles */}
            <Text style={styles.sectionHeader}>Applicable Career Pathways:</Text>

            <View style={styles.careerList}>
              <View style={styles.careerItem}>
                <View style={styles.careerItemHeader}>
                  <Briefcase size={14} color={COLORS.emeraldBright} />
                  <Text style={styles.careerRoleTitle}>ESG Risk Analyst</Text>
                </View>
                <Text style={styles.careerRoleDesc}>
                  Evaluates environmental risks & regulatory factors for African commercial banks and green development funds.
                </Text>
              </View>

              <View style={styles.careerItem}>
                <View style={styles.careerItemHeader}>
                  <Briefcase size={14} color={COLORS.emeraldBright} />
                  <Text style={styles.careerRoleTitle}>Junior Green Portfolio Manager</Text>
                </View>
                <Text style={styles.careerRoleDesc}>
                  Constructs and rebalances climate-resilient asset portfolios across West African renewable and forestry bonds.
                </Text>
              </View>

              <View style={styles.careerItem}>
                <View style={styles.careerItemHeader}>
                  <Briefcase size={14} color={COLORS.emeraldBright} />
                  <Text style={styles.careerRoleTitle}>Climate Adaptation Finance Officer</Text>
                </View>
                <Text style={styles.careerRoleDesc}>
                  Structures blended finance instruments for rural cocoa cooperatives and municipal micro-grids.
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Footer Action */}
          <Pressable
            onPress={onClose}
            style={styles.doneBtn}
            accessibilityLabel="Close career view"
            accessibilityRole="button"
            hitSlop={10}
          >
            <Text style={styles.doneBtnText}>Close Career View</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 22, 17, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '92%',
    maxWidth: 540,
    alignSelf: 'center',
    maxHeight: '80%',
    backgroundColor: COLORS.bgDarkAlt,
    borderRadius: LAYOUT.borderRadius,
    borderWidth: 1,
    borderColor: COLORS.cardBorderHighlight,
    padding: 18,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    paddingBottom: 10,
  },
  badgeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgeTitleText: {
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
  skillBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginBottom: 14,
  },
  skillTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  skillTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.emeraldBright,
  },
  skillDescription: {
    fontSize: 12,
    color: COLORS.textBright,
    lineHeight: 16,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  careerList: {
    gap: 8,
  },
  careerItem: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  careerItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  careerRoleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textBright,
  },
  careerRoleDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 15,
  },
  doneBtn: {
    backgroundColor: COLORS.emeraldPrimary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.bgDark,
  },
});
