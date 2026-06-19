import { useMemo, useState } from 'react';
import { dimensions } from '../data/datingMirrorContent';
import type { VectorProfile } from '../types/dating-mirror';

interface RadarChartProps {
  ideal: VectorProfile;
  actual: VectorProfile;
  social: VectorProfile;
}

const chartWidth = 620;
const chartHeight = 520;
const centerX = chartWidth / 2;
const centerY = 250;
const radius = 150;
const labelRadius = 210;

const radarColors = {
  ideal: {
    fill: 'rgba(47, 158, 68, 0.16)',
    stroke: '#2f9e44',
  },
  actual: {
    fill: 'rgba(217, 72, 65, 0.14)',
    stroke: '#d94841',
  },
  social: {
    fill: 'rgba(245, 158, 11, 0.12)',
    stroke: '#f59e0b',
  },
  grid: '#ececea',
};

type RadarSeriesKey = 'ideal' | 'actual' | 'social';

interface RadarPoint {
  x: number;
  y: number;
}

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

export function RadarChart({ ideal, actual, social }: RadarChartProps) {
  const [visibleSeries, setVisibleSeries] = useState<Record<RadarSeriesKey, boolean>>({
    ideal: true,
    actual: true,
    social: true,
  });
  const gridRings = useMemo(() => [0.25, 0.5, 0.75, 1], []);
  const idealPoints = useMemo(() => pointsForProfile(ideal), [ideal]);
  const actualPoints = useMemo(() => pointsForProfile(actual), [actual]);
  const socialPoints = useMemo(() => pointsForProfile(social), [social]);
  const toggleSeries = (series: RadarSeriesKey) => {
    setVisibleSeries((current) => ({
      ...current,
      [series]: !current[series],
    }));
  };

  return (
    <figure
      className="mx-auto my-6 grid w-[min(100%,720px)] justify-items-center"
      aria-label="Radar chart comparing ideal, actual, and friend-view vectors"
    >
      <svg className="h-auto w-[min(100%,620px)] overflow-visible" viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img">
        <title>Radar chart comparing ideal aspiration, actual history, and social friend view</title>
        {gridRings.map((ring) => (
          <polygon
            key={ring}
            points={polygonPoints(dimensions.map((_, index) => pointAt(index, radius * ring)))}
            fill="none"
            stroke={radarColors.grid}
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
                stroke={radarColors.grid}
                strokeWidth="1"
              />
              <text
                className="fill-muted-foreground text-[0.9rem] font-medium"
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
        {visibleSeries.ideal && (
          <>
            <polygon
              points={polygonPoints(idealPoints)}
              fill={radarColors.ideal.fill}
              stroke={radarColors.ideal.stroke}
              strokeWidth="3"
            />
            {idealPoints.map((point, index) => (
              <circle
                key={`ideal-${dimensions[index].key}`}
                cx={point.x}
                cy={point.y}
                r="6"
                fill={radarColors.ideal.stroke}
              />
            ))}
          </>
        )}
        {visibleSeries.actual && (
          <>
            <polygon
              points={polygonPoints(actualPoints)}
              fill={radarColors.actual.fill}
              stroke={radarColors.actual.stroke}
              strokeWidth="3"
            />
            {actualPoints.map((point, index) => (
              <circle
                key={`actual-${dimensions[index].key}`}
                cx={point.x}
                cy={point.y}
                r="6"
                fill={radarColors.actual.stroke}
              />
            ))}
          </>
        )}
        {visibleSeries.social && (
          <>
            <polygon
              points={polygonPoints(socialPoints)}
              fill={radarColors.social.fill}
              stroke={radarColors.social.stroke}
              strokeDasharray="8 6"
              strokeWidth="3"
            />
            {socialPoints.map((point, index) => (
              <circle
                key={`social-${dimensions[index].key}`}
                cx={point.x}
                cy={point.y}
                r="6"
                fill={radarColors.social.stroke}
              />
            ))}
          </>
        )}
      </svg>
      <figcaption className="box-border flex w-full flex-wrap justify-center gap-x-[22px] gap-y-3.5 px-2 font-medium text-muted-foreground">
        <label className="inline-flex cursor-pointer select-none items-center gap-2">
          <input
            className="m-0 size-4 accent-positive"
            type="checkbox"
            checked={visibleSeries.ideal}
            onChange={() => toggleSeries('ideal')}
          />
          Ideal (Aspiration)
        </label>
        <label className="inline-flex cursor-pointer select-none items-center gap-2">
          <input
            className="m-0 size-4 accent-negative"
            type="checkbox"
            checked={visibleSeries.actual}
            onChange={() => toggleSeries('actual')}
          />
          Actual (History)
        </label>
        <label className="inline-flex cursor-pointer select-none items-center gap-2">
          <input
            className="m-0 size-4 accent-warning"
            type="checkbox"
            checked={visibleSeries.social}
            onChange={() => toggleSeries('social')}
          />
          Friend Feedback
        </label>
      </figcaption>
    </figure>
  );
}
