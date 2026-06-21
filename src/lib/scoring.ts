import { dimensionOrder } from '../data/datingMirrorContent';
import type {
  ActualFrequencyValue,
  DimensionKey,
  IntrospectionCard,
  VectorProfile,
} from '../types/dating-mirror';

export const actualFrequencyWeights: Record<ActualFrequencyValue, number> = {
  never: 0,
  sometimes: 1 / 3,
  often: 2 / 3,
  always: 1,
};

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
  answers: Partial<Record<string, ActualFrequencyValue | 'left' | 'right'>>,
  statements: IntrospectionCard[],
): VectorProfile {
  const profile = baselineVector();

  statements.forEach((statement) => {
    const answer = answers[statement.id];
    const weight =
      answer === 'right'
        ? 1
        : answer === 'left'
          ? 0
          : answer
            ? actualFrequencyWeights[answer]
            : 0;

    if (weight === 0) {
      return;
    }

    profile[statement.key] = clampScore(profile[statement.key] + statement.scoreEffect * weight);
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
