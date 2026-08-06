import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  ClimateSignal,
  GreenAsset,
  PortfolioPosition,
  TradeOrder,
  InvestmentThesis,
  OrderSide,
  OrderType,
  SkillMeters,
  DailyChallenge,
} from '@/types';
import { INITIAL_CLIMATE_SIGNALS, INITIAL_GREEN_ASSETS, tickClimateData } from '@/services/climateService';
import { evaluateThesisText, executeOrder } from '@/services/tradingEngine';
import {
  saveCashBalance,
  loadCashBalance,
  savePositions,
  loadPositions,
  saveOrders,
  loadOrders,
  saveTheses,
  loadTheses,
  saveWatchlist,
  loadWatchlist,
  saveLearnState,
  loadLearnState,
  saveDataSaver,
  loadDataSaver,
} from '@/services/storageService';

interface AppContextType {
  signals: ClimateSignal[];
  assets: GreenAsset[];
  cash: number;
  positions: PortfolioPosition[];
  orders: TradeOrder[];
  theses: InvestmentThesis[];
  watchlist: string[];
  xp: number;
  streak: number;
  completedLessons: string[];
  skillMeters: SkillMeters;
  dailyChallenge: DailyChallenge;
  sessionTimeRemaining: number; // in seconds
  isRefreshing: boolean;
  isDataSaver: boolean;
  
  toggleDataSaver: () => void;
  refreshData: () => Promise<void>;
  toggleWatchlist: (assetId: string) => void;
  submitThesis: (assetId: string, text: string, communityPurpose?: string) => { valid: boolean; feedback: string; thesis?: InvestmentThesis };
  executeTrade: (assetId: string, side: OrderSide, type: OrderType, quantity: number, limitPrice?: number) => { success: boolean; message: string };
  completeLesson: (lessonId: string, xpReward: number) => void;
  answerDailyChallenge: (optionIndex: number) => { correct: boolean; explanation: string };
  hasUnlockedThesis: (assetId: string) => boolean;
  getThesisForAsset: (assetId: string) => InvestmentThesis | undefined;
  getPortfolioValue: () => number;
}

