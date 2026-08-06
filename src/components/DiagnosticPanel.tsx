import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { GreenAsset, InvestmentThesis } from '@/types';
import { COLORS } from '@/constants/theme';
import {
  Lock,
  Unlock,
  ShieldAlert,
  FileText,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Plus,
  Check,
  Heart,
  BarChart2,
  PenTool,
} from 'lucide-react-native';
import { evaluateThesisText } from '@/services/tradingEngine';

interface DiagnosticPanelProps {
  asset: GreenAsset;
  onUnlockSuccess: (thesis: InvestmentThesis) => void;
  existingThesis?: InvestmentThesis;
  onSubmitThesis: (text: string, communityPurpose?: string) => { valid: boolean; feedback: string; thesis?: InvestmentThesis };
}

export const DiagnosticPanel: React.FC<DiagnosticPanelProps> = ({
  asset,
  onUnlockSuccess,
  existingThesis,
  onSubmitThesis,
}) => {
  const [activeTab, setActiveTab] = useState<'sensors' | 'thesis'>('sensors');
  const [thesisText, setThesisText] = useState<string>(existingThesis ? existingThesis.text : '');
  const [communityPurpose, setCommunityPurpose] = useState<string>(
    existingThesis?.communityPurpose || `This trade supports ${asset.communityImpact.toLowerCase()}`
  );
  const [errorFeedback, setErrorFeedback] = useState<string>('');

  const evaluation = evaluateThesisText(thesisText);
  const isAlreadyUnlocked = !!existingThesis || evaluation.valid;

  const handleSubmit = () => {
    setErrorFeedback('');
    const res = onSubmitThesis(thesisText, communityPurpose);
    if (!res.valid) {
      setErrorFeedback(res.feedback);
    } else if (res.thesis) {
      onUnlockSuccess(res.thesis);
    }
  };

  const handleAppendChip = (snippet: string) => {
    if (existingThesis) return;
    setThesisText((prev) => (prev ? `${prev} ${snippet}` : snippet));
    setActiveTab('thesis');
  };

  const quickSnippets = [
    `1) ${asset.name} signal index is ${asset.signalScore}/100 based on ${asset.environmentalMetrics[0]?.label || 'sensor reading'}.`,
    `2) ${asset.riskFactors[0] || 'Ecological weather shifts'} presents a key risk factor.`,
    `3) Virtual price of GH₵${asset.price.toFixed(2)} offers strong allocation value.`,
  ];

  return (
    <View style={styles.container}>
      {/* 5-STAR RESEARCH LOCK STATUS CARD */}
      <View
        style={[
          styles.statusCard,
          { borderColor: isAlreadyUnlocked ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)' },
        ]}
      >
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusIconCircle,
              { backgroundColor: isAlreadyUnlocked ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)' },
            ]}
          >
            {isAlreadyUnlocked ? (
              <Unlock size={20} color="#10B981" />
            ) : (
              <Lock size={20} color="#D97706" />
            )}
          </View>

          <View style={{ flex: 1 }}>
            <View style={styles.statusTitleRow}>
              <Text style={styles.statusTitle}>
                {isAlreadyUnlocked ? 'Research Lock: UNLOCKED' : 'Research Lock: ACTIVE'}
              </Text>
              <View
                style={[
                  styles.statusPill,
                  { backgroundColor: isAlreadyUnlocked ? '#10B981' : '#F59E0B' },
                ]}
              >
                <Text style={styles.statusPillText}>
                  {isAlreadyUnlocked ? 'Ready to Trade' : 'Thesis Required'}
                </Text>
              </View>
            </View>
            <Text style={styles.statusDesc}>
              {isAlreadyUnlocked
                ? 'Your thesis & community purpose are validated. Trade execution ticket is enabled.'
                : 'Review sensor telemetry and submit a 3-sentence investment thesis to unlock trading.'}
            </Text>
          </View>
        </View>
      </View>

      {/* SEGMENTED TAB CONTROLLER */}
      <View style={styles.tabBar}>
        <Pressable
          onPress={() => setActiveTab('sensors')}
          style={[styles.tabBtn, activeTab === 'sensors' && styles.tabBtnActive]}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'sensors' }}
        >
          <BarChart2 size={14} color={activeTab === 'sensors' ? '#0D5C46' : COLORS.textMuted} />
          <Text style={[styles.tabBtnText, activeTab === 'sensors' && styles.tabBtnTextActive]}>
            Ecosystem Signals
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('thesis')}
          style={[styles.tabBtn, activeTab === 'thesis' && styles.tabBtnActive]}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'thesis' }}
        >
          <PenTool size={14} color={activeTab === 'thesis' ? '#0D5C46' : COLORS.textMuted} />
          <Text style={[styles.tabBtnText, activeTab === 'thesis' && styles.tabBtnTextActive]}>
            Research Thesis
          </Text>
        </Pressable>
      </View>

      {/* TAB 1: ECOSYSTEM SIGNALS & RISKS */}
      {activeTab === 'sensors' && (
        <View style={styles.panelBody}>
          {/* Sensor Readouts Grid */}
          <Text style={styles.subSectionTitle}>Live Environmental Sensors ({asset.symbol})</Text>
          <View style={styles.sensorGrid}>
            {asset.environmentalMetrics.map((m, idx) => (
              <View key={idx} style={styles.sensorCard}>
                <Text style={styles.sensorLabel}>{m.label}</Text>
                <Text style={styles.sensorVal}>{m.value}</Text>
              </View>
            ))}
          </View>

          {/* Ecological Risk Factors */}
          <Text style={styles.subSectionTitle}>Ecological Risk Factors</Text>
          <View style={styles.riskList}>
            {asset.riskFactors.map((rf, idx) => (
              <View key={idx} style={styles.riskBadgeRow}>
                <ShieldAlert size={14} color="#D97706" />
                <Text style={styles.riskBadgeText}>{rf}</Text>
              </View>
            ))}
          </View>

          {/* Quick Action to Thesis */}
          {!existingThesis && (
            <Pressable
              onPress={() => setActiveTab('thesis')}
              style={styles.switchTabCta}
            >
              <Text style={styles.switchTabCtaText}>Proceed to Write Research Thesis →</Text>
            </Pressable>
          )}
        </View>
      )}

      {/* TAB 2: RESEARCH THESIS & COMMUNITY PURPOSE */}
      {activeTab === 'thesis' && (
        <View style={styles.panelBody}>
          {/* Guidance Steps Bar */}
          <View style={styles.stepsRow}>
            {[
              { num: 1, label: '1. Signal' },
              { num: 2, label: '2. Risk' },
              { num: 3, label: '3. Value' },
            ].map((st) => {
              const isDone = evaluation.sentenceCount >= st.num;
              return (
                <View
                  key={st.num}
                  style={[styles.stepPill, isDone ? styles.stepPillDone : styles.stepPillPending]}
                >
                  {isDone ? <Check size={12} color="#FFFFFF" /> : <Text style={styles.stepNumText}>{st.num}</Text>}
                  <Text style={[styles.stepLabelText, isDone && styles.stepLabelTextDone]}>{st.label}</Text>
                </View>
              );
            })}

            {evaluation.valid && (
              <View style={styles.ratingBadge}>
                <CheckCircle2 size={12} color="#10B981" />
                <Text style={styles.ratingText}>{evaluation.qualityRating}</Text>
              </View>
            )}
          </View>

          {/* Quick Template Sentences */}
          {!existingThesis && (
            <View style={styles.templateSection}>
              <Text style={styles.templateHeaderLabel}>Tap to insert structured template sentence:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
                {quickSnippets.map((snip, idx) => (
                  <Pressable
                    key={idx}
                    onPress={() => handleAppendChip(snip)}
                    style={({ pressed }) => [styles.chipBtn, pressed && { opacity: 0.8 }]}
                  >
                    <Plus size={12} color="#0D5C46" />
                    <Text style={styles.chipBtnText}>Sentence {idx + 1} Template</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}

          {/* 3-Sentence Thesis Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputFieldLabel}>3-Sentence Investment Thesis:</Text>
            <TextInput
              style={styles.textInputMain}
              multiline
              numberOfLines={4}
              placeholder="e.g. 1) Suhum rainfall is up +12%, boosting cocoa canopy hydration. 2) Dry harmattan winds pose a late-season risk to bean pods. 3) Current price of GH₵148.50 offers strong upside given optimal soil moisture."
              placeholderTextColor={COLORS.textMuted}
              value={thesisText}
              onChangeText={setThesisText}
              editable={!existingThesis}
            />
          </View>

          {/* Community Purpose Field */}
          <View style={styles.inputGroup}>
            <View style={styles.communityHeaderRow}>
              <Heart size={14} color="#EC4899" />
              <Text style={styles.communityHeaderTitle}>Community Purpose:</Text>
            </View>
            <TextInput
              style={styles.textInputSub}
              multiline
              numberOfLines={2}
              placeholder="e.g. This trade provides disease-resistant seedlings to 2,400 cocoa farmers in Asante Akim."
              placeholderTextColor={COLORS.textMuted}
              value={communityPurpose}
              onChangeText={setCommunityPurpose}
              editable={!existingThesis}
            />
          </View>

          {!!errorFeedback && (
            <View style={styles.errorBox}>
              <AlertCircle size={14} color={COLORS.redAlert} />
              <Text style={styles.errorText}>{errorFeedback}</Text>
            </View>
          )}

          {/* Validate & Unlock Action Button */}
          {!existingThesis && (
            <Pressable
              onPress={handleSubmit}
              style={({ pressed }) => [
                styles.submitBtn,
                !evaluation.valid && styles.submitBtnDisabled,
                pressed && evaluation.valid && { opacity: 0.88 },
              ]}
              disabled={!evaluation.valid}
            >
              <Unlock size={16} color={evaluation.valid ? '#FFFFFF' : COLORS.textMuted} />
              <Text style={[styles.submitBtnText, !evaluation.valid && styles.submitBtnTextDisabled]}>
                Validate & Unlock Trade Ticket
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E4EAE2',
    padding: 16,
    gap: 14,
    shadowColor: '#102A1F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  statusCard: {
    backgroundColor: '#F8FAF7',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusIconCircle: {
    padding: 10,
    borderRadius: 12,
  },
  statusTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.textBright,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statusDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F0',
    borderRadius: 12,
    padding: 3,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#102A1F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  tabBtnTextActive: {
    color: '#0D5C46',
    fontWeight: '800',
  },
  panelBody: {
    gap: 12,
    paddingTop: 4,
  },
  subSectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textBright,
  },
  sensorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sensorCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8FAF7',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E4EAE2',
  },
  sensorLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  sensorVal: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.textBright,
    marginTop: 2,
  },
  riskList: {
    gap: 6,
  },
  riskBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  riskBadgeText: {
    fontSize: 11,
    color: '#B45309',
    fontWeight: '600',
    flex: 1,
  },
  switchTabCta: {
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.10)',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  switchTabCtaText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0D5C46',
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  stepPillDone: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  stepPillPending: {
    backgroundColor: '#F1F5F0',
    borderColor: '#E4EAE2',
  },
  stepNumText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
  },
  stepLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  stepLabelTextDone: {
    color: '#FFFFFF',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  templateSection: {
    gap: 4,
  },
  templateHeaderLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  chipsScroll: {
    flexDirection: 'row',
  },
  chipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(13, 92, 70, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 6,
    borderWidth: 1,
    borderColor: 'rgba(13, 92, 70, 0.15)',
  },
  chipBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0D5C46',
  },
  inputGroup: {
    gap: 4,
  },
  inputFieldLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textBright,
  },
  textInputMain: {
    backgroundColor: '#F8FAF7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D8E2D5',
    color: COLORS.textBright,
    padding: 12,
    fontSize: 12,
    textAlignVertical: 'top',
    minHeight: 85,
  },
  communityHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  communityHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#BE185D',
  },
  textInputSub: {
    backgroundColor: '#F8FAF7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D8E2D5',
    color: COLORS.textBright,
    padding: 10,
    fontSize: 11,
    textAlignVertical: 'top',
    minHeight: 50,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    padding: 10,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 11,
    color: COLORS.redAlert,
    flex: 1,
  },
  submitBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0D5C46',
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#0D5C46',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  submitBtnDisabled: {
    backgroundColor: '#F1F5F0',
    borderWidth: 1,
    borderColor: '#E4EAE2',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  submitBtnTextDisabled: {
    color: COLORS.textMuted,
  },
});
