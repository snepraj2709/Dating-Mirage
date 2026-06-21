import type {
  ActualAnswerMap,
  ActualFrequencyValue,
  FriendFeedbackSubmission,
  RelationshipType,
  UserSession,
  VectorProfile,
} from '../types/dating-mirror';

const IDEAL_DRAFT_KEY = 'dating-mirror:ideal-draft';
const ACTUAL_SWIPES_KEY = 'dating-mirror:actual-swipes';
const SESSION_KEY = 'dating-mirror:session';
const CURRENT_STAGE_KEY = 'dating-mirror:current-stage';
const LOCAL_FRIEND_PREFIX = 'dating-mirror:friend-feedback:';
const ANONYMOUS_FRIEND_NAME = 'anonymous';

export type StoredAppStage = 'landing' | 'ideal' | 'actualIntro' | 'actual' | 'share' | 'reveal';

export function loadIdealDraft(): Partial<VectorProfile> {
  try {
    const raw = window.localStorage.getItem(IDEAL_DRAFT_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveIdealDraft(draft: Partial<VectorProfile>) {
  window.localStorage.setItem(IDEAL_DRAFT_KEY, JSON.stringify(draft));
}

export function clearIdealDraft() {
  window.localStorage.removeItem(IDEAL_DRAFT_KEY);
}

function normalizeActualAnswer(value: unknown): ActualFrequencyValue | undefined {
  if (value === 'never' || value === 'sometimes' || value === 'often' || value === 'always') {
    return value;
  }

  if (value === 'left') {
    return 'never';
  }

  if (value === 'right') {
    return 'always';
  }

  return undefined;
}

export function loadActualAnswers(): ActualAnswerMap {
  try {
    const raw = window.localStorage.getItem(ACTUAL_SWIPES_KEY);
    const parsed = raw ? JSON.parse(raw) : {};

    return Object.entries(parsed).reduce<ActualAnswerMap>((answers, [id, value]) => {
      const answer = normalizeActualAnswer(value);

      if (answer) {
        answers[id] = answer;
      }

      return answers;
    }, {});
  } catch {
    return {};
  }
}

export function saveActualAnswers(answers: ActualAnswerMap) {
  window.localStorage.setItem(ACTUAL_SWIPES_KEY, JSON.stringify(answers));
}

export function loadActualSwipes() {
  return loadActualAnswers();
}

export function saveActualSwipes(answers: ActualAnswerMap) {
  saveActualAnswers(answers);
}

export function clearActualSwipes() {
  window.localStorage.removeItem(ACTUAL_SWIPES_KEY);
}

export function loadStoredSession(): UserSession | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredSession(session: UserSession) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearStoredSession() {
  window.localStorage.removeItem(SESSION_KEY);
}

function isStoredAppStage(value: unknown): value is StoredAppStage {
  return value === 'landing' ||
    value === 'ideal' ||
    value === 'actualIntro' ||
    value === 'actual' ||
    value === 'share' ||
    value === 'reveal';
}

export function loadStoredStage(): StoredAppStage | null {
  try {
    const stage = window.localStorage.getItem(CURRENT_STAGE_KEY);
    return isStoredAppStage(stage) ? stage : null;
  } catch {
    return null;
  }
}

export function saveStoredStage(stage: StoredAppStage) {
  window.localStorage.setItem(CURRENT_STAGE_KEY, stage);
}

export function clearStoredStage() {
  window.localStorage.removeItem(CURRENT_STAGE_KEY);
}

function isVectorProfile(value: unknown): value is VectorProfile {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const profile = value as Partial<Record<keyof VectorProfile, unknown>>;
  return ['CON', 'INT', 'AUT', 'VAL', 'GOC', 'VUL', 'REA', 'RWO'].every(
    (key) => typeof profile[key as keyof VectorProfile] === 'number',
  );
}

function normalizeRelationshipType(value: unknown): RelationshipType {
  return value === 'best_friend' ||
    value === 'roommate' ||
    value === 'cousin' ||
    value === 'work_friend' ||
    value === 'others'
    ? value
    : 'others';
}

function normalizeLocalFriendFeedback(value: unknown): FriendFeedbackSubmission | null {
  if (isVectorProfile(value)) {
    return {
      friendName: ANONYMOUS_FRIEND_NAME,
      relationshipType: 'others',
      relationshipLabel: 'Other',
      socialVector: value,
    };
  }

  if (!value || typeof value !== 'object') {
    return null;
  }

  const record = value as Partial<FriendFeedbackSubmission>;
  if (!isVectorProfile(record.socialVector)) {
    return null;
  }

  const relationshipType = normalizeRelationshipType(record.relationshipType);
  const relationshipLabel = typeof record.relationshipLabel === 'string' && record.relationshipLabel.trim()
    ? record.relationshipLabel.trim()
    : 'Other';

  return {
    friendName: ANONYMOUS_FRIEND_NAME,
    relationshipType,
    relationshipLabel,
    socialVector: record.socialVector,
  };
}

export function loadLocalFriendFeedback(sessionId: string): FriendFeedbackSubmission[] {
  try {
    const raw = window.localStorage.getItem(`${LOCAL_FRIEND_PREFIX}${sessionId}`);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.reduce<FriendFeedbackSubmission[]>((feedback, item) => {
      const normalized = normalizeLocalFriendFeedback(item);
      if (normalized) {
        feedback.push(normalized);
      }
      return feedback;
    }, []);
  } catch {
    return [];
  }
}

export function loadLocalFriendProfiles(sessionId: string): VectorProfile[] {
  return loadLocalFriendFeedback(sessionId).map((feedback) => feedback.socialVector);
}

export function appendLocalFriendFeedback(sessionId: string, feedback: FriendFeedbackSubmission): number {
  const profiles = [...loadLocalFriendFeedback(sessionId), feedback];
  window.localStorage.setItem(`${LOCAL_FRIEND_PREFIX}${sessionId}`, JSON.stringify(profiles));
  return profiles.length;
}

export function appendLocalFriendProfile(sessionId: string, profile: VectorProfile): number {
  return appendLocalFriendFeedback(sessionId, {
    friendName: ANONYMOUS_FRIEND_NAME,
    relationshipType: 'others',
    relationshipLabel: 'Other',
    socialVector: profile,
  });
}

export function clearLocalFriendProfiles(sessionId: string) {
  window.localStorage.removeItem(`${LOCAL_FRIEND_PREFIX}${sessionId}`);
}
