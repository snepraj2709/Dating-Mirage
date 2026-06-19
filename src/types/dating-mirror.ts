export type DimensionKey = 'CON' | 'INT' | 'AUT' | 'VAL' | 'GOC' | 'VUL' | 'REA' | 'RWO';

export interface Dimension {
  key: DimensionKey;
  name: string;
  leftLabel: string;
  rightLabel: string;
}

export interface VectorProfile {
  CON: number;
  INT: number;
  AUT: number;
  VAL: number;
  GOC: number;
  VUL: number;
  REA: number;
  RWO: number;
}

export type QuadrantKey = 'guilty-pleasure' | 'total-disconnect' | 'true-blindspot' | 'aligned';

export type RelationshipType = 'best_friend' | 'roommate' | 'cousin' | 'work_friend' | 'others';

export interface QuadrantDetail {
  icon: string;
  title: string;
  badge: string;
  description: string;
  vibe: string;
}

export interface SliderQuestion {
  key: DimensionKey;
  title: string;
  scenario: string;
  leftAnchor: string;
  centerAnchor: string;
  rightAnchor: string;
}

export interface SwipeStatement {
  id: string;
  key: DimensionKey;
  statement: string;
  endpoint: 1 | 10;
  scoreEffect: -2.25 | 2.25;
  swipeRightLabel: string;
}

export interface FriendRapidFireQuestion {
  id: string;
  key: DimensionKey;
  prompt: string;
  optionA: { label: string; score: 1 | 10 };
  optionB: { label: string; score: 1 | 10 };
}

export interface DimensionJohariResult {
  key: DimensionKey;
  consciousGap: number;
  blindSpotGap: number;
  rawSeverity: number;
  severityPercentage: number;
  quadrant: QuadrantKey;
}

export interface JohariReport {
  userId: string;
  friendCount: number;
  reportUnlocked: boolean;
  dimensions: Record<DimensionKey, DimensionJohariResult>;
  featuredDimensions: DimensionJohariResult[];
  shareCardUrl?: string;
}

export interface UserSession {
  id: string;
  idealProfile: VectorProfile | null;
  actualProfile: VectorProfile | null;
  socialProfile: VectorProfile | null;
  friendCount: number;
  reportUnlocked: boolean;
  resultEmail?: string | null;
  resultEmailSavedAt?: string | null;
  resultEmailSentAt?: string | null;
}

export interface StepProgress {
  idealComplete: boolean;
  actualComplete: boolean;
  friendCount: number;
  reportUnlocked: boolean;
}
