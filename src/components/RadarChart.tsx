import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import type { DimensionKey, RadarChartReport, RadarDimensionReport, VectorProfile } from '../types/dating-mirror';

interface RadarChartProps {
  radarChart: RadarChartReport;
  className?: string;
}

const chartWidth = 660;
const chartHeight = 620;
const centerX = chartWidth / 2;
const centerY = 306;
const radius = 190;
const labelRadius = 274;

const radarColors = {
  ideal: {
    fill: 'rgba(47, 158, 68, 0.13)',
    stroke: '#2f9e44',
  },
  actual: {
    fill: 'rgba(217, 72, 65, 0.12)',
    stroke: '#d94841',
  },
  friend_feedback: {
    fill: 'rgba(245, 158, 11, 0.10)',
    stroke: '#f59e0b',
  },
  grid: '#ececea',
  highlight: '#e83e8c',
};

const seriesLabels = {
  ideal: 'Ideal',
  actual: 'Actual',
  friend_feedback: 'Friend Feedback',
};

type RadarSeriesKey = keyof typeof seriesLabels;

interface RadarPoint {
  x: number;
  y: number;
}

function angleFor(index: number, total: number) {
  return -Math.PI / 2 + (index / total) * Math.PI * 2;
}

function pointAt(index: number, pointRadius: number, total: number): RadarPoint {
  const angle = angleFor(index, total);
  return {
    x: centerX + Math.cos(angle) * pointRadius,
    y: centerY + Math.sin(angle) * pointRadius,
  };
}

function valueRadius(value: number, min: number, max: number) {
  const range = Math.max(1, max - min);
  const normalized = Math.min(1, Math.max(0, (value - min) / range));
  return normalized * radius;
}

function pointsForProfile(
  profile: VectorProfile,
  dimensions: RadarDimensionReport[],
  min: number,
  max: number,
) {
  return dimensions.map((dimension, index) => {
    return pointAt(index, valueRadius(profile[dimension.key], min, max), dimensions.length);
  });
}

function polygonPoints(points: RadarPoint[]) {
  return points.map((point) => `${point.x},${point.y}`).join(' ');
}

function labelAnchor(index: number, total: number) {
  const horizontalPosition = Math.cos(angleFor(index, total));

  if (horizontalPosition > 0.35) {
    return 'start';
  }

  if (horizontalPosition < -0.35) {
    return 'end';
  }

  return 'middle';
}

function dominantGapLabel(dominantGap: RadarDimensionReport['dominant_gap']) {
  if (dominantGap === 'conscious') {
    return 'ideal vs actual';
  }

  if (dominantGap === 'blind_spot') {
    return 'actual vs friends';
  }

  return 'split signal';
}

function SeriesPolygon({
  points,
  series,
}: {
  points: RadarPoint[];
  series: RadarSeriesKey;
}) {
  return (
    <>
      <polygon
        points={polygonPoints(points)}
        fill={radarColors[series].fill}
        stroke={radarColors[series].stroke}
        strokeDasharray={series === 'friend_feedback' ? '8 6' : undefined}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
      {points.map((point, index) => (
        <circle
          key={`${series}-${index}`}
          cx={point.x}
          cy={point.y}
          r="5.5"
          fill={radarColors[series].stroke}
        />
      ))}
    </>
  );
}

