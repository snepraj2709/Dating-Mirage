import { useRef, useState } from 'react';
import { toJpeg, toPng } from 'html-to-image';
import { Download } from 'lucide-react';
import { dimensions, quadrantDetails } from '../data/datingMirrorContent';
import type { JohariReport } from '../types/dating-mirror';

interface ShareCardProps {
  report: JohariReport;
}

function dimensionName(key: string) {
  return dimensions.find((dimension) => dimension.key === key)?.name ?? key;
}

export function ShareCard({ report }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const exportCard = async (format: 'png' | 'jpeg') => {
    if (!cardRef.current) {
      return;
    }

    setExportError(null);
    try {
      const dataUrl =
        format === 'png'
          ? await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 })
          : await toJpeg(cardRef.current, { cacheBust: true, pixelRatio: 2, quality: 0.94 });
      const link = document.createElement('a');
      link.download = `dating-mirror-card.${format === 'png' ? 'png' : 'jpg'}`;
      link.href = dataUrl;
      link.click();
    } catch {
      setExportError('Share card export failed. Try again after the page finishes rendering.');
    }
  };

  return (
    <section className="share-card-section">
      <div className="share-card-export" ref={cardRef}>
        <p className="eyebrow">Dating Mirror</p>
        <h2>My top mirror gaps</h2>
        <div className="share-card-findings">
          {report.featuredDimensions.map((dimension, index) => {
            const detail = quadrantDetails[dimension.quadrant];
            return (
              <article key={dimension.key}>
                <span>{index + 1}</span>
                <div>
                  <p>{detail.badge}</p>
                  <h3>{dimensionName(dimension.key)}</h3>
                  <strong>{dimension.severityPercentage}% tension</strong>
                </div>
              </article>
            );
          })}
        </div>
        <footer>
          <span>{report.friendCount} friends contributed</span>
          <span>dating mirror</span>
        </footer>
      </div>
      <div className="share-downloads">
        <button className="primary-button" onClick={() => exportCard('png')}>
          <Download size={18} />
          PNG
        </button>
        <button className="secondary-link" onClick={() => exportCard('jpeg')}>
          <Download size={16} />
          JPEG
        </button>
      </div>
      {exportError && <p className="inline-error">{exportError}</p>}
    </section>
  );
}

