import {
  Activity,
  ArrowRight,
  Brain,
  CalendarCheck,
  Compass,
  Flame,
  Heart,
  MessageCircle,
  ShieldCheck,
  Target,
  Trophy,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useMemo, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { dimensions } from '@/data/datingMirrorContent';
import dummyReportJson from '@/data/dummy-llm-report.json';
import { cn } from '@/lib/utils';
import type { DiagnosticReportSection, DimensionKey, MirrorReport, VectorProfile } from '@/types/dating-mirror';
import { Button } from '@/components/ui/button';
import { Pill } from '@/components/ui/pill';
import { ContentBand } from '@/components/ui/section';
import { Surface } from '@/components/ui/surface';

type PatternLensKey = 'all' | 'guilty' | 'blindSpot' | 'facade' | 'deepVoid';
type DiagnosticLensKey = Exclude<PatternLensKey, 'all'>;
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

interface DiagnosticReadItem {
  key: keyof MirrorReport['diagnostic_matrix'];
  label: string;
  icon: LucideIcon;
  section: DiagnosticReportSection;
}

interface DiagnosticLensContent extends DiagnosticReadItem {
  lens: DiagnosticLensKey;
  tab: string;
  description: string;
}

const chartWidth = 720;
const chartHeight = 590;
const centerX = chartWidth / 2;
const centerY = chartHeight / 2;
const radius = 150;
const orbitRadius = 218;
const orbitLabelOffset = 34;
const autoplayDelayMs = 4500;

const vectorKeys: VectorKey[] = ['ideal', 'actual', 'social'];
const lensStoryOrder: PatternLensKey[] = ['all', 'facade', 'blindSpot', 'guilty', 'deepVoid'];
const diagnosticReadOrder: DiagnosticLensKey[] = ['facade', 'guilty', 'blindSpot', 'deepVoid'];
const dummyReport = dummyReportJson as MirrorReport;
const { shareable_card: demoShareableCard, diagnostic_matrix: demoDiagnosticMatrix } = dummyReport;

const allLensContent = {
  tab: 'All',
  title: 'The four strongest reads',
  cta: 'Show me my biggest gap',
};

const diagnosticLensContent: Record<DiagnosticLensKey, DiagnosticLensContent> = {
  facade: {
    lens: 'facade',
    key: 'facade',
    tab: 'Facade',
    label: 'Facade',
    icon: ShieldCheck,
    description: 'You know where you are settling or over-accommodating, but pretend otherwise to your friends.',
    section: demoDiagnosticMatrix.facade,
  },
  guilty: {
    lens: 'guilty',
    key: 'guilty_pleasure',
    tab: 'Guilty pleasure',
    label: 'Guilty Pleasure',
    icon: Flame,
    description: 'You know you hate it but you still do it, and your friends also know you do this.',
    section: demoDiagnosticMatrix.guilty_pleasure,
  },
  blindSpot: {
    lens: 'blindSpot',
    key: 'blindspots',
    tab: 'Blind spot',
    label: 'Blind Spot',
    icon: Target,
    description: 'You believe your choices align with your standards, but your friends see a different pattern.',
    section: demoDiagnosticMatrix.blindspots,
  },
  deepVoid: {
    lens: 'deepVoid',
    key: 'deep_void',
    tab: 'Deep Void',
    label: 'Deep Void',
    icon: Brain,
    description:
      'A deeper psychological layer that neither you nor your friends can reliably observe through surface behavior.',
    section: demoDiagnosticMatrix.deep_void,
  },
};

const strongestReadItems: DiagnosticReadItem[] = diagnosticReadOrder.map((lens) => diagnosticLensContent[lens]);

const dimensionIconMap: Record<DimensionKey, LucideIcon> = {
  CON: CalendarCheck,
  INT: Zap,
  AUT: Compass,
  VAL: Trophy,
  GOC: MessageCircle,
  VUL: Heart,
  REA: Activity,
  RWO: ShieldCheck,
};

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
    stroke: '#2f9e44',
    fill: 'rgba(47, 158, 68, 0.16)',
    delay: 120,
  },
  actual: {
    stroke: '#d94841',
    fill: 'rgba(217, 72, 65, 0.14)',
    delay: 520,
  },
  social: {
    stroke: '#f59e0b',
    fill: 'rgba(245, 158, 11, 0.12)',
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
    label: 'Friend Feedback',
    strokeWidth: 3.5,
    dashed: true,
  },
];

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

