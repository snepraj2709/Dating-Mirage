import { describe, expect, it } from 'vitest';
import { swipeStatements } from '../data/datingMirrorContent';
import {
  aggregateSocialProfile,
  baselineVector,
  buildActualProfile,
  buildFriendProfile,
} from './scoring';

describe('Dating Mirror scoring', () => {
  it('builds actual profile from weighted frequency answers', () => {
    const answers = {
      'CON-low': 'often',
      'CON-high': 'sometimes',
      'INT-high': 'always',
      'INT-low': 'never',
    } as const;

    const profile = buildActualProfile(answers, swipeStatements);

    expect(profile.CON).toBe(4.75);
    expect(profile.INT).toBe(7.75);
    expect(profile.AUT).toBe(5.5);
  });

  it('keeps never answers at baseline and supports legacy swipe drafts', () => {
    const neverAnswers = Object.fromEntries(swipeStatements.map((statement) => [statement.id, 'never'])) as Record<
      string,
      'never'
    >;
    const alwaysAnswers = Object.fromEntries(swipeStatements.map((statement) => [statement.id, 'always'])) as Record<
      string,
      'always'
    >;
    const legacyRightSwipes = Object.fromEntries(swipeStatements.map((statement) => [statement.id, 'right'])) as Record<
      string,
      'right'
    >;

    expect(buildActualProfile(neverAnswers, swipeStatements)).toEqual(baselineVector());
    expect(buildActualProfile(alwaysAnswers, swipeStatements)).toEqual(
      buildActualProfile(legacyRightSwipes, swipeStatements),
    );
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

  it('returns null when no friend profiles are available', () => {
    expect(aggregateSocialProfile([])).toBeNull();
  });
});
