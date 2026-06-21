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

export type RelationshipType = 'best_friend' | 'roommate' | 'cousin' | 'work_friend' | 'others';

export type IdealQuestionScore = 1 | 4 | 7 | 10;

export interface IdealQuestionOption {
  label: string;
  score: IdealQuestionScore;
}

export interface IdealQuestion {
  key: DimensionKey;
  title: string;
  scenario: string;
  options: IdealQuestionOption[];
}

export interface SwipeStatement {
  id: string;
  key: DimensionKey;
  statement: string;
  endpoint: 1 | 10;
  scoreEffect: -2.25 | 2.25;
  swipeRightLabel: string;
}

export type ActualFrequencyValue = 'never' | 'sometimes' | 'often' | 'always';

export type ActualAnswerMap = Partial<Record<string, ActualFrequencyValue>>;

export interface FriendRapidFireQuestion {
  id: string;
  key: DimensionKey;
  prompt: string;
  optionA: { label: string; score: 1 | 10 };
  optionB: { label: string; score: 1 | 10 };
}

export interface ShareableCardReport {
  archetype_title: string;
  tagline: string;
  core_conflict: string;
  actionable_interventions: string[];
}

export interface DiagnosticReportSection {
  insight: string;
  evidence_dimensions: DimensionKey[];
}

export interface DiagnosticMatrixReport {
  facade: DiagnosticReportSection;
  guilty_pleasure: DiagnosticReportSection;
  blindspots: DiagnosticReportSection;
  deep_void: DiagnosticReportSection;
}

export interface FrictionReportAxis {
  score: number;
  analysis: string;
}

export interface FrictionMapReport {
  burnout_axis: FrictionReportAxis;
  armor_axis: FrictionReportAxis;
}

export interface MirrorReport {
  shareable_card: ShareableCardReport;
  diagnostic_matrix: DiagnosticMatrixReport;
  friction_map: FrictionMapReport;
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
