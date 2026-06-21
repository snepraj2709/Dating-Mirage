import { useState } from 'react';
import { dimensions } from '../data/datingMirrorContent';
import { cn } from '../lib/utils';
import type { DimensionKey } from '../types/dating-mirror';

type JourneyStepId = 'ideal' | 'actual' | 'social' | 'pattern';
type VectorKey = 'ideal' | 'actual' | 'social';

interface JourneyInsight {
  title: string;
  body: string;
}

interface JourneyStep {
  id: JourneyStepId;
  title: string;
  navDescription: string;
  headline: string;
  body: string;
  visualTitle: string;
  activeVectors: VectorKey[];
  drawVector: VectorKey | 'all';
  insights: JourneyInsight[];
}

const JOURNEY_STEPS: JourneyStep[] = [
  {
    id: 'ideal',
    title: 'Ideal',
    navDescription: 'What you say you want.',
    headline: 'Ideal partner signals.',
    body:
      'The mirror starts with your stated standards. Instead of treating desire as a vague wishlist, it separates what you admire from what actually makes you feel safe, chosen, calm, wanted, or alive.',
    visualTitle: 'The baseline appears',
    activeVectors: ['ideal'],
    drawVector: 'ideal',
    insights: [
      {
        title: 'Attachment signal',
        body: 'Do they want closeness, space, chase, or steadiness?',
      },
      {
        title: 'Emotional rhythm',
        body: 'Is their ideal calm, intense, slow, or consuming?',
      },
      {
        title: 'Safety marker',
        body: 'What makes love feel stable instead of exciting-but-unsafe?',
      },
      {
        title: 'Baseline',
        body: 'Every later gap is measured against this line.',
      },
    ],
  },
  {
    id: 'actual',
    title: 'Actual',
    navDescription: 'Who your dating history shows.',
    headline: 'Compare the dream with the pattern.',
    body:
      'Your dating history shows where attraction behaves differently from intention. This step looks at the people you actually choose, tolerate, chase, wait for, explain, or keep returning to.',
    visualTitle: 'The history line appears',
    activeVectors: ['ideal', 'actual'],
    drawVector: 'actual',
    insights: [
      {
        title: 'Repeated pull',
        body: 'What kind of person keeps getting your attention?',
      },
      {
        title: 'Chemistry pattern',
        body: 'Where does excitement override your stated standards?',
      },
      {
        title: 'Tolerance zone',
        body: 'What behavior do you accept more often than you admit?',
      },
      {
        title: 'Gap signal',
        body: 'This reveals the guilty-pleasure pattern.',
      },
    ],
  },
  {
    id: 'social',
    title: 'Social',
    navDescription: 'What trusted people notice.',
    headline: 'Add the outside view.',
    body:
      'Friends often see the pattern before you do because they are not inside the chemistry. This layer captures what trusted observers notice when you like someone: whether you become calmer, smaller, reactive, unavailable, over-giving, or more yourself.',
    visualTitle: 'The social mirror enters',
    activeVectors: ['ideal', 'actual', 'social'],
    drawVector: 'social',
    insights: [
      {
        title: 'Outside pattern',
        body: 'What changes in you when you start liking someone?',
      },
      {
        title: 'Blind spot',
        body: 'What others can see that you explain away?',
      },
      {
        title: 'Social proof',
        body: 'The report uses patterns, not individual gossip.',
      },
      {
        title: 'Reality check',
        body: 'This reveals the true blind spot.',
      },
    ],
  },
  {
    id: 'pattern',
    title: 'Pattern Map',
    navDescription: 'The gap becomes visible.',
    headline: 'The gap becomes visible.',
    body:
      'The final mirror overlays desire, history, and social observation. Where the lines separate, the app names the pattern: what you know, what others see, what you hide, and what should not be scored.',
    visualTitle: 'The mirror is formed',
    activeVectors: ['ideal', 'actual', 'social'],
    drawVector: 'all',
    insights: [
      {
        title: 'Guilty pleasure',
        body: 'You know the mismatch, but still choose it.',
      },
      {
        title: 'Blind spot',
        body: 'Others see a pattern you cannot yet see.',
      },
      {
        title: 'Facade',
        body: 'Your private choices and public story differ.',
      },
      {
        title: 'Next move',
        body: 'The report turns the gap into one action.',
      },
    ],
  },
];

const vectorConfig: Record<
  VectorKey,
  {
    label: string;
    className: string;
    points: string;
  }
> = {
  ideal: {
    label: 'IDEAL',
    className: 'journey-vector-line--ideal',
    points: '28,54 96,42 166,61 236,44 332,56',
  },
  actual: {
    label: 'ACTUAL',
    className: 'journey-vector-line--actual',
    points: '28,92 96,113 166,83 236,119 332,98',
  },
  social: {
    label: 'SOCIAL',
    className: 'journey-vector-line--social',
    points: '28,130 96,119 166,138 236,106 332,128',
  },
};

