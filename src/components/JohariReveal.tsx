import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Flame, Sparkles, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CompactLoader } from '@/components/ui/flow';
import { Eyebrow } from '@/components/ui/pill';
import { Surface } from '@/components/ui/surface';
import { cn } from '@/lib/utils';
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
      <main className="mx-auto grid min-h-screen w-[min(1040px,calc(100%_-_32px))] place-items-center content-center gap-5 py-6 pb-14 text-center max-[620px]:w-[min(100%_-_24px,520px)]">
        <CompactLoader />
        <h2 className="text-[clamp(1.75rem,4vw,3rem)] leading-[1.05] text-foreground">Polishing your mirror...</h2>
      </main>
    );
  }

  return (
    <main className="mx-auto grid h-svh w-[min(1040px,calc(100%_-_32px))] grid-rows-[auto_minmax(0,1fr)] overflow-hidden py-3 max-[620px]:w-[min(100%_-_24px,520px)]">
      <div className="mb-2 flex min-h-9 items-center justify-between gap-4 opacity-70">
        <Button variant="ghostPill" size="compact" onClick={onBack}>
          <ArrowLeft size={18} />
          Back
        </Button>
        <Button variant="dangerGhost" size="compact" onClick={onBurnData}>
          <Trash2 size={17} />
          Burn My Data
        </Button>
      </div>

      <section className="grid min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-2">
        <Surface
          asChild
          className={cn(
            'relative min-h-0 overflow-hidden',
            screenIndex === 1 && 'p-[clamp(14px,2.4vh,24px)]',
          )}
        >
          <article>
          <div
            className={cn(
              'h-full min-h-0 overflow-auto pb-[calc(48px_+_clamp(24px,5vw,42px)_+_clamp(12px,2vh,18px))]',
              screenIndex === 1 && 'grid content-start gap-2 [&>h3]:mb-0 [&>h3]:text-[clamp(1rem,2.2vh,1.45rem)] [&>h3]:leading-[1.12] [&>p]:mb-0 [&>p]:text-[clamp(0.84rem,1.7vh,1rem)] [&>p]:leading-[1.35] [&_[data-slot=eyebrow]]:mb-0 [&_[data-slot=eyebrow]]:text-[clamp(0.72rem,1.5vh,0.88rem)]',
            )}
          >
            <Eyebrow>{current.eyebrow}</Eyebrow>
            <h3 className="text-xl leading-[1.2] text-foreground">{current.title}</h3>
            <p>{current.body}</p>

            {screenIndex === 0 && (
              <RadarChart ideal={session.idealProfile} actual={session.actualProfile} social={session.socialProfile} />
            )}

            {screenIndex === 1 && (
              <VerticalStoryCard
                className="my-2 w-[min(420px,100%,clamp(220px,calc((100svh_-_320px)*9/16),420px))] gap-[clamp(6px,1.2vh,12px)] p-[clamp(14px,2.2vh,24px)] [&_[data-slot=eyebrow]]:text-[clamp(0.72rem,1.5vh,0.88rem)] [&_[data-slot=story-card-body]]:gap-1.5 [&_[data-slot=story-card-body]_p]:text-[clamp(0.78rem,1.65vh,0.95rem)] [&_[data-slot=story-card-body]_p]:leading-[1.35] [&_[data-slot=story-card-icon]]:min-h-[clamp(20px,3vh,34px)] [&_[data-slot=story-card-meta]]:text-[clamp(0.85rem,1.8vh,1rem)] [&_h2]:text-[clamp(1.25rem,3.2vh,2rem)] [&_h2]:leading-[1.05]"
                icon={<span className="text-[clamp(1.2rem,3vh,1.7rem)] leading-none">{topDimensionDetail.icon}</span>}
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
              <div className="my-6 grid gap-3">
                {report.featuredDimensions.map((dimension) => {
                  const detail = quadrantDetails[dimension.quadrant];
                  return (
                    <Surface
                      asChild
                      className="grid grid-cols-[auto_1fr] items-start gap-3.5 p-[18px]"
                      key={dimension.key}
                      variant="muted"
                    >
                      <article>
                      <span className="text-3xl">{detail.icon}</span>
                      <div>
                        <h3 className="mb-2.5 text-xl leading-[1.2] text-foreground">{dimensionName(dimension.key)}</h3>
                        <p>{detail.vibe}</p>
                        <strong className="text-foreground">{dimension.severityPercentage}% tension</strong>
                      </div>
                      </article>
                    </Surface>
                  );
                })}
              </div>
            )}

            {screenIndex === 3 && (
              <Surface className="my-6 grid grid-cols-[auto_1fr] items-start gap-3.5 p-[18px]" variant="muted">
                <Flame size={28} />
                <p className="mb-0 text-[1.15rem] font-medium text-foreground">{nextMoveCopy(topDimension.key)}</p>
              </Surface>
            )}

            {screenIndex === 4 && <ShareCard report={report} />}
          </div>

          <div className="absolute bottom-[clamp(24px,5vw,42px)] right-[clamp(24px,5vw,42px)] flex w-[min(168px,calc(100%_-_(clamp(24px,5vw,42px)_*_2)))] justify-end">
            <Button
              size="flow"
              className="h-12 min-h-12 w-full px-[22px]"
              onClick={() => (canGoNext ? setScreenIndex((index) => index + 1) : setScreenIndex(0))}
            >
              {canGoNext ? 'Next' : 'Replay'}
              {canGoNext ? <ArrowRight size={18} /> : <Sparkles size={18} />}
            </Button>
          </div>
          </article>
        </Surface>

        <div className="grid grid-cols-5 gap-2 self-end" aria-label={`Reveal screen ${screenIndex + 1} of ${screens.length}`}>
          {screens.map((screen) => (
            <span
              key={screen.eyebrow}
              className={cn('h-2 rounded-full bg-muted', screen.eyebrow === current.eyebrow && 'bg-primary')}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
