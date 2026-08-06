import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { GreenAsset, InvestmentThesis } from '@/types';
import { COLORS, LAYOUT } from '@/constants/theme';
import { Lock, Unlock, ShieldAlert, FileText, CheckCircle2, Sparkles, AlertCircle, Plus, Check } from 'lucide-react-native';
import { evaluateThesisText } from '@/services/tradingEngine';

interface DiagnosticPanelProps {
  asset: GreenAsset;
  onUnlockSuccess: (thesis: InvestmentThesis) => void;
  existingThesis?: InvestmentThesis;
  onSubmitThesis: (text: string) => { valid: boolean; feedback: string; thesis?: InvestmentThesis };
}

export const DiagnosticPanel: React.FC<DiagnosticPanelProps> = ({
  asset,
  onUnlockSuccess,
  existingThesis,
  onSubmitThesis,
}) => {
  const [thesisText, setThesisText] = useState<string>(existingThesis ? existingThesis.text : '');
  const [errorFeedback, setErrorFeedback] = useState<string>('');

  const evaluation = evaluateThesisText(thesisText);
  const isAlreadyUnlocked = !!existingThesis || evaluation.valid;

  const handleSubmit = () => {
    setErrorFeedback('');
    const res = onSubmitThesis(thesisText);
    if (!res.valid) {
      setErrorFeedback(res.feedback);
    } else if (res.thesis) {
      onUnlockSuccess(res.thesis);
    }
  };

  const handleAppendChip = (snippet: string) => {
    if (existingThesis) return;
    setThesisText((prev) => (prev ? `${prev} ${snippet}` : snippet));
  };

  // Preset quick chips based on asset metrics
  const quickSnippets = [
    `1) ${asset.name} signal index is ${asset.signalScore}/100 based on ${asset.environmentalMetrics[0]?.label || 'sensor reading'}.`,
    `2) ${asset.riskFactors[0] || 'Ecological weather shifts'} presents a key risk factor.`,
    `3) Virtual price of GH₵${asset.price.toFixed(2)} offers strong allocation value.`,
  ];

  return (
    <View style={styles.container}>
      {/* Header status */}
      <View
        style={[
          styles.headerBox,
          { borderColor: isAlreadyUnlocked ? COLORS.emeraldPrimary : 'rgba(245, 158, 11, 0.5)' },
        ]}
      >
        <View style={styles.headerTitleRow}>
          {isAlreadyUnlocked ? (
            <View style={styles.unlockedIconCircle}>
              <Unlock size={18} color="#10B981" />
            </View>
          ) : (
            <View style={styles.lockedIconCircle}>
              <Lock size={18} color="#D97706" />
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>
              {isAlreadyUnlocked ? 'Research Lock: UNLOCKED' : 'Research Lock: ACTIVE (1/3 Unlocked)'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {isAlreadyUnlocked
                ? 'Your 3-sentence investment thesis is validated. Trade execution ticket is enabled.'
                : 'Review the environmental telemetry below and enter a 3-sentence thesis to unlock trading.'}
            </Text>
          </View>
        </View>
      </View>

      {/* Environmental Diagnostics Box */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <FileText size={16} color={COLORS.emeraldBright} />
          <Text style={styles.sectionTitle}>Environmental Diagnostic Sensors ({asset.symbol})</Text>
        </View>

        <View style={styles.metricsGrid}>
          {asset.environmentalMetrics.map((m, idx) => (
            <View key={idx} style={styles.metricItem}>
              <Text style={styles.metricItemLabel}>{m.label}</Text>
              <Text style={styles.metricItemVal}>{m.value}</Text>
            </View>
          ))}
        </View>

        {/* Risk factors */}
        <Text style={styles.riskHeader}>Key Ecological Risk Factors:</Text>
        {asset.riskFactors.map((rf, idx) => (
          <View key={idx} style={styles.riskRow}>
            <ShieldAlert size={14} color={COLORS.amberData} />
            <Text style={styles.riskText}>{rf}</Text>
          </View>
        ))}
      </View>

      {/* Thesis Entry & Guidance */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Sparkles size={16} color={COLORS.amberDataBright} />
          <Text style={styles.sectionTitle}>Structured 3-Sentence Thesis</Text>
        </View>

        <View style={styles.guidanceBox}>
          <Text style={styles.guidanceItem}>
            1. <Text style={styles.guidanceBold}>Signal Observation:</Text> State the climate metric driving this asset.
          </Text>
          <Text style={styles.guidanceItem}>
            2. <Text style={styles.guidanceBold}>Risk Assessment:</Text> Identify a key risk that could impact performance.
          </Text>
          <Text style={styles.guidanceItem}>
            3. <Text style={styles.guidanceBold}>Financial Rationale:</Text> Explain why capital should be allocated at GH₵{asset.price.toFixed(2)}.
          </Text>
        </View>

        {/* Quick Insert Template Chips */}
        {!existingThesis && (
          <View style={styles.chipRowContainer}>
            <Text style={styles.chipHeaderLabel}>Tap to append template sentences:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
              {quickSnippets.map((snip, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => handleAppendChip(snip)}
                  style={({ pressed }) => [styles.templateChip, pressed && { opacity: 0.8 }]}
                  accessibilityRole="button"
                  accessibilityLabel={`Append sentence ${idx + 1}`}
                >
                  <Plus size={12} color="#10B981" />
                  <Text style={styles.templateChipText}>Sentence {idx + 1} Template</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        <TextInput
          style={styles.textInput}
          multiline
          numberOfLines={4}
          placeholder="e.g. 1) Suhum rainfall is up +12%, boosting cocoa canopy hydration. 2) Dry harmattan winds pose a late-season risk to bean pods. 3) Current price of GH₵148.50 offers strong upside given optimal soil moisture."
          placeholderTextColor={COLORS.textMuted}
          value={thesisText}
          onChangeText={setThesisText}
          editable={!existingThesis}
        />

        {/* Sentence Counter & Evaluator Progress Steps */}
        <View style={styles.evalRow}>
          <View style={styles.sentenceStepsGroup}>
            {[1, 2, 3].map((stepNum) => {
              const isFilled = evaluation.sentenceCount >= stepNum;
              return (
                <View
                  key={stepNum}
                  style={[
                    styles.stepBadge,
                    isFilled ? styles.stepBadgeActive : styles.stepBadgeInactive,
                  ]}
                >
                  {isFilled ? (
                    <Check size={10} color="#FFFFFF" />
                  ) : (
                    <Text style={styles.stepBadgeNum}>{stepNum}</Text>
                  )}
                  <Text style={[styles.stepBadgeText, isFilled && styles.stepBadgeTextActive]}>
                    Sentence {stepNum}
                  </Text>
                </View>
              );
            })}
          </View>

          {evaluation.valid && (
            <View style={styles.validBadge}>
              <CheckCircle2 size={12} color={COLORS.emeraldBright} />
              <Text style={styles.validBadgeText}>{evaluation.qualityRating} Thesis</Text>
            </View>
          )}
        </View>

        {!!errorFeedback && (
          <View style={styles.errorBox}>
            <AlertCircle size={14} color={COLORS.redAlert} />
            <Text style={styles.errorText}>{errorFeedback}</Text>
          </View>
        )}

        {/* Unlock / Submit Button */}
        {!existingThesis && (
          <Pressable
            onPress={handleSubmit}
            style={({ pressed }) => [
              styles.submitButton,
              !evaluation.valid && styles.submitButtonDisabled,
              pressed && evaluation.valid && { opacity: 0.85 },
            ]}
            disabled={!evaluation.valid}
            accessibilityRole="button"
            accessibilityLabel="Validate and unlock trade ticket"
          >
            <Unlock size={16} color={evaluation.valid ? '#FFFFFF' : COLORS.textMuted} />
            <Text style={[styles.submitButtonText, !evaluation.valid && styles.submitButtonTextDisabled]}>
              Validate & Unlock Trade Ticket
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  headerBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    shadowColor: '#102A1F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  unlockedIconCircle: {
    padding: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
  },
  lockedIconCircle: {
    padding: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.textBright,
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E4EAE2',
    shadowColor: '#102A1F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textBright,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  metricItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F1F5F0',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D8E2D5',
  },
  metricItemLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  metricItemVal: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textBright,
    marginTop: 2,
  },
  riskHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  riskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.06)',
    padding: 8,
    borderRadius: 8,
  },
  riskText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 15,
  },
  guidanceBox: {
    backgroundColor: '#F1F5F0',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    gap: 4,
    borderWidth: 1,
    borderColor: '#D8E2D5',
  },
  guidanceItem: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  guidanceBold: {
    fontWeight: '700',
    color: '#059669',
  },
  chipRowContainer: {
    marginBottom: 10,
  },
  chipHeaderLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  chipsScroll: {
    flexDirection: 'row',
  },
  templateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.10)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    marginRight: 6,
  },
  templateChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  textInput: {
    backgroundColor: '#F1F5F0',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D8E2D5',
    color: COLORS.textBright,
    padding: 12,
    fontSize: 12,
    textAlignVertical: 'top',
    minHeight: 95,
  },
  evalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  sentenceStepsGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  stepBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  stepBadgeActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  stepBadgeInactive: {
    backgroundColor: '#F1F5F0',
    borderColor: '#D8E2D5',
  },
  stepBadgeNum: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  stepBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  stepBadgeTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  validBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  validBadgeText: {
    fontSize: 11,
    color: COLORS.emeraldBright,
    fontWeight: '800',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 11,
    color: COLORS.redAlert,
    flex: 1,
  },
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0D5C46',
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#0D5C46',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: '#F1F5F0',
    borderWidth: 1,
    borderColor: '#D8E2D5',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  submitButtonTextDisabled: {
    color: COLORS.textMuted,
  },
});
