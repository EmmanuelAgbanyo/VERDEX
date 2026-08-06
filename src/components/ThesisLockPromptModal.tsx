import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { GreenAsset } from '@/types';
import { COLORS } from '@/constants/theme';
import { Lock, PenTool, X, ShieldAlert, Sparkles } from 'lucide-react-native';

interface ThesisLockPromptModalProps {
  visible: boolean;
  asset: GreenAsset | null;
  onClose: () => void;
  onGoToThesis: () => void;
}

export const ThesisLockPromptModal: React.FC<ThesisLockPromptModalProps> = ({
  visible,
  asset,
  onClose,
  onGoToThesis,
}) => {
  if (!visible || !asset) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.dialogCard}>
          {/* Close Button */}
          <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={10}>
            <X size={18} color={COLORS.textMuted} />
          </Pressable>

          {/* Lock Header */}
          <View style={styles.iconCircle}>
            <Lock size={32} color="#D97706" />
          </View>

          <Text style={styles.title}>Governance Thesis Lock 🔒</Text>
          <Text style={styles.subtitle}>
            Submit Research Thesis First for <Text style={styles.symbolBold}>{asset.symbol}</Text>
          </Text>

          {/* Educational Governance Callout */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <ShieldAlert size={16} color="#D97706" />
              <Text style={styles.infoTitle}>Why is trading locked?</Text>
            </View>
            <Text style={styles.infoBody}>
              To prevent speculative trading and promote analytical stewardship, VERDEX requires a 3-sentence thesis covering:
            </Text>

            <View style={styles.stepsList}>
              <View style={styles.stepRow}>
                <View style={styles.stepNumPill}><Text style={styles.stepNumText}>1</Text></View>
                <Text style={styles.stepText}><Text style={styles.stepBold}>Climate Signal Observation</Text> (e.g. soil moisture, AQI)</Text>
              </View>
              <View style={styles.stepRow}>
                <View style={styles.stepNumPill}><Text style={styles.stepNumText}>2</Text></View>
                <Text style={styles.stepText}><Text style={styles.stepBold}>Ecological Risk Factor</Text> (e.g. drought, weather shift)</Text>
              </View>
              <View style={styles.stepRow}>
                <View style={styles.stepNumPill}><Text style={styles.stepNumText}>3</Text></View>
                <Text style={styles.stepText}><Text style={styles.stepBold}>Financial Valuation Rationale</Text> (e.g. GH₵ price point)</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.btnRow}>
            <Pressable
              onPress={onGoToThesis}
              style={({ pressed }) => [styles.thesisBtn, pressed && { opacity: 0.88 }]}
            >
              <PenTool size={16} color="#FFFFFF" />
              <Text style={styles.thesisBtnText}>Write Thesis Now →</Text>
            </Pressable>

            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.cancelBtn, pressed && { opacity: 0.88 }]}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 22, 17, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialogCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 460,
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#E8EDE6',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 6,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textBright,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: -8,
  },
  symbolBold: {
    fontWeight: '900',
    color: '#0D5C46',
  },
  infoCard: {
    backgroundColor: '#FDFBF7',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  infoBody: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  stepsList: {
    gap: 6,
    marginTop: 4,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepNumPill: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  stepText: {
    fontSize: 11,
    color: COLORS.textBright,
    flex: 1,
  },
  stepBold: {
    fontWeight: '800',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginTop: 4,
  },
  thesisBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0D5C46',
    paddingVertical: 14,
    borderRadius: 14,
  },
  thesisBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cancelBtn: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#F1F5F0',
    borderWidth: 1,
    borderColor: '#E8EDE6',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textBright,
  },
});