const vectorOrder: VectorKey[] = ['ideal', 'actual', 'social'];

const miniRadarVectors: Record<VectorKey, Record<DimensionKey, number>> = {
  ideal: {
    CON: 8.6,
    INT: 3.2,
    AUT: 7.2,
    VAL: 2.9,
    GOC: 7.5,
    VUL: 6.6,
    REA: 2.8,
    RWO: 8.4,
  },
  actual: {
    CON: 3.0,
    INT: 8.8,
    AUT: 3.2,
    VAL: 6.7,
    GOC: 3.8,
    VUL: 4.8,
    REA: 7.2,
    RWO: 4.1,
  },
  social: {
    CON: 4.2,
    INT: 6.2,
    AUT: 5.6,
    VAL: 5.8,
    GOC: 5.8,
    VUL: 3.3,
    REA: 4.8,
    RWO: 6.8,
  },
};

const miniRadarSeries: Array<{
  key: VectorKey;
  label: string;
  className: string;
  pointClassName: string;
  dashed?: boolean;
}> = [
  {
    key: 'ideal',
    label: 'Ideal',
    className: 'journey-radar-series--ideal',
    pointClassName: 'journey-radar-point--ideal',
  },
  {
    key: 'actual',
    label: 'Actual',
    className: 'journey-radar-series--actual',
    pointClassName: 'journey-radar-point--actual',
  },
  {
    key: 'social',
    label: 'Social',
    className: 'journey-radar-series--social',
    pointClassName: 'journey-radar-point--social',
    dashed: true,
  },
];

const miniRadarSize = 420;
const miniRadarCenter = miniRadarSize / 2;
const miniRadarRadius = 112;
const miniRadarLabelRadius = 158;

function miniRadarAngle(index: number) {
  return -Math.PI / 2 + (index / dimensions.length) * Math.PI * 2;
}

function miniRadarPoint(index: number, radius: number) {
  const angle = miniRadarAngle(index);

  return {
    x: miniRadarCenter + Math.cos(angle) * radius,
    y: miniRadarCenter + Math.sin(angle) * radius,
  };
}

function miniRadarPointsFor(values: Record<DimensionKey, number>) {
  return dimensions.map((dimension, index) => {
    const valueRadius = ((values[dimension.key] - 1) / 9) * miniRadarRadius;

    return miniRadarPoint(index, valueRadius);
  });
}

function miniRadarPolygon(points: Array<{ x: number; y: number }>) {
  return points.map((point) => `${point.x},${point.y}`).join(' ');
}

function miniRadarClosedPolyline(points: Array<{ x: number; y: number }>) {
  return miniRadarPolygon([...points, points[0]]);
}

