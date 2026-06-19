import { quadrantDetails } from '../data/datingMirrorContent';
import type { JohariReport, QuadrantKey } from '../types/dating-mirror';

interface JohariMatrixProps {
  report: JohariReport;
}

const cells: Array<{
  key: QuadrantKey;
  axis: string;
}> = [
  { key: 'guilty-pleasure', axis: 'High self gap / Low blind spot' },
  { key: 'total-disconnect', axis: 'High self gap / High blind spot' },
  { key: 'aligned', axis: 'Low self gap / Low blind spot' },
  { key: 'true-blindspot', axis: 'Low self gap / High blind spot' },
];

export function JohariMatrix({ report }: JohariMatrixProps) {
  const activeQuadrants = new Set(report.featuredDimensions.map((dimension) => dimension.quadrant));

  return (
    <section className="johari-matrix" aria-label="Johari gap matrix">
      {cells.map((cell) => {
        const detail = quadrantDetails[cell.key];
        return (
          <article
            key={cell.key}
            className={`matrix-cell ${cell.key} ${activeQuadrants.has(cell.key) ? 'active' : ''}`}
          >
            <span className="matrix-icon">{detail.icon}</span>
            <p className="matrix-axis">{cell.axis}</p>
            <h3>{detail.title}</h3>
            <p>{detail.description}</p>
          </article>
        );
      })}
    </section>
  );
}

