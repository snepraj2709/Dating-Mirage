import type { UserSession, VectorProfile } from '../types/dating-mirror';

const IDEAL_DRAFT_KEY = 'dating-mirror:ideal-draft';
const ACTUAL_SWIPES_KEY = 'dating-mirror:actual-swipes';
const SESSION_KEY = 'dating-mirror:session';

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

export function loadActualSwipes(): Record<string, 'left' | 'right'> {
  try {
    const raw = window.localStorage.getItem(ACTUAL_SWIPES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveActualSwipes(swipes: Record<string, 'left' | 'right'>) {
  window.localStorage.setItem(ACTUAL_SWIPES_KEY, JSON.stringify(swipes));
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
