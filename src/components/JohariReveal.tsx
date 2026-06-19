import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Flame, Sparkles, Trash2 } from 'lucide-react';
import { dimensions, quadrantDetails } from '../data/datingMirrorContent';
import type { JohariReport, UserSession } from '../types/dating-mirror';
import { RadarChart } from './RadarChart';
import { ShareCard } from './ShareCard';
import { VerticalStoryCard } from './VerticalStoryCard';

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
  const topDimensionDetail = quadrantDetails[topDimension.quadrant];
  const topDimensionName = dimensionName(topDimension.key);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsPolishing(false), 3000);
    return () => window.clearTimeout(timeout);
  }, []);

  const screens = useMemo(
    () => [
      {
        eyebrow: 'Magnet',
        title: ' Your Mirror Analysis',
        body: `${report.friendCount} people fed the mirror. The loudest signal is ${dimensionName(
          topDimension.key,
        )}, which landed in ${quadrantDetails[topDimension.quadrant].title}.`,
      },
      {
        eyebrow: 'Mirage',
        title: 'Your stated ideal and your actual choices are not in sync.',
        body: `${topDimensionName} carries a ${topDimension.consciousGap.toFixed(
          1,
        )} self-gap. ${secondDimension ? `${dimensionName(secondDimension.key)} is right behind it.` : ''}`,
      },
      {
        eyebrow: 'Breakdown',
        title: 'Top two patterns.',
        body: 'The report features top two highest-tension dimensions and they are:',
      },
      {
        eyebrow: 'Next Move',
        title: 'For next 30-days.',
        body: nextMoveCopy(topDimension.key),
      },
      {
        eyebrow: 'Share',
        title: 'Export the analysis.',
        body: 'Share the analysis report on your socials.',
      },
    ],
    [report.friendCount, secondDimension, topDimension, topDimensionName],
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
        <article className={`story-panel ${screenIndex === 1 ? 'story-panel--mirage' : ''}`}>
          <div className="story-content">
            <p className="eyebrow">{current.eyebrow}</p>
            <h3>{current.title}</h3>
            <p>{current.body}</p>

            {screenIndex === 0 && (
              <RadarChart ideal={session.idealProfile} actual={session.actualProfile} social={session.socialProfile} />
            )}

            {screenIndex === 1 && (
              <VerticalStoryCard
                className="mirage-story-card"
                icon={<span className="vertical-story-card__emoji">{topDimensionDetail.icon}</span>}
                eyebrow="Screen 2 - The Mirage"
                title={`${topDimensionName}: ${topDimensionDetail.title}`}
                body={
                  <>
                    <p>
                      Self-gap: {topDimension.consciousGap.toFixed(1)}. Blind-spot gap:{' '}
                      {topDimension.blindSpotGap.toFixed(1)}.
                    </p>
                    <p>{topDimensionDetail.vibe}</p>
                  </>
                }
                meta={`${topDimension.severityPercentage}% tension`}
              />
            )}

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
          </div>

          <div className="story-actions">
            <button
              className="primary-button flow-continue"
              onClick={() => (canGoNext ? setScreenIndex((index) => index + 1) : setScreenIndex(0))}
            >
              {canGoNext ? 'Next' : 'Replay'}
              {canGoNext ? <ArrowRight size={18} /> : <Sparkles size={18} />}
            </button>
          </div>
        </article>

        <div className="story-progress" aria-label={`Reveal screen ${screenIndex + 1} of ${screens.length}`}>
          {screens.map((screen) => (
            <span key={screen.eyebrow} className={screen.eyebrow === current.eyebrow ? 'active' : ''} />
          ))}
        </div>
      </section>
    </main>
  );
}
