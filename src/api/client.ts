import type { JohariReport, RelationshipType, UserSession, VectorProfile } from '../types/dating-mirror';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

type ApiVectorProfile = Record<keyof VectorProfile, number>;

interface ApiSession {
  id: string;
  ideal_profile: ApiVectorProfile | null;
  actual_profile: ApiVectorProfile | null;
  social_profile: ApiVectorProfile | null;
  friend_count: number;
  report_unlocked: boolean;
}

interface ApiReport {
  user_id: string;
  friend_count: number;
  report_unlocked: boolean;
  dimensions: Record<string, {
    key: string;
    conscious_gap: number;
    blind_spot_gap: number;
    raw_severity: number;
    severity_percentage: number;
    quadrant: string;
  }>;
  featured_dimensions: Array<{
    key: string;
    conscious_gap: number;
    blind_spot_gap: number;
    raw_severity: number;
    severity_percentage: number;
    quadrant: string;
  }>;
  share_card_url?: string | null;
}

function toUserSession(session: ApiSession): UserSession {
  return {
    id: session.id,
    idealProfile: session.ideal_profile,
    actualProfile: session.actual_profile,
    socialProfile: session.social_profile,
    friendCount: session.friend_count,
    reportUnlocked: session.report_unlocked,
  };
}

function toReport(report: ApiReport): JohariReport {
  const mapResult = (result: ApiReport['featured_dimensions'][number]) => ({
    key: result.key as keyof VectorProfile,
    consciousGap: result.conscious_gap,
    blindSpotGap: result.blind_spot_gap,
    rawSeverity: result.raw_severity,
    severityPercentage: result.severity_percentage,
    quadrant: result.quadrant as JohariReport['featuredDimensions'][number]['quadrant'],
  });

  return {
    userId: report.user_id,
    friendCount: report.friend_count,
    reportUnlocked: report.report_unlocked,
    dimensions: Object.fromEntries(
      Object.entries(report.dimensions).map(([key, value]) => [key, mapResult(value)]),
    ) as JohariReport['dimensions'],
    featuredDimensions: report.featured_dimensions.map(mapResult),
    shareCardUrl: report.share_card_url ?? undefined,
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
    throw new Error(message || `Request failed with ${response.status}`);
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

export async function submitFriendFeedback(
  sessionId: string,
  relationshipType: RelationshipType,
  feedbackProfile: VectorProfile,
): Promise<{ sessionId: string; friendCount: number; reportUnlocked: boolean }> {
  return request(`/sessions/${sessionId}/friend-feedback`, {
    method: 'POST',
    body: JSON.stringify({
      relationship_type: relationshipType,
      is_anonymous: true,
      feedback_profile: feedbackProfile,
    }),
  });
}

export async function getSession(sessionId: string): Promise<UserSession> {
  return toUserSession(await request<ApiSession>(`/sessions/${sessionId}`));
}

export async function getReport(sessionId: string): Promise<JohariReport> {
  return toReport(await request<ApiReport>(`/sessions/${sessionId}/report`));
}

export async function burnSession(sessionId: string): Promise<{ deleted: boolean }> {
  return request(`/sessions/${sessionId}`, { method: 'DELETE' });
}

