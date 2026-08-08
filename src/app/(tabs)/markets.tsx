import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, RefreshControl, useWindowDimensions } from 'react-native';
import { useApp } from '@/context/AppContext';
import { AssetCard } from '@/components/AssetCard';
import { GlassCard } from '@/components/GlassCard';
import { COLORS, LAYOUT } from '@/constants/theme';
import { Search, Filter, Star, Zap, TrendingUp, SlidersHorizontal, SearchX } from 'lucide-react-native';
import { DataSaverToggle, DataSaverBanner } from '@/components/DataSaverToggle';
import { useRouter } from 'expo-router';
import { AssetCategory } from '@/types';

export default function MarketsScreen() {
  const {
    assets,
    watchlist,
    toggleWatchlist,
    hasUnlockedThesis,
    isRefreshing,
    isDataSaver,
    refreshData,
  } = useApp();

  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'all' | 'watchlist'>('all');
  const [sortByScore, setSortByScore] = useState<boolean>(false);

  // Filter logic
  let filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.regionLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.signalType.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === 'watchlist') {
      return watchlist.includes(asset.id);
    }
    if (selectedCategory !== 'all') {
      return asset.category === selectedCategory;
    }
    return true;
  });

  if (sortByScore) {
    filteredAssets = [...filteredAssets].sort((a, b) => b.signalScore - a.signalScore);
  }

  // Market Radar Metrics
  const topMover = [...assets].sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h))[0];
  const highestSignal = [...assets].sort((a, b) => b.signalScore - a.signalScore)[0];

  return (
    <View style={[styles.container, isDataSaver && styles.containerDataSaver]}>
      <DataSaverBanner />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshData}
            tintColor={COLORS.emeraldBright}
            colors={[COLORS.emeraldBright]}
          />
        }
      >
        {/* Screen Header */}
        <View style={styles.headerArea}>
          <View style={styles.titleRowWithToggle}>
            <Text style={[styles.screenTitle, isDataSaver && { color: '#FFFFFF' }]}>Markets</Text>
            <DataSaverToggle compact />
          </View>
          <Text style={[styles.screenDesc, isDataSaver && { color: '#CCCCCC' }]}>
            Real-time Ghanaian climate signals driving verified green asset valuations.
          </Text>
        </View>

        {/* MARKET RADAR WIDGET */}
        <GlassCard variant="dark" showGrid style={styles.radarCard}>
          <View style={styles.radarHeader}>
            <Zap size={18} color={COLORS.amberDataBright} />
            <Text style={styles.radarTitle}>Market Radar</Text>
          </View>

          <View style={[styles.radarGrid, { flexDirection: isWide ? 'row' : 'column' }]}>
            <View style={styles.radarBox}>
              <Text style={styles.radarLabel}>TOP MOVER</Text>
              <Text style={styles.radarValue}>{topMover?.symbol}</Text>
              <Text style={[styles.radarSub, { color: topMover?.change24h >= 0 ? COLORS.emeraldBright : COLORS.redAlert }]}>
                {topMover?.change24h >= 0 ? '+' : ''}{topMover?.change24h.toFixed(2)}%
              </Text>
            </View>

            <View style={styles.radarBox}>
              <Text style={styles.radarLabel}>HIGHEST SIGNAL</Text>
              <Text style={styles.radarValue}>{highestSignal?.symbol}</Text>
              <Text style={[styles.radarSub, { color: COLORS.amberDataBright }]}>
                Score: {highestSignal?.signalScore}/100
              </Text>
            </View>

            <View style={styles.radarBox}>
              <Text style={styles.radarLabel}>WATCHLIST</Text>
              <Text style={styles.radarValue}>{watchlist.length}</Text>
              <Text style={styles.radarSub}>Starred assets</Text>
            </View>
          </View>
        </GlassCard>

        {/* SEARCH BAR */}
        <View style={styles.searchContainer}>
          <Search size={20} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search assets, symbols, regions..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityRole="search"
            accessibilityLabel="Search assets"
          />
        </View>

        {/* CATEGORY & WATCHLIST FILTERS */}
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
            <Star size={14} color={selectedCategory === 'watchlist' ? COLORS.bgDark : COLORS.amberData} />
            <Text style={[styles.filterChipText, selectedCategory === 'watchlist' && styles.filterChipTextActive]}>
              Watchlist ({watchlist.length})
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setSelectedCategory('cocoa')}
            style={[styles.filterChip, selectedCategory === 'cocoa' && styles.filterChipActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: selectedCategory === 'cocoa' }}
            accessibilityLabel="Filter Cocoa Bonds"
          >
            <Text style={[styles.filterChipText, selectedCategory === 'cocoa' && styles.filterChipTextActive]}>
              Cocoa Bonds
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setSelectedCategory('solar')}
            style={[styles.filterChip, selectedCategory === 'solar' && styles.filterChipActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: selectedCategory === 'solar' }}
            accessibilityLabel="Filter Solar Shares"
          >
            <Text style={[styles.filterChipText, selectedCategory === 'solar' && styles.filterChipTextActive]}>
              Solar Shares
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setSelectedCategory('mangrove')}
            style={[styles.filterChip, selectedCategory === 'mangrove' && styles.filterChipActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: selectedCategory === 'mangrove' }}
            accessibilityLabel="Filter Blue Carbon"
          >
            <Text style={[styles.filterChipText, selectedCategory === 'mangrove' && styles.filterChipTextActive]}>
              Blue Carbon
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setSelectedCategory('savannah')}
            style={[styles.filterChip, selectedCategory === 'savannah' && styles.filterChipActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: selectedCategory === 'savannah' }}
            accessibilityLabel="Filter Savannah Stakes"
          >
            <Text style={[styles.filterChipText, selectedCategory === 'savannah' && styles.filterChipTextActive]}>
              Savannah Stakes
            </Text>
          </Pressable>
        </ScrollView>

        {/* SORT TOGGLE */}
        <View style={styles.sortRow}>
          <Text style={styles.resultsCount}>{filteredAssets.length} asset(s) found</Text>

          <Pressable
            onPress={() => setSortByScore(!sortByScore)}
            style={[styles.sortBtn, sortByScore && styles.sortBtnActive]}
          >
            <SlidersHorizontal size={14} color={sortByScore ? COLORS.bgDark : COLORS.emeraldBright} />
            <Text style={[styles.sortBtnText, sortByScore && styles.sortBtnTextActive]}>
              {sortByScore ? 'Sorted by Signal' : 'Sort by Signal'}
            </Text>
          </Pressable>
        </View>

        {/* ASSET LIST */}
        {filteredAssets.length === 0 ? (
          <GlassCard showGrid style={styles.emptyCard}>
            <SearchX size={32} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No matching green assets</Text>
            <Text style={styles.emptySub}>Try adjusting your search term or category filters.</Text>
          </GlassCard>
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
    backgroundColor: COLORS.bgDark,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
    maxWidth: 840,
    width: '100%',
    alignSelf: 'center',
  },
  headerArea: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E4EAE2',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textBright,
    letterSpacing: -0.5,
  },
  screenDesc: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  radarCard: {
    padding: 20,
    marginBottom: 24,
    gap: 16,
    borderRadius: 16,
  },
  radarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radarTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  radarGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  radarBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    gap: 4,
  },
  radarLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(167, 243, 208, 0.7)',
    letterSpacing: 0.5,
  },
  radarValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
    marginBottom: 2,
  },
  radarSub: {
    fontSize: 11,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E4EAE2',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    color: COLORS.textBright,
    fontSize: 14,
    fontWeight: '500',
  },
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
    borderColor: '#E4EAE2',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: COLORS.emeraldPrimary,
    borderColor: COLORS.emeraldBright,
    shadowColor: '#10B981',
    shadowOpacity: 0.15,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sortRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 14,
  },
  resultsCount: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  sortBtnActive: {
    backgroundColor: COLORS.emeraldPrimary,
    borderColor: COLORS.emeraldBright,
  },
  sortBtnText: {
    fontSize: 12,
    color: COLORS.emeraldBright,
    fontWeight: '700',
  },
  sortBtnTextActive: {
    color: COLORS.bgDark,
  },
  assetsList: {
    gap: 12,
  },
  emptyCard: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 10,
    borderRadius: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textBright,
  },
  emptySub: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  titleRowWithToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  containerDataSaver: {
    backgroundColor: '#000000',
  },
});
