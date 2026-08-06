import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, useWindowDimensions } from 'react-native';
import { useApp } from '@/context/AppContext';
import { GlassCard } from '@/components/GlassCard';
import { DailyChallengeCard } from '@/components/DailyChallengeCard';
import { COLORS, LAYOUT } from '@/constants/theme';
import {
  ChevronRight,
  CheckCircle2,
  BookOpen,
  Lock,
  Shield,
  Award,
  Play,
  Award as MedalIcon,
  BarChart3,
  LineChart,
  Sparkles,
  Check,
  Target,
  Zap,
  Flame,
  Crown,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LearnPathway } from '@/types';
import Svg, { Circle, Rect, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { FlameSvg, AwardSvg, CoopFinanceSvg, IotSensorSvg, AirQualitySvg, SparklesSvg } from '@/components/SvgIcons';

export const LEARN_PATHWAYS: LearnPathway[] = [
  {
    id: 'path-climate-change',
    title: 'Climate Change Fundamentals',
    description: 'Understand physical atmospheric feedback loops, rainfall anomalies, and West African ecological vulnerabilities.',
    iconName: 'Wind',
    color: '#3B82F6', // Blue
    totalLessons: 3,
    completedLessons: 1,
    lessons: [
      {
        id: 'les-climate-1',
        pathwayId: 'path-climate-change',
        title: 'Decoding Ghanaian Micro-Climate Signals',
        summary: 'Learn how satellite humidity and air quality index (AQI) map directly to regional agricultural yield forecasts.',
        durationMinutes: 4,
        xpReward: 100,
        locked: false,
        completed: true,
        sections: [
          {
            title: '1. Atmospheric Sensor Baselines',
            body: 'Ghanaian ecological zones fluctuate based on Harmattan wind patterns and monsoon pulses. Air Quality Index (AQI) measures fine particulate matter PM2.5. An AQI below 50 indicates clean atmospheric transparency.',
            keyTakeaway: 'Cleaner air (lower AQI) allows higher solar irradiance, boosting solar PV generation.',
          },
          {
            title: '2. Rainfall Variance in the Cocoa Belt',
            body: 'Eastern Region cocoa trees require consistent 100mm-130mm monthly precipitation. A +12% rainfall anomaly enhances pod filling while moisture drops below 40% induce dry stress.',
            keyTakeaway: 'Rainfall anomalies directly shift Suhum Cocoa Cooperative Bond prices.',
          },
        ],
        quiz: {
          id: 'q-climate-1',
          question: 'What happens to Tamale solar micro-grid output when Accra AQI drops from 55 to 42?',
          options: [
            'Output drops due to cloud cover.',
            'Output rises due to higher atmospheric clarity.',
            'Output remains unchanged.',
            'Battery storage drains instantly.',
          ],
          correctOptionIndex: 1,
          explanation: 'Cleaner air increases direct solar irradiance reaching solar panels.',
        },
        practicePrompt: 'Now visit the Markets tab and evaluate the Tamale Solar Shares signal score.',
      },
      {
        id: 'les-climate-2',
        pathwayId: 'path-climate-change',
        title: 'Savannah Thermal Anomalies & Wildfire Risks',
        summary: 'Analyze temperature deviations in the Northern Buffer Zone and their impact on shea tree agroforestry stakes.',
        durationMinutes: 5,
        xpReward: 120,
        locked: false,
        completed: false,
        sections: [
          {
            title: '1. Thermal Anomaly Thresholds',
            body: 'When land surface temperatures exceed baseline by +1.5°C, moisture evaporation accelerates rapidly, increasing wildfire risks along the Mole corridor.',
            keyTakeaway: 'Thermal anomalies serve as early warning signals for Savannah reforestation risk.',
          },
        ],
        quiz: {
          id: 'q-climate-2',
          question: 'Which asset is most vulnerable to elevated thermal anomalies in Northern Ghana?',
          options: [
            'Volta Mangrove Tokens',
            'Mole Corridor Savannah Reforestation Stake',
            'Accra Urban Logistics Bond',
            'Suhum Organic Cocoa Bond',
          ],
          correctOptionIndex: 1,
          explanation: 'Thermal anomalies increase bushfire risk along Savannah reforestation corridors.',
        },
        practicePrompt: 'Check the risk factors on Mole Savannah Stake in the Markets desk.',
      },
    ],
  },
  {
    id: 'path-climate-finance',
    title: 'Climate Finance & Green Bonds',
    description: 'Master green bond structuring, carbon credit verification, and virtual capital allocation mechanisms.',
    iconName: 'Award',
    color: '#10B981', // Emerald
    totalLessons: 2,
    completedLessons: 0,
    lessons: [
      {
        id: 'les-finance-1',
        pathwayId: 'path-climate-finance',
        title: 'Structuring African Green Cooperative Bonds',
        summary: 'Discover how smallholder farmers combine virtual capital with premium crop pricing to issue green bonds.',
        durationMinutes: 6,
        xpReward: 150,
        locked: false,
        completed: false,
        sections: [
          {
            title: '1. Use of Proceeds in Green Bonds',
            body: 'Green bonds restrict capital allocation to audited sustainable activities, such as installing solar irrigation hubs or shade canopy planting.',
            keyTakeaway: 'Strict use-of-proceeds covenants protect bondholders against greenwashing.',
          },
        ],
        quiz: {
          id: 'q-finance-1',
          question: 'What distinguishes a Green Cooperative Bond from a conventional municipal bond?',
          options: [
            'Higher interest rates only.',
            'Capital is legally restricted to verified environmental impact activities.',
            'No repayment obligation.',
            'Traded exclusively on international stock exchanges.',
          ],
          correctOptionIndex: 1,
          explanation: 'Green bonds require strict allocation to environmental projects.',
        },
        practicePrompt: 'Write a 3-sentence thesis for Suhum Cocoa Bond focusing on use-of-proceeds.',
      },
    ],
  },
  {
    id: 'path-climate-data',
    title: 'Climate Data Analytics & IoT',
    description: 'Learn how satellite remote sensing, soil moisture sensors, and IoT weather stations generate price signals.',
    iconName: 'BarChart3',
    color: '#F59E0B', // Amber
    totalLessons: 2,
    completedLessons: 0,
    lessons: [
      {
        id: 'les-data-1',
        pathwayId: 'path-climate-data',
        title: 'Interpreting Satellite Blue Carbon Capture',
        summary: 'Evaluate NDVI canopy indices and biomass carbon density metrics in the Volta Estuary.',
        durationMinutes: 5,
        xpReward: 130,
        locked: false,
        completed: false,
        sections: [
          {
            title: '1. Remote Sensing Biomass Index',
            body: 'Satellites measure reflected near-infrared light (NDVI) to quantify coastal mangrove density and calculate carbon sequestration rates (tCO2e/ha).',
            keyTakeaway: 'Higher NDVI correlates directly with blue carbon token price appreciation.',
          },
        ],
        quiz: {
          id: 'q-data-1',
          question: 'What metric measures blue carbon sequestration in Volta Mangroves?',
          options: [
            'Barometric pressure',
            'tCO2e/ha (Tonnes of CO2 equivalent per hectare)',
            'Wind speed in knots',
            'pH acidity level',
          ],
          correctOptionIndex: 1,
          explanation: 'tCO2e/ha is the standard unit for sequestered carbon credits.',
        },
        practicePrompt: 'Examine Volta Mangrove Carbon Token metrics in your portfolio.',
      },
    ],
  },
  {
    id: 'path-adaptation-resilience',
    title: 'Adaptation & Resilience',
    description: 'Learn to design resilient community infrastructure, flood defenses, and drought resistant farming frameworks.',
    iconName: 'Shield',
    color: '#E11D48', // Rose
    totalLessons: 2,
    completedLessons: 0,
    lessons: [
      {
        id: 'les-resilience-1',
        pathwayId: 'path-adaptation-resilience',
        title: 'Community Micro-Grids & Irrigation',
        summary: 'Understand how off-grid solar-powered irrigation creates agricultural resilience against rainfall gaps.',
        durationMinutes: 5,
        xpReward: 140,
        locked: false,
        completed: false,
        sections: [
          {
            title: '1. Climate Resilient Agriculture',
            body: 'Unpredictable monsoon starts force Ghanaian farms to adopt solar irrigation hubs. Solar power pumps water from underground aquifers dynamically during drought ticks.',
            keyTakeaway: 'Decentralized grids secure food supply lines and protect local bond yields.',
          },
        ],
        quiz: {
          id: 'q-resilience-1',
          question: 'How do solar water hubs reduce drought vulnerability for smallholders?',
          options: [
            'By generating carbon offsets directly.',
            'By providing reliable water supply during rainfall deficits.',
            'By preventing Harmattan wind flow.',
            'By reducing local land taxes.',
          ],
          correctOptionIndex: 1,
          explanation: 'Pumping groundwater dynamically ensures crops receive moisture when rains fail.',
        },
        practicePrompt: 'Inspect the Brong-Ahafo Crop Bond description in Markets.',
      },
    ],
  },
];

export default function LearnScreen() {
  const {
    xp,
    streak,
    completedLessons,
    skillMeters,
    dailyChallenge,
    answerDailyChallenge,
    signals,
  } = useApp();

  const router = useRouter();
  const { width } = useWindowDimensions();
  const [selectedPathId, setSelectedPathId] = useState<string>('path-climate-change');
  const [certModalVisible, setCertModalVisible] = useState<boolean>(false);
  const [sandboxTemp, setSandboxTemp] = useState<number>(0.8);

  const accraSignal = signals.find((s) => s.region === 'accra') || signals[0];

  const currentLevel = Math.floor(xp / 200) + 1;
  const xpProgress = (xp % 200) / 200;

  const weekDays = [
    { label: 'M', active: streak >= 1 },
    { label: 'T', active: streak >= 2 },
    { label: 'W', active: streak >= 3 },
    { label: 'T', active: streak >= 4 },
    { label: 'F', active: streak >= 5 },
    { label: 'S', active: streak >= 6 },
    { label: 'S', active: streak >= 7 },
  ];

  const getPathwayIcon = (pathwayId: string) => {
    switch (pathwayId) {
      case 'path-climate-change':
        return <AirQualitySvg size={22} color="#1A73E8" secondaryColor="#60A5FA" />;
      case 'path-climate-finance':
        return <CoopFinanceSvg size={22} color="#0D5C46" secondaryColor="#34D399" />;
      case 'path-climate-data':
        return <IotSensorSvg size={22} color="#B45309" secondaryColor="#FBBF24" />;
      case 'path-adaptation-resilience':
        return <SparklesSvg size={22} color="#E11D48" />;
      default:
        return <SparklesSvg size={22} color="#FF5A5F" />;
    }
  };

  const selectedPathway = LEARN_PATHWAYS.find((p) => p.id === selectedPathId) || LEARN_PATHWAYS[0];

  const getPathwayProgress = (path: LearnPathway) => {
    const completedCount = path.lessons.filter((l) => completedLessons.includes(l.id)).length;
    const total = path.lessons.length;
    const ratio = completedCount / total;
    return {
      completedCount,
      total,
      percentage: Math.round(ratio * 100),
      ratio,
    };
  };

  const calcSandboxImpact = (temp: number) => {
    const cocoaRiskPct = Math.max(0, Math.min(100, Math.round((temp - 0.5) * 45)));
    const solarOutputPct = Math.max(80, Math.min(130, Math.round(100 + (temp - 0.8) * 15)));
    return { cocoaRiskPct, solarOutputPct };
  };

  const { cocoaRiskPct, solarOutputPct } = calcSandboxImpact(sandboxTemp);

  return (
    <View style={styles.container}>
      <View style={[styles.blurBlob, styles.blobBlue]} />
      <View style={[styles.blurBlob, styles.blobGreen]} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={{ maxWidth: 840, width: '100%', alignSelf: 'center' }}>
          {/* Screen Header */}
          <View style={styles.headerArea}>
            <Text style={styles.screenTag}>DUOLINGO-STYLE E-LEARNING</Text>
            <Text style={styles.screenTitle}>Green Academy</Text>
            <Text style={styles.screenDesc}>
              Master climate data analysis, complete daily quests, and earn verified credentials.
            </Text>
          </View>

          {/* DUOLINGO GAMIFIED STREAK & XP HEADER HUB */}
          <GlassCard variant="light" showGrid style={styles.duoHeaderCard}>
            <View style={styles.duoTopStatsRow}>
              {/* Flame Streak Pill */}
              <View style={styles.duoStreakPill}>
                <Flame size={20} color="#FF5A5F" fill="#FF5A5F" />
                <View>
                  <Text style={styles.duoStreakNum}>{streak} Day Streak</Text>
                  <Text style={styles.duoStreakSub}>Keep practicing!</Text>
                </View>
              </View>

              {/* XP Level Crown Pill */}
              <View style={styles.duoXpPill}>
                <Crown size={20} color="#F59E0B" fill="#F59E0B" />
                <View>
                  <Text style={styles.duoXpNum}>Level {currentLevel}</Text>
                  <Text style={styles.duoXpSub}>{xp} Total XP</Text>
                </View>
              </View>
            </View>

            {/* Daily Goal Bar */}
            <View style={styles.duoGoalBox}>
              <View style={styles.duoGoalHeader}>
                <View style={styles.duoGoalTitleRow}>
                  <Target size={14} color="#10B981" />
                  <Text style={styles.duoGoalTitle}>DAILY XP GOAL</Text>
                </View>
                <Text style={styles.duoGoalVal}>{(xp % 200)} / 200 XP</Text>
              </View>
              <View style={styles.duoTrack}>
                <View style={[styles.duoFill, { width: `${Math.min(100, xpProgress * 100)}%` }]} />
              </View>
            </View>

            {/* Week Streak Calendar Dots */}
            <View style={styles.duoCalendarRow}>
              {weekDays.map((day, idx) => (
                <View key={idx} style={styles.duoCalCol}>
                  <View
                    style={[
                      styles.duoCalDot,
                      day.active ? styles.duoCalDotActive : styles.duoCalDotInactive,
                    ]}
                  >
                    {day.active ? (
                      <CheckCircle2 size={13} color="#FFFFFF" />
                    ) : (
                      <Text style={styles.duoCalText}>{day.label}</Text>
                    )}
                  </View>
                  <Text style={styles.duoCalLabel}>{day.label}</Text>
                </View>
              ))}
            </View>
          </GlassCard>

          {/* DUOLINGO DAILY QUESTS HUB */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionCategory}>DAILY QUESTS</Text>
            <Text style={styles.sectionTitle}>Earn Bonus XP</Text>
          </View>

          <View style={styles.questsContainer}>
            <View style={styles.questCard}>
              <View style={styles.questIconCircle}>
                <BookOpen size={16} color="#3B82F6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.questTitle}>Complete 1 Academy Lesson</Text>
                <Text style={styles.questSub}>+100 XP upon completion</Text>
              </View>
              <View style={styles.questRewardBadge}>
                <Text style={styles.questRewardText}>+100 XP</Text>
              </View>
            </View>

            <View style={styles.questCard}>
              <View style={[styles.questIconCircle, { backgroundColor: 'rgba(245, 158, 11, 0.12)' }]}>
                <Zap size={16} color="#F59E0B" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.questTitle}>Answer Signal Challenge</Text>
                <Text style={styles.questSub}>+50 XP instant bonus</Text>
              </View>
              <View style={[styles.questRewardBadge, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                <Text style={[styles.questRewardText, { color: '#B45309' }]}>+50 XP</Text>
              </View>
            </View>
          </View>

          {/* ACCRA CLIMATE SIGNAL READOUT */}
          <View style={styles.accraSignalCard}>
            <View style={styles.accraHeader}>
              <AirQualitySvg size={16} color="#0D5C46" secondaryColor="#34D399" />
              <Text style={styles.accraTitle}>LIVE ACCRA CLIMATE READOUT</Text>
            </View>
            <Text style={styles.accraBody}>
              {accraSignal.name}:{' '}
              <Text style={{ fontWeight: '800', color: COLORS.textBright }}>
                {accraSignal.currentValue} {accraSignal.unit}
              </Text>{' '}
              ({accraSignal.statusText}) — {accraSignal.impactDescription}
            </Text>
          </View>

          {/* DAILY SIGNAL CHALLENGE */}
          <DailyChallengeCard challenge={dailyChallenge} onAnswer={answerDailyChallenge} />

          {/* VERIFIED CERTIFICATIONS */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionCategory}>VERIFIED CREDENTIALS</Text>
            <Text style={styles.sectionTitle}>Certifications & Badges</Text>
          </View>

          <GlassCard style={styles.certCard}>
            <View style={styles.certMain}>
              <MedalIcon size={26} color="#10B981" />
              <View style={{ flex: 1 }}>
                <Text style={styles.certTitleText}>Climate Finance Specialist</Text>
                <Text style={styles.certCriteria}>Criteria: Complete 2 lessons in Climate Fundamentals</Text>
              </View>
              <Pressable
                onPress={() => setCertModalVisible(true)}
                style={styles.certClaimBtn}
                accessibilityRole="button"
                accessibilityLabel="View Climate Finance Specialist Certificate"
                hitSlop={44}
              >
                <Text style={styles.certClaimBtnText}>View Cert</Text>
              </Pressable>
            </View>
          </GlassCard>

          {/* COURSE SYLLABUS CAROUSEL */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionCategory}>LMS PATHWAYS</Text>
            <Text style={styles.sectionTitle}>Course Syllabus Tracks</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.carouselContainer}
            contentContainerStyle={styles.carouselContent}
          >
            {LEARN_PATHWAYS.map((path) => {
              const isSelected = path.id === selectedPathId;
              const progress = getPathwayProgress(path);
              const r = 14;
              const circ = 2 * Math.PI * r;
              const offset = circ - progress.ratio * circ;

              return (
                <Pressable
                  key={path.id}
                  onPress={() => setSelectedPathId(path.id)}
                  style={({ pressed }) => [
                    styles.courseCard,
                    isSelected && styles.courseCardActive,
                    pressed && { opacity: 0.95 },
                  ]}
                  accessibilityLabel={`${path.title} pathway`}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isSelected }}
                  hitSlop={44}
                >
                  <View style={styles.cardHeader}>
                    <View style={[styles.courseIconWrapper, { backgroundColor: `${path.color}15` }]}>
                      {getPathwayIcon(path.id)}
                    </View>

                    <View style={styles.ringWrapper}>
                      <Svg width={36} height={36} viewBox="0 0 36 36">
                        <Circle cx={18} cy={18} r={r} stroke="#F1F5F0" strokeWidth={3} fill="none" />
                        <Circle
                          cx={18}
                          cy={18}
                          r={r}
                          stroke={path.color}
                          strokeWidth={3}
                          strokeDasharray={circ}
                          strokeDashoffset={offset}
                          strokeLinecap="round"
                          fill="none"
                          transform="rotate(-90 18 18)"
                        />
                      </Svg>
                      <Text style={styles.ringPercentText}>{progress.percentage}%</Text>
                    </View>
                  </View>

                  <Text style={styles.courseTitle} numberOfLines={1}>
                    {path.title}
                  </Text>
                  <Text style={styles.courseDesc} numberOfLines={2}>
                    {path.description}
                  </Text>

                  <View style={styles.courseFooter}>
                    <Text style={styles.courseLessonsCount}>
                      {progress.completedCount}/{progress.total} lessons
                    </Text>
                    {isSelected && <View style={[styles.activeDot, { backgroundColor: path.color }]} />}
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* DUOLINGO-STYLE LESSON TREE & PATH NODES */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionCategory}>CURRICULUM ROADMAP</Text>
            <Text style={styles.sectionTitle}>{selectedPathway.title}</Text>
          </View>

          <GlassCard style={styles.roadmapCard}>
            <View style={styles.lessonsContainer}>
              {selectedPathway.lessons.map((les, idx) => {
                const isCompleted = completedLessons.includes(les.id);
                const isPreviousCompleted =
                  idx === 0 || completedLessons.includes(selectedPathway.lessons[idx - 1].id);
                const isLocked = !isCompleted && !isPreviousCompleted;
                const isLast = idx === selectedPathway.lessons.length - 1;

                return (
                  <View key={les.id} style={styles.lessonTimelineWrapper}>
                    {!isLast && (
                      <View
                        style={[
                          styles.timelineConnector,
                          isCompleted ? styles.connectorCompleted : styles.connectorLocked,
                        ]}
                      />
                    )}

                    <Pressable
                      onPress={() => {
                        if (!isLocked) {
                          router.push(`/lesson/${les.id}` as any);
                        }
                      }}
                      disabled={isLocked}
                      style={({ pressed }) => [
                        styles.duoLessonButton,
                        isCompleted && styles.duoLessonButtonCompleted,
                        !isCompleted && !isLocked && styles.duoLessonButtonActive,
                        isLocked && styles.duoLessonButtonLocked,
                        pressed && !isLocked && { opacity: 0.85 },
                      ]}
                      accessibilityLabel={`${les.title}, ${isLocked ? 'locked' : isCompleted ? 'completed' : 'available'}`}
                      accessibilityRole="button"
                      accessibilityState={{ disabled: isLocked }}
                      hitSlop={44}
                    >
                      <View style={styles.duoLessonNodeLeft}>
                        <View
                          style={[
                            styles.duoNodeCircle,
                            isCompleted && styles.duoNodeCompleted,
                            !isCompleted && !isLocked && styles.duoNodeActive,
                            isLocked && styles.duoNodeLocked,
                          ]}
                        >
                          {isCompleted ? (
                            <CheckCircle2 size={18} color="#FFFFFF" />
                          ) : isLocked ? (
                            <Lock size={14} color="#8BA196" />
                          ) : (
                            <Play size={16} color="#FFFFFF" fill="#FFFFFF" />
                          )}
                        </View>

                        <View style={styles.duoLessonTextGroup}>
                          <Text
                            style={[
                              styles.duoLessonTitle,
                              isCompleted && styles.duoLessonTitleCompleted,
                              isLocked && styles.duoLessonTitleLocked,
                            ]}
                          >
                            {les.title}
                          </Text>
                          <Text style={styles.duoLessonMeta}>
                            {isLocked
                              ? 'Locked (Complete previous lesson)'
                              : `${les.durationMinutes} mins • +${les.xpReward} XP`}
                          </Text>
                        </View>
                      </View>

                      {!isLocked && (
                        <View
                          style={[
                            styles.startBadge,
                            isCompleted ? styles.startBadgeDone : styles.startBadgeStart,
                          ]}
                        >
                          <Text style={styles.startBadgeText}>{isCompleted ? 'REVIEW' : 'START'}</Text>
                        </View>
                      )}
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </GlassCard>

          {/* APPLIED LAB SANDBOX */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionCategory}>APPLIED LAB SANDBOX</Text>
            <Text style={styles.sectionTitle}>Climate Signal Sandbox</Text>
          </View>

          <GlassCard style={styles.sandboxCard}>
            <Text style={styles.sandboxDescText}>
              Simulate how atmospheric warming shifts ecosystem yields and investment asset risk indices dynamically:
            </Text>

            <View style={styles.sliderGroup}>
              <View style={styles.sliderLabelRow}>
                <Text style={styles.sliderLabel}>Savannah Temp Anomaly:</Text>
                <Text style={styles.sliderVal}>+{sandboxTemp.toFixed(1)}°C</Text>
              </View>
              <View style={styles.segmentedControlRow}>
                {[0.0, 0.5, 1.0, 1.5, 2.0, 2.5].map((val) => {
                  const isActive = sandboxTemp === val;
                  return (
                    <Pressable
                      key={val}
                      onPress={() => setSandboxTemp(val)}
                      style={[styles.segmentBtn, isActive && styles.segmentBtnActive]}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: isActive }}
                      accessibilityLabel={`Set anomaly to +${val.toFixed(1)} degrees`}
                      hitSlop={44}
                    >
                      <Text style={[styles.segmentBtnText, isActive && styles.segmentBtnTextActive]}>
                        +{val.toFixed(1)}°
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.sandboxStatsGrid}>
              <View style={styles.sandboxStatCell}>
                <Text style={styles.sandboxStatVal}>{cocoaRiskPct}%</Text>
                <Text style={styles.sandboxStatLabel}>Cocoa Crop Stress Index</Text>
              </View>
              <View style={styles.sandboxStatCell}>
                <Text style={styles.sandboxStatVal}>{solarOutputPct}%</Text>
                <Text style={styles.sandboxStatLabel}>Solar Microgrid Yield</Text>
              </View>
            </View>
          </GlassCard>

          {/* SKILL DASHBOARD METERS */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionCategory}>SKILL METERS</Text>
            <Text style={styles.sectionTitle}>Validated Competencies</Text>
          </View>

          <GlassCard style={styles.skillMeterCard}>
            <View style={styles.meterRow}>
              <View style={styles.meterInfo}>
                <Text style={styles.meterLabel}>Environmental Signal Reading</Text>
                <Text style={styles.meterValue}>{skillMeters.signalReading}/100</Text>
              </View>
              <View style={styles.meterTrack}>
                <View
                  style={[
                    styles.meterFill,
                    { width: `${skillMeters.signalReading}%`, backgroundColor: '#10B981' },
                  ]}
                />
              </View>
            </View>

            <View style={styles.meterRow}>
              <View style={styles.meterInfo}>
                <Text style={styles.meterLabel}>Thesis Craft & Risk Analysis</Text>
                <Text style={styles.meterValue}>{skillMeters.thesisCraft}/100</Text>
              </View>
              <View style={styles.meterTrack}>
                <View
                  style={[
                    styles.meterFill,
                    { width: `${skillMeters.thesisCraft}%`, backgroundColor: '#F59E0B' },
                  ]}
                />
              </View>
            </View>

            <View style={styles.meterRow}>
              <View style={styles.meterInfo}>
                <Text style={styles.meterLabel}>Portfolio Risk Awareness</Text>
                <Text style={styles.meterValue}>{skillMeters.riskAwareness}/100</Text>
              </View>
              <View style={styles.meterTrack}>
                <View
                  style={[
                    styles.meterFill,
                    { width: `${skillMeters.riskAwareness}%`, backgroundColor: '#1A73E8' },
                  ]}
                />
              </View>
            </View>
          </GlassCard>
        </View>
      </ScrollView>

      {/* LMS CERTIFICATE MODAL */}
      <Modal visible={certModalVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.certModalCard}>
            <View style={styles.certBorderDecoration}>
              <View style={styles.certInnerDecoration}>
                <Award size={48} color="#FFD700" style={{ alignSelf: 'center', marginBottom: 12 }} />

                <Text style={styles.certLmsHeader}>VERDEX LMS ACADEMY CERTIFICATE</Text>
                <Text style={styles.certMainTitle}>Verified Climate Finance Specialist</Text>

                <Text style={styles.certNameText}>Ghana Candidate Portfolio</Text>
                <Text style={styles.certBodyText}>
                  Has successfully completed the advanced curriculum modules in environmental signal reading,
                  sustainable capital allocation, and thesis validation algorithms under the GreenRes Hackathon 2026
                  guidelines.
                </Text>

                <View style={styles.certLineSeparator} />

                <View style={styles.certSignaturesRow}>
                  <View style={styles.signatureCol}>
                    <Text style={styles.sigHandwritten}>Ghana EPA</Text>
                    <Text style={styles.sigTitle}>Environment Authority</Text>
                  </View>
                  <View style={styles.signatureCol}>
                    <Text style={styles.sigHandwritten}>Mastercard Fdn</Text>
                    <Text style={styles.sigTitle}>Sponsor Representative</Text>
                  </View>
                </View>

                <Text style={styles.certHashText}>Credential ID: VRDX-LMS-7934A • Verified Ledger Account</Text>
              </View>
            </View>

            <Pressable
              onPress={() => setCertModalVisible(false)}
              style={styles.closeCertBtn}
              accessibilityRole="button"
              accessibilityLabel="Dismiss Certificate"
              hitSlop={44}
            >
              <Text style={styles.closeCertBtnText}>Dismiss Certificate</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  blobBlue: {
    width: 260,
    height: 260,
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    top: -60,
    right: -60,
  },
  blobGreen: {
    width: 220,
    height: 220,
    backgroundColor: 'rgba(16, 185, 129, 0.06)',
    top: 400,
    left: -50,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerArea: {
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 12,
  },
  screenTag: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1.5,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textBright,
    letterSpacing: -0.4,
  },
  screenDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  duoHeaderCard: {
    marginHorizontal: 16,
    padding: 18,
    gap: 14,
    marginBottom: 12,
    borderRadius: 22,
  },
  duoTopStatsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  duoStreakPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 90, 95, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 90, 95, 0.25)',
  },
  duoStreakNum: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FF5A5F',
  },
  duoStreakSub: {
    fontSize: 10,
    fontWeight: '600',
    color: '#E11D48',
  },
  duoXpPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
  },
  duoXpNum: {
    fontSize: 14,
    fontWeight: '900',
    color: '#D97706',
  },
  duoXpSub: {
    fontSize: 10,
    fontWeight: '600',
    color: '#B45309',
  },
  duoGoalBox: {
    gap: 6,
  },
  duoGoalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  duoGoalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  duoGoalTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 1,
  },
  duoGoalVal: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1A2E26',
  },
  duoTrack: {
    height: 10,
    backgroundColor: '#F1F5F0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  duoFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 6,
  },
  duoCalendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#E4EAE2',
    paddingTop: 12,
    marginTop: 2,
  },
  duoCalCol: {
    alignItems: 'center',
    gap: 4,
  },
  duoCalDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  duoCalDotActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  duoCalDotInactive: {
    backgroundColor: '#F1F5F0',
    borderColor: '#E4EAE2',
  },
  duoCalText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#7C8E84',
  },
  duoCalLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#8BA196',
  },
  questsContainer: {
    marginHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  questCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E4EAE2',
    shadowColor: '#102A1F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  questIconCircle: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
  },
  questTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1A2E26',
  },
  questSub: {
    fontSize: 10,
    color: '#7C8E84',
  },
  questRewardBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  questRewardText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2563EB',
  },
  accraSignalCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E4EAE2',
    marginHorizontal: 16,
    marginBottom: 8,
    gap: 4,
    shadowColor: '#102A1F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  accraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  accraTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0D5C46',
    letterSpacing: 0.5,
  },
  accraBody: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 15,
  },
  sectionHeaderRow: {
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  sectionCategory: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textBright,
  },
  certCard: {
    marginHorizontal: 16,
    padding: 12,
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  certMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  certTitleText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A2E26',
  },
  certCriteria: {
    fontSize: 10,
    color: '#7C8E84',
  },
  certClaimBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  certClaimBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  carouselContainer: {
    paddingLeft: 16,
    marginBottom: 8,
  },
  carouselContent: {
    paddingRight: 32,
    gap: 12,
  },
  courseCard: {
    width: 230,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E4EAE2',
    padding: 16,
    gap: 8,
    shadowColor: '#102A1F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  courseCardActive: {
    borderColor: '#10B981',
    shadowColor: '#10B981',
    shadowOpacity: 0.06,
  },
  courseIconWrapper: {
    padding: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ringWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringPercentText: {
    position: 'absolute',
    fontSize: 9,
    fontWeight: '800',
    color: '#1A2E26',
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A2E26',
    marginTop: 4,
  },
  courseDesc: {
    fontSize: 11,
    color: '#7C8E84',
    lineHeight: 15,
    minHeight: 30,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F0',
    paddingTop: 8,
    marginTop: 4,
  },
  courseLessonsCount: {
    fontSize: 10,
    fontWeight: '600',
    color: '#059669',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  roadmapCard: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 20,
  },
  lessonsContainer: {
    position: 'relative',
  },
  lessonTimelineWrapper: {
    position: 'relative',
    paddingBottom: 12,
  },
  timelineConnector: {
    position: 'absolute',
    left: 21,
    top: 36,
    bottom: -12,
    width: 3,
    zIndex: 1,
  },
  connectorCompleted: {
    backgroundColor: '#10B981',
  },
  connectorLocked: {
    backgroundColor: '#E4EAE2',
  },
  duoLessonButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#E4EAE2',
    borderBottomWidth: 4,
    borderBottomColor: '#D8E2D5',
    zIndex: 2,
    shadowColor: '#102A1F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  duoLessonButtonCompleted: {
    borderColor: '#10B981',
    borderBottomColor: '#059669',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  duoLessonButtonActive: {
    borderColor: '#10B981',
    borderBottomColor: '#059669',
  },
  duoLessonButtonLocked: {
    opacity: 0.65,
    backgroundColor: '#F7F9F6',
  },
  duoLessonNodeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  duoNodeCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  duoNodeCompleted: {
    backgroundColor: '#10B981',
  },
  duoNodeActive: {
    backgroundColor: '#10B981',
  },
  duoNodeLocked: {
    backgroundColor: '#F1F5F0',
    borderWidth: 1,
    borderColor: '#E4EAE2',
  },
  duoLessonTextGroup: {
    flex: 1,
  },
  duoLessonTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1A2E26',
  },
  duoLessonTitleCompleted: {
    color: '#059669',
  },
  duoLessonTitleLocked: {
    color: COLORS.textMuted,
  },
  duoLessonMeta: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginTop: 2,
  },
  startBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  startBadgeStart: {
    backgroundColor: '#10B981',
  },
  startBadgeDone: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  startBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  sandboxCard: {
    marginHorizontal: 16,
    padding: 16,
    gap: 10,
  },
  sandboxDescText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  sliderGroup: {
    marginVertical: 4,
  },
  sliderLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sliderLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A2E26',
  },
  sliderVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#10B981',
  },
  sandboxStatsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  sandboxStatCell: {
    flex: 1,
    backgroundColor: '#F1F5F0',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D8E2D5',
  },
  sandboxStatVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1A2E26',
  },
  sandboxStatLabel: {
    fontSize: 9,
    color: '#7C8E84',
    marginTop: 2,
    textAlign: 'center',
  },
  skillMeterCard: {
    marginHorizontal: 16,
    padding: 16,
    gap: 12,
    marginBottom: 12,
  },
  meterRow: {
    gap: 4,
  },
  meterInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  meterLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  meterValue: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textBright,
  },
  meterTrack: {
    height: 6,
    backgroundColor: COLORS.inputBg,
    borderRadius: 3,
    overflow: 'hidden',
  },
  meterFill: {
    height: '100%',
    borderRadius: 3,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 22, 17, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  certModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#10B981',
    padding: 20,
    width: '100%',
    maxWidth: 360,
    gap: 14,
  },
  certBorderDecoration: {
    borderWidth: 1,
    borderColor: '#E4EAE2',
    padding: 14,
    borderRadius: 12,
  },
  certInnerDecoration: {
    borderWidth: 2,
    borderColor: '#10B981',
    borderStyle: 'dashed',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  certLmsHeader: {
    fontSize: 9,
    fontWeight: '900',
    color: '#10B981',
    letterSpacing: 1.5,
  },
  certMainTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1A2E26',
    textAlign: 'center',
    marginVertical: 6,
  },
  certNameText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0D5C46',
    marginVertical: 4,
    textDecorationLine: 'underline',
  },
  certBodyText: {
    fontSize: 10,
    color: '#7C8E84',
    textAlign: 'center',
    lineHeight: 14,
    marginVertical: 8,
  },
  certLineSeparator: {
    width: '80%',
    height: 1,
    backgroundColor: '#E4EAE2',
    marginVertical: 8,
  },
  certSignaturesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 6,
  },
  signatureCol: {
    alignItems: 'center',
    width: '45%',
  },
  sigHandwritten: {
    fontFamily: 'monospace',
    fontStyle: 'italic',
    fontSize: 12,
    fontWeight: '800',
    color: '#1A2E26',
  },
  sigTitle: {
    fontSize: 8,
    color: '#8BA196',
    marginTop: 2,
  },
  certHashText: {
    fontSize: 8,
    color: '#8BA196',
    marginTop: 12,
  },
  closeCertBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeCertBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  segmentedControlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F1F5F0',
    borderRadius: 10,
    padding: 4,
    marginTop: 6,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBtnActive: {
    backgroundColor: '#10B981',
  },
  segmentBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#7C8E84',
  },
  segmentBtnTextActive: {
    color: '#FFFFFF',
  },
});
