import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { DailyChallenge } from '@/types';
import { COLORS, LAYOUT } from '@/constants/theme';
import { Zap, CheckCircle2, XCircle, Award, ChevronDown, ChevronUp, X, RotateCcw } from 'lucide-react-native';

interface DailyChallengeCardProps {
  challenge: DailyChallenge;
  onAnswer: (optionIndex: number) => { correct: boolean; explanation: string };
}

export const DailyChallengeCard: React.FC<DailyChallengeCardProps> = ({ challenge, onAnswer }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isClosed, setIsClosed] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; explanation: string } | null>(
    challenge.completed
      ? { correct: true, explanation: challenge.explanation }
      : null
  );

  const handleSelect = (idx: number) => {
    if (challenge.completed) return;
    setSelectedIndex(idx);
    const result = onAnswer(idx);
    setFeedback(result);
  };

  if (isClosed) {
    return (
      <View style={styles.closedContainer}>
        <Pressable
          onPress={() => setIsClosed(false)}
          style={({ pressed }) => [styles.restoreBtn, pressed && { opacity: 0.85 }]}
          accessibilityLabel="Restore Daily Challenge"
          accessibilityRole="button"
        >
          <Zap size={14} color={COLORS.amberDataBright} />
          <Text style={styles.restoreText}>Show Daily Signal Challenge (+{challenge.xpReward} XP)</Text>
          <RotateCcw size={13} color={COLORS.textMuted} />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, isCollapsed && styles.containerCollapsed]}>
      {/* Header Row: Title, XP Badge, Minimise & Close Controls */}
      <View style={styles.headerRow}>
        <Pressable
          onPress={() => setIsCollapsed(!isCollapsed)}
          style={styles.titleGroup}
          accessibilityLabel={isCollapsed ? 'Expand Daily Challenge' : 'Minimise Daily Challenge'}
          accessibilityRole="button"
        >
          <Zap size={18} color={COLORS.amberDataBright} />
          <Text style={styles.titleText}>{challenge.title}</Text>
        </Pressable>

        <View style={styles.headerRightControls}>
          <View style={styles.xpBadge}>
            <Award size={12} color={COLORS.amberDataBright} />
            <Text style={styles.xpText}>+{challenge.xpReward} XP</Text>
          </View>

          {/* Minimise/Expand Toggle Button */}
          <Pressable
            onPress={() => setIsCollapsed(!isCollapsed)}
            style={({ pressed }) => [styles.iconActionBtn, pressed && { opacity: 0.7 }]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel={isCollapsed ? 'Expand Daily Challenge' : 'Minimise Daily Challenge'}
            accessibilityRole="button"
          >
            {isCollapsed ? (
              <ChevronDown size={18} color={COLORS.textSecondary} />
            ) : (
              <ChevronUp size={18} color={COLORS.textSecondary} />
            )}
          </Pressable>

          {/* Close/Dismiss Button */}
          <Pressable
            onPress={() => setIsClosed(true)}
            style={({ pressed }) => [styles.iconActionBtn, pressed && { opacity: 0.7 }]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Close Daily Challenge"
            accessibilityRole="button"
          >
            <X size={16} color={COLORS.textMuted} />
          </Pressable>
        </View>
      </View>

      {!isCollapsed && (
        <>
          {/* Signal Context Pill */}
          <View style={styles.signalContextPill}>
            <Text style={styles.signalContextLabel}>LIVE SIGNAL READOUT:</Text>
            <Text style={styles.signalContextVal}>{challenge.signalContext}</Text>
          </View>

          {/* Scenario & Question */}
          <Text style={styles.scenarioText}>{challenge.scenario}</Text>
          <Text style={styles.questionText}>{challenge.question}</Text>

          {/* Options */}
          <View style={styles.optionsList}>
            {challenge.options.map((opt, idx) => {
              const isSelected = selectedIndex === idx;
              const isCorrect = idx === challenge.correctIndex;
              const optionStyle: StyleProp<ViewStyle>[] = [styles.optionItem];
              const textStyle: StyleProp<TextStyle>[] = [styles.optionText];

              if (feedback) {
                if (isCorrect) {
                  optionStyle.push(styles.optionCorrect);
                  textStyle.push(styles.optionTextCorrect);
                } else if (isSelected && !feedback.correct) {
                  optionStyle.push(styles.optionIncorrect);
                  textStyle.push(styles.optionTextIncorrect);
                }
              }

              return (
                <Pressable
                  key={idx}
                  onPress={() => handleSelect(idx)}
                  style={({ pressed }) => [...optionStyle, pressed && !feedback && { opacity: 0.8 }]}
                >
                  <Text style={textStyle}>
                    {String.fromCharCode(65 + idx)}. {opt}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Feedback Banner */}
          {feedback && (
            <View
              style={[
                styles.feedbackBox,
                { backgroundColor: feedback.correct ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 90, 95, 0.15)' },
              ]}
            >
              <View style={styles.feedbackTitleRow}>
                {feedback.correct ? (
                  <CheckCircle2 size={16} color={COLORS.emeraldBright} />
                ) : (
                  <XCircle size={16} color={COLORS.redAlert} />
                )}
                <Text
                  style={[
                    styles.feedbackTitle,
                    { color: feedback.correct ? COLORS.emeraldBright : COLORS.redAlert },
                  ]}
                >
                  {feedback.correct ? 'Correct Signal Interpretation!' : 'Incorrect Analysis'}
                </Text>
              </View>
              <Text style={styles.explanationText}>{feedback.explanation}</Text>

              {!feedback.correct && (
                <Pressable
                  onPress={() => {
                    setSelectedIndex(null);
                    setFeedback(null);
                  }}
                  style={styles.retryChallengeBtn}
                  accessibilityLabel="Try challenge again"
                  accessibilityRole="button"
                >
                  <Text style={styles.retryChallengeText}>Try Another Option</Text>
                </Pressable>
              )}
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    gap: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  containerCollapsed: {
    paddingVertical: 12,
    gap: 0,
  },
  closedContainer: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  restoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.10)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    borderStyle: 'dashed',
  },
  restoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.amberDataBright,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  titleText: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.textBright,
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  headerRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconActionBtn: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  xpText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.amberDataBright,
  },
  signalContextPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.inputBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  signalContextLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  signalContextVal: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.emeraldBright,
  },
  scenarioText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  questionText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textBright,
  },
  optionsList: {
    gap: 8,
  },
  optionItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    shadowColor: '#102A1F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  optionCorrect: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: COLORS.emeraldPrimary,
    borderWidth: 1.5,
  },
  optionIncorrect: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: COLORS.redAlert,
    borderWidth: 1.5,
  },
  optionText: {
    fontSize: 12,
    color: COLORS.textBright,
    fontWeight: '500',
  },
  optionTextCorrect: {
    color: COLORS.emeraldBright,
    fontWeight: '700',
  },
  optionTextIncorrect: {
    color: COLORS.redAlert,
    fontWeight: '700',
  },
  feedbackBox: {
    padding: 14,
    borderRadius: 14,
    gap: 6,
    marginTop: 6,
  },
  feedbackTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  feedbackTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  explanationText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 15,
  },
  retryChallengeBtn: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: COLORS.redAlert,
    borderRadius: 6,
  },
  retryChallengeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