export function RadarChart({ radarChart, className }: RadarChartProps) {
  const [visibleSeries, setVisibleSeries] = useState<Record<RadarSeriesKey, boolean>>({
    ideal: true,
    actual: true,
    friend_feedback: true,
  });
  const gridRings = useMemo(() => [0.25, 0.5, 0.75, 1], []);
  const highlightByKey = useMemo(() => {
    return new Map<DimensionKey, RadarDimensionReport>(
      radarChart.highlights.map((highlight) => [highlight.key, highlight]),
    );
  }, [radarChart.highlights]);
  const { min, max } = radarChart.scale;
  const idealPoints = useMemo(
    () => pointsForProfile(radarChart.series.ideal, radarChart.dimensions, min, max),
    [max, min, radarChart.dimensions, radarChart.series.ideal],
  );
  const actualPoints = useMemo(
    () => pointsForProfile(radarChart.series.actual, radarChart.dimensions, min, max),
    [max, min, radarChart.dimensions, radarChart.series.actual],
  );
  const friendFeedbackPoints = useMemo(
    () => pointsForProfile(radarChart.series.friend_feedback, radarChart.dimensions, min, max),
    [max, min, radarChart.dimensions, radarChart.series.friend_feedback],
  );
  const toggleSeries = (series: RadarSeriesKey) => {
    setVisibleSeries((current) => ({
      ...current,
      [series]: !current[series],
    }));
  };

  return (
    <figure
      className={cn('mx-auto grid w-full justify-items-center gap-4', className)}
      aria-label="Radar chart comparing ideal, actual, and friend feedback vectors"
    >
      <svg
        className="h-auto w-[min(100%,660px)] overflow-visible"
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        role="img"
      >
        <title>Radar chart comparing ideal aspiration, actual history, and friend feedback</title>
        <defs>
          <filter id="radar-gap-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {gridRings.map((ring) => (
          <polygon
            key={ring}
            points={polygonPoints(radarChart.dimensions.map((_, index) => pointAt(index, radius * ring, radarChart.dimensions.length)))}
            fill="none"
            stroke={radarColors.grid}
          />
        ))}

        {radarChart.dimensions.map((dimension, index) => {
          const highlight = highlightByKey.get(dimension.key);
          const axisPoint = pointAt(index, radius, radarChart.dimensions.length);
          const labelPoint = pointAt(index, labelRadius, radarChart.dimensions.length);
          const rankPoint = pointAt(index, radius + 28, radarChart.dimensions.length);

          return (
            <g key={dimension.key}>
              {highlight && (
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={axisPoint.x}
                  y2={axisPoint.y}
                  stroke={radarColors.highlight}
                  strokeLinecap="round"
                  strokeWidth="9"
                  opacity="0.12"
                  filter="url(#radar-gap-glow)"
                />
              )}
              <line
                x1={centerX}
                y1={centerY}
                x2={axisPoint.x}
                y2={axisPoint.y}
                stroke={highlight ? 'rgba(232,62,140,0.34)' : radarColors.grid}
                strokeWidth={highlight ? '1.5' : '1'}
              />
              {highlight && (
                <g>
                  <circle
                    cx={rankPoint.x}
                    cy={rankPoint.y}
                    r="14"
                    fill="#ffffff"
                    stroke={radarColors.highlight}
                    strokeWidth="2"
                  />
                  <text
                    className="fill-primary text-[0.78rem] font-bold"
                    x={rankPoint.x}
                    y={rankPoint.y + 0.5}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {highlight.highlight_rank}
                  </text>
                </g>
              )}
              <text
                className={cn(
                  'fill-muted-foreground text-[0.94rem] font-medium',
                  highlight && 'fill-foreground font-semibold',
                )}
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor={labelAnchor(index, radarChart.dimensions.length)}
                dominantBaseline="middle"
              >
                {dimension.name}
              </text>
            </g>
          );
        })}

        {visibleSeries.ideal && <SeriesPolygon points={idealPoints} series="ideal" />}
        {visibleSeries.actual && <SeriesPolygon points={actualPoints} series="actual" />}
        {visibleSeries.friend_feedback && <SeriesPolygon points={friendFeedbackPoints} series="friend_feedback" />}
      </svg>

      <figcaption className="grid w-full gap-3">
        <div className="box-border flex w-full flex-wrap justify-center gap-x-[18px] gap-y-3 px-2 font-medium text-muted-foreground">
          {(Object.keys(seriesLabels) as RadarSeriesKey[]).map((series) => (
            <label className="inline-flex cursor-pointer select-none items-center gap-2" key={series}>
              <input
                className="m-0 size-4"
                style={{ accentColor: radarColors[series].stroke }}
                type="checkbox"
                checked={visibleSeries[series]}
                onChange={() => toggleSeries(series)}
              />
              <span
                className="h-[3px] w-8 rounded-full"
                style={{ backgroundColor: radarColors[series].stroke }}
                aria-hidden="true"
              />
              {seriesLabels[series]}
            </label>
          ))}
        </div>

        <div className="mx-auto flex max-w-[760px] flex-wrap justify-center gap-2">
          {radarChart.highlights.map((highlight) => (
            <span
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-3.5 py-2 text-[0.86rem] font-medium leading-none text-foreground shadow-[0_10px_24px_rgba(17,17,17,0.06)]"
              key={highlight.key}
            >
              <span className="grid size-5 place-items-center rounded-full bg-primary text-[0.72rem] text-primary-foreground">
                {highlight.highlight_rank}
              </span>
              {highlight.name}
              <span className="text-muted-foreground">{Math.round(highlight.severity_percentage)}%</span>
              <span className="text-muted-foreground">{dominantGapLabel(highlight.dominant_gap)}</span>
            </span>
          ))}
        </div>
      </figcaption>
    </figure>
  );
}
