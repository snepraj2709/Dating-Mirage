import { ArrowRight, FlagTriangleRight, Lightbulb } from 'lucide-react';
import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { dimensions } from '@/data/datingMirrorContent';
import { cn } from '@/lib/utils';
import type { DimensionKey, VectorProfile } from '@/types/dating-mirror';
import { Button } from '@/components/ui/button';
import { ContentBand } from '@/components/ui/section';
import { Surface } from '@/components/ui/surface';

type PatternLensKey = 'all' | 'guilty' | 'blindSpot' | 'facade';
type VectorKey = 'ideal' | 'actual' | 'social';

interface MapAnalysisSectionProps {
  onStart: () => void;
}

interface RadarPoint {
  x: number;
  y: number;
}

interface GapHighlight {
  key: DimensionKey;
  from: RadarPoint;
  to: RadarPoint;
  delay: number;
}

const chartWidth = 560;
const chartHeight = 500;
const centerX = chartWidth / 2;
const centerY = 250;
const radius = 148;
const labelRadius = 207;
const autoplayDelayMs = 4500;

const vectorKeys: VectorKey[] = ['ideal', 'actual', 'social'];
const lensStoryOrder: PatternLensKey[] = ['all', 'facade', 'blindSpot', 'guilty'];

const demoVectors: Record<VectorKey, VectorProfile> = {
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

const seriesConfig: Record<
  VectorKey,
  {
    stroke: string;
    fill: string;
    delay: number;
  }
> = {
  ideal: {
    stroke: '#d6a63f',
    fill: 'rgba(214, 166, 63, 0.16)',
    delay: 120,
  },
  actual: {
    stroke: '#2563eb',
    fill: 'rgba(37, 99, 235, 0.13)',
    delay: 520,
  },
  social: {
    stroke: '#4a2815',
    fill: 'rgba(74, 40, 21, 0.1)',
    delay: 920,
  },
};

const radarLegend: Array<{
  key: VectorKey;
  label: string;
  strokeWidth: number;
  dashed?: boolean;
}> = [
  {
    key: 'ideal',
    label: 'Ideal',
    strokeWidth: 4,
  },
  {
    key: 'actual',
    label: 'Actual',
    strokeWidth: 4,
  },
  {
    key: 'social',
    label: 'Social',
    strokeWidth: 3.5,
    dashed: true,
  },
];

const lensContent: Record<
  PatternLensKey,
  {
    tab: string;
    title: string;
    body: string[];
    action?: string;
    cta?: string;
    cueLabels?: string[];
  }
> = {
  all: {
    tab: 'All',
    title: 'Where the lines separate',
    body: [
      'The emotional truth is not inside one line.',
      'It lives in the distance between the lines.',
    ],
    cta: 'Show me my biggest gap',
  },
  guilty: {
    tab: 'Guilty pleasure',
    title: 'The choice you know is not aligned',
    body: [
      'You say you want calm, consistency, and emotional safety.',
      'But your dating pattern shows that intensity pulls your attention more than calm.'
    ],
    action:
      'Before the next date, write down 3 signals of emotional safety and look for them before chemistry.',
    cueLabels: [
      'Strong pull toward intense behaviors',
      "Don't stay for consistency",
      'Hard time establishing autonomy within the relationship',
    ],
  },
  blindSpot: {
    tab: 'Blind spot',
    title: 'The pattern others see before you do',
    body: [
      'You believe your choices match your standards.',
      'But your social circle notice a different emotional pattern.',
      'The Attraction might feel intense to you, but the patterns is obvious to a person outside the whirlwind of your emotional rollercoaster.',
    ],
    action:
      'Ask a close friend: "When I like someone, what do I start tolerating that I normally wouldn\'t?"',
  },
  facade: {
    tab: 'Facade',
    title: 'The version you live vs. the version people see',
    body: [
      'Your dating choices show one pattern.',
      'But your friends see a different pattern.',
      'You may look composed from the outside, while privately you are over-accommodating, waiting, explaining, or self-doubting.',
    ],
    action:
      'Before you hide a dating problem from your friends, pause. The urge to hide itself is a signal.',
  },
};

const activeLensButtonClassName = 'bg-[#fff1fb] text-[#95179b] shadow-[0_10px_28px_rgba(149,23,155,0.1)]';

function angleFor(index: number) {
  return -Math.PI / 2 + (index / dimensions.length) * Math.PI * 2;
}

function pointAt(index: number, pointRadius: number): RadarPoint {
  const angle = angleFor(index);
  return {
    x: centerX + Math.cos(angle) * pointRadius,
    y: centerY + Math.sin(angle) * pointRadius,
  };
}

function pointsForProfile(profile: VectorProfile) {
  return dimensions.map((dimension, index) => {
    const valueRadius = ((profile[dimension.key] - 1) / 9) * radius;
    return pointAt(index, valueRadius);
  });
}

function polygonPoints(points: RadarPoint[]) {
  return points.map((point) => `${point.x},${point.y}`).join(' ');
}

function pathForPoints(points: RadarPoint[]) {
  const [firstPoint, ...restPoints] = points;
  return `M ${firstPoint.x} ${firstPoint.y} ${restPoints.map((point) => `L ${point.x} ${point.y}`).join(' ')} Z`;
}

function bridgePath(firstPoints: RadarPoint[], secondPoints: RadarPoint[]) {
  return pathForPoints([...firstPoints, ...secondPoints.slice().reverse()]);
}

function labelAnchor(index: number) {
  const horizontalPosition = Math.cos(angleFor(index));

  if (horizontalPosition > 0.35) {
    return 'start';
  }

  if (horizontalPosition < -0.35) {
    return 'end';
  }

  return 'middle';
}

function pairForLens(lens: PatternLensKey): [VectorKey, VectorKey] {
  if (lens === 'blindSpot') {
    return ['ideal', 'social'];
  }

  if (lens === 'facade') {
    return ['actual', 'social'];
  }

  return ['ideal', 'actual'];
}

function getSeriesOpacity(lens: PatternLensKey, series: VectorKey) {
  if (lens === 'all') {
    return series === 'social' ? 0.64 : 0.72;
  }

  const activePair = pairForLens(lens);
  return activePair.includes(series) ? 0.96 : 0.18;
}

function getFillOpacity(lens: PatternLensKey, series: VectorKey) {
  if (lens === 'all') {
    return series === 'social' ? 0.08 : 0.1;
  }

  const activePair = pairForLens(lens);
  return activePair.includes(series) ? 0.13 : 0.025;
}

function getGapColor(lens: PatternLensKey) {
  if (lens === 'blindSpot') {
    return '#d946ef';
  }

  if (lens === 'facade') {
    return '#6b7280';
  }

  return '#f59e0b';
}

function strongestDimensions(first: VectorKey, second: VectorKey, count: number) {
  return dimensions
    .map((dimension) => ({
      key: dimension.key,
      name: dimension.name,
      gap: Math.abs(demoVectors[first][dimension.key] - demoVectors[second][dimension.key]),
    }))
    .sort((a, b) => b.gap - a.gap)
    .slice(0, count);
}

function getHighlights(lens: PatternLensKey, pointsBySeries: Record<VectorKey, RadarPoint[]>): GapHighlight[] {
  const pair = pairForLens(lens);
  const count = lens === 'all' ? 2 : 3;
  return strongestDimensions(pair[0], pair[1], count).map((dimension, index) => {
    const dimensionIndex = dimensions.findIndex((item) => item.key === dimension.key);
    return {
      key: dimension.key,
      from: pointsBySeries[pair[0]][dimensionIndex],
      to: pointsBySeries[pair[1]][dimensionIndex],
      delay: 1180 + index * 120,
    };
  });
}

function RadarLensScene({ activeLens }: { activeLens: PatternLensKey }) {
  const gridRings = useMemo(() => [0.25, 0.5, 0.75, 1], []);
  const pointsBySeries = useMemo<Record<VectorKey, RadarPoint[]>>(
    () => ({
      ideal: pointsForProfile(demoVectors.ideal),
      actual: pointsForProfile(demoVectors.actual),
      social: pointsForProfile(demoVectors.social),
    }),
    [],
  );
  const highlights = useMemo(() => getHighlights(activeLens, pointsBySeries), [activeLens, pointsBySeries]);
  const gapColor = getGapColor(activeLens);
  const socialPath = pathForPoints(pointsBySeries.social);
  const facadeRevealPath = bridgePath(pointsBySeries.actual, pointsBySeries.social);

  return (
    <figure
      className="map-radar-shell m-0 grid min-h-[460px] content-center justify-items-center overflow-hidden rounded-lg bg-[#fbfbfb] px-4 py-5 max-[620px]:min-h-[238px] max-[620px]:px-2 max-[620px]:py-2"
      aria-label="Animated radar map comparing stated preference, actual choices, and friend-observed patterns"
    >
      <svg
        className="h-[min(42svh,420px)] w-auto max-w-full overflow-visible max-[620px]:h-[210px]"
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        role="img"
      >
        <title>Pattern lens radar comparing ideal, actual, and social dating signals</title>
        <defs>
          <filter id="map-analysis-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <mask id="map-analysis-social-mask">
            <path
              key={`social-mask-${activeLens}`}
              className="map-radar-mask-path"
              d={socialPath}
              fill="none"
              pathLength={1}
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="14"
              style={{ '--draw-delay': `${seriesConfig.social.delay}ms` } as CSSProperties}
            />
          </mask>
        </defs>

        {gridRings.map((ring) => (
          <polygon
            key={ring}
            points={polygonPoints(dimensions.map((_, index) => pointAt(index, radius * ring)))}
            fill="none"
            stroke="#e8e4dc"
            strokeWidth="1"
          />
        ))}

        {dimensions.map((dimension, index) => {
          const axisPoint = pointAt(index, radius);
          const labelPoint = pointAt(index, labelRadius);
          return (
            <g key={dimension.key}>
              <line
                x1={centerX}
                y1={centerY}
                x2={axisPoint.x}
                y2={axisPoint.y}
                stroke="#e8e4dc"
                strokeWidth="1"
              />
              <text
                className="fill-muted-foreground text-[0.8rem] font-medium max-[620px]:text-[0.68rem]"
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor={labelAnchor(index)}
                dominantBaseline="middle"
              >
                {dimension.name}
              </text>
            </g>
          );
        })}

        {activeLens === 'facade' && (
          <g className="map-facade-reveal" filter="url(#map-analysis-glow)">
            <path d={facadeRevealPath} fill="rgba(17, 17, 17, 0.08)" stroke="none" />
          </g>
        )}

        {highlights.map((highlight) => {
          return (
            <g key={`${activeLens}-${highlight.key}`}>
              <line
                className={cn(
                  'map-gap-line',
                  activeLens === 'blindSpot' && 'map-gap-line--pulse',
                  activeLens === 'facade' && 'map-gap-line--hidden',
                )}
                x1={highlight.from.x}
                y1={highlight.from.y}
                x2={highlight.to.x}
                y2={highlight.to.y}
                stroke={gapColor}
                strokeLinecap="round"
                strokeWidth={activeLens === 'blindSpot' || activeLens === 'all' ? 10 : 8}
                filter="url(#map-analysis-glow)"
                style={{ '--gap-delay': `${highlight.delay}ms` } as CSSProperties}
              />
            </g>
          );
        })}

        {vectorKeys.map((series) => {
          const config = seriesConfig[series];
          const path = pathForPoints(pointsBySeries[series]);
          const isSocial = series === 'social';
          const seriesStyle = {
            '--series-stroke': config.stroke,
            '--series-fill': config.fill,
            '--series-opacity': getSeriesOpacity(activeLens, series),
            '--series-fill-opacity': getFillOpacity(activeLens, series),
            '--draw-delay': `${config.delay}ms`,
          } as CSSProperties;

          return (
            <g
              key={`${activeLens}-${series}`}
              className="map-radar-series"
              style={seriesStyle}
            >
              <path className="map-radar-fill" d={path} fill={config.fill} stroke="none" />
              <g mask={isSocial ? 'url(#map-analysis-social-mask)' : undefined}>
                <path
                  className={cn('map-radar-stroke', isSocial ? 'map-radar-stroke--dashed' : 'map-radar-stroke--draw')}
                  d={path}
                  fill="none"
                  pathLength={isSocial ? undefined : 1}
                  stroke={config.stroke}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={isSocial ? '10 9' : undefined}
                  strokeWidth={isSocial ? 3.5 : 4}
                />
                {pointsBySeries[series].map((point, index) => (
                  <circle
                    className="map-radar-point"
                    key={`${series}-${dimensions[index].key}`}
                    cx={point.x}
                    cy={point.y}
                    r={activeLens === 'all' ? 4.5 : 5.5}
                    fill={config.stroke}
                  />
                ))}
              </g>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-2 flex w-full flex-nowrap items-center justify-center gap-x-5 px-2 text-[0.76rem] font-medium text-muted-foreground max-[620px]:mt-0 max-[620px]:gap-x-3 max-[620px]:text-[0.66rem]">
        {radarLegend.map((item) => (
          <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap" key={item.key}>
            <i
              className={cn('block h-0 w-6 max-[620px]:w-4', item.dashed && 'border-dashed')}
              style={{
                borderColor: seriesConfig[item.key].stroke,
                borderTopWidth: item.strokeWidth,
              }}
              aria-hidden="true"
            />
            <span className="text-foreground">{item.label}</span>
          </span>
        ))}
      </figcaption>
    </figure>
  );
}

export function MapAnalysisSection({ onStart }: MapAnalysisSectionProps) {
  const [activeLens, setActiveLens] = useState<PatternLensKey>('all');
  const [isAutoplaying, setIsAutoplaying] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const activeContent = lensContent[activeLens];

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
      if (mediaQuery.matches) {
        setIsAutoplaying(false);
      }
    };

    updateMotionPreference();
    mediaQuery.addEventListener('change', updateMotionPreference);

    return () => {
      mediaQuery.removeEventListener('change', updateMotionPreference);
    };
  }, []);

  useEffect(() => {
    if (!isAutoplaying || prefersReducedMotion) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveLens((currentLens) => {
        const currentIndex = lensStoryOrder.indexOf(currentLens);
        return lensStoryOrder[(currentIndex + 1) % lensStoryOrder.length];
      });
    }, autoplayDelayMs);

    return () => {
      window.clearInterval(timer);
    };
  }, [isAutoplaying, prefersReducedMotion]);

  const handleLensSelect = (lens: PatternLensKey) => {
    setActiveLens(lens);
    setIsAutoplaying(false);
  };

  return (
    <ContentBand className="grid content-center gap-4 py-[clamp(34px,6svh,56px)] max-[620px]:content-start max-[620px]:gap-3 max-[620px]:py-5" id="map-analysis">
      <div className="grid gap-4 max-[620px]:gap-3">
        <div className="flex items-end justify-between gap-4 max-[620px]:grid max-[620px]:gap-2">
          <h2 className="mb-0 text-[clamp(1.65rem,3.6vw,2.65rem)] leading-[1.05] tracking-normal text-foreground max-[620px]:text-[1.45rem]">
            Map Analysis
          </h2>
          <div
            aria-label="Pattern lenses"
            className="landing-snap-row flex-nowrap gap-2.5 max-[620px]:gap-2"
            role="tablist"
          >
            {lensStoryOrder.map((lens) => {
              const isActive = activeLens === lens;
              return (
                <button
                  aria-selected={isActive}
                  className={cn(
                    'landing-snap-item group relative inline-flex min-h-[44px] items-center justify-center overflow-hidden rounded-lg px-4 py-2 text-left text-[0.92rem] font-medium transition-[background,color,transform,box-shadow] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground active:scale-[0.98] max-[620px]:min-h-[38px] max-[620px]:px-3 max-[620px]:text-[0.78rem]',
                    isActive
                      ? activeLensButtonClassName
                      : 'bg-card text-muted-foreground hover:-translate-y-0.5 hover:bg-muted hover:text-foreground',
                  )}
                  key={lens}
                  onClick={() => handleLensSelect(lens)}
                  role="tab"
                  type="button"
                >
                  <span className="leading-[1.1]">{lensContent[lens].tab}</span>
                  {isActive && isAutoplaying && !prefersReducedMotion && (
                    <span
                      className={cn(
                        'map-lens-progress absolute inset-x-3 bottom-1 h-1 origin-left rounded-full',
                        'bg-[#e83e8c]',
                      )}
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-[minmax(0,1.12fr)_minmax(300px,0.88fr)] items-stretch gap-4 max-[980px]:grid-cols-1 max-[620px]:gap-3">
          <Surface className="overflow-hidden p-0" aria-live="polite">
            <RadarLensScene activeLens={activeLens} />
          </Surface>

          <Surface asChild className="grid content-start gap-4 p-[clamp(18px,2.4vw,24px)] max-[620px]:gap-3 max-[620px]:p-4" aria-live="polite">
            <aside>
              <div className="map-insight-enter grid content-start gap-4 max-[620px]:gap-3" key={activeLens}>
                <h3 className="mb-0 text-[clamp(1.35rem,2.4vw,1.9rem)] leading-[1.08] text-foreground max-[620px]:text-[1.15rem]">
                  {activeContent.title}
                </h3>

                <div
                  className="mobile-snap-row grid gap-2.5 max-[620px]:grid-cols-none"
                  aria-label="Map analysis details"
                  tabIndex={0}
                >
                  <ul className="mobile-snap-item m-0 grid list-none gap-1.5 rounded-md bg-card p-3 text-[0.9rem] leading-[1.38] text-muted-foreground shadow-none max-[620px]:min-h-[116px]">
                    {activeContent.body.map((paragraph) => (
                      <li className="grid grid-cols-[auto_1fr] gap-2" key={paragraph}>
                        <span aria-hidden="true">-</span>
                        <span>{paragraph}</span>
                      </li>
                    ))}
                  </ul>

                  {activeContent.cueLabels && (
                    <div className="mobile-snap-item grid gap-2.5 rounded-md bg-red-50 px-3 py-3 text-red-950 shadow-none max-[620px]:min-h-[116px]">
                      <FlagTriangleRight className="text-red-500" size={20} aria-hidden="true" />
                      <ul className="m-0 grid list-none gap-1.5 p-0 text-[0.88rem] font-medium leading-[1.32]">
                        {activeContent.cueLabels.map((label) => (
                          <li className="grid grid-cols-[auto_1fr] gap-2" key={label}>
                            <span aria-hidden="true">-</span>
                            <span>{label}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeContent.action && (
                    <div className="mobile-snap-item grid gap-2 rounded-md bg-amber-50 px-3 py-3 text-[#6f4a00] shadow-none max-[620px]:min-h-[116px]">
                      <span className="inline-flex items-center gap-2 text-[0.8rem] font-medium uppercase">
                        <Lightbulb className="shrink-0 text-amber-500" size={17} aria-hidden="true" />
                        Tip
                      </span>
                      <p className="mb-0 text-[0.9rem] font-medium leading-[1.4] text-[#6f4a00]">{activeContent.action}</p>
                    </div>
                  )}

                  {activeContent.cta && (
                    <div className="mobile-snap-item grid content-center max-[620px]:min-h-[116px]">
                      <Button className="w-fit max-[620px]:w-full" onClick={onStart}>
                        {activeContent.cta}
                        <ArrowRight size={18} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </Surface>
        </div>
      </div>
    </ContentBand>
  );
}
