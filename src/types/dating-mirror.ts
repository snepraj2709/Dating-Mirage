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

export interface IntrospectionOption {
  weight: 0.0 | 0.33 | 0.66 | 1.0; // Scaled multiplier to preserve your backend math
  label: string;                   // The raw, unfiltered internal monologue choice
}

export interface IntrospectionCard {
  id: string;
  key: DimensionKey;
  endpoint: 1 | 10;
  scoreEffect: -2.25 | 2.25;
  situation: string;               // Shipped to the UI as the main bold quote/scenario
  subtext: string;                 // Psychological grounder / honesty nudge
  options: IntrospectionOption[];
}

export type ActualFrequencyValue = 'never' | 'sometimes' | 'often' | 'always';

export type ActualAnswerMap = Partial<Record<string, ActualFrequencyValue>>;

export interface FriendFeedbackSubmission {
  friendName: string;
  relationshipType: RelationshipType;
  relationshipLabel: string;
  socialVector: VectorProfile;
}

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

export type DominantGap = 'conscious' | 'blind_spot' | 'mixed';

export interface RadarScaleReport {
  min: number;
  max: number;
}

export interface RadarSeriesReport {
  ideal: VectorProfile;
  actual: VectorProfile;
  friend_feedback: VectorProfile;
}

export interface RadarDimensionReport {
  key: DimensionKey;
  name: string;
  ideal_score: number;
  actual_score: number;
  friend_feedback_score: number;
  conscious_gap: number;
  blind_spot_gap: number;
  total_gap: number;
  severity_percentage: number;
  dominant_gap: DominantGap;
  highlight_rank?: number | null;
}

export interface RadarChartReport {
  scale: RadarScaleReport;
  series: RadarSeriesReport;
  dimensions: RadarDimensionReport[];
  highlights: RadarDimensionReport[];
}

export interface MirrorReport {
  shareable_card: ShareableCardReport;
  diagnostic_matrix: DiagnosticMatrixReport;
  friction_map: FrictionMapReport;
  radar_chart: RadarChartReport;
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
  resultEmailSyncPending?: boolean;
}

export interface StepProgress {
  idealComplete: boolean;
  actualComplete: boolean;
  friendCount: number;
  reportUnlocked: boolean;
}
