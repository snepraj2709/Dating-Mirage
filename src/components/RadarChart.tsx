import { useMemo } from 'react';
import { dimensions } from '../data/datingMirrorContent';
import type { VectorProfile } from '../types/dating-mirror';

interface RadarChartProps {
  ideal: VectorProfile;
  actual: VectorProfile;
  social: VectorProfile;
}

const size = 360;
const center = size / 2;
const radius = 132;

function pointsFor(profile: VectorProfile) {
  return dimensions
    .map((dimension, index) => {
      const angle = -Math.PI / 2 + (index / dimensions.length) * Math.PI * 2;
      const valueRadius = ((profile[dimension.key] - 1) / 9) * radius;
      return `${center + Math.cos(angle) * valueRadius},${center + Math.sin(angle) * valueRadius}`;
    })
    .join(' ');
}

export function RadarChart({ ideal, actual, social }: RadarChartProps) {
  const gridRings = useMemo(() => [0.25, 0.5, 0.75, 1], []);
  const idealPoints = useMemo(() => pointsFor(ideal), [ideal]);
  const actualPoints = useMemo(() => pointsFor(actual), [actual]);
  const socialPoints = useMemo(() => pointsFor(social), [social]);

  return (
    <figure className="radar-chart" aria-label="Radar chart comparing ideal, actual, and friend-view vectors">
      <svg viewBox={`0 0 ${size} ${size}`} role="img">
        {gridRings.map((ring) => (
          <circle
            key={ring}
            cx={center}
            cy={center}
            r={radius * ring}
            fill="none"
            stroke="rgba(235, 72, 221, 0.1)"
          />
        ))}
        {dimensions.map((dimension, index) => {
          const angle = -Math.PI / 2 + (index / dimensions.length) * Math.PI * 2;
          const x = center + Math.cos(angle) * radius;
          const y = center + Math.sin(angle) * radius;
          const labelX = center + Math.cos(angle) * (radius + 24);
          const labelY = center + Math.sin(angle) * (radius + 24);
          return (
            <g key={dimension.key}>
              <line x1={center} y1={center} x2={x} y2={y} stroke="#ffcad4" strokeWidth="1" />
              <text x={labelX} y={labelY} textAnchor="middle" dominantBaseline="middle">
                {dimension.key}
              </text>
            </g>
          );
        })}
        <polygon points={idealPoints} fill="rgba(255, 133, 179, 0.15)" stroke="#ff85b3" strokeWidth="2" />
        <polygon points={actualPoints} fill="rgba(235, 72, 221, 0.1)" stroke="#eb48dd" strokeWidth="3" />
        <polygon
          points={socialPoints}
          fill="none"
          stroke="#2a1b24"
          strokeDasharray="6 4"
          strokeWidth="2.5"
        />
      </svg>
      <figcaption>
        <span><i className="legend ideal" /> Ideal</span>
        <span><i className="legend actual" /> Actual</span>
        <span><i className="legend social" /> Friends</span>
      </figcaption>
    </figure>
  );
}

