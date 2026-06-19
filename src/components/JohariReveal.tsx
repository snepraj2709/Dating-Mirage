import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Flame, Sparkles, Trash2 } from 'lucide-react';
import { dimensions, quadrantDetails } from '../data/datingMirrorContent';
import type { JohariReport, UserSession } from '../types/dating-mirror';
import { JohariMatrix } from './JohariMatrix';
import { RadarChart } from './RadarChart';
import { ShareCard } from './ShareCard';

interface JohariRevealProps {
  report: JohariReport;
  session: UserSession;
  onBack: () => void;
  onBurnData: () => void;
}

function dimensionName(key: string) {
  return dimensions.find((dimension) => dimension.key === key)?.name ?? key;
}

function nextMoveCopy(key: string) {
  const copy: Record<string, string> = {
    CON: 'For 30 days, do not decode crumbs. Ask for the plan once, then watch the follow-through.',
    INT: 'For 30 days, let chemistry be evidence, not a verdict. No soulmate math before week three.',
    AUT: 'For 30 days, keep one standing friend plan even when someone new gets shiny.',
    VAL: 'For 30 days, ask whether you like how they treat you more than how impressive they look.',
    GOC: 'For 30 days, replace the silent spiral with one clean sentence about what bothered you.',
    VUL: 'For 30 days, reveal one real thing at a human pace instead of performing chill.',
    REA: 'For 30 days, wait 20 minutes before reacting to a cold text. Let your nervous system land first.',
    RWO: 'For 30 days, treat mixed signals as data, not a puzzle you have to win.',
  };

  return copy[key] ?? 'For 30 days, turn the mirror into one tiny repeatable action.';
}

export function JohariReveal({ report, session, onBack, onBurnData }: JohariRevealProps) {
  const [isPolishing, setIsPolishing] = useState(true);
  const [screenIndex, setScreenIndex] = useState(0);
  const topDimension = report.featuredDimensions[0];
  const secondDimension = report.featuredDimensions[1];

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsPolishing(false), 3000);
    return () => window.clearTimeout(timeout);
  }, []);

  const screens = useMemo(
    () => [
      {
        eyebrow: 'Screen 1 - The Magnet',
        title: ' Your Mirror Analysis',
        body: `${report.friendCount} people fed the mirror. The loudest signal is ${dimensionName(
          topDimension.key,
        )}, which landed in ${quadrantDetails[topDimension.quadrant].title}.`,
      },
      {
        eyebrow: 'Screen 2 - The Mirage',
        title: 'Your stated ideal and your actual choices are not always dating the same person.',
        body: `${dimensionName(topDimension.key)} carries a ${topDimension.consciousGap.toFixed(
          1,
        )} self-gap. ${secondDimension ? `${dimensionName(secondDimension.key)} is right behind it.` : ''}`,
      },
      {
        eyebrow: 'Screen 3 - The Breakdown',
        title: 'Top two patterns, no clinical jargon.',
        body: 'The report only features the highest-tension dimensions so the read stays sharp, not overwhelming.',
      },
      {
        eyebrow: 'Screen 4 - Next Move',
        title: 'Your 30-day micro-habit.',
        body: nextMoveCopy(topDimension.key),
      },
      {
        eyebrow: 'Screen 5 - The Share Card',
        title: 'Export the receipt.',
        body: 'Download a high-contrast card for Instagram, TikTok, or the group chat that already knew.',
      },
    ],
    [report.friendCount, secondDimension, topDimension],
  );

  const current = screens[screenIndex];
  const canGoNext = screenIndex < screens.length - 1;

  if (!session.idealProfile || !session.actualProfile || !session.socialProfile) {
    return null;
  }

  if (isPolishing) {
    return (
      <main className="reveal-loader">
        <div className="compact-loader" aria-hidden="true" />
        <h2>Polishing your mirror...</h2>
      </main>
    );
  }

  return (
    <main className="reveal-screen">
      <div className="flow-topbar">
        <button className="ghost-button" onClick={onBack}>
          <ArrowLeft size={18} />
          Back
        </button>
        <button className="ghost-button danger" onClick={onBurnData}>
          <Trash2 size={17} />
          Burn My Data
        </button>
      </div>

      <section className="story-shell">
        <div className="story-progress" aria-label={`Reveal screen ${screenIndex + 1} of ${screens.length}`}>
          {screens.map((screen) => (
            <span key={screen.eyebrow} className={screen.eyebrow === current.eyebrow ? 'active' : ''} />
          ))}
        </div>

        <article className="story-panel">
          <p className="eyebrow">{current.eyebrow}</p>
          <h3>{current.title}</h3>
          <p>{current.body}</p>

          {screenIndex === 0 && (
            <RadarChart ideal={session.idealProfile} actual={session.actualProfile} social={session.socialProfile} />
          )}

          {screenIndex === 1 && <JohariMatrix report={report} />}

          {screenIndex === 2 && (
            <div className="breakdown-list">
              {report.featuredDimensions.map((dimension) => {
                const detail = quadrantDetails[dimension.quadrant];
                return (
                  <article key={dimension.key}>
                    <span>{detail.icon}</span>
                    <div>
                      <h3>{dimensionName(dimension.key)}</h3>
                      <p>{detail.vibe}</p>
                      <strong>{dimension.severityPercentage}% tension</strong>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {screenIndex === 3 && (
            <div className="habit-card">
              <Flame size={28} />
              <p>{nextMoveCopy(topDimension.key)}</p>
            </div>
          )}

          {screenIndex === 4 && <ShareCard report={report} />}

          <button
            className="primary-button flow-continue"
            onClick={() => (canGoNext ? setScreenIndex((index) => index + 1) : setScreenIndex(0))}
          >
            {canGoNext ? 'Next reveal' : 'Replay reveal'}
            {canGoNext ? <ArrowRight size={18} /> : <Sparkles size={18} />}
          </button>
        </article>
      </section>
    </main>
  );
}