const INITIAL_DAILY_CHALLENGE: DailyChallenge = {
  id: 'chal-01',
  date: new Date().toISOString().split('T')[0],
  title: 'Accra AQI & Solar Signal Challenge',
  scenario: 'Accra Air Quality Index improved by 8% today due to reduced harmattan dust. How does this impact Northern Savannah solar micro-grid yield?',
  signalContext: '42 AQI (-8% vs 7d avg)',
  question: 'What is the primary operational effect on Tamale solar assets?',
  options: [
    'Solar panel dust accumulation increases, reducing battery charging.',
    'Higher atmospheric clarity boosts solar irradiance and daily energy output.',
    'Rainfall decreases sharply across the Eastern cocoa belt.',
    'Mangrove carbon sequestration drops by 12%.',
  ],
  correctIndex: 1,
  explanation: 'Lower particulate pollution (cleaner air) allows more direct solar irradiance to reach PV panels, increasing daily output by ~14%.',
  xpReward: 100,
  completed: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [signals, setSignals] = useState<ClimateSignal[]>(INITIAL_CLIMATE_SIGNALS);
  const [assets, setAssets] = useState<GreenAsset[]>(INITIAL_GREEN_ASSETS);
  const [cash, setCash] = useState<number>(12840.20);
  const [positions, setPositions] = useState<PortfolioPosition[]>([
    {
      assetId: 'asset-ghana-cocoa',
      symbol: 'GH-COCOA',
      name: 'Suhum Cocoa Coop Climate Bond',
      category: 'cocoa',
      quantity: 35,
      avgBuyPrice: 142.00,
      currentPrice: 148.50,
      totalValue: 5197.50,
      unrealizedPnl: 227.50,
      unrealizedPnlPercent: 4.58,
    },
    {
      assetId: 'asset-northern-solar',
      symbol: 'WA-SOLAR',
      name: 'Tamale Micro-Grid Solar Shares',
      category: 'solar',
      quantity: 80,
      avgBuyPrice: 39.50,
      currentPrice: 42.10,
      totalValue: 3368.00,
      unrealizedPnl: 208.00,
      unrealizedPnlPercent: 6.58,
    },
  ]);
  const [orders, setOrders] = useState<TradeOrder[]>([]);
  const [theses, setTheses] = useState<InvestmentThesis[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>(['asset-northern-solar', 'asset-volta-mangrove']);
  
  // Learn state
  const [xp, setXp] = useState<number>(450);
  const [streak, setStreak] = useState<number>(5);
  const [completedLessons, setCompletedLessons] = useState<string[]>(['les-climate-1']);
  const [skillMeters, setSkillMeters] = useState<SkillMeters>({
    signalReading: 82,
    thesisCraft: 75,
    riskAwareness: 88,
  });
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge>(INITIAL_DAILY_CHALLENGE);
  
  // Session countdown (28 mins 45 secs = 1725s)
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState<number>(1725);
  // Data Saver 2G mode
  const [isDataSaver, setIsDataSaver] = useState<boolean>(false);

  // Load stored state on mount
  useEffect(() => {
    (async () => {
      const savedDataSaver = await loadDataSaver();
      if (savedDataSaver !== null) setIsDataSaver(savedDataSaver);

      const savedCash = await loadCashBalance();
      if (savedCash !== null) setCash(savedCash);

      const savedPos = await loadPositions();
      if (savedPos) setPositions(savedPos);

      const savedOrd = await loadOrders();
      if (savedOrd) setOrders(savedOrd);

      const savedTheses = await loadTheses();
      if (savedTheses) setTheses(savedTheses);

      const savedWatch = await loadWatchlist();
      if (savedWatch) setWatchlist(savedWatch);

      const savedLearn = await loadLearnState();
      if (savedLearn) {
        setXp(savedLearn.xp);
        setStreak(savedLearn.streak);
        setCompletedLessons(savedLearn.completedLessons);
        setSkillMeters(savedLearn.skillMeters);
      }
    })();
  }, []);

  const toggleDataSaver = useCallback(() => {
    setIsDataSaver((prev) => {
      const next = !prev;
      saveDataSaver(next);
      return next;
    });
  }, []);

  // 30-minute session countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTimeRemaining((prev) => (prev > 0 ? prev - 1 : 1800));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Pulse climate tick every 10s to simulate live trading terminal movement
  useEffect(() => {
    const tickInterval = setInterval(() => {
      setSignals((prevSignals) => {
        setAssets((prevAssets) => {
          const { updatedSignals, updatedAssets } = tickClimateData(prevSignals, prevAssets);
          return updatedAssets;
        });
        return prevSignals;
      });
    }, 10000);
    return () => clearInterval(tickInterval);
  }, []);

  // Recalculate portfolio position valuations when asset prices change
  useEffect(() => {
    setPositions((prevPositions) =>
      prevPositions.map((pos) => {
        const liveAsset = assets.find((a) => a.id === pos.assetId);
        if (!liveAsset) return pos;
        const totalVal = Number((pos.quantity * liveAsset.price).toFixed(2));
        const costBasis = pos.quantity * pos.avgBuyPrice;
        const pnl = Number((totalVal - costBasis).toFixed(2));
        const pnlPercent = Number(((pnl / costBasis) * 100).toFixed(2));
        return {
          ...pos,
          currentPrice: liveAsset.price,
          totalValue: totalVal,
          unrealizedPnl: pnl,
          unrealizedPnlPercent: pnlPercent,
        };
      })
    );
  }, [assets]);

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise((res) => setTimeout(res, 800));
    const { updatedSignals, updatedAssets } = tickClimateData(signals, assets);
    setSignals(updatedSignals);
    setAssets(updatedAssets);
    setIsRefreshing(false);
  }, [signals, assets]);

  const toggleWatchlist = useCallback((assetId: string) => {
    setWatchlist((prev) => {
      const next = prev.includes(assetId) ? prev.filter((id) => id !== assetId) : [...prev, assetId];
      saveWatchlist(next);
      return next;
    });
  }, []);

  const submitThesis = useCallback(
    (assetId: string, text: string, communityPurpose?: string) => {
      const asset = assets.find((a) => a.id === assetId);
      if (!asset) return { valid: false, feedback: 'Asset not found.' };

      const evalResult = evaluateThesisText(text);
      if (!evalResult.valid) {
        return { valid: false, feedback: evalResult.feedback };
      }

      const newThesis: InvestmentThesis = {
        id: `thesis-${Date.now()}`,
        assetId,
        assetSymbol: asset.symbol,
        text: text.trim(),
        communityPurpose: communityPurpose?.trim() || `Supported ${asset.communityImpact.toLowerCase()}`,
        sentenceCount: evalResult.sentenceCount,
        timestamp: Date.now(),
        qualityRating: evalResult.qualityRating,
        signalObservation: `Analyzed ${asset.signalType} signal score of ${asset.signalScore}/100.`,
        riskAssessment: asset.riskFactors[0] || 'Evaluated environmental variance.',
        financialRationale: `Targeting allocation in ${asset.name} backed by environmental yield data.`,
      };

      setTheses((prev) => {
        const next = [newThesis, ...prev];
        saveTheses(next);
        return next;
      });

      setSkillMeters((prev) => {
        const nextMeters = { ...prev, thesisCraft: Math.min(100, prev.thesisCraft + 5) };
        saveLearnState(xp, streak, completedLessons, nextMeters);
        return nextMeters;
      });

      return { valid: true, feedback: evalResult.feedback, thesis: newThesis };
    },
    [assets, xp, streak, completedLessons]
  );

  const hasUnlockedThesis = useCallback(
    (assetId: string) => {
      return theses.some((t) => t.assetId === assetId);
    },
    [theses]
  );

  const getThesisForAsset = useCallback(
    (assetId: string) => {
      return theses.find((t) => t.assetId === assetId);
    },
    [theses]
  );

  const executeTrade = useCallback(
    (assetId: string, side: OrderSide, type: OrderType, quantity: number, limitPrice?: number) => {
      const asset = assets.find((a) => a.id === assetId);
      if (!asset) return { success: false, message: 'Asset not found.' };

      const activeThesis = getThesisForAsset(assetId);
      if (!activeThesis) {
        return {
          success: false,
          message: 'Research Lock Active! You must write a 3-sentence investment thesis in the Diagnostic Panel before executing this trade.',
        };
      }

      try {
        const result = executeOrder(
          asset,
          side,
          type,
          quantity,
          limitPrice,
          cash,
          positions,
          activeThesis.id
        );

        setCash(result.newCash);
        saveCashBalance(result.newCash);

        setPositions(result.newPositions);
        savePositions(result.newPositions);

        setOrders((prev) => {
          const next = [result.order, ...prev];
          saveOrders(next);
          return next;
        });

        setSkillMeters((prev) => {
          const next = {
            ...prev,
            signalReading: Math.min(100, prev.signalReading + 3),
            riskAwareness: Math.min(100, prev.riskAwareness + 4),
          };
          saveLearnState(xp, streak, completedLessons, next);
          return next;
        });

        return {
          success: true,
          message: `Trade executed! ${side.toUpperCase()} ${quantity} ${asset.symbol} @ GH₵${result.order.price.toFixed(2)} (Fee: GH₵${result.order.fee.toFixed(2)})`,
        };
      } catch (err: any) {
        return { success: false, message: err.message || 'Trade execution failed.' };
      }
    },
    [assets, cash, positions, getThesisForAsset, xp, streak, completedLessons]
  );

  const completeLesson = useCallback(
    (lessonId: string, xpReward: number) => {
      if (!completedLessons.includes(lessonId)) {
        const nextLessons = [...completedLessons, lessonId];
        const nextXp = xp + xpReward;
        setCompletedLessons(nextLessons);
        setXp(nextXp);
        saveLearnState(nextXp, streak, nextLessons, skillMeters);
      }
    },
    [completedLessons, xp, streak, skillMeters]
  );

  const answerDailyChallenge = useCallback(
    (optionIndex: number) => {
      const isCorrect = optionIndex === dailyChallenge.correctIndex;
      if (isCorrect && !dailyChallenge.completed) {
        const updatedChal = { ...dailyChallenge, completed: true };
        setDailyChallenge(updatedChal);
        const nextXp = xp + dailyChallenge.xpReward;
        setXp(nextXp);
        saveLearnState(nextXp, streak + 1, completedLessons, skillMeters);
        setStreak((s) => s + 1);
      }
      return { correct: isCorrect, explanation: dailyChallenge.explanation };
    },
    [dailyChallenge, xp, streak, completedLessons, skillMeters]
  );

  const getPortfolioValue = useCallback(() => {
    const positionsVal = positions.reduce((sum, p) => sum + p.totalValue, 0);
    return Number((cash + positionsVal).toFixed(2));
  }, [cash, positions]);

  return (
    <AppContext.Provider
      value={{
        signals,
        assets,
        cash,
        positions,
        orders,
        theses,
        watchlist,
        xp,
        streak,
        completedLessons,
        skillMeters,
        dailyChallenge,
        sessionTimeRemaining,
        isRefreshing,
        isDataSaver,
        toggleDataSaver,
        refreshData,
        toggleWatchlist,
        submitThesis,
        executeTrade,
        completeLesson,
        answerDailyChallenge,
        hasUnlockedThesis,
        getThesisForAsset,
        getPortfolioValue,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
