import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { TradeOrder, GreenAsset } from '@/types';
import { COLORS } from '@/constants/theme';
import { CheckCircle2, ShieldCheck, ArrowRight, Heart, Wallet, Receipt, X } from 'lucide-react-native';

interface TradeConfirmationModalProps {
  visible: boolean;
  order: TradeOrder | null;
  asset: GreenAsset | null;
  onClose: () => void;
  onViewPortfolio: () => void;
}

export const TradeConfirmationModal: React.FC<TradeConfirmationModalProps> = ({
  visible,
  order,
  asset,
  onClose,
  onViewPortfolio,
}) => {
  if (!visible || !order || !asset) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.dialogCard}>
          {/* Close Button */}
          <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={10}>
            <X size={18} color={COLORS.textMuted} />
          </Pressable>

          {/* Success Header */}
          <View style={styles.iconCircle}>
            <CheckCircle2 size={36} color="#10B981" />
          </View>

          <Text style={styles.title}>Trade Executed!</Text>
          <Text style={styles.subtitle}>
            Your virtual order has been filled on the VERDEX matching engine.
          </Text>

          {/* Order Receipt Details */}
          <View style={styles.receiptCard}>
            <View style={styles.receiptHeader}>
              <Receipt size={14} color="#10B981" />
              <Text style={styles.receiptTitle}>ORDER RECEIPT #{order.id.slice(-6).toUpperCase()}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Asset Symbol</Text>
              <Text style={styles.valBold}>{order.symbol}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Asset Name</Text>
              <Text style={styles.valSub} numberOfLines={1}>{order.assetName}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Order Side & Type</Text>
              <Text style={styles.valSide}>{order.side.toUpperCase()} MARKET</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Executed Quantity</Text>
              <Text style={styles.valBold}>{order.quantity} Units</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Execution Price</Text>
              <Text style={styles.valBold}>GH₵{order.price.toFixed(2)}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Transaction Fee (0.1%)</Text>
              <Text style={styles.valSub}>GH₵{order.fee.toFixed(2)}</Text>
            </View>

            <View style={[styles.row, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Capital Allocated</Text>
              <Text style={styles.totalVal}>GH₵{(order.totalValue + order.fee).toFixed(2)}</Text>
            </View>
          </View>

          {/* Community Purpose Impact Banner */}
          <View style={styles.impactCard}>
            <Heart size={16} color="#EC4899" />
            <View style={{ flex: 1 }}>
              <Text style={styles.impactTitle}>Community Purpose Activated</Text>
              <Text style={styles.impactText}>{asset.communityImpact}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.btnRow}>
            <Pressable
              onPress={onViewPortfolio}
              style={({ pressed }) => [styles.portfolioBtn, pressed && { opacity: 0.88 }]}
            >
              <Wallet size={16} color="#FFFFFF" />
              <Text style={styles.portfolioBtnText}>View in Portfolio</Text>
              <ArrowRight size={14} color="#FFFFFF" />
            </Pressable>

            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.doneBtn, pressed && { opacity: 0.88 }]}
            >
              <Text style={styles.doneBtnText}>Done</Text>
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
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textBright,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: -8,
  },
  receiptCard: {
    backgroundColor: '#F8FAF7',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E8EDE6',
    gap: 8,
  },
  receiptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  receiptTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0D5C46',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  valBold: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textBright,
  },
  valSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    maxWidth: 200,
  },
  valSide: {
    fontSize: 11,
    fontWeight: '900',
    color: '#10B981',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E8EDE6',
    paddingTop: 8,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textBright,
  },
  totalVal: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0D5C46',
  },
  impactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(236, 72, 153, 0.08)',
    borderRadius: 14,
    padding: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.2)',
  },
  impactTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#BE185D',
  },
  impactText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    lineHeight: 14,
    marginTop: 2,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginTop: 4,
  },
  portfolioBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0D5C46',
    paddingVertical: 14,
    borderRadius: 14,
  },
  portfolioBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  doneBtn: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#F1F5F0',
    borderWidth: 1,
    borderColor: '#E8EDE6',
  },
  doneBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textBright,
  },
});
