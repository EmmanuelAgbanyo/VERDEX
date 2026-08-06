import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Svg, { Path, Rect, Line, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useApp } from '@/context/AppContext';
import { DiagnosticPanel } from '@/components/DiagnosticPanel';
import { TradeTicketModal } from '@/components/TradeTicketModal';
import { GlassCard } from '@/components/GlassCard';
import { COLORS, LAYOUT } from '@/constants/theme';
import {
  ArrowLeft,
  Star,
  MapPin,
  TrendingUp,
  TrendingDown,
  Lock,
  Unlock,
  Heart,
  Radio,
  Activity,
  Cpu,
  Compass,
  Zap,
  Users,
  TreePine,
  Briefcase,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import { InvestmentThesis } from '@/types';

export default function AssetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const {
    assets,
    cash,
    watchlist,
    toggleWatchlist,
    submitThesis,
    executeTrade,
    getThesisForAsset,
    hasUnlockedThesis,
  } = useApp();

  const asset = assets.find((a) => a.id === id) || assets[0];
  const isStarred = watchlist.includes(asset.id);
  const existingThesis = getThesisForAsset(asset.id);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(hasUnlockedThesis(asset.id));
  const [tradeModalVisible, setTradeModalVisible] = useState<boolean>(false);
  const [showStory, setShowStory] = useState<boolean>(true);
  const [chartType, setChartType] = useState<'area' | 'candles'>('area');
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y' | 'ALL'>('1D');
  const [selectedPointIndex, setSelectedPointIndex] = useState<number>(asset.historicalPrices.length - 1);

  const isPositive = asset.change24h >= 0;

  const handleUnlockSuccess = (thesis: InvestmentThesis) => {
    setIsUnlocked(true);
  };

  // Generate simulated candlestick and volume data based on price history
  const chartData = asset.historicalPrices.map((hp, idx) => {
    const seed = asset.price + idx * 8.5;
    const rand = (val: number) => Math.abs(Math.sin(val));

    const close = hp.price;
    const open = idx === 0 ? close - 1.2 : asset.historicalPrices[idx - 1].price;
    const spread = Math.abs(close - open);
    const high = Math.max(open, close) + rand(seed) * (spread + 1);
    const low = Math.min(open, close) - rand(seed + 1.2) * (spread + 1);
    const volume = Math.floor(rand(seed + 3.1) * 3200) + 1200;

    return {
      time: hp.time,
      open,
      close,
      high,
      low,
      volume,
    };
  });

  // SVG dimensions
  const { width } = useWindowDimensions();
  const chartWidth = Math.min(width - 48, 760);
  const chartHeight = 135;

  // Calculate price boundaries for plotting
  const candleHighs = chartData.map((d) => d.high);
  const candleLows = chartData.map((d) => d.low);
  const minVal = Math.min(...candleLows) * 0.99;
  const maxVal = Math.max(...candleHighs) * 1.01;
  const valRange = maxVal - minVal;

  const points = asset.historicalPrices.map((hp, idx) => {
    const x = (idx / (asset.historicalPrices.length - 1)) * chartWidth;
    const y = chartHeight - ((hp.price - minVal) / valRange) * chartHeight;
    return { x, y };
  });

  // Calculate SVGs paths
  const linePath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;

  // Selected point details
  const activeDataPoint = chartData[selectedPointIndex] || chartData[chartData.length - 1];

  // Telemetry details based on ecological asset category
  const getTelemetryData = () => {
    switch (asset.category) {
      case 'cocoa':
        return {
          stationId: 'SUHUM-COCOA-MET-12',
          coords: '6.0354° N, 0.4522° W',
          ping: '12ms',
          uptime: '99.85%',
          correlations: [
            { label: 'Rainfall Saturation Index', score: '+78%', color: '#10B981' },
            { label: 'Harmattan Canopy Heat Stress', score: '-58%', color: '#FF5A5F' },
          ],
        };
      case 'solar':
        return {
          stationId: 'TAMALE-SOLAR-PV-08',
          coords: '9.4008° N, 0.8393° W',
          ping: '18ms',
          uptime: '99.92%',
          correlations: [
            { label: 'Atmospheric Aerosol Clarity', score: '+92%', color: '#10B981' },
            { label: 'Daily Solar Irradiance Yield', score: '+86%', color: '#10B981' },
          ],
        };
      case 'mangrove':
        return {
          stationId: 'VOLTA-DELTA-WET-04',
          coords: '5.7831° N, 0.7303° E',
          ping: '15ms',
          uptime: '99.78%',
          correlations: [
            { label: 'Soil Organic Salinity Balance', score: '+82%', color: '#10B981' },
            { label: 'Carbon Abatement Credit Margin', score: '+74%', color: '#10B981' },
          ],
        };
      default:
        return {
          stationId: 'MOLE-SAVANNAH-S-01',
          coords: '9.3175° N, 1.8492° W',
          ping: '22ms',
          uptime: '99.64%',
          correlations: [
            { label: 'Grassland Humus Moisture', score: '+85%', color: '#10B981' },
            { label: 'Diurnal Temp Volatility Risk', score: '-68%', color: '#FF5A5F' },
          ],
        };
    }
  };

  const telemetry = getTelemetryData();
  const timeframes: ('1D' | '1W' | '1M' | '1Y' | 'ALL')[] = ['1D', '1W', '1M', '1Y', 'ALL'];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Header Bar */}
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            style={styles.iconBtn}
            accessibilityLabel="Go back to markets list"
            accessibilityRole="button"
          >
            <ArrowLeft size={20} color={COLORS.textBright} />
          </Pressable>

          <View style={styles.headerTitleGroup}>
            <Text style={styles.symbolText}>{asset.symbol}</Text>
            <Text style={styles.nameSub}>{asset.name}</Text>
          </View>

          <Pressable
            onPress={() => toggleWatchlist(asset.id)}
            style={styles.iconBtn}
            accessibilityLabel="Toggle asset watchlist star status"
            accessibilityRole="button"
          >
            <Star
              size={20}
              color={isStarred ? COLORS.amberData : COLORS.textMuted}
              fill={isStarred ? COLORS.amberData : 'transparent'}
            />
          </Pressable>
        </View>

        {/* Dynamic Pricing and Live Valuation Title */}
        <View style={styles.titleInfoBlock}>
          <View style={styles.titleLeft}>
            <Text style={styles.screenTag}>{asset.regionLabel}</Text>
            <Text style={styles.priceHeading}>GH₵{asset.price.toFixed(2)}</Text>
          </View>
          <View
            style={[
              styles.changeBadge,
              { backgroundColor: isPositive ? 'rgba(52, 211, 153, 0.15)' : 'rgba(239, 68, 68, 0.15)' },
            ]}
          >
            {isPositive ? (
              <TrendingUp size={14} color="#10B981" />
            ) : (
              <TrendingDown size={14} color="#FF5A5F" />
            )}
            <Text style={[styles.changeText, { color: isPositive ? '#059669' : '#FF5A5F' }]}>
              {isPositive ? '+' : ''}{asset.change24h.toFixed(2)}%
            </Text>
          </View>
        </View>

        {/* SESSION METRICS BAR */}
        <View style={styles.sessionStatsBar}>
          <View style={styles.sessionStatItem}>
            <Text style={styles.sessionStatLabel}>SESSION HIGH</Text>
            <Text style={styles.sessionStatVal}>GH₵{(maxVal * 0.995).toFixed(2)}</Text>
          </View>
          <View style={styles.sessionStatDivider} />
          <View style={styles.sessionStatItem}>
            <Text style={styles.sessionStatLabel}>SESSION LOW</Text>
            <Text style={styles.sessionStatVal}>GH₵{(minVal * 1.005).toFixed(2)}</Text>
          </View>
          <View style={styles.sessionStatDivider} />
          <View style={styles.sessionStatItem}>
            <Text style={styles.sessionStatLabel}>SIGNAL SCORE</Text>
            <Text style={[styles.sessionStatVal, { color: COLORS.amberDataBright }]}>
              {asset.signalScore}/100
            </Text>
          </View>
        </View>

        {/* HIGH-FIDELITY INTERACTIVE CHART PANEL */}
        <GlassCard variant="dark" showGrid style={styles.chartPanel}>
          {/* Chart Header Controls */}
          <View style={styles.chartHeaderOptions}>
            <View style={styles.timeframePillsRow}>
              {timeframes.map((tf) => (
                <Pressable
                  key={tf}
                  onPress={() => setTimeframe(tf)}
                  style={[styles.timeframePill, timeframe === tf && styles.timeframePillActive]}
                  accessibilityRole="button"
                  accessibilityLabel={`Select timeframe ${tf}`}
                >
                  <Text style={[styles.timeframeText, timeframe === tf && styles.timeframeTextActive]}>
                    {tf}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.chartToggleBtnRow}>
              <Pressable
                onPress={() => setChartType('area')}
                style={[styles.chartToggleBtn, chartType === 'area' && styles.chartToggleBtnActive]}
                accessibilityRole="button"
                accessibilityLabel="Area Chart"
              >
                <Text style={[styles.chartToggleText, chartType === 'area' && styles.chartToggleTextActive]}>
                  Area
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setChartType('candles')}
                style={[styles.chartToggleBtn, chartType === 'candles' && styles.chartToggleBtnActive]}
                accessibilityRole="button"
                accessibilityLabel="Candlestick Chart"
              >
                <Text style={[styles.chartToggleText, chartType === 'candles' && styles.chartToggleTextActive]}>
                  Candles
                </Text>
              </Pressable>
            </View>
          </View>

          {/* SVG Vector Chart Drawing Canvas */}
          <View style={styles.svgContainer}>
            <Svg width="100%" height={chartHeight}>
              <Defs>
                <LinearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#10B981" stopOpacity={0.45} />
                  <Stop offset="100%" stopColor="#10B981" stopOpacity={0.0} />
                </LinearGradient>
              </Defs>

              <Line x1="0" y1={chartHeight * 0.25} x2={chartWidth} y2={chartHeight * 0.25} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <Line x1="0" y1={chartHeight * 0.5} x2={chartWidth} y2={chartHeight * 0.5} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <Line x1="0" y1={chartHeight * 0.75} x2={chartWidth} y2={chartHeight * 0.75} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

              {chartType === 'area' ? (
                <>
                  <Path d={areaPath} fill="url(#chartGradient)" />
                  <Path d={linePath} fill="none" stroke="#10B981" strokeWidth="2.5" />
                </>
              ) : (
                chartData.map((d, idx) => {
                  const x = (idx / (chartData.length - 1)) * chartWidth;
                  const candleWidth = 10;

                  const yOpen = chartHeight - ((d.open - minVal) / valRange) * chartHeight;
                  const yClose = chartHeight - ((d.close - minVal) / valRange) * chartHeight;
                  const yHigh = chartHeight - ((d.high - minVal) / valRange) * chartHeight;
                  const yLow = chartHeight - ((d.low - minVal) / valRange) * chartHeight;

                  const isCandleGreen = d.close >= d.open;
                  const candleColor = isCandleGreen ? '#10B981' : '#FF5A5F';

                  return (
                    <React.Fragment key={idx}>
                      <Line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={candleColor} strokeWidth="1.5" />
                      <Rect
                        x={x - candleWidth / 2}
                        y={Math.min(yOpen, yClose)}
                        width={candleWidth}
                        height={Math.max(3, Math.abs(yOpen - yClose))}
                        fill={candleColor}
                        rx={1}
                      />
                    </React.Fragment>
                  );
                })
              )}

              {selectedPointIndex !== null && points[selectedPointIndex] && (
                <Line
                  x1={points[selectedPointIndex].x}
                  y1={0}
                  x2={points[selectedPointIndex].x}
                  y2={chartHeight}
                  stroke="rgba(255,255,255,0.25)"
                  strokeDasharray="4,4"
                  strokeWidth="1.2"
                />
              )}
            </Svg>
          </View>

          {/* Interactive touch selector ticks */}
          <View style={styles.chartTimeTicksRow}>
            {asset.historicalPrices.map((hp, idx) => (
              <Pressable
                key={idx}
                onPress={() => setSelectedPointIndex(idx)}
                style={[
                  styles.timeTickBtn,
                  selectedPointIndex === idx && styles.timeTickBtnActive,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Select time ${hp.time}`}
              >
                <Text
                  style={[
                    styles.timeTickText,
                    selectedPointIndex === idx && styles.timeTickTextActive,
                  ]}
                >
                  {hp.time}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Point Inspector details HUD */}
          <View style={styles.chartInspectorHud}>
            <View style={styles.hudMetaBox}>
              <Text style={styles.hudMetaLabel}>SELECTED PRICE</Text>
              <Text style={styles.hudMetaValue}>GH₵{activeDataPoint.close.toFixed(2)}</Text>
            </View>

            <View style={styles.hudMetaBox}>
              <Text style={styles.hudMetaLabel}>VOLUME</Text>
              <Text style={styles.hudMetaValue}>{activeDataPoint.volume.toLocaleString()} units</Text>
            </View>

            <View style={styles.hudMetaBox}>
              <Text style={styles.hudMetaLabel}>VOLATILITY</Text>
              <Text style={styles.hudMetaValue}>
                {(
                  (Math.abs(activeDataPoint.close - activeDataPoint.open) / activeDataPoint.open) *
                  100
                ).toFixed(2)}
                %
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* POINT 2: IMPACT BREAKDOWN CARD WITH 3 KEY METRICS */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Community Impact Breakdown</Text>
        </View>

        <GlassCard style={styles.impactBreakdownCard}>
          <Text style={styles.impactIntroText}>
            Every credit allocated directly builds tangible climate resilience in Ghanaian partner communities:
          </Text>

          <View style={styles.impactMetrics3Grid}>
            <View style={styles.impactMetricCell}>
              <Users size={18} color="#3B82F6" />
              <Text style={styles.impactMetricVal}>
                {asset.impactBreakdown?.peopleReached || '2,400 farmers'}
              </Text>
              <Text style={styles.impactMetricLabel}>People Reached</Text>
            </View>

            <View style={styles.impactMetricCell}>
              <TreePine size={18} color="#10B981" />
              <Text style={styles.impactMetricVal}>
                {asset.impactBreakdown?.environmentalBenefit || '1,200 ha smart farming'}
              </Text>
              <Text style={styles.impactMetricLabel}>Environmental Benefit</Text>
            </View>

            <View style={styles.impactMetricCell}>
              <Briefcase size={18} color="#F59E0B" />
              <Text style={styles.impactMetricVal}>
                {asset.impactBreakdown?.jobsSupported || '180 local jobs'}
              </Text>
              <Text style={styles.impactMetricLabel}>Local Jobs Supported</Text>
            </View>
          </View>

          {/* READ THE COMMUNITY STORY TOGGLE */}
          {asset.communityStory && (
            <View style={styles.storyContainer}>
              <Pressable
                onPress={() => setShowStory(!showStory)}
                style={styles.storyToggleHeader}
              >
                <View style={styles.storyTitleRow}>
                  <BookOpen size={14} color="#0D5C46" />
                  <Text style={styles.storyTitleText}>Read the Community Story</Text>
                </View>
                {showStory ? <ChevronUp size={16} color="#0D5C46" /> : <ChevronDown size={16} color="#0D5C46" />}
              </Pressable>

              {showStory && (
                <View style={styles.storyCardBody}>
                  <View style={styles.storyPersonHeader}>
                    <Text style={styles.storyPersonName}>{asset.communityStory.personName}</Text>
                    <Text style={styles.storyPersonRole}>
                      {asset.communityStory.role} • {asset.communityStory.location}
                    </Text>
                  </View>
                  <Text style={styles.storyNarrativeText}>"{asset.communityStory.storyText}"</Text>
                </View>
              )}
            </View>
          )}
        </GlassCard>

        {/* TELEMETRY & LIVE SENSOR STATUS */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Ecosystem Telemetry Feed</Text>
        </View>

        <View style={styles.telemetryGrid}>
          {/* Station Coordinates */}
          <GlassCard style={styles.telemetryMiniCard}>
            <View style={styles.telemetryCardTitleRow}>
              <Compass size={14} color="#10B981" />
              <Text style={styles.telemetryCardTitle}>Sensor Coordinates</Text>
            </View>
            <Text style={styles.telemetryValueText}>{telemetry.coords}</Text>
            <Text style={styles.telemetrySubText}>Accra MET Server Sync</Text>
          </GlassCard>

          {/* Device Telemetry status */}
          <GlassCard style={styles.telemetryMiniCard}>
            <View style={styles.telemetryCardTitleRow}>
              <Cpu size={14} color="#F59E0B" />
              <Text style={styles.telemetryCardTitle}>Station Core ID</Text>
            </View>
            <Text style={styles.telemetryValueText}>{telemetry.stationId}</Text>
            <Text style={styles.telemetrySubText}>Latency: {telemetry.ping} • Active 🟢</Text>
          </GlassCard>
        </View>

        {/* DIAGNOSTIC PANEL & RESEARCH LOCK */}
        <DiagnosticPanel
          asset={asset}
          onUnlockSuccess={handleUnlockSuccess}
          existingThesis={existingThesis}
          onSubmitThesis={(text) => submitThesis(asset.id, text)}
        />

        {/* EXECUTE TRADE BUTTON */}
        <View style={styles.tradeActionContainer}>
          <Pressable
            onPress={() => setTradeModalVisible(true)}
            style={({ pressed }) => [
              styles.tradeBtn,
              !isUnlocked && styles.tradeBtnDisabled,
              pressed && isUnlocked && { opacity: 0.85 },
            ]}
            disabled={!isUnlocked}
            accessibilityLabel="Open trade execution ticket"
            accessibilityRole="button"
            accessibilityHint="Opens a modal to buy or sell this asset"
          >
            {isUnlocked ? (
              <Unlock size={18} color="#FFFFFF" />
            ) : (
              <Lock size={18} color={COLORS.textMuted} />
            )}
            <Text style={[styles.tradeBtnText, !isUnlocked && styles.tradeBtnTextDisabled]}>
              {isUnlocked ? 'OPEN TRADE TICKET' : 'LOCKED — SUBMIT THESIS FIRST'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Trade Ticket Modal */}
      <TradeTicketModal
        visible={tradeModalVisible}
        asset={asset}
        cash={cash}
        onClose={() => setTradeModalVisible(false)}
        onConfirmTrade={(side, type, qty, limit) => executeTrade(asset.id, side, type, qty, limit)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 14,
    maxWidth: 840,
    width: '100%',
    alignSelf: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  headerTitleGroup: {
    alignItems: 'center',
  },
  symbolText: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textBright,
  },
  nameSub: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  titleInfoBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  titleLeft: {
    gap: 2,
  },
  screenTag: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  priceHeading: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.textDark,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  changeText: {
    fontSize: 13,
    fontWeight: '800',
  },
  sessionStatsBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E4EAE2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#102A1F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  sessionStatItem: {
    alignItems: 'center',
  },
  sessionStatLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  sessionStatVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1A2E26',
    marginTop: 1,
  },
  sessionStatDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E4EAE2',
  },
  chartPanel: {
    padding: 16,
    gap: 12,
    borderRadius: 20,
  },
  chartHeaderOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeframePillsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  timeframePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  timeframePillActive: {
    backgroundColor: '#10B981',
  },
  timeframeText: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
  },
  timeframeTextActive: {
    color: '#FFFFFF',
  },
  chartToggleBtnRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 8,
    padding: 2,
  },
  chartToggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  chartToggleBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  chartToggleText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
  },
  chartToggleTextActive: {
    color: '#FFFFFF',
  },
  svgContainer: {
    alignItems: 'center',
    marginVertical: 4,
  },
  chartTimeTicksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: 8,
  },
  timeTickBtn: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  timeTickBtnActive: {
    backgroundColor: '#10B981',
  },
  timeTickText: {
    fontSize: 8,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
  },
  timeTickTextActive: {
    color: '#FFFFFF',
  },
  chartInspectorHud: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 10,
    gap: 8,
    marginTop: 4,
  },
  hudMetaBox: {
    flex: 1,
  },
  hudMetaLabel: {
    fontSize: 8,
    color: '#A7F3D0',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  hudMetaValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  sectionHeaderRow: {
    marginTop: 12,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textBright,
  },
  impactBreakdownCard: {
    padding: 16,
    gap: 12,
    borderRadius: 18,
  },
  impactIntroText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },
  impactMetrics3Grid: {
    flexDirection: 'row',
    gap: 8,
  },
  impactMetricCell: {
    flex: 1,
    backgroundColor: '#F1F5F0',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D8E2D5',
    alignItems: 'center',
    gap: 4,
  },
  impactMetricVal: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.textBright,
    textAlign: 'center',
  },
  impactMetricLabel: {
    fontSize: 9,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  storyContainer: {
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#E4EAE2',
    paddingTop: 10,
  },
  storyToggleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  storyTitleText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0D5C46',
  },
  storyCardBody: {
    backgroundColor: 'rgba(230, 244, 234, 0.6)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(13, 92, 70, 0.12)',
    marginTop: 8,
    gap: 4,
  },
  storyPersonHeader: {
    marginBottom: 2,
  },
  storyPersonName: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0D5C46',
  },
  storyPersonRole: {
    fontSize: 10,
    color: '#7C8E84',
  },
  storyNarrativeText: {
    fontSize: 11,
    color: '#1A2E26',
    lineHeight: 16,
    fontStyle: 'italic',
  },
  telemetryGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  telemetryMiniCard: {
    flex: 1,
    padding: 14,
    gap: 4,
    borderRadius: 16,
  },
  telemetryCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  telemetryCardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textBright,
  },
  telemetryValueText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textBright,
    marginTop: 2,
  },
  telemetrySubText: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  tradeActionContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  tradeBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#0D5C46',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#0D5C46',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 4,
  },
  tradeBtnDisabled: {
    backgroundColor: '#F1F5F0',
    borderWidth: 1,
    borderColor: '#D8E2D5',
    shadowOpacity: 0,
    elevation: 0,
  },
  tradeBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  tradeBtnTextDisabled: {
    color: COLORS.textMuted,
  },
});
