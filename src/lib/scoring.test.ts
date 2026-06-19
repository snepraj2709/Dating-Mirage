import { describe, expect, it } from 'vitest';
import { swipeStatements } from '../data/datingMirrorContent';
import {
  aggregateSocialProfile,
  baselineVector,
  buildActualProfile,
  buildFriendProfile,
  calculateDimensionJohari,
  calculateJohariReport,
} from './scoring';

describe('Dating Mirror scoring', () => {
  it('builds actual profile from right swipes and keeps left swipes neutral', () => {
    const swipes = {
      'CON-low': 'right',
      'CON-high': 'left',
      'INT-high': 'right',
      'INT-low': 'left',
    } as const;

    const profile = buildActualProfile(swipes, swipeStatements);

    expect(profile.CON).toBe(3.25);
    expect(profile.INT).toBe(7.75);
    expect(profile.AUT).toBe(5.5);
  });

  it('aggregates completed friend profiles by dimension', () => {
    const social = aggregateSocialProfile([
      buildFriendProfile({
        CON: 1,
        INT: 10,
        AUT: 1,
        VAL: 10,
        GOC: 1,
        VUL: 10,
        REA: 10,
        RWO: 1,
      }),
      buildFriendProfile({
        CON: 10,
        INT: 10,
        AUT: 10,
        VAL: 10,
        GOC: 10,
        VUL: 10,
        REA: 1,
        RWO: 10,
      }),
    ]);

    expect(social).toMatchObject({
      CON: 5.5,
      INT: 10,
      AUT: 5.5,
      VAL: 10,
      GOC: 5.5,
      VUL: 10,
      REA: 5.5,
      RWO: 5.5,
    });
  });

  it('classifies dimensions using the V1 Johari threshold', () => {
    const ideal = baselineVector(9);
    const actual = baselineVector(5.5);
    const social = baselineVector(5.5);

    expect(calculateDimensionJohari('CON', ideal, actual, social).quadrant).toBe('guilty-pleasure');

    actual.CON = 9;
    social.CON = 3;
    expect(calculateDimensionJohari('CON', ideal, actual, social).quadrant).toBe('true-blindspot');

    actual.CON = 4;
    social.CON = 9;
    expect(calculateDimensionJohari('CON', ideal, actual, social).quadrant).toBe('total-disconnect');

    actual.CON = 8;
    social.CON = 8;
    expect(calculateDimensionJohari('CON', ideal, actual, social).quadrant).toBe('aligned');
  });

  it('returns only the top two featured report dimensions', () => {
    const ideal = baselineVector(10);
    const actual = baselineVector(10);
    const social = baselineVector(10);

    actual.CON = 1;
    social.CON = 10;
    actual.INT = 3;
    social.INT = 9;
    actual.AUT = 8;
    social.AUT = 8;

    const report = calculateJohariReport('user-1', ideal, actual, social, 2);

    expect(report.reportUnlocked).toBe(true);
    expect(report.featuredDimensions).toHaveLength(2);
    expect(report.featuredDimensions.map((dimension) => dimension.key)).toEqual(['CON', 'INT']);
  });
});

