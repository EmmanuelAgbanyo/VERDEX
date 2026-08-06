import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Animated } from 'react-native';
import { GreenAsset, InvestmentThesis } from '@/types';
import { COLORS } from '@/constants/theme';
import {
  Lock,
  Unlock,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Plus,
  Check,
  Heart,
  BarChart2,
  PenTool,
  Bot,
  Brain,
  ShieldCheck,
  TrendingUp,
  Loader,
  Zap,
} from 'lucide-react-native';
import { evaluateThesisText } from '@/services/tradingEngine';

// ── Simulated AI Analysis Engine ──────────────────────────────────────────────
interface AIAnalysisResult {
  overallScore: number; // 0-100
  verdict: 'Approved' | 'Needs Revision' | 'Rejected';
  signalCoverage: { score: number; feedback: string; detected: string[] };
  riskAnalysis: { score: number; feedback: string; detected: string[] };
  financialRationale: { score: number; feedback: string; detected: string[] };
  communityAlignment: { score: number; feedback: string };
  aiSummary: string;
}

function simulateAIAnalysis(
  thesisText: string,
  communityPurpose: string,
  asset: GreenAsset
): AIAnalysisResult {
  const text = thesisText.toLowerCase();
  const community = communityPurpose.toLowerCase();

  // Signal Coverage Analysis
  const signalKeywords = ['signal', 'rainfall', 'humidity', 'aqi', 'temperature', 'solar', 'irradiance', 'ndvi', 'moisture', 'canopy', 'biomass', 'carbon', 'sensor', 'index', 'anomaly', 'weather', 'climate'];
  const detectedSignals = signalKeywords.filter(k => text.includes(k));
  const signalScore = Math.min(100, 40 + detectedSignals.length * 12);
  const signalFeedback = detectedSignals.length >= 2
    ? `Strong environmental signal reference. Detected ${detectedSignals.length} climate indicators relevant to ${asset.symbol}.`
    : detectedSignals.length === 1
    ? `Partial signal coverage. Consider referencing additional metrics like ${asset.environmentalMetrics[0]?.label || 'soil moisture'}.`
    : `Weak signal coverage. Your thesis should reference specific environmental data driving ${asset.name} valuation.`;

  // Risk Analysis
  const riskKeywords = ['risk', 'harmattan', 'drought', 'flood', 'wildfire', 'disease', 'pest', 'volatility', 'stress', 'erosion', 'deforestation', 'storm', 'wind', 'threat', 'vulnerability', 'decline'];
  const detectedRisks = riskKeywords.filter(k => text.includes(k));
  const riskScore = Math.min(100, 35 + detectedRisks.length * 15);
  const riskFeedback = detectedRisks.length >= 2
    ? `Thorough risk identification. ${detectedRisks.length} ecological risk factors acknowledged — demonstrates mature risk awareness.`
    : detectedRisks.length === 1
    ? `Basic risk coverage. Consider also addressing: "${asset.riskFactors[0] || 'seasonal weather variance'}".`
    : `Insufficient risk analysis. Every trade thesis must identify at least one ecological threat to the asset.`;

  // Financial Rationale
  const finKeywords = ['price', 'value', 'allocation', 'upside', 'yield', 'return', 'cost', 'gh₵', 'invest', 'bond', 'token', 'share', 'stake', 'capital', 'opportunity', 'premium', 'discount', 'strong'];
  const detectedFin = finKeywords.filter(k => text.includes(k));
  const finScore = Math.min(100, 30 + detectedFin.length * 10);
  const finFeedback = detectedFin.length >= 2
    ? `Clear financial reasoning with ${detectedFin.length} valuation indicators. Capital allocation thesis is well-structured.`
    : detectedFin.length === 1
    ? `Partial financial rationale. Strengthen by referencing the current price point of GH₵${asset.price.toFixed(2)}.`
    : `Missing financial rationale. Explain why capital should be allocated at the current price level.`;

  // Community Alignment
  const communityKeywords = ['community', 'farmer', 'local', 'cooperative', 'resilience', 'livelihood', 'health', 'education', 'clinic', 'school', 'women', 'youth', 'job', 'employment'];
  const detectedCommunity = communityKeywords.filter(k => community.includes(k));
  const communityScore = Math.min(100, 50 + detectedCommunity.length * 12);
  const communityFeedback = detectedCommunity.length >= 1
    ? `Community purpose aligns with ${asset.name} impact objectives. Local stakeholder benefit is articulated.`
    : `Consider articulating how this trade benefits the local community served by ${asset.name}.`;

  // Overall Score (weighted)
  const overallScore = Math.round(signalScore * 0.30 + riskScore * 0.25 + finScore * 0.25 + communityScore * 0.20);

  const verdict: AIAnalysisResult['verdict'] =
    overallScore >= 65 ? 'Approved' : overallScore >= 40 ? 'Needs Revision' : 'Rejected';

  // AI Summary
  const summaries = {
    Approved: `VERDEX AI has validated your research thesis for ${asset.symbol}. Signal coverage, risk identification, and financial rationale meet the governance threshold. Your trade ticket is cleared for execution.`,
    'Needs Revision': `Your thesis shows partial understanding of ${asset.symbol} fundamentals but needs stronger coverage in ${signalScore < riskScore ? 'environmental signal analysis' : 'risk identification'}. Revise and resubmit.`,
    Rejected: `This thesis does not meet VERDEX governance standards for ${asset.symbol}. Please review the ecosystem sensor data and construct a structured 3-sentence analysis.`,
  };

  return {
    overallScore,
    verdict,
    signalCoverage: { score: signalScore, feedback: signalFeedback, detected: detectedSignals },
    riskAnalysis: { score: riskScore, feedback: riskFeedback, detected: detectedRisks },
    financialRationale: { score: finScore, feedback: finFeedback, detected: detectedFin },
    communityAlignment: { score: communityScore, feedback: communityFeedback },
    aiSummary: summaries[verdict],
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

interface DiagnosticPanelProps {
  asset: GreenAsset;
  onUnlockSuccess: (thesis: InvestmentThesis) => void;
  existingThesis?: InvestmentThesis;
  onSubmitThesis: (text: string, communityPurpose?: string) => { valid: boolean; feedback: string; thesis?: InvestmentThesis };
  selectedTab?: 'sensors' | 'thesis';
  onTabChange?: (tab: 'sensors' | 'thesis') => void;
}

export const DiagnosticPanel: React.FC<DiagnosticPanelProps> = ({
  asset,
  onUnlockSuccess,
  existingThesis,
  onSubmitThesis,
  selectedTab,
  onTabChange,
}) => {
  const [activeTabState, setActiveTabState] = useState<'sensors' | 'thesis'>('sensors');
  const activeTab = selectedTab !== undefined ? selectedTab : activeTabState;

  const handleTabPress = (tab: 'sensors' | 'thesis') => {
    setActiveTabState(tab);
    if (onTabChange) onTabChange(tab);
  };

  const [thesisText, setThesisText] = useState<string>(existingThesis ? existingThesis.text : '');
  const [communityPurpose, setCommunityPurpose] = useState<string>(
    existingThesis?.communityPurpose || `This trade supports ${asset.communityImpact.toLowerCase()}`
  );
  const [errorFeedback, setErrorFeedback] = useState<string>('');

  // AI Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [showAiResult, setShowAiResult] = useState(false);
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  const evaluation = evaluateThesisText(thesisText);
  const isAlreadyUnlocked = !!existingThesis || (aiResult?.verdict === 'Approved');

  // Pulse animation for AI analyzing state
  useEffect(() => {
    if (isAnalyzing) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 0.4, duration: 600, useNativeDriver: true }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
  }, [isAnalyzing]);

  const analysisSteps = [
    { label: 'Parsing thesis structure...', icon: '📄' },
    { label: 'Cross-referencing environmental sensors...', icon: '🛰️' },
    { label: 'Evaluating risk factor coverage...', icon: '⚠️' },
    { label: 'Scoring financial rationale...', icon: '💰' },
    { label: 'Validating community alignment...', icon: '🌍' },
    { label: 'Generating AI confidence score...', icon: '🤖' },
  ];

  const handleAIValidation = () => {
    if (!evaluation.valid) return;

    setErrorFeedback('');
    setIsAnalyzing(true);
    setAnalysisStep(0);
    setShowAiResult(false);
    setAiResult(null);

    // Simulate step-by-step AI analysis with delays
    const stepDuration = 600;
    analysisSteps.forEach((_, idx) => {
      setTimeout(() => {
        setAnalysisStep(idx + 1);
      }, stepDuration * (idx + 1));
    });

    // Complete analysis after all steps
    setTimeout(() => {
      const result = simulateAIAnalysis(thesisText, communityPurpose, asset);
      setAiResult(result);
      setIsAnalyzing(false);
      setShowAiResult(true);
    }, stepDuration * (analysisSteps.length + 1));
  };

  const handleConfirmUnlock = () => {
    if (!aiResult || aiResult.verdict !== 'Approved') return;
    const res = onSubmitThesis(thesisText, communityPurpose);
    if (!res.valid) {
      setErrorFeedback(res.feedback);
    } else if (res.thesis) {
      onUnlockSuccess(res.thesis);
    }
  };

  const handleRetry = () => {
    setAiResult(null);
    setShowAiResult(false);
    setAnalysisStep(0);
  };

  const handleAppendChip = (snippet: string) => {
    if (existingThesis) return;
    setThesisText((prev) => (prev ? `${prev} ${snippet}` : snippet));
    setActiveTab('thesis');
    // Reset AI result when thesis changes
    setAiResult(null);
    setShowAiResult(false);
  };

  const quickSnippets = [
    `1) ${asset.name} signal index is ${asset.signalScore}/100 based on ${asset.environmentalMetrics[0]?.label || 'sensor reading'}.`,
    `2) ${asset.riskFactors[0] || 'Ecological weather shifts'} presents a key risk factor.`,
    `3) Virtual price of GH₵${asset.price.toFixed(2)} offers strong allocation value.`,
  ];

  const getScoreColor = (score: number) =>
    score >= 70 ? '#10B981' : score >= 45 ? '#F59E0B' : '#E11D48';

  const getVerdictColor = (verdict: string) =>
    verdict === 'Approved' ? '#10B981' : verdict === 'Needs Revision' ? '#F59E0B' : '#E11D48';

  return (
    <View style={styles.container}>
      {/* STATUS CARD */}
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
                  {isAlreadyUnlocked ? 'AI Approved' : 'AI Review Required'}
                </Text>
              </View>
            </View>
            <Text style={styles.statusDesc}>
              {isAlreadyUnlocked
                ? 'VERDEX AI has validated your thesis & community purpose. Trade execution ticket is enabled.'
                : 'Write a 3-sentence thesis and submit for AI analysis to unlock trading.'}
            </Text>
          </View>
        </View>
      </View>

      {/* SEGMENTED TAB CONTROLLER */}
      <View style={styles.tabBar}>
        <Pressable
          onPress={() => handleTabPress('sensors')}
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
          onPress={() => handleTabPress('thesis')}
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

      {/* TAB 1: ECOSYSTEM SIGNALS */}
      {activeTab === 'sensors' && (
        <View style={styles.panelBody}>
          <Text style={styles.subSectionTitle}>Live Environmental Sensors ({asset.symbol})</Text>
          <View style={styles.sensorGrid}>
            {asset.environmentalMetrics.map((m, idx) => (
              <View key={idx} style={styles.sensorCard}>
                <Text style={styles.sensorLabel}>{m.label}</Text>
                <Text style={styles.sensorVal}>{m.value}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.subSectionTitle}>Ecological Risk Factors</Text>
          <View style={styles.riskList}>
            {asset.riskFactors.map((rf, idx) => (
              <View key={idx} style={styles.riskBadgeRow}>
                <ShieldAlert size={14} color="#D97706" />
                <Text style={styles.riskBadgeText}>{rf}</Text>
              </View>
            ))}
          </View>

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

      {/* TAB 2: THESIS + AI VALIDATION */}
      {activeTab === 'thesis' && (
        <View style={styles.panelBody}>
          {/* Sentence Progress Steps */}
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

            {evaluation.valid && !aiResult && (
              <View style={styles.ratingBadge}>
                <CheckCircle2 size={12} color="#10B981" />
                <Text style={styles.ratingText}>{evaluation.qualityRating}</Text>
              </View>
            )}
          </View>

          {/* Quick Template Sentences */}
          {!existingThesis && !showAiResult && (
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

          {/* Thesis Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputFieldLabel}>3-Sentence Investment Thesis:</Text>
            <TextInput
              style={styles.textInputMain}
              multiline
              numberOfLines={4}
              placeholder="e.g. 1) Suhum rainfall is up +12%, boosting cocoa canopy hydration. 2) Dry harmattan winds pose a late-season risk to bean pods. 3) Current price of GH₵148.50 offers strong upside given optimal soil moisture."
              placeholderTextColor={COLORS.textMuted}
              value={thesisText}
              onChangeText={(t) => {
                setThesisText(t);
                if (aiResult) { setAiResult(null); setShowAiResult(false); }
              }}
              editable={!existingThesis && !isAnalyzing}
            />
          </View>

          {/* Community Purpose */}
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
              onChangeText={(t) => {
                setCommunityPurpose(t);
                if (aiResult) { setAiResult(null); setShowAiResult(false); }
              }}
              editable={!existingThesis && !isAnalyzing}
            />
          </View>

          {/* ── AI ANALYZING STATE ── */}
          {isAnalyzing && (
            <View style={styles.aiAnalyzingCard}>
              <View style={styles.aiAnalyzingHeader}>
                <Animated.View style={{ opacity: pulseAnim }}>
                  <Brain size={20} color="#7C3AED" />
                </Animated.View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.aiAnalyzingTitle}>VERDEX AI Analyzing Thesis...</Text>
                  <Text style={styles.aiAnalyzingSubtext}>
                    Cross-referencing against {asset.symbol} ecosystem data
                  </Text>
                </View>
              </View>

              <View style={styles.aiStepsList}>
                {analysisSteps.map((step, idx) => {
                  const isComplete = analysisStep > idx;
                  const isCurrent = analysisStep === idx + 1;
                  return (
                    <View key={idx} style={styles.aiStepRow}>
                      <Text style={styles.aiStepIcon}>{step.icon}</Text>
                      <Text
                        style={[
                          styles.aiStepLabel,
                          isComplete && styles.aiStepLabelDone,
                          isCurrent && styles.aiStepLabelCurrent,
                        ]}
                      >
                        {step.label}
                      </Text>
                      {isComplete && <Check size={14} color="#10B981" />}
                    </View>
                  );
                })}
              </View>

              {/* Progress bar */}
              <View style={styles.aiProgressTrack}>
                <View
                  style={[
                    styles.aiProgressFill,
                    { width: `${Math.round((analysisStep / analysisSteps.length) * 100)}%` },
                  ]}
                />
              </View>
            </View>
          )}

          {/* ── AI RESULT CARD ── */}
          {showAiResult && aiResult && (
            <View style={styles.aiResultCard}>
              {/* Verdict Header */}
              <View style={[styles.aiVerdictHeader, { borderLeftColor: getVerdictColor(aiResult.verdict) }]}>
                <View style={styles.aiVerdictRow}>
                  <Bot size={20} color={getVerdictColor(aiResult.verdict)} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.aiVerdictLabel}>VERDEX AI VERDICT</Text>
                    <Text style={[styles.aiVerdictText, { color: getVerdictColor(aiResult.verdict) }]}>
                      {aiResult.verdict}
                    </Text>
                  </View>
                  <View style={[styles.aiScoreCircle, { borderColor: getScoreColor(aiResult.overallScore) }]}>
                    <Text style={[styles.aiScoreNum, { color: getScoreColor(aiResult.overallScore) }]}>
                      {aiResult.overallScore}
                    </Text>
                    <Text style={styles.aiScoreLabel}>/ 100</Text>
                  </View>
                </View>
              </View>

              {/* Dimension Breakdown */}
              <View style={styles.aiDimensionsList}>
                {[
                  { label: 'Signal Coverage', score: aiResult.signalCoverage.score, feedback: aiResult.signalCoverage.feedback, icon: <Zap size={14} color="#3B82F6" /> },
                  { label: 'Risk Analysis', score: aiResult.riskAnalysis.score, feedback: aiResult.riskAnalysis.feedback, icon: <ShieldAlert size={14} color="#F59E0B" /> },
                  { label: 'Financial Rationale', score: aiResult.financialRationale.score, feedback: aiResult.financialRationale.feedback, icon: <TrendingUp size={14} color="#10B981" /> },
                  { label: 'Community Alignment', score: aiResult.communityAlignment.score, feedback: aiResult.communityAlignment.feedback, icon: <Heart size={14} color="#EC4899" /> },
                ].map((dim, idx) => (
                  <View key={idx} style={styles.aiDimensionRow}>
                    <View style={styles.aiDimHeader}>
                      {dim.icon}
                      <Text style={styles.aiDimLabel}>{dim.label}</Text>
                      <Text style={[styles.aiDimScore, { color: getScoreColor(dim.score) }]}>
                        {dim.score}/100
                      </Text>
                    </View>
                    <View style={styles.aiDimTrack}>
                      <View
                        style={[
                          styles.aiDimFill,
                          { width: `${dim.score}%`, backgroundColor: getScoreColor(dim.score) },
                        ]}
                      />
                    </View>
                    <Text style={styles.aiDimFeedback}>{dim.feedback}</Text>
                  </View>
                ))}
              </View>

              {/* AI Summary */}
              <View style={styles.aiSummaryBox}>
                <View style={styles.aiSummaryHeader}>
                  <Sparkles size={14} color="#7C3AED" />
                  <Text style={styles.aiSummaryTitle}>AI Summary</Text>
                </View>
                <Text style={styles.aiSummaryText}>{aiResult.aiSummary}</Text>
              </View>

              {/* Action Buttons */}
              {aiResult.verdict === 'Approved' ? (
                <Pressable
                  onPress={handleConfirmUnlock}
                  style={({ pressed }) => [styles.unlockBtn, pressed && { opacity: 0.88 }]}
                >
                  <ShieldCheck size={16} color="#FFFFFF" />
                  <Text style={styles.unlockBtnText}>Confirm & Unlock Trade Ticket</Text>
                </Pressable>
              ) : (
                <Pressable
                  onPress={handleRetry}
                  style={({ pressed }) => [styles.retryBtn, pressed && { opacity: 0.88 }]}
                >
                  <PenTool size={14} color="#0D5C46" />
                  <Text style={styles.retryBtnText}>Revise Thesis & Resubmit</Text>
                </Pressable>
              )}
            </View>
          )}

          {/* Error Feedback */}
          {!!errorFeedback && (
            <View style={styles.errorBox}>
              <AlertCircle size={14} color={COLORS.redAlert} />
              <Text style={styles.errorText}>{errorFeedback}</Text>
            </View>
          )}

          {/* Submit for AI Review Button */}
          {!existingThesis && !isAnalyzing && !showAiResult && (
            <Pressable
              onPress={handleAIValidation}
              style={({ pressed }) => [
                styles.submitBtn,
                !evaluation.valid && styles.submitBtnDisabled,
                pressed && evaluation.valid && { opacity: 0.88 },
              ]}
              disabled={!evaluation.valid}
            >
              <Bot size={16} color={evaluation.valid ? '#FFFFFF' : COLORS.textMuted} />
              <Text style={[styles.submitBtnText, !evaluation.valid && styles.submitBtnTextDisabled]}>
                Submit for AI Validation
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
    borderColor: '#E8EDE6',
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
    padding: 14,
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
    paddingVertical: 3,
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
    marginTop: 3,
    lineHeight: 16,
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
    gap: 14,
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
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8EDE6',
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
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 4,
  },
  switchTabCtaText: {
    fontSize: 12,
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
    borderColor: '#E8EDE6',
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
    gap: 6,
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
    paddingVertical: 6,
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
    lineHeight: 18,
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
    lineHeight: 16,
  },

  // ── AI Analyzing Card ──
  aiAnalyzingCard: {
    backgroundColor: '#FAF5FF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.2)',
    gap: 12,
  },
  aiAnalyzingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aiAnalyzingTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#7C3AED',
  },
  aiAnalyzingSubtext: {
    fontSize: 10,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  aiStepsList: {
    gap: 6,
  },
  aiStepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 3,
  },
  aiStepIcon: {
    fontSize: 14,
    width: 22,
    textAlign: 'center',
  },
  aiStepLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.textMuted,
    flex: 1,
  },
  aiStepLabelDone: {
    color: COLORS.textBright,
    fontWeight: '600',
  },
  aiStepLabelCurrent: {
    color: '#7C3AED',
    fontWeight: '700',
  },
  aiProgressTrack: {
    height: 4,
    backgroundColor: 'rgba(124, 58, 237, 0.12)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  aiProgressFill: {
    height: '100%',
    backgroundColor: '#7C3AED',
    borderRadius: 2,
  },

  // ── AI Result Card ──
  aiResultCard: {
    backgroundColor: '#FAFBF9',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8EDE6',
    gap: 14,
  },
  aiVerdictHeader: {
    borderLeftWidth: 4,
    paddingLeft: 12,
    paddingVertical: 4,
  },
  aiVerdictRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aiVerdictLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  aiVerdictText: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  aiScoreCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  aiScoreNum: {
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 18,
  },
  aiScoreLabel: {
    fontSize: 8,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  aiDimensionsList: {
    gap: 12,
  },
  aiDimensionRow: {
    gap: 4,
  },
  aiDimHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aiDimLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textBright,
    flex: 1,
  },
  aiDimScore: {
    fontSize: 11,
    fontWeight: '800',
  },
  aiDimTrack: {
    height: 6,
    backgroundColor: '#F1F5F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  aiDimFill: {
    height: '100%',
    borderRadius: 3,
  },
  aiDimFeedback: {
    fontSize: 10,
    color: COLORS.textSecondary,
    lineHeight: 15,
    fontWeight: '500',
  },
  aiSummaryBox: {
    backgroundColor: 'rgba(124, 58, 237, 0.06)',
    borderRadius: 12,
    padding: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.12)',
  },
  aiSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aiSummaryTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#7C3AED',
  },
  aiSummaryText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 17,
    fontWeight: '500',
  },
  unlockBtn: {
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
  unlockBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  retryBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAF7',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8EDE6',
  },
  retryBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0D5C46',
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
    backgroundColor: '#7C3AED',
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  submitBtnDisabled: {
    backgroundColor: '#F1F5F0',
    borderWidth: 1,
    borderColor: '#E8EDE6',
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
