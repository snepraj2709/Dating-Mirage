import type { FriendFeedbackSubmission, MirrorReport, UserSession, VectorProfile } from '../types/dating-mirror';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

type ApiVectorProfile = Record<keyof VectorProfile, number>;

interface ApiSession {
  id: string;
  ideal_profile: ApiVectorProfile | null;
  actual_profile: ApiVectorProfile | null;
  social_profile: ApiVectorProfile | null;
  friend_count: number;
  report_unlocked: boolean;
  result_email?: string | null;
  result_email_saved_at?: string | null;
  result_email_sent_at?: string | null;
}

function toUserSession(session: ApiSession): UserSession {
  return {
    id: session.id,
    idealProfile: session.ideal_profile,
    actualProfile: session.actual_profile,
    socialProfile: session.social_profile,
    friendCount: session.friend_count,
    reportUnlocked: session.report_unlocked,
    resultEmail: session.result_email ?? null,
    resultEmailSavedAt: session.result_email_saved_at ?? null,
    resultEmailSentAt: session.result_email_sent_at ?? null,
  };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    const message = await response.text();
    let detail: string | null = null;
    try {
      const parsed = JSON.parse(message) as { detail?: unknown };
      if (typeof parsed.detail === 'string') {
        detail = parsed.detail;
      }
    } catch {
      // Non-JSON error bodies fall back to the raw response text below.
    }
    throw new Error(detail ?? (message || `Request failed with ${response.status}`));
  }

  return response.json() as Promise<T>;
}

export async function createOrUpdateSession(
  idealProfile: VectorProfile,
  sessionId?: string,
): Promise<UserSession> {
  const session = await request<ApiSession>('/sessions', {
    method: 'POST',
    body: JSON.stringify({
      ideal_profile: idealProfile,
      session_id: sessionId,
    }),
  });

  return toUserSession(session);
}

export async function submitActualProfile(sessionId: string, actualProfile: VectorProfile): Promise<UserSession> {
  const session = await request<ApiSession>(`/sessions/${sessionId}/actual-profile`, {
    method: 'POST',
    body: JSON.stringify({ actual_profile: actualProfile }),
  });

  return toUserSession(session);
}

export async function saveResultEmail(sessionId: string, resultEmail: string): Promise<UserSession> {
  const session = await request<ApiSession>(`/sessions/${sessionId}/result-email`, {
    method: 'POST',
    body: JSON.stringify({ result_email: resultEmail }),
  });

  return toUserSession(session);
}

export async function submitFriendFeedback(
  sessionId: string,
  feedback: FriendFeedbackSubmission,
): Promise<{ sessionId: string; friendCount: number; reportUnlocked: boolean }> {
  return request(`/sessions/${sessionId}/friend-feedback`, {
    method: 'POST',
    body: JSON.stringify({
      friend_name: feedback.friendName,
      relationship_type: feedback.relationshipType,
      relationship_label: feedback.relationshipLabel,
      social_vector: feedback.socialVector,
    }),
  });
}

export async function getSession(sessionId: string): Promise<UserSession> {
  return toUserSession(await request<ApiSession>(`/sessions/${sessionId}`));
}

export async function getReport(sessionId: string): Promise<MirrorReport> {
  return request<MirrorReport>(`/sessions/${sessionId}/report`);
}

export async function burnSession(sessionId: string): Promise<{ deleted: boolean }> {
  return request(`/sessions/${sessionId}`, { method: 'DELETE' });
}
