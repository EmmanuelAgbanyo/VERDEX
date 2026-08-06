export type EcologicalRegion = 
  | 'accra' 
  | 'eastern_suhum' 
  | 'northern_savannah' 
  | 'volta_delta' 
  | 'brong_ahafo';

export type SignalType = 
  | 'air_quality' 
  | 'rainfall' 
  | 'heat_anomaly' 
  | 'solar_irradiance' 
  | 'carbon_offset';

export interface ClimateSignal {
  id: string;
  region: EcologicalRegion;
  regionLabel: string;
  name: string;
  type: SignalType;
  currentValue: number;
  unit: string;
  changePercent: number; // e.g. -8 or +12
  baselineValue: number;
  statusText: string; // e.g. "Good", "+12% vs avg", "High"
  updatedSecondsAgo: number;
  impactDescription: string;
  volatilityImpact: number; // multiplier for asset price movement
}

export type AssetCategory = 'cocoa' | 'solar' | 'mangrove' | 'savannah';

export interface PricePoint {
  time: string;
  price: number;
}

export interface ImpactBreakdown {
  peopleReached: string;
  environmentalBenefit: string;
  jobsSupported: string;
}

export interface CommunityStory {
  personName: string;
  role: string;
  location: string;
  storyText: string;
}

export interface GreenAsset {
  id: string;
  symbol: string;
  name: string;
  region: EcologicalRegion;
  regionLabel: string;
  category: AssetCategory;
  price: number; // Virtual capital price in GH₵
  change24h: number; // Percentage change
  signalScore: number; // 0 to 100
  signalType: SignalType;
  primarySignalId: string;
  researchReady: boolean;
  description: string;
  communityImpact: string;
  whyThisMattersSnippet: string;
  impactBreakdown: ImpactBreakdown;
  communityStory: CommunityStory;
  environmentalMetrics: {
    label: string;
    value: string;
  }[];
  riskFactors: string[];
  historicalPrices: PricePoint[];
  starred?: boolean;
}

export type OrderType = 'market' | 'limit';
export type OrderSide = 'buy' | 'sell';

export interface TradeOrder {
  id: string;
  assetId: string;
  symbol: string;
  assetName: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price: number;
  totalValue: number;
  fee: number;
  status: 'executed' | 'queued' | 'cancelled';
  timestamp: number;
  thesisId?: string;
}

export interface InvestmentThesis {
  id: string;
  assetId: string;
  assetSymbol: string;
  text: string;
  communityPurpose?: string;
  sentenceCount: number;
  timestamp: number;
  qualityRating: 'Strong' | 'Solid' | 'Basic';
  signalObservation: string;
  riskAssessment: string;
  financialRationale: string;
}

export interface PortfolioPosition {
  assetId: string;
  symbol: string;
  name: string;
  category: AssetCategory;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  totalValue: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
}

export interface UserBadge {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  icon: string;
  careerPathLink?: string;
  unlockedAt?: string;
}

export interface CareerRole {
  id: string;
  title: string;
  badgeTitle: string;
  skillAcquired: string;
  description: string;
  relevantCareers: string[];
  sampleEmployers: string[];
  salaryRange: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface LessonSection {
  title: string;
  body: string;
  keyTakeaway: string;
}

export interface Lesson {
  id: string;
  pathwayId: string;
  title: string;
  summary: string;
  durationMinutes: number;
  xpReward: number;
  locked: boolean;
  completed: boolean;
  sections: LessonSection[];
  quiz: QuizQuestion;
  practicePrompt: string;
}

export interface LearnPathway {
  id: string;
  title: string;
  description: string;
  iconName: string;
  color: string;
  totalLessons: number;
  completedLessons: number;
  lessons: Lesson[];
}

export interface SkillMeters {
  signalReading: number; // 0-100
  thesisCraft: number;    // 0-100
  riskAwareness: number;  // 0-100
}

export interface DailyChallenge {
  id: string;
  date: string;
  title: string;
  scenario: string;
  signalContext: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  xpReward: number;
  completed: boolean;
}
