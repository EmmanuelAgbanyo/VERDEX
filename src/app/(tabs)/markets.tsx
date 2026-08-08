import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { AssetCard } from '@/components/AssetCard';
import { COLORS } from '@/constants/theme';
import {
  Search,
  Star,
  Zap,
  TrendingUp,
  TrendingDown,
  SlidersHorizontal,
  SearchX,
  Radio,
  ArrowRight,
  Sparkles,
} from 'lucide-react-native';
import { AssetCategory, GreenAsset } from '@/types';

export default function MarketsScreen() {
  const {
    assets,
    watchlist,
    toggleWatchlist,
    hasUnlockedThesis,
    isRefreshing,
    refreshData,
  } = useApp();

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'all' | 'watchlist'>('all');
  const [sortBy, setSortBy] = useState<'signal' | 'movement' | 'price' | 'alphabetical'>('signal');

  // Filter assets
  let filteredAssets = assets.filter((asset) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === '' ||
      asset.name.toLowerCase().includes(q) ||
      asset.symbol.toLowerCase().includes(q) ||
      asset.regionLabel.toLowerCase().includes(q) ||
      asset.category.toLowerCase().includes(q) ||
      asset.signalType.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (selectedCategory === 'watchlist') {
      return watchlist.includes(asset.id);
    }
    if (selectedCategory !== 'all') {
      return asset.category === selectedCategory;
    }
    return true;
  });

  // Sort assets
  filteredAssets = [...filteredAssets].sort((a, b) => {
    if (sortBy === 'signal') {
      return b.signalScore - a.signalScore;
    }
    if (sortBy === 'movement') {
      return Math.abs(b.change24h) - Math.abs(a.change24h);
    }
    if (sortBy === 'price') {
      return b.price - a.price;
    }
    if (sortBy === 'alphabetical') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  // Market Distribution Metrics for Market Pulse Hero Card
  const risingCount = assets.filter((a) => a.change24h > 0).length;
  const fallingCount = assets.filter((a) => a.change24h < 0).length;
  const strongSignalCount = assets.filter((a) => a.signalScore >= 85).length;

  // Spotlight asset for Market Pulse Hero
  const spotlightAsset = [...assets].sort((a, b) => b.signalScore - a.signalScore)[0] || assets[0];
  const isSpotlightPositive = spotlightAsset ? spotlightAsset.change24h >= 0 : true;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshData}
            tintColor={COLORS.emeraldPrimary}
            colors={[COLORS.emeraldPrimary]}
          />
        }
      >
        {/* SCREEN HEADER */}
        <View style={styles.headerArea}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.screenTitle}>MARKETS</Text>
            <View style={styles.livePulseBadge}>
              <Radio size={11} color="#34D399" />
              <Text style={styles.livePulseText}>LIVE</Text>
            </View>
          </View>
          <Text style={styles.screenDesc}>
            Explore Ghana's green economy through live climate signals.
          </Text>
        </View>

        {/* 03 — HERO EXPERIENCE: MARKET PULSE CARD */}
        <View style={styles.pulseCard}>
          <View style={styles.pulseHeader}>
            <View style={styles.pulseTitleGroup}>
              <Zap size={16} color="#F59E0B" />
              <Text style={styles.pulseTitle}>MARKET PULSE</Text>
            </View>
            <Text style={styles.pulseTimer}>Updated 12 sec ago</Text>
          </View>

          {/* Distribution Stats Bar */}
          <View style={styles.statsRow}>
            <View style={styles.statPill}>
              <TrendingUp size={12} color="#34D399" />
              <Text style={styles.statPillText}>{risingCount} Rising</Text>
            </View>

            <View style={styles.statPill}>
              <TrendingDown size={12} color="#FCA5A5" />
              <Text style={styles.statPillText}>{fallingCount} Falling</Text>
            </View>

            <View style={styles.statPill}>
              <Sparkles size={12} color="#F59E0B" />
              <Text style={styles.statPillText}>{strongSignalCount} Strong Signals</Text>
            </View>

            <View style={styles.statPill}>
              <Star size={12} color="#F59E0B" />
              <Text style={styles.statPillText}>{watchlist.length} Saved</Text>
            </View>
          </View>

          {/* Featured Spotlight Asset Box inside Hero */}
          {spotlightAsset && (
            <View style={styles.spotlightBox}>
              <View style={styles.spotlightHeader}>
                <View>
                  <Text style={styles.spotlightSymbol}>{spotlightAsset.symbol}</Text>
                  <Text style={styles.spotlightName}>{spotlightAsset.name}</Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.spotlightPrice}>GH₵{spotlightAsset.price.toFixed(2)}</Text>
                  <Text style={[styles.spotlightChange, { color: isSpotlightPositive ? '#34D399' : '#FCA5A5' }]}>
                    {isSpotlightPositive ? '+' : ''}{spotlightAsset.change24h.toFixed(2)}% ↑
                  </Text>
                </View>
              </View>

              <View style={styles.spotlightSignalRow}>
                <Text style={styles.spotlightScoreText}>
                  ENVIRONMENTAL SIGNAL: <Text style={{ color: '#34D399', fontWeight: '900' }}>● {spotlightAsset.signalScore} / 100 STRONG</Text>
                </Text>

                <View style={styles.driverTagsGroup}>
                  <Text style={styles.driverTag}>🌿 Restoration ↑</Text>
                  <Text style={styles.driverTag}>🌊 Coastal resilience ↑</Text>
                </View>
              </View>

              <Pressable
                onPress={() => router.push(`/asset/${spotlightAsset.id}` as any)}
                style={({ pressed }) => [styles.pulseCta, pressed && styles.pressedState]}
                accessibilityRole="button"
                accessibilityLabel={`View signal for ${spotlightAsset.name}`}
              >
                <Text style={styles.pulseCtaText}>VIEW SIGNAL</Text>
                <ArrowRight size={14} color="#FFFFFF" />
              </Pressable>
            </View>
          )}
        </View>

        {/* 06 — INTELLIGENT SEARCH BAR */}
        <View style={styles.searchContainer}>
          <Search size={18} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search assets, symbols, regions (e.g. Suhum)..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityRole="search"
            accessibilityLabel="Search green assets"
          />
          {searchQuery !== '' && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
              <Text style={styles.clearSearchText}>Clear</Text>
            </Pressable>
          )}
        </View>

        {/* 07 — CATEGORY NAVIGATION CHIPS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <Pressable
            onPress={() => setSelectedCategory('all')}
            style={[styles.filterChip, selectedCategory === 'all' && styles.filterChipActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: selectedCategory === 'all' }}
            accessibilityLabel="Filter all assets"
          >
            <Text style={[styles.filterChipText, selectedCategory === 'all' && styles.filterChipTextActive]}>
              All ({assets.length})
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setSelectedCategory('watchlist')}
            style={[styles.filterChip, selectedCategory === 'watchlist' && styles.filterChipActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: selectedCategory === 'watchlist' }}
            accessibilityLabel="Filter watchlist"
          >
            <Star size={13} color={selectedCategory === 'watchlist' ? '#FFFFFF' : '#D97706'} fill={selectedCategory === 'watchlist' ? '#FFFFFF' : 'transparent'} />
            <Text style={[styles.filterChipText, selectedCategory === 'watchlist' && styles.filterChipTextActive]}>
              Watchlist ({watchlist.length})
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setSelectedCategory('cocoa')}
            style={[styles.filterChip, selectedCategory === 'cocoa' && styles.filterChipActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: selectedCategory === 'cocoa' }}
            accessibilityLabel="Filter Cocoa"
          >
            <Text style={[styles.filterChipText, selectedCategory === 'cocoa' && styles.filterChipTextActive]}>
              Cocoa
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setSelectedCategory('solar')}
            style={[styles.filterChip, selectedCategory === 'solar' && styles.filterChipActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: selectedCategory === 'solar' }}
            accessibilityLabel="Filter Solar"
          >
            <Text style={[styles.filterChipText, selectedCategory === 'solar' && styles.filterChipTextActive]}>
              Solar
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setSelectedCategory('mangrove')}
            style={[styles.filterChip, selectedCategory === 'mangrove' && styles.filterChipActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: selectedCategory === 'mangrove' }}
            accessibilityLabel="Filter Carbon"
          >
            <Text style={[styles.filterChipText, selectedCategory === 'mangrove' && styles.filterChipTextActive]}>
              Carbon
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setSelectedCategory('savannah')}
            style={[styles.filterChip, selectedCategory === 'savannah' && styles.filterChipActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: selectedCategory === 'savannah' }}
            accessibilityLabel="Filter Reforestation"
          >
            <Text style={[styles.filterChipText, selectedCategory === 'savannah' && styles.filterChipTextActive]}>
              Reforestation
            </Text>
          </Pressable>
        </ScrollView>

        {/* 18 — SMART SORTING CONTROL BAR */}
        <View style={styles.sortRow}>
          <Text style={styles.resultsCount}>{filteredAssets.length} Markets</Text>

          <View style={styles.sortPillsGroup}>
            <SlidersHorizontal size={13} color="#0D5C46" />
            <Pressable
              onPress={() => setSortBy('signal')}
              style={[styles.sortPill, sortBy === 'signal' && styles.sortPillActive]}
            >
              <Text style={[styles.sortPillText, sortBy === 'signal' && styles.sortPillTextActive]}>
                Signal {sortBy === 'signal' ? '↓' : ''}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setSortBy('movement')}
              style={[styles.sortPill, sortBy === 'movement' && styles.sortPillActive]}
            >
              <Text style={[styles.sortPillText, sortBy === 'movement' && styles.sortPillTextActive]}>
                Gainers
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setSortBy('price')}
              style={[styles.sortPill, sortBy === 'price' && styles.sortPillActive]}
            >
              <Text style={[styles.sortPillText, sortBy === 'price' && styles.sortPillTextActive]}>
                Price
              </Text>
            </Pressable>
          </View>
        </View>

        {/* 17 — PREMIUM EMPTY STATES OR REDESIGNED ASSET CARDS */}
        {filteredAssets.length === 0 ? (
          selectedCategory === 'watchlist' ? (
            <View style={styles.emptyCard}>
              <Star size={36} color="#D97706" />
              <Text style={styles.emptyTitle}>Your watchlist is empty</Text>
              <Text style={styles.emptySub}>
                Star an asset to follow its climate and market signals in real time.
              </Text>
              <Pressable
                onPress={() => setSelectedCategory('all')}
                style={({ pressed }) => [styles.emptyCtaBtn, pressed && styles.pressedState]}
              >
                <Text style={styles.emptyCtaText}>Explore All Markets</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <SearchX size={36} color="#64748B" />
              <Text style={styles.emptyTitle}>No green assets found</Text>
              <Text style={styles.emptySub}>
                Try searching another asset, region (e.g. Suhum, Tamale), or category.
              </Text>
              <Pressable
                onPress={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                style={({ pressed }) => [styles.emptyCtaBtn, pressed && styles.pressedState]}
              >
                <Text style={styles.emptyCtaText}>Clear Search & Filters</Text>
              </Pressable>
            </View>
          )
        ) : (
          <View style={styles.assetsList}>
            {filteredAssets.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                isStarred={watchlist.includes(asset.id)}
                hasUnlockedThesis={hasUnlockedThesis(asset.id)}
                onPress={() => router.push(`/asset/${asset.id}` as any)}
                onStarToggle={() => toggleWatchlist(asset.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8F5',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  pressedState: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  headerArea: {
    marginBottom: 20,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0D211A',
    letterSpacing: -0.4,
  },
  livePulseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  livePulseText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.5,
  },
  screenDesc: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B8276',
    lineHeight: 18,
  },

  /* HERO MARKET PULSE CARD */
  pulseCard: {
    backgroundColor: '#072C22',
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#072017',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 6,
  },
  pulseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pulseTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#F59E0B',
    letterSpacing: 1,
  },
  pulseTimer: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(167, 243, 208, 0.7)',
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  statPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  spotlightBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
  },
  spotlightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  spotlightSymbol: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  spotlightName: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  spotlightPrice: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  spotlightChange: {
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },
  spotlightSignalRow: {
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  spotlightScoreText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    marginBottom: 6,
  },
  driverTagsGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  driverTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A7F3D0',
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pulseCta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginTop: 4,
  },
  pulseCtaText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },

  /* SEARCH BAR */
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E1E8DE',
    paddingHorizontal: 14,
    marginBottom: 16,
    shadowColor: '#0E2E21',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 13,
    fontWeight: '500',
    color: '#0D211A',
  },
  clearSearchText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D5C46',
  },

  /* CATEGORY FILTERS */
  filterScroll: {
    marginBottom: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E1E8DE',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#0B3C2F',
    borderColor: '#0B3C2F',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  /* SORT BAR */
  sortRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  resultsCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  sortPillsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sortPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E8DE',
  },
  sortPillActive: {
    backgroundColor: 'rgba(11, 60, 47, 0.10)',
    borderColor: '#0D5C46',
  },
  sortPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  sortPillTextActive: {
    color: '#0D5C46',
    fontWeight: '800',
  },

  /* ASSET LIST & EMPTY STATES */
  assetsList: {
    gap: 0,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E1E8DE',
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0D211A',
  },
  emptySub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  emptyCtaBtn: {
    backgroundColor: '#0B3C2F',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 6,
  },
  emptyCtaText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
