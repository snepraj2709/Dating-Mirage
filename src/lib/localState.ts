import type { ActualAnswerMap, ActualFrequencyValue, UserSession, VectorProfile } from '../types/dating-mirror';

const IDEAL_DRAFT_KEY = 'dating-mirror:ideal-draft';
const ACTUAL_SWIPES_KEY = 'dating-mirror:actual-swipes';
const SESSION_KEY = 'dating-mirror:session';
const LOCAL_FRIEND_PREFIX = 'dating-mirror:friend-feedback:';

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

export function loadLocalFriendProfiles(sessionId: string): VectorProfile[] {
  try {
    const raw = window.localStorage.getItem(`${LOCAL_FRIEND_PREFIX}${sessionId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function appendLocalFriendProfile(sessionId: string, profile: VectorProfile): number {
  const profiles = [...loadLocalFriendProfiles(sessionId), profile];
  window.localStorage.setItem(`${LOCAL_FRIEND_PREFIX}${sessionId}`, JSON.stringify(profiles));
  return profiles.length;
}

export function clearLocalFriendProfiles(sessionId: string) {
  window.localStorage.removeItem(`${LOCAL_FRIEND_PREFIX}${sessionId}`);
}
