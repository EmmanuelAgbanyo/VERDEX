import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, TextInput, Alert } from 'react-native';
import { GreenAsset, OrderSide, OrderType, TradeOrder } from '@/types';
import { COLORS, LAYOUT } from '@/constants/theme';
import { X, ArrowRight, Wallet, ShieldAlert, CheckCircle, Info } from 'lucide-react-native';
import { SIMULATED_TRANSACTION_FEE_RATE } from '@/services/tradingEngine';

interface TradeTicketModalProps {
  visible: boolean;
  asset: GreenAsset;
  cash: number;
  onClose: () => void;
  onConfirmTrade: (
    side: OrderSide,
    type: OrderType,
    quantity: number,
    limitPrice?: number
  ) => { success: boolean; message: string; order?: TradeOrder };
}

export const TradeTicketModal: React.FC<TradeTicketModalProps> = ({
  visible,
  asset,
  cash,
  onClose,
  onConfirmTrade,
}) => {
  const [side, setSide] = useState<OrderSide>('buy');
  const [type, setType] = useState<OrderType>('market');
  const [quantityText, setQuantityText] = useState<string>('10');
  const [limitPriceText, setLimitPriceText] = useState<string>(asset.price.toString());
  const [tradeMessage, setTradeMessage] = useState<{ success: boolean; text: string } | null>(null);

  const quantity = parseInt(quantityText, 10) || 0;
  const executionPrice = type === 'market' ? asset.price : parseFloat(limitPriceText) || asset.price;
  const rawSubtotal = executionPrice * quantity;
  const fee = Number((rawSubtotal * SIMULATED_TRANSACTION_FEE_RATE).toFixed(2));
  const totalCost = side === 'buy' ? rawSubtotal + fee : -(rawSubtotal - fee);

  const isBuyValid = side === 'buy' ? totalCost <= cash && quantity > 0 : quantity > 0;

  const handleExecute = () => {
    setTradeMessage(null);
    if (quantity <= 0) {
      setTradeMessage({ success: false, text: 'Please enter a valid unit quantity.' });
      return;
    }

    const res = onConfirmTrade(
      side,
      type,
      quantity,
      type === 'limit' ? parseFloat(limitPriceText) : undefined
    );

    setTradeMessage({ success: res.success, text: res.message });
    if (res.success) {
      setTimeout(() => {
        onClose();
        setTradeMessage(null);
      }, 500);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        {/* Modal Content Surface (Sibling layout, backdrop dismissal handles outside tap) */}
        <View
          style={styles.modalContent}
          accessible={true}
          accessibilityViewIsModal={true}
          accessibilityRole="dialog"
          aria-modal={true}
          accessibilityLabel={`Order Ticket for ${asset.symbol}`}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Order Ticket: {asset.symbol}</Text>
              <Text style={styles.headerSubtitle}>{asset.name}</Text>
            </View>
            <Pressable
              onPress={onClose}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Close Order Ticket"
              hitSlop={10}
            >
              <X size={20} color={COLORS.textBright} />
            </Pressable>
          </View>

          {/* Side Toggle: Buy vs Sell */}
          <View style={styles.tabContainer}>
            <Pressable
              onPress={() => setSide('buy')}
              style={[styles.tabBtn, side === 'buy' && styles.tabBtnBuyActive]}
              accessibilityRole="button"
              accessibilityLabel="Buy Tab"
              hitSlop={10}
            >
              <Text style={[styles.tabBtnText, side === 'buy' && styles.tabBtnTextActive]}>BUY</Text>
            </Pressable>
            <Pressable
              onPress={() => setSide('sell')}
              style={[styles.tabBtn, side === 'sell' && styles.tabBtnSellActive]}
              accessibilityRole="button"
              accessibilityLabel="Sell Tab"
              hitSlop={10}
            >
              <Text style={[styles.tabBtnText, side === 'sell' && styles.tabBtnTextActive]}>SELL</Text>
            </Pressable>
          </View>

          {/* Order Type Toggle: Market vs Limit */}
          <View style={styles.orderTypeRow}>
            <Pressable
              onPress={() => setType('market')}
              style={[styles.typeChip, type === 'market' && styles.typeChipActive]}
              accessibilityRole="button"
              accessibilityLabel="Market Order Type"
              hitSlop={10}
            >
              <Text style={[styles.typeChipText, type === 'market' && styles.typeChipTextActive]}>Market Order</Text>
            </Pressable>
            <Pressable
              onPress={() => setType('limit')}
              style={[styles.typeChip, type === 'limit' && styles.typeChipActive]}
              accessibilityRole="button"
              accessibilityLabel="Limit Order Type"
              hitSlop={10}
            >
              <Text style={[styles.typeChipText, type === 'limit' && styles.typeChipTextActive]}>Limit Order</Text>
            </Pressable>
          </View>

          {/* Quantity & Price Input Fields */}
          <View style={styles.formRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Quantity (Units)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={quantityText}
                onChangeText={setQuantityText}
                accessibilityLabel="Quantity in units"
                importantForAccessibility="yes"
              />
            </View>

            {type === 'limit' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Target Price (GH₵)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={limitPriceText}
                  onChangeText={setLimitPriceText}
                  accessibilityLabel="Target Price"
                  importantForAccessibility="yes"
                />
              </View>
            )}
          </View>

          {/* Buying Power & Summary Breakdown */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryLabelBox}>
                <Wallet size={14} color={COLORS.emeraldBright} />
                <Text style={styles.summaryLabel}>Buying Power (Virtual Cash)</Text>
              </View>
              <Text style={styles.summaryVal}>GH₵{cash.toFixed(2)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Unit Execution Price</Text>
              <Text style={styles.summaryVal}>GH₵{executionPrice.toFixed(2)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Est. Transaction Fee (0.1%)</Text>
              <Text style={styles.summaryVal}>GH₵{fee.toFixed(2)}</Text>
            </View>

            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>{side === 'buy' ? 'Total Cost' : 'Est. Credit'}</Text>
              <Text style={styles.totalVal}>GH₵{Math.abs(totalCost).toFixed(2)}</Text>
            </View>
          </View>

          {/* Sell Coming Soon Notice */}
          {side === 'sell' && (
            <View style={styles.sellNoticeBox}>
              <Info size={14} color="#D97706" />
              <Text style={styles.sellNoticeDesc}>
                Sell functionality coming soon — full version will support asset divestments.
              </Text>
            </View>
          )}

          {/* Message notification */}
          {tradeMessage && (
            <View
              style={[
                styles.messageBox,
                { backgroundColor: tradeMessage.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)' },
              ]}
            >
              {tradeMessage.success ? (
                <CheckCircle size={16} color={COLORS.emeraldBright} />
              ) : (
                <ShieldAlert size={16} color={COLORS.redAlert} />
              )}
              <Text
                style={[
                  styles.messageText,
                  { color: tradeMessage.success ? COLORS.emeraldBright : COLORS.redAlert },
                ]}
              >
                {tradeMessage.text}
              </Text>
            </View>
          )}

          {/* Submit Action */}
          <Pressable
            onPress={handleExecute}
            accessibilityRole="button"
            accessibilityLabel={side === 'buy' ? 'Execute Buy Order' : 'Execute Sell Order'}
            hitSlop={10}
            style={({ pressed }) => [
              styles.actionBtn,
              side === 'buy' ? styles.actionBtnBuy : styles.actionBtnSellDisabled,
              (side === 'sell' || !isBuyValid || quantity <= 0) && styles.actionBtnDisabled,
              pressed && side === 'buy' && { opacity: 0.85 },
            ]}
            disabled={side === 'sell' || !isBuyValid || quantity <= 0}
          >
            <Text style={[styles.actionBtnText, side === 'sell' && styles.actionBtnTextDisabled]}>
              {side === 'buy' ? 'EXECUTE BUY ORDER' : 'SELL COMING IN FULL VERSION'}
            </Text>
            {side === 'buy' && <ArrowRight size={16} color={COLORS.bgDark} />}
          </Pressable>

          <Text style={styles.disclaimerText}>
            * Simulating live market execution using virtual funds.
          </Text>
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
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    gap: 14,
    maxWidth: 540,
    width: '92%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textBright,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: COLORS.inputBg,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.inputBg,
    borderRadius: 10,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabBtnBuyActive: {
    backgroundColor: COLORS.emeraldPrimary,
  },
  tabBtnSellActive: {
    backgroundColor: COLORS.redAlert,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  tabBtnTextActive: {
    color: COLORS.bgDark,
  },
  orderTypeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeChip: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    backgroundColor: COLORS.inputBg,
  },
  typeChipActive: {
    borderColor: COLORS.emeraldBright,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
  },
  typeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  typeChipTextActive: {
    color: COLORS.emeraldBright,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 8,
    padding: 10,
    color: COLORS.textBright,
    fontSize: 16,
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    gap: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabelBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  summaryLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  summaryVal: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textBright,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingTop: 8,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textBright,
  },
  totalVal: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.amberDataBright,
  },
  messageBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 8,
  },
  messageText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  actionBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 10,
  },
  actionBtnBuy: {
    backgroundColor: COLORS.emeraldPrimary,
  },
  actionBtnSell: {
    backgroundColor: COLORS.redAlert,
  },
  actionBtnDisabled: {
    opacity: 0.5,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.bgDark,
  },
  sellNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
  },
  sellNoticeDesc: {
    fontSize: 11,
    color: '#D97706',
    fontWeight: '600',
    flex: 1,
  },
  actionBtnSellDisabled: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  actionBtnTextDisabled: {
    color: '#D97706',
  },
  disclaimerText: {
    fontSize: 10,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
