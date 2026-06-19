import { dimensionOrder } from '../data/datingMirrorContent';
import type {
  DimensionJohariResult,
  DimensionKey,
  JohariReport,
  QuadrantKey,
  SwipeStatement,
  VectorProfile,
} from '../types/dating-mirror';

export const HIGH_GAP_THRESHOLD = 3.0;
export const MAX_DISTANCE = Math.sqrt(9 ** 2 + 9 ** 2);

export const baselineVector = (value = 5.5): VectorProfile => ({
  CON: value,
  INT: value,
  AUT: value,
  VAL: value,
  GOC: value,
  VUL: value,
  REA: value,
  RWO: value,
});

export const clampScore = (value: number) => Math.min(10, Math.max(1, Number(value.toFixed(2))));

export function buildActualProfile(
  swipes: Record<string, 'left' | 'right'>,
  statements: SwipeStatement[],
): VectorProfile {
  const profile = baselineVector();

  statements.forEach((statement) => {
    if (swipes[statement.id] !== 'right') {
      return;
    }

    profile[statement.key] = clampScore(profile[statement.key] + statement.scoreEffect);
  });

  dimensionOrder.forEach((key) => {
    profile[key] = clampScore(profile[key]);
  });

  return profile;
}

export function buildFriendProfile(answers: Partial<Record<DimensionKey, 1 | 10>>): VectorProfile {
  const missing = dimensionOrder.find((key) => answers[key] === undefined);

  if (missing) {
    throw new Error(`Missing friend answer for ${missing}`);
  }

  return dimensionOrder.reduce((profile, key) => {
    profile[key] = answers[key]!;
    return profile;
  }, {} as VectorProfile);
}

export function aggregateSocialProfile(friendProfiles: VectorProfile[]): VectorProfile | null {
  if (friendProfiles.length === 0) {
    return null;
  }

  return dimensionOrder.reduce((profile, key) => {
    const total = friendProfiles.reduce((sum, friendProfile) => sum + friendProfile[key], 0);
    profile[key] = clampScore(total / friendProfiles.length);
    return profile;
  }, {} as VectorProfile);
}

export function calculateDimensionJohari(
  key: DimensionKey,
  ideal: VectorProfile,
  actual: VectorProfile,
  social: VectorProfile,
): DimensionJohariResult {
  const consciousGap = Math.abs(ideal[key] - actual[key]);
  const blindSpotGap = Math.abs(actual[key] - social[key]);
  const rawSeverity = Math.sqrt(consciousGap ** 2 + blindSpotGap ** 2);
  const severityPercentage = (rawSeverity / MAX_DISTANCE) * 100;

  let quadrant: QuadrantKey = 'aligned';

  if (consciousGap >= HIGH_GAP_THRESHOLD && blindSpotGap < HIGH_GAP_THRESHOLD) {
    quadrant = 'guilty-pleasure';
  } else if (consciousGap >= HIGH_GAP_THRESHOLD && blindSpotGap >= HIGH_GAP_THRESHOLD) {
    quadrant = 'total-disconnect';
  } else if (consciousGap < HIGH_GAP_THRESHOLD && blindSpotGap >= HIGH_GAP_THRESHOLD) {
    quadrant = 'true-blindspot';
  }

  return {
    key,
    consciousGap: Number(consciousGap.toFixed(2)),
    blindSpotGap: Number(blindSpotGap.toFixed(2)),
    rawSeverity: Number(rawSeverity.toFixed(2)),
    severityPercentage: Number(severityPercentage.toFixed(1)),
    quadrant,
  };
}

export function calculateJohariReport(
  userId: string,
  ideal: VectorProfile,
  actual: VectorProfile,
  social: VectorProfile,
  friendCount: number,
): JohariReport {
  const dimensions = dimensionOrder.reduce((results, key) => {
    results[key] = calculateDimensionJohari(key, ideal, actual, social);
    return results;
  }, {} as Record<DimensionKey, DimensionJohariResult>);

  const featuredDimensions = Object.values(dimensions)
    .sort((a, b) => b.rawSeverity - a.rawSeverity)
    .slice(0, 2);

  return {
    userId,
    friendCount,
    reportUnlocked: friendCount >= 2,
    dimensions,
    featuredDimensions,
  };
}