function labelPointAt(index: number): RadarPoint {
  const angle = angleFor(index);
  const nodePoint = pointAt(index, orbitRadius);

  return {
    x: nodePoint.x + Math.cos(angle) * orbitLabelOffset,
    y: nodePoint.y + Math.sin(angle) * (orbitLabelOffset - 4),
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

function orbitHitRect(index: number, nodePoint: RadarPoint, labelPoint: RadarPoint) {
  const anchor = labelAnchor(index);
  const width = anchor === 'middle' ? 190 : 210;
  const x = anchor === 'start' ? nodePoint.x - 34 : anchor === 'end' ? nodePoint.x - width + 34 : nodePoint.x - width / 2;
  const y = Math.min(nodePoint.y, labelPoint.y) - 28;
  const height = Math.abs(nodePoint.y - labelPoint.y) + 56;

  return { height, width, x, y };
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
    return seriesConfig.social.stroke;
  }

  if (lens === 'facade') {
    return '#111111';
  }

  return seriesConfig.actual.stroke;
}

function dimensionGapRankings(first: VectorKey, second: VectorKey) {
  return dimensions
    .map((dimension, index) => ({
      key: dimension.key,
      name: dimension.name,
      index,
      gap: Math.abs(demoVectors[first][dimension.key] - demoVectors[second][dimension.key]),
    }))
    .sort((a, b) => b.gap - a.gap);
}

function strongestDimensions(first: VectorKey, second: VectorKey, count: number) {
  return dimensionGapRankings(first, second).slice(0, count);
}

function defaultDimensionForLens(lens: PatternLensKey): DimensionKey {
  const pair = pairForLens(lens);
  return strongestDimensions(pair[0], pair[1], 1)[0]?.key ?? dimensions[0].key;
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

function getHighlightForDimension(
  lens: PatternLensKey,
  dimensionKey: DimensionKey,
  pointsBySeries: Record<VectorKey, RadarPoint[]>,
  delay: number,
): GapHighlight {
  const pair = pairForLens(lens);
  const dimensionIndex = dimensions.findIndex((dimension) => dimension.key === dimensionKey);

  return {
    key: dimensionKey,
    from: pointsBySeries[pair[0]][dimensionIndex],
    to: pointsBySeries[pair[1]][dimensionIndex],
    delay,
  };
}

function dimensionName(key: DimensionKey) {
  return dimensions.find((dimension) => dimension.key === key)?.name ?? key;
}

function EvidencePills({ dimensionKeys }: { dimensionKeys: DimensionKey[] }) {
  return (
    <div className="flex min-w-0 flex-wrap gap-1">
      {dimensionKeys.map((dimensionKey) => (
        <Pill
          className="max-w-full border-border/70 bg-muted/70 px-2 py-0.5 text-center text-[0.64rem] leading-tight tracking-normal text-muted-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),0_8px_18px_rgba(17,17,17,0.08)] backdrop-blur-xl"
          key={dimensionKey}
        >
          {dimensionName(dimensionKey)}
        </Pill>
      ))}
    </div>
  );
}

function StrongestReadsPanel({ cta, onStart }: { cta?: string; onStart: () => void }) {
  return (
    <div className="grid gap-2.5 max-[620px]:grid-cols-none" aria-label="Map analysis details" tabIndex={0}>
      <section className="mobile-snap-item grid gap-1.5 rounded-md bg-[#fff7fb] p-3 shadow-none max-[620px]:min-h-[116px]">
        <span className="text-[0.74rem] font-medium uppercase tracking-normal text-primary">Core conflict</span>
        <p className="mb-0 text-[0.9rem] font-medium leading-[1.35] text-foreground">
          {demoShareableCard.core_conflict}
        </p>
      </section>

      <div className="mobile-snap-item grid gap-2 rounded-md bg-card p-3 shadow-none max-[620px]:min-h-[116px]">
        {strongestReadItems.map(({ key, label, icon: Icon, section }, index) => (
          <article className="grid gap-2" key={key}>
            {index > 0 && <div className="h-px bg-border" aria-hidden="true" />}
            <div className="grid grid-cols-[auto_1fr] gap-2.5">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                <Icon size={14} aria-hidden="true" />
              </span>
              <div className="grid min-w-0 gap-1.5">
                <div>
                  <h4 className="mb-0 text-[0.88rem] leading-[1.14] text-foreground">{label}</h4>
                </div>
                <p className="mb-0 text-[0.78rem] leading-[1.28] text-muted-foreground">{section.insight}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {cta && (
        <div className="mobile-snap-item grid content-center max-[620px]:min-h-[116px]">
          <Button className="w-fit max-[620px]:w-full" onClick={onStart}>
            {cta}
            <ArrowRight size={18} />
          </Button>
        </div>
      )}
    </div>
  );
}

function DiagnosticLensPanel({ item }: { item: DiagnosticLensContent }) {
  const Icon = item.icon;

  return (
    <div className="grid gap-2.5 max-[620px]:grid-cols-none" aria-label="Map analysis details" tabIndex={0}>
      <section className="mobile-snap-item grid gap-2 rounded-md bg-card p-3 shadow-none max-[620px]:min-h-[116px]">
        <div className="grid grid-cols-[auto_1fr] gap-2.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
            <Icon size={16} aria-hidden="true" />
          </span>
          <div className="grid gap-1.5">
            <p className="mb-0 text-[0.9rem] font-medium leading-[1.35] text-foreground">{item.description}</p>
          </div>
        </div>
      </section>

      <section className="mobile-snap-item grid gap-2 rounded-md bg-[#fff7fb] p-3 shadow-none max-[620px]:min-h-[116px]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[0.74rem] font-medium uppercase tracking-normal text-primary">Report read</span>
          <EvidencePills dimensionKeys={item.section.evidence_dimensions} />
        </div>
        <p className="mb-0 text-[0.92rem] leading-[1.4] text-foreground">{item.section.insight}</p>
      </section>
    </div>
  );
}

interface RadarLensSceneProps {
  activeLens: PatternLensKey;
  onDimensionSelect: () => void;
}

function RadarLensScene({ activeLens, onDimensionSelect }: RadarLensSceneProps) {
  const [selectedDimension, setSelectedDimension] = useState<DimensionKey>(() => defaultDimensionForLens(activeLens));
  const gridRings = useMemo(() => [0.25, 0.5, 0.75, 1], []);
  const pointsBySeries = useMemo<Record<VectorKey, RadarPoint[]>>(
    () => ({
      ideal: pointsForProfile(demoVectors.ideal),
      actual: pointsForProfile(demoVectors.actual),
      social: pointsForProfile(demoVectors.social),
    }),
    [],
  );
  const activePair = pairForLens(activeLens);
  const gapRankings = useMemo(() => dimensionGapRankings(activePair[0], activePair[1]), [activeLens]);
  const highlights = useMemo(() => getHighlights(activeLens, pointsBySeries), [activeLens, pointsBySeries]);
  const selectedHighlight = useMemo(
    () => getHighlightForDimension(activeLens, selectedDimension, pointsBySeries, 940),
    [activeLens, pointsBySeries, selectedDimension],
  );
  const visibleGapLines = useMemo(
    () => [selectedHighlight, ...highlights.filter((highlight) => highlight.key !== selectedDimension)],
    [highlights, selectedDimension, selectedHighlight],
  );
  const gapColor = getGapColor(activeLens);
  const gapByDimension = new Map(gapRankings.map((dimension) => [dimension.key, dimension.gap]));
  const socialPath = pathForPoints(pointsBySeries.social);
  const facadeRevealPath = bridgePath(pointsBySeries.actual, pointsBySeries.social);

  useEffect(() => {
    setSelectedDimension(defaultDimensionForLens(activeLens));
  }, [activeLens]);

  const handleDimensionSelect = (dimensionKey: DimensionKey) => {
    setSelectedDimension(dimensionKey);
    onDimensionSelect();
  };

  const handleDimensionKeyDown = (event: KeyboardEvent<SVGGElement>, dimensionKey: DimensionKey) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    handleDimensionSelect(dimensionKey);
  };

  return (
    <figure
      className="map-radar-shell m-0 grid min-h-[500px] content-center justify-items-center overflow-hidden rounded-lg bg-[#fbfbfb] px-4 py-5 max-[620px]:min-h-[326px] max-[620px]:px-2 max-[620px]:py-3"
      aria-label="Interactive orbital radar map comparing stated preference, actual choices, and friend-observed patterns"
    >
      <svg
        className="h-auto w-full max-w-[680px] overflow-visible"
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        role="img"
      >
        <title>Pattern lens orbital radar comparing ideal, actual, and friend feedback dating signals</title>
        <defs>
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

        <circle className="map-orbit-ring" cx={centerX} cy={centerY} r={orbitRadius} />
        <circle className="map-orbit-ring map-orbit-ring--inner" cx={centerX} cy={centerY} r={orbitRadius - 42} />

        {gridRings.map((ring) => (
          <polygon
            key={ring}
            points={polygonPoints(dimensions.map((_, index) => pointAt(index, radius * ring)))}
            fill="none"
            stroke="#e6e6e6"
            strokeWidth="1"
          />
        ))}

        {dimensions.map((dimension, index) => {
          const axisPoint = pointAt(index, radius);
          const orbitPoint = pointAt(index, orbitRadius);
          return (
            <g key={dimension.key}>
              <line
                x1={centerX}
                y1={centerY}
                x2={axisPoint.x}
                y2={axisPoint.y}
                stroke="#e6e6e6"
                strokeWidth="1"
              />
              <line className="map-orbit-spoke" x1={axisPoint.x} y1={axisPoint.y} x2={orbitPoint.x} y2={orbitPoint.y} />
            </g>
          );
        })}

        {activeLens === 'facade' && (
          <g className="map-facade-reveal">
            <path d={facadeRevealPath} fill="rgba(17, 17, 17, 0.08)" stroke="none" />
          </g>
        )}

        {visibleGapLines.map((highlight) => {
          const dimensionIndex = dimensions.findIndex((dimension) => dimension.key === highlight.key);
          const nodePoint = pointAt(dimensionIndex, orbitRadius);
          const midpoint = {
            x: (highlight.from.x + highlight.to.x) / 2,
            y: (highlight.from.y + highlight.to.y) / 2,
          };
          const isSelectedGap = highlight.key === selectedDimension;

          return (
            <g key={`${activeLens}-${highlight.key}-${isSelectedGap ? 'selected' : 'top'}`}>
              <line
                className={cn('map-orbit-connector', isSelectedGap && 'map-orbit-connector--active')}
                x1={nodePoint.x}
                y1={nodePoint.y}
                x2={midpoint.x}
                y2={midpoint.y}
                stroke={gapColor}
                strokeLinecap="round"
                strokeWidth={isSelectedGap ? 2.8 : 1.6}
                style={{ '--connector-delay': `${Math.max(highlight.delay - 280, 160)}ms` } as CSSProperties}
              />
              <line
                className={cn(
                  'map-gap-line',
                  isSelectedGap && 'map-gap-line--selected',
                  activeLens === 'blindSpot' && !isSelectedGap && 'map-gap-line--pulse',
                  activeLens === 'facade' && 'map-gap-line--hidden',
                )}
                x1={highlight.from.x}
                y1={highlight.from.y}
                x2={highlight.to.x}
                y2={highlight.to.y}
                stroke={gapColor}
                strokeLinecap="round"
                strokeWidth={isSelectedGap ? 11 : activeLens === 'blindSpot' || activeLens === 'all' ? 8 : 6}
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
                    className={cn('map-radar-point', dimensions[index].key === selectedDimension && 'map-radar-point--active')}
                    key={`${series}-${dimensions[index].key}`}
                    cx={point.x}
                    cy={point.y}
                    r={dimensions[index].key === selectedDimension ? 7 : activeLens === 'all' ? 4.5 : 5.5}
                    fill={config.stroke}
                  />
                ))}
              </g>
            </g>
          );
        })}

        {dimensions.map((dimension, index) => {
          const nodePoint = pointAt(index, orbitRadius);
          const labelPoint = labelPointAt(index);
          const hitRect = orbitHitRect(index, nodePoint, labelPoint);
          const gap = gapByDimension.get(dimension.key) ?? 0;
          const isSelected = selectedDimension === dimension.key;
          const nodeColor = '#111111';
          const nodeRadius = 15;
          const nodeStrokeWidth = 1.6;
          const DimensionIcon = dimensionIconMap[dimension.key];

          return (
            <g
              aria-label={`${dimension.name}. Gap ${gap.toFixed(1)}. Select to highlight this dimension.`}
              aria-pressed={isSelected}
              className={cn(
                'map-orbit-node',
                isSelected && 'map-orbit-node--active',
              )}
              focusable="true"
              key={dimension.key}
              onClick={() => handleDimensionSelect(dimension.key)}
              onKeyDown={(event) => handleDimensionKeyDown(event, dimension.key)}
              role="button"
              style={{ '--node-color': nodeColor } as CSSProperties}
              tabIndex={0}
            >
              <rect
                className="map-orbit-node-hit"
                height={hitRect.height}
                rx="24"
                width={hitRect.width}
                x={hitRect.x}
                y={hitRect.y}
              />
              <circle
                className="map-orbit-node-core"
                cx={nodePoint.x}
                cy={nodePoint.y}
                r={nodeRadius}
                strokeWidth={nodeStrokeWidth}
              />
              <DimensionIcon
                aria-hidden="true"
                className="map-orbit-icon"
                focusable="false"
                height={16}
                strokeWidth={2}
                width={16}
                x={nodePoint.x - 8}
                y={nodePoint.y - 8}
              />
              <text
                className="map-orbit-label"
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
  const activeTitle = activeLens === 'all' ? allLensContent.title : diagnosticLensContent[activeLens].label;

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
    <ContentBand className="grid content-center gap-4 py-[clamp(34px,6svh,56px)] max-[980px]:min-h-0 max-[980px]:max-h-none max-[980px]:overflow-visible max-[620px]:content-start max-[620px]:gap-3 max-[620px]:py-5" id="map-analysis">
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
                  <span className="leading-[1.1]">
                    {lens === 'all' ? allLensContent.tab : diagnosticLensContent[lens].tab}
                  </span>
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
          <Surface
            className="overflow-hidden border-0 p-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),0_18px_60px_rgba(17,17,17,0.08),0_4px_18px_rgba(232,62,140,0.08)]"
            aria-live="polite"
          >
            <RadarLensScene activeLens={activeLens} onDimensionSelect={() => setIsAutoplaying(false)} />
          </Surface>

          <Surface
            asChild
            className="grid content-start gap-4 border-0 p-[clamp(18px,2.4vw,24px)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),0_18px_60px_rgba(17,17,17,0.08),0_4px_18px_rgba(232,62,140,0.08)] max-[620px]:gap-3 max-[620px]:p-4"
            aria-live="polite"
          >
            <aside>
              <div className="map-insight-enter grid content-start gap-4 max-[620px]:gap-3" key={activeLens}>
                <h3 className="mb-0 text-[clamp(1.35rem,2.4vw,1.9rem)] leading-[1.08] text-foreground max-[620px]:text-[1.15rem]">
                  {activeTitle}
                </h3>

                {activeLens === 'all' ? (
                  <StrongestReadsPanel cta={allLensContent.cta} onStart={onStart} />
                ) : (
                  <DiagnosticLensPanel item={diagnosticLensContent[activeLens]} />
                )}
              </div>
            </aside>
          </Surface>
        </div>
      </div>
    </ContentBand>
  );
}
