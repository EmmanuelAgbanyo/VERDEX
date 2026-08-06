import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, StyleProp, ViewStyle, TextStyle, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { LEARN_PATHWAYS } from '../(tabs)/learn';
import { GlassCard } from '@/components/GlassCard';
import { COLORS, LAYOUT } from '@/constants/theme';
import { ArrowLeft, BookOpen, Award, CheckCircle2, XCircle, ArrowRight, Lightbulb, Sparkles } from 'lucide-react-native';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { completeLesson, completedLessons } = useApp();
  const { width } = useWindowDimensions();

  // Find lesson from pathways
  let targetLesson = LEARN_PATHWAYS.flatMap((p) => p.lessons).find((l) => l.id === id);
  if (!targetLesson) {
    targetLesson = LEARN_PATHWAYS[0].lessons[0];
  }

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const isAlreadyCompleted = completedLessons.includes(targetLesson.id);

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
    setQuizSubmitted(false);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null || !targetLesson) return;
    const correct = selectedOption === targetLesson.quiz.correctOptionIndex;
    setIsCorrect(correct);
    setQuizSubmitted(true);

    if (correct) {
      completeLesson(targetLesson.id, targetLesson.xpReward);
    }
  };

  return (
    <View style={styles.container}>
      {/* Dynamic Background Glows */}
      <View style={[styles.blurBlob, styles.blobAmber]} />
      <View style={[styles.blurBlob, styles.blobGreen]} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={{ maxWidth: 720, width: '100%', alignSelf: 'center', gap: 14 }}>
        {/* Header */}
        <View style={styles.topRow}>
          <Pressable
            onPress={() => router.back()}
            style={styles.iconBtn}
            accessibilityLabel="Go back to learn path"
            accessibilityRole="button"
            hitSlop={44}
          >
            <ArrowLeft size={18} color="#1A2E26" />
          </Pressable>

          <View style={styles.titleBox}>
            <Text style={styles.lessonTag}>ACADEMY MODULE</Text>
            <Text style={styles.lessonTitle}>{targetLesson.title}</Text>
          </View>

          <View style={styles.xpTag}>
            <Award size={14} color="#B45309" />
            <Text style={styles.xpText}>+{targetLesson.xpReward} XP</Text>
          </View>
        </View>

        {/* Lesson Summary Overview (Glass Card) */}
        <GlassCard variant="emerald" showGrid style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <BookOpen size={16} color="#0D5C46" />
            <Text style={styles.summaryTitle}>Module Overview</Text>
          </View>
          <Text style={styles.summaryText}>{targetLesson.summary}</Text>
        </GlassCard>

        {/* Teaching Sections */}
        {targetLesson.sections.map((sec, idx) => (
          <GlassCard key={idx} style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>{sec.title}</Text>
            <Text style={styles.sectionBody}>{sec.body}</Text>
            <View style={styles.takeawayBox}>
              <Lightbulb size={14} color="#B45309" />
              <Text style={styles.takeawayText}>
                <Text style={{ fontWeight: '700', color: '#B45309' }}>Key Takeaway: </Text>
                {sec.keyTakeaway}
              </Text>
            </View>
          </GlassCard>
        ))}

        {/* END-OF-LESSON QUIZ (Glass Card with Highlight borders) */}
        <GlassCard variant="light" style={styles.quizCard}>
          <View style={styles.quizHeaderRow}>
            <Sparkles size={16} color="#10B981" />
            <Text style={styles.quizHeaderTitle}>End-of-Lesson Checkpoint</Text>
          </View>

          <Text style={styles.questionText}>{targetLesson.quiz.question}</Text>

          <View style={styles.optionsList}>
            {targetLesson.quiz.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectOpt = idx === targetLesson.quiz.correctOptionIndex;

              const styleItem: StyleProp<ViewStyle>[] = [styles.optionItem];
              if (isSelected) styleItem.push(styles.optionSelected);

              if (quizSubmitted) {
                if (isCorrectOpt) {
                  styleItem.push(styles.optionCorrect);
                } else if (isSelected && !isCorrect) {
                  styleItem.push(styles.optionIncorrect);
                }
              }

              return (
                <Pressable
                  key={idx}
                  onPress={() => handleSelectOption(idx)}
                  style={styleItem}
                  accessibilityLabel={`Option ${String.fromCharCode(65 + idx)}: ${opt}`}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  hitSlop={44}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && { color: '#0D5C46', fontWeight: '700' },
                      quizSubmitted && isCorrectOpt && { color: '#0D5C46', fontWeight: '800' },
                    ]}
                  >
                    {String.fromCharCode(65 + idx)}. {opt}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Quiz Feedback Banner */}
          {quizSubmitted && (
            <View
              style={[
                styles.feedbackBox,
                { backgroundColor: isCorrect ? 'rgba(16, 185, 129, 0.12)' : 'rgba(225, 29, 72, 0.12)' },
              ]}
            >
              <View style={styles.feedbackTitleRow}>
                {isCorrect ? (
                  <CheckCircle2 size={16} color="#10B981" />
                ) : (
                  <XCircle size={16} color="#E11D48" />
                )}
                <Text style={[styles.feedbackTitle, { color: isCorrect ? '#0D5C46' : '#E11D48' }]}>
                  {isCorrect ? 'Correct Answer! Module Mastered' : 'Incorrect Analysis'}
                </Text>
              </View>
              <Text style={styles.explanationText}>{targetLesson.quiz.explanation}</Text>
            </View>
          )}

          {/* Submit / Retry Action Button */}
          {!quizSubmitted ? (
            <Pressable
              onPress={handleCheckAnswer}
              style={({ pressed }) => [
                styles.checkBtn,
                selectedOption === null && styles.checkBtnDisabled,
                pressed && selectedOption !== null && { opacity: 0.85 },
              ]}
              disabled={selectedOption === null}
              accessibilityLabel="Submit your quiz answer"
              accessibilityRole="button"
              accessibilityState={{ disabled: selectedOption === null }}
              hitSlop={44}
            >
              <Text style={styles.checkBtnText}>CHECK ANSWER</Text>
            </Pressable>
          ) : (
            !isCorrect && (
              <Pressable
                onPress={() => setQuizSubmitted(false)}
                style={styles.retryBtn}
                accessibilityLabel="Retry quiz"
                accessibilityRole="button"
                hitSlop={44}
              >
                <Text style={styles.retryBtnText}>RETRY CHECKPOINT</Text>
              </Pressable>
            )
          )}
        </GlassCard>

        {/* Applied Practice Prompt (Glass overlay) */}
        <GlassCard style={styles.practiceCard}>
          <Text style={styles.practiceTag}>APPLIED PRACTICE PROMPT</Text>
          <Text style={styles.practiceText}>{targetLesson.practicePrompt}</Text>
          <Pressable
            onPress={() => router.push('/(tabs)/markets')}
            style={({ pressed }) => [styles.practiceBtn, pressed && { opacity: 0.85 }]}
            accessibilityLabel="Navigate to trading terminal"
            accessibilityRole="button"
            hitSlop={44}
          >
            <Text style={styles.practiceBtnText}>Go to Climate Terminal</Text>
            <ArrowRight size={14} color="#FFFFFF" />
          </Pressable>
        </GlassCard>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
    position: 'relative',
    overflow: 'hidden',
  },
  blurBlob: {
    position: 'absolute',
    borderRadius: 999,
  },
  blobAmber: {
    width: 250,
    height: 250,
    backgroundColor: 'rgba(245, 158, 11, 0.04)',
    top: -50,
    right: -50,
  },
  blobGreen: {
    width: 220,
    height: 220,
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    top: 350,
    left: -60,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  iconBtn: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4EAE2',
  },
  titleBox: {
    flex: 1,
    marginHorizontal: 12,
  },
  lessonTag: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  lessonTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A2E26',
  },
  xpTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  xpText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  summaryCard: {
    padding: 16,
    gap: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0D5C46',
  },
  summaryText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  sectionCard: {
    padding: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A2E26',
  },
  sectionBody: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  takeawayBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: '#F7F9F6',
    borderWidth: 1,
    borderColor: '#E4EAE2',
    padding: 10,
    borderRadius: 8,
    marginTop: 4,
  },
  takeawayText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 15,
  },
  quizCard: {
    padding: 16,
    gap: 10,
  },
  quizHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quizHeaderTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#10B981',
  },
  questionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A2E26',
  },
  optionsList: {
    gap: 8,
  },
  optionItem: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E4EAE2',
  },
  optionSelected: {
    borderColor: '#10B981',
    backgroundColor: '#E6F4EA',
  },
  optionCorrect: {
    borderColor: '#0D5C46',
    backgroundColor: '#D1FAE5',
  },
  optionIncorrect: {
    borderColor: '#E11D48',
    backgroundColor: '#FFE4E6',
  },
  optionText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  feedbackBox: {
    padding: 12,
    borderRadius: 10,
    gap: 4,
  },
  feedbackTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  feedbackTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  explanationText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 15,
  },
  checkBtn: {
    backgroundColor: '#0D5C46',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  checkBtnDisabled: {
    opacity: 0.5,
  },
  checkBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  retryBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E11D48',
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
  },
  retryBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#E11D48',
  },
  practiceCard: {
    padding: 16,
    gap: 10,
  },
  practiceTag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 1,
  },
  practiceText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  practiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0D5C46',
    paddingVertical: 11,
    borderRadius: 10,
    marginTop: 4,
  },
  practiceBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
