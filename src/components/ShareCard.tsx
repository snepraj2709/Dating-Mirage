import { useRef, useState } from 'react';
import { toJpeg, toPng } from 'html-to-image';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InlineError } from '@/components/ui/flow';
import { Eyebrow } from '@/components/ui/pill';
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
    <section className="mx-auto my-6 grid justify-items-center gap-3.5">
      <div
        className="grid aspect-[4/5] w-[min(100%,420px)] content-between overflow-hidden rounded-lg border border-[#333333] bg-[#111111] p-7 text-white shadow-none"
        ref={cardRef}
      >
        <Eyebrow className="text-white">Dating Mirror</Eyebrow>
        <h2 className="text-[2.7rem] leading-[1.05] text-white max-[620px]:text-[2.2rem]">My top mirror gaps</h2>
        <div className="grid gap-3.5">
          {report.featuredDimensions.map((dimension, index) => {
            const detail = quadrantDetails[dimension.quadrant];
            return (
              <article
                className="grid grid-cols-[auto_1fr] gap-3 rounded-lg border border-white/15 bg-white/10 p-3.5"
                key={dimension.key}
              >
                <span className="inline-flex size-[38px] items-center justify-center rounded-full bg-white font-medium text-[#111111]">
                  {index + 1}
                </span>
                <div>
                  <p className="mb-0 text-white">{detail.badge}</p>
                  <h3 className="mb-2.5 text-xl leading-[1.2] text-white">{dimensionName(dimension.key)}</h3>
                  <strong className="text-white">{dimension.severityPercentage}% tension</strong>
                </div>
              </article>
            );
          })}
        </div>
        <footer className="flex flex-wrap items-center justify-between gap-3 text-[0.82rem] font-medium uppercase text-white/80">
          <span>{report.friendCount} friends contributed</span>
          <span>dating mirror</span>
        </footer>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => exportCard('png')}>
          <Download size={18} />
          PNG
        </Button>
        <Button variant="secondaryPill" onClick={() => exportCard('jpeg')}>
          <Download size={16} />
          JPEG
        </Button>
      </div>
      {exportError && <InlineError>{exportError}</InlineError>}
    </section>
  );
}
