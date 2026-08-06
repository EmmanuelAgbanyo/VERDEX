import AsyncStorage from '@react-native-async-storage/async-storage';
import { PortfolioPosition, TradeOrder, InvestmentThesis, SkillMeters } from '@/types';

const KEYS = {
  CASH_BALANCE: '@verdex_cash_balance',
  POSITIONS: '@verdex_positions',
  ORDERS: '@verdex_orders',
  THESES: '@verdex_theses',
  WATCHLIST: '@verdex_watchlist',
  LEARN_XP: '@verdex_learn_xp',
  LEARN_STREAK: '@verdex_learn_streak',
  COMPLETED_LESSONS: '@verdex_completed_lessons',
  SKILL_METERS: '@verdex_skill_meters',
  DAILY_CHALLENGE: '@verdex_daily_challenge',
  DATA_SAVER: '@verdex_data_saver',
};

export async function saveDataSaver(isDataSaver: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.DATA_SAVER, JSON.stringify(isDataSaver));
  } catch (e) {
    console.error('Error saving data saver setting', e);
  }
}

export async function loadDataSaver(): Promise<boolean | null> {
  try {
    const val = await AsyncStorage.getItem(KEYS.DATA_SAVER);
    return val !== null ? JSON.parse(val) : null;
  } catch (e) {
    console.error('Error loading data saver setting', e);
    return null;
  }
}

export async function saveCashBalance(cash: number): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.CASH_BALANCE, cash.toString());
  } catch (e) {
    console.error('Error saving cash balance', e);
  }
}

export async function loadCashBalance(): Promise<number | null> {
  try {
    const val = await AsyncStorage.getItem(KEYS.CASH_BALANCE);
    return val ? parseFloat(val) : null;
  } catch (e) {
    console.error('Error loading cash balance', e);
    return null;
  }
}

export async function savePositions(positions: PortfolioPosition[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.POSITIONS, JSON.stringify(positions));
  } catch (e) {
    console.error('Error saving positions', e);
  }
}

export async function loadPositions(): Promise<PortfolioPosition[] | null> {
  try {
    const val = await AsyncStorage.getItem(KEYS.POSITIONS);
    return val ? JSON.parse(val) : null;
  } catch (e) {
    console.error('Error loading positions', e);
    return null;
  }
}

export async function saveOrders(orders: TradeOrder[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
  } catch (e) {
    console.error('Error saving orders', e);
  }
}

export async function loadOrders(): Promise<TradeOrder[] | null> {
  try {
    const val = await AsyncStorage.getItem(KEYS.ORDERS);
    return val ? JSON.parse(val) : null;
  } catch (e) {
    console.error('Error loading orders', e);
    return null;
  }
}

export async function saveTheses(theses: InvestmentThesis[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.THESES, JSON.stringify(theses));
  } catch (e) {
    console.error('Error saving theses', e);
  }
}

export async function loadTheses(): Promise<InvestmentThesis[] | null> {
  try {
    const val = await AsyncStorage.getItem(KEYS.THESES);
    return val ? JSON.parse(val) : null;
  } catch (e) {
    console.error('Error loading theses', e);
    return null;
  }
}

export async function saveWatchlist(watchlist: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.WATCHLIST, JSON.stringify(watchlist));
  } catch (e) {
    console.error('Error saving watchlist', e);
  }
}

export async function loadWatchlist(): Promise<string[] | null> {
  try {
    const val = await AsyncStorage.getItem(KEYS.WATCHLIST);
    return val ? JSON.parse(val) : null;
  } catch (e) {
    console.error('Error loading watchlist', e);
    return null;
  }
}

export async function saveLearnState(xp: number, streak: number, completedLessons: string[], skillMeters: SkillMeters): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.LEARN_XP, xp.toString());
    await AsyncStorage.setItem(KEYS.LEARN_STREAK, streak.toString());
    await AsyncStorage.setItem(KEYS.COMPLETED_LESSONS, JSON.stringify(completedLessons));
    await AsyncStorage.setItem(KEYS.SKILL_METERS, JSON.stringify(skillMeters));
  } catch (e) {
    console.error('Error saving learn state', e);
  }
}

export async function loadLearnState(): Promise<{ xp: number; streak: number; completedLessons: string[]; skillMeters: SkillMeters } | null> {
  try {
    const xp = await AsyncStorage.getItem(KEYS.LEARN_XP);
    const streak = await AsyncStorage.getItem(KEYS.LEARN_STREAK);
    const lessons = await AsyncStorage.getItem(KEYS.COMPLETED_LESSONS);
    const meters = await AsyncStorage.getItem(KEYS.SKILL_METERS);

    if (xp === null) return null;

    return {
      xp: parseInt(xp, 10),
      streak: parseInt(streak || '1', 10),
      completedLessons: lessons ? JSON.parse(lessons) : [],
      skillMeters: meters ? JSON.parse(meters) : { signalReading: 75, thesisCraft: 60, riskAwareness: 80 },
    };
  } catch (e) {
    console.error('Error loading learn state', e);
    return null;
  }
}