function MiniPatternRadar() {
  const ringPoints = [0.25, 0.5, 0.75, 1].map((scale) =>
    miniRadarPolygon(dimensions.map((_, index) => miniRadarPoint(index, miniRadarRadius * scale))),
  );

  return (
    <div className="journey-pattern-radar" aria-hidden="true">
      <svg className="mx-auto h-auto w-[min(52%,220px)] max-[620px]:w-[min(54%,180px)]" viewBox="0 0 420 390" role="img">
        <g className="journey-radar-grid">
          {ringPoints.map((points) => (
            <polygon fill="none" key={points} points={points} />
          ))}
          {dimensions.map((dimension, index) => {
            const point = miniRadarPoint(index, miniRadarRadius);

            return <line key={dimension.key} x1={miniRadarCenter} x2={point.x} y1={miniRadarCenter} y2={point.y} />;
          })}
        </g>

        <g className="journey-radar-gap-layer">
          <circle cx="292" cy="118" r="44" />
          <circle cx="166" cy="122" r="32" />
          <circle cx="150" cy="260" r="25" />
        </g>

        {miniRadarSeries.map((series) => {
          const points = miniRadarPointsFor(miniRadarVectors[series.key]);

          return (
            <g className="journey-radar-series" key={series.key}>
              <polygon
                className={cn('journey-radar-fill', series.className)}
                points={miniRadarPolygon(points)}
              />
              <polyline
                className={cn('journey-radar-line', series.className, series.dashed && 'journey-radar-line--dashed')}
                points={miniRadarClosedPolyline(points)}
              />
              {points.map((point, index) => (
                <circle
                  className={cn('journey-radar-point', series.pointClassName)}
                  cx={point.x}
                  cy={point.y}
                  key={`${series.key}-${dimensions[index].key}`}
                  r="4.8"
                />
              ))}
            </g>
          );
        })}

        <g className="journey-radar-labels">
          {dimensions.map((dimension, index) => {
            const point = miniRadarPoint(index, miniRadarLabelRadius);
            const horizontal = Math.cos(miniRadarAngle(index));
            const anchor = horizontal > 0.35 ? 'start' : horizontal < -0.35 ? 'end' : 'middle';
            const x = anchor === 'start' ? Math.min(point.x, 292) : anchor === 'end' ? Math.max(point.x, 116) : point.x;

            return (
              <text key={dimension.key} textAnchor={anchor} x={x} y={point.y}>
                {dimension.name}
              </text>
            );
          })}
        </g>
      </svg>

      <div className="journey-radar-legend">
        {miniRadarSeries.map((series) => (
          <span className="journey-radar-legend-item" key={series.key}>
            <span className={cn('journey-radar-legend-line', series.className, series.dashed && 'journey-radar-legend-line--dashed')} />
            {series.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function MiniVectorMap({ step }: { step: JourneyStep }) {
  if (step.id === 'pattern') {
    return <MiniPatternRadar />;
  }

  const activeVectorSet = new Set(step.activeVectors);
  const showActualGap = step.id === 'actual';
  const showSocialPulse = step.id === 'social';

  return (
    <div className="vector-mini-map" aria-hidden="true">
      <svg className="h-[clamp(112px,18svh,168px)] w-full max-[620px]:h-[92px]" viewBox="0 0 360 180" role="img">
        <defs>
          <linearGradient id="journey-gap-gradient" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#e83e8c" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#d6a63f" stopOpacity="0.04" />
          </linearGradient>
        </defs>
        <path
          className={cn('journey-gap-glow', showActualGap && 'journey-gap-glow--visible')}
          d="M88 46 C132 102 164 98 226 47 C242 82 258 112 320 97 C254 126 219 131 166 86 C130 118 104 115 88 46 Z"
          fill="url(#journey-gap-gradient)"
        />
        <circle
          className={cn('journey-social-pulse', showSocialPulse && 'journey-social-pulse--visible')}
          cx="166"
          cy="124"
          fill="none"
          r="31"
          stroke="#e83e8c"
        />
        <circle
          className="journey-map-complete"
          cx="248"
          cy="82"
          fill="none"
          r="52"
          stroke="#e83e8c"
        />

        {vectorOrder.map((vector) => {
          const isActive = activeVectorSet.has(vector);
          const isDrawing = step.drawVector === vector || step.drawVector === 'all';
          const showMotionCue = isDrawing && vector !== 'social';
          const config = vectorConfig[vector];

          return (
            <g key={`${step.id}-${vector}`}>
              <polyline
                className={cn(
                  'journey-vector-line',
                  config.className,
                  isActive ? 'journey-vector-line--active' : 'journey-vector-line--muted',
                  isDrawing && 'journey-vector-line--draw',
                )}
                points={config.points}
              />
              {showMotionCue && (
                <polyline
                  className={cn(
                    'journey-vector-line journey-vector-line--motion',
                    config.className,
                  )}
                  points={config.points}
                />
              )}
            </g>
          );
        })}
      </svg>

      <div className="grid grid-cols-3 gap-2 text-[0.72rem] font-medium uppercase tracking-normal text-subtle-foreground">
        {vectorOrder.map((vector) => (
          <span
            className={cn(vectorConfig[vector].className, activeVectorSet.has(vector) && 'text-foreground')}
            key={vector}
          >
            {vectorConfig[vector].label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function MirrorStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const selectedStep = JOURNEY_STEPS[activeStep];

  return (
    <section
      aria-labelledby="how-it-works-title"
      className="landing-section bg-[#fffaf6] py-[clamp(32px,5svh,48px)] max-[620px]:py-4"
      id="how-it-works"
    >
      <div className="landing-container grid h-full content-center gap-4 max-[620px]:gap-2.5">
        <header className="mx-auto grid max-w-[760px] justify-items-center text-center">
          <p
            className="m-0 text-[0.82rem] font-medium uppercase tracking-normal text-subtle-foreground max-[620px]:text-[0.72rem]"
            id="how-it-works-title"
          >
            How it works
          </p>
        </header>

        <div className="guided-journey journey-shell grid h-[min(660px,calc(100svh-126px))] overflow-hidden rounded-lg border border-border bg-white shadow-none min-[1021px]:grid-cols-[minmax(230px,280px)_minmax(0,1fr)_minmax(300px,0.84fr)] max-[1020px]:h-[calc(100svh-106px)] max-[1020px]:grid-rows-[auto_minmax(0,0.9fr)_minmax(0,1fr)] max-[1020px]:rounded-lg max-[620px]:h-[calc(100svh-62px)]">
          <aside className="journey-sidebar grid content-start gap-3 border-border bg-[#fff4f9] p-4 min-[1021px]:border-r max-[1020px]:border-b max-[620px]:gap-2 max-[620px]:p-3">
            <p className="m-0 px-1 text-[0.72rem] font-medium uppercase tracking-normal text-subtle-foreground max-[620px]:hidden">
              Build the mirror
            </p>
            <div
              aria-label="How your mirror gets formed steps"
              className="tablet-snap-row grid gap-2.5 max-[1020px]:pb-1"
              role="tablist"
            >
              {JOURNEY_STEPS.map((step, index) => {
                const isActive = index === activeStep;

                return (
                  <button
                    aria-controls="journey-step-panel"
                    aria-selected={isActive}
                    className={cn(
                      'tablet-snap-item journey-step group grid min-h-[92px] w-full grid-cols-[36px_minmax(0,1fr)] items-start gap-3 rounded-lg border bg-white/62 p-3 text-left transition-[background,border-color,box-shadow,transform] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-foreground max-[1020px]:min-h-[68px] max-[1020px]:w-[222px] max-[1020px]:items-center max-[1020px]:rounded-full max-[1020px]:p-3 max-[620px]:w-[210px] max-[620px]:grid-cols-[34px_minmax(0,1fr)]',
                      isActive
                        ? 'active border-primary bg-white'
                        : 'border-border text-muted-foreground hover:border-border-strong hover:bg-white',
                    )}
                    id={`journey-step-${step.id}`}
                    key={step.id}
                    onClick={() => setActiveStep(index)}
                    role="tab"
                    type="button"
                  >
                    <span
                      className={cn(
                        'grid size-9 place-items-center rounded-full text-[0.82rem] leading-none transition-colors max-[620px]:size-[34px]',
                        isActive ? 'bg-primary text-white' : 'bg-muted text-subtle-foreground group-hover:text-foreground',
                      )}
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="grid gap-1.5">
                      <span className={cn('text-[0.95rem] leading-tight text-foreground max-[620px]:text-[0.88rem]', !isActive && 'text-foreground/78')}>
                        {step.title}
                      </span>
                      <span className="text-[0.8rem] leading-[1.3] text-muted-foreground max-[620px]:text-[0.72rem]">{step.navDescription}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          <div
            aria-labelledby={`journey-step-${selectedStep.id}`}
            className="journey-main grid min-h-0 content-center border-border p-[clamp(20px,4vw,40px)] min-[1021px]:border-r max-[620px]:p-4"
            id="journey-step-panel"
            role="tabpanel"
            tabIndex={0}
          >
            <div className="journey-content-enter grid max-w-[560px] gap-4 max-[620px]:gap-2.5" key={selectedStep.id}>
              <h3 className="mb-0 text-[clamp(2rem,4vw,3.65rem)] leading-[0.98] tracking-normal text-foreground max-[620px]:text-[clamp(1.55rem,7vw,2rem)]">
                {selectedStep.headline}
              </h3>
              <p className="mb-0 text-[clamp(0.95rem,1.15vw,1.05rem)] leading-[1.55] text-muted-foreground max-[620px]:text-[0.84rem] max-[620px]:leading-[1.4]">
                {selectedStep.body}
              </p>
            </div>
          </div>

          <aside className="journey-visual-enter journey-visual-card grid min-h-0 content-center overflow-hidden">
            <div className="grid h-full min-h-0 content-center gap-3 overflow-hidden bg-white p-[clamp(18px,2.5vw,28px)] max-[620px]:gap-2 max-[620px]:p-3">
              <div className="grid gap-1.5">
                <p className="m-0 text-[0.76rem] font-medium uppercase tracking-normal text-subtle-foreground">
                  What changes on the map
                </p>
                <h3 className="mb-0 text-[clamp(1.18rem,1.7vw,1.5rem)] leading-tight text-foreground max-[620px]:text-[1.05rem]">
                  {selectedStep.visualTitle}
                </h3>
              </div>

              <MiniVectorMap step={selectedStep} />

              <div className="mobile-snap-row insight-grid grid grid-cols-2 gap-2.5 max-[620px]:grid-cols-none">
                {selectedStep.insights.map((insight) => (
                  <div className="mobile-snap-item insight-tile grid gap-1 rounded-lg border border-border bg-white p-3 max-[620px]:min-h-[96px]" key={insight.title}>
                    <h4 className="mb-0 text-[0.88rem] leading-tight text-foreground">{insight.title}</h4>
                    <p className="mb-0 text-[0.76rem] leading-[1.35] text-muted-foreground">{insight.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
