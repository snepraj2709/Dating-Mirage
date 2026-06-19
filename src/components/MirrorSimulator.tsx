import { ArrowRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/pill';
import { ContentBand, SectionHeading } from '@/components/ui/section';
import { Surface } from '@/components/ui/surface';

interface MirrorSimulatorProps {
  onStart: () => void;
}

function clampWidth(gap: number) {
  return `${Math.min(100, (gap / 9) * 100)}%`;
}

export function MirrorSimulator({ onStart }: MirrorSimulatorProps) {
  const [ideal, setIdeal] = useState(5);
  const [actual, setActual] = useState(7.4);
  const [friends, setFriends] = useState(8.2);

  const result = useMemo(() => {
    const consciousGap = Math.abs(ideal - actual);
    const blindSpotGap = Math.abs(actual - friends);

    if (consciousGap >= 3 && blindSpotGap < 3) {
      return {
        title: 'Q1: Guilty Pleasure Pattern',
        copy: 'Your choices drift from your stated standard, and the outside view mostly agrees with your history.',
      };
    }

    if (consciousGap < 3 && blindSpotGap >= 3) {
      return {
        title: 'Q2: True Blind Spot',
        copy: 'Your self-read feels consistent, but friend feedback says the pattern is landing differently in real life.',
      };
    }

    if (consciousGap >= 3 && blindSpotGap >= 3) {
      return {
        title: 'Q3: Total Disconnect',
        copy: 'Your stated ideal, actual choices, and social mirror are all pulling in different directions.',
      };
    }

    return {
      title: 'Aligned Balance Profile',
      copy: 'The simulated ideal, history, and friend-observed pattern are close enough to tell one coherent story.',
    };
  }, [actual, friends, ideal]);

  const consciousGap = Math.abs(ideal - actual);
  const blindSpotGap = Math.abs(actual - friends);

  return (
    <ContentBand className="pt-[72px]" id="mirror-sandbox">
      <SectionHeading
        eyebrow="Mirror simulator"
        title="Move the vectors and watch the classification change."
        description="The live report compares stated preference, actual history, and friend-observed behavior before it recommends a quadrant."
      />

      <div className="grid grid-cols-[minmax(0,1fr)_minmax(320px,0.92fr)] gap-6 max-[960px]:grid-cols-1">
        <Surface className="p-6" aria-label="Simulator controls">
          <label className="grid gap-2.5 py-[18px]">
            <span className="flex justify-between gap-4 text-foreground">
              Ideal partner intensity
              <strong>{ideal.toFixed(1)}</strong>
            </span>
            <input
              aria-label="Ideal partner intensity"
              className="simulator-range"
              max="10"
              min="1"
              onChange={(event) => setIdeal(Number(event.target.value))}
              step="0.1"
              type="range"
              value={ideal}
            />
            <small className="flex justify-between gap-4 text-[0.82rem] text-subtle-foreground">
              <span>Slow burn</span>
              <span>Whirlwind</span>
            </small>
          </label>

          <label className="grid gap-2.5 border-t border-border py-[18px]">
            <span className="flex justify-between gap-4 text-foreground">
              Actual chosen intensity
              <strong>{actual.toFixed(1)}</strong>
            </span>
            <input
              aria-label="Actual chosen intensity"
              className="simulator-range"
              max="10"
              min="1"
              onChange={(event) => setActual(Number(event.target.value))}
              step="0.1"
              type="range"
              value={actual}
            />
            <small className="flex justify-between gap-4 text-[0.82rem] text-subtle-foreground">
              <span>Steady</span>
              <span>Volatile</span>
            </small>
          </label>

          <label className="grid gap-2.5 border-t border-border py-[18px]">
            <span className="flex justify-between gap-4 text-foreground">
              What friends observe
              <strong>{friends.toFixed(1)}</strong>
            </span>
            <input
              aria-label="What friends observe"
              className="simulator-range"
              max="10"
              min="1"
              onChange={(event) => setFriends(Number(event.target.value))}
              step="0.1"
              type="range"
              value={friends}
            />
            <small className="flex justify-between gap-4 text-[0.82rem] text-subtle-foreground">
              <span>Grounded</span>
              <span>Chasing the rush</span>
            </small>
          </label>
        </Surface>

        <Surface asChild className="grid content-start gap-[18px] p-6">
          <aside>
          <Eyebrow>Live calculator result</Eyebrow>
          <h3 className="mb-0 text-xl leading-[1.2] text-foreground">{result.title}</h3>

          <div className="grid gap-4" aria-label="Simulated gaps">
            <div>
              <span className="flex justify-between gap-4 text-foreground">
                Conscious self-gap
                <strong>{consciousGap.toFixed(1)}</strong>
              </span>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <i className="block h-full rounded-[inherit] bg-negative" style={{ width: clampWidth(consciousGap) }} />
              </div>
            </div>
            <div>
              <span className="flex justify-between gap-4 text-foreground">
                Social blind-spot gap
                <strong>{blindSpotGap.toFixed(1)}</strong>
              </span>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <i className="block h-full rounded-[inherit] bg-warning" style={{ width: clampWidth(blindSpotGap) }} />
              </div>
            </div>
          </div>

          <p className="mb-0">{result.copy}</p>
          <Button className="mt-1 w-fit max-[620px]:w-full" onClick={onStart}>
            Build my real mirror
            <ArrowRight size={18} />
          </Button>
          </aside>
        </Surface>
      </div>
    </ContentBand>
  );
}
