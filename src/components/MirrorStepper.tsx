import { useState, type CSSProperties } from 'react';
import {
  FlaskConical,
  HeartCrack,
  MessageSquareText,
  Shield,
  ShipWheel,
  SmilePlus,
  TrendingUpDown,
  Trophy,
  Waves,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { dimensions } from '../data/datingMirrorContent';
import { cn } from '../lib/utils';
import type { DimensionKey } from '../types/dating-mirror';

type MirrorSourceId = 'ideal' | 'actual' | 'friends';

interface MirrorSource {
  id: MirrorSourceId;
  title: string;
  description: string;
  measurement: string;
}

interface DimensionVisual {
  Icon: LucideIcon;
  SecondaryIcon?: LucideIcon;
  color: string;
  background: string;
  border: string;
  cue: string;
}

const mirrorSources: MirrorSource[] = [
  {
    id: 'ideal',
    title: 'Ideal',
    description: 'What type of partner do you dream to spend your life with?',
    measurement:
      'Measured as the I vector: your stated partner standard scores all eight dimensions from 1.0 to 10.0.',
  },
  {
    id: 'actual',
    title: 'Actual',
    description: 'What type of person have you been attracting so far?',
    measurement:
      'Measured as the A vector: your dating-history response pattern shifts each dimension toward repeated behavior.',
  },
  {
    id: 'friends',
    title: 'Observation',
    description: 'What outside outlook do your friends have on your dating life?',
    measurement:
      'Measured as the S vector: anonymous friend feedback is averaged into the outside-observed profile.',
  },
];

const dimensionVisuals: Record<DimensionKey, DimensionVisual> = {
  CON: {
    Icon: Waves,
    color: '#0284c7',
    background: '#f0f9ff',
    border: '#bae6fd',
    cue: 'calm water',
  },
  INT: {
    Icon: Zap,
    color: '#ca8a04',
    background: '#fefce8',
    border: '#fde68a',
    cue: 'bolt charge',
  },
  AUT: {
    Icon: ShipWheel,
    color: '#15803d',
    background: '#f0fdf4',
    border: '#bbf7d0',
    cue: 'hands on wheel',
  },
  VAL: {
    Icon: SmilePlus,
    SecondaryIcon: Trophy,
    color: '#9333ea',
    background: '#faf5ff',
    border: '#e9d5ff',
    cue: 'praise pull',
  },
  GOC: {
    Icon: MessageSquareText,
    color: '#0f766e',
    background: '#f0fdfa',
    border: '#99f6e4',
    cue: 'repair dialogue',
  },
  VUL: {
    Icon: HeartCrack,
    SecondaryIcon: Shield,
    color: '#dc2626',
    background: '#fef2f2',
    border: '#fecaca',
    cue: 'shown weakness',
  },
  REA: {
    Icon: FlaskConical,
    color: '#ea580c',
    background: '#fff7ed',
    border: '#fed7aa',
    cue: 'chemical reaction',
  },
  RWO: {
    Icon: TrendingUpDown,
    color: '#4338ca',
    background: '#eef2ff',
    border: '#c7d2fe',
    cue: 'worth signal',
  },
};

const sourceById = mirrorSources.reduce(
  (sources, source) => ({ ...sources, [source.id]: source }),
  {} as Record<MirrorSourceId, MirrorSource>,
);

function SourceQuadrant({
  className,
  isActive,
  onActivate,
  source,
}: {
  className?: string;
  isActive: boolean;
  onActivate: () => void;
  source: MirrorSource;
}) {
  return (
    <button
      aria-label={`${source.title} input: ${source.description}`}
      aria-pressed={isActive}
      className={cn(
        'group relative grid min-h-0 w-full place-items-center overflow-hidden bg-card p-[clamp(22px,3vw,44px)] text-center transition-[background,border-color,color,transform] duration-150 ease-out focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-foreground max-[760px]:min-h-[180px] max-[760px]:p-6',
        isActive ? 'border-primary bg-[#fff7fb]' : 'border-border hover:border-border-strong',
        className,
      )}
      onClick={onActivate}
      onFocus={onActivate}
      onMouseMove={onActivate}
      type="button"
    >
      <span className="grid max-w-[620px] justify-items-center gap-3">
        <span
          className="block text-[clamp(2rem,4.8vw,4.65rem)] leading-none text-foreground max-[1080px]:text-[clamp(1.9rem,4.5vw,3.5rem)]"
        >
          {source.title}
        </span>
        <span className="block text-[clamp(0.95rem,1.45vw,1.24rem)] leading-[1.55] text-muted-foreground max-[1080px]:text-[0.95rem]">
          {source.description}
        </span>
      </span>
    </button>
  );
}

export function MirrorStepper() {
  const [activeSource, setActiveSource] = useState<MirrorSourceId>('ideal');
  const selectedSource = sourceById[activeSource];

  return (
    <section
      aria-labelledby="how-it-works-title"
      className="scroll-mt-[72px] border-y border-border bg-background min-[761px]:h-[calc(100svh-72px)] min-[761px]:overflow-hidden max-[620px]:scroll-mt-16"
      id="how-it-works"
    >
      <div className="mx-auto grid w-full max-w-[1440px] grid-rows-[auto_minmax(0,1fr)] min-[761px]:h-full max-[760px]:w-[min(100%_-_24px,520px)]">
        <header className="mx-auto grid max-w-[820px] justify-items-center gap-2.5 px-4 py-[clamp(18px,3vh,30px)] text-center max-[760px]:py-7">
          <p className="m-0 mb-3 text-[0.88rem] font-medium uppercase tracking-normal text-muted-foreground">
            How your mirror gets formed
          </p>
          <h2
            className="mb-0 text-[clamp(1.75rem,4vw,3rem)] leading-[1.05] tracking-normal text-foreground"
            id="how-it-works-title"
          >
            How it works
          </h2>
        </header>

        <div className="grid w-full grid-cols-2 grid-rows-2 border-x border-border min-[761px]:min-h-0 max-[760px]:grid-cols-1 max-[760px]:grid-rows-none max-[760px]:border-t">
        <SourceQuadrant
          className="border-b border-r max-[760px]:border-r-0"
          isActive={activeSource === 'ideal'}
          onActivate={() => setActiveSource('ideal')}
          source={sourceById.ideal}
        />

        <aside className="relative min-h-0 overflow-hidden border-b border-border bg-[#fbfbfb] p-[clamp(18px,2.8vw,36px)] max-[1080px]:p-[18px] max-[760px]:min-h-[420px] max-[760px]:p-5">
          <div
            className="mirror-arena-enter flex h-full min-h-0 flex-col justify-between gap-4"
            key={activeSource}
          >
            <div className="grid gap-3 max-[1080px]:gap-2">
              <div className="flex flex-wrap items-center justify-between gap-3 text-[0.78rem] font-medium uppercase tracking-normal text-subtle-foreground">
                <span className="text-primary">{selectedSource.title}</span>
              </div>
              <div className="grid gap-2">
                <p className="mb-0 max-w-[700px] text-[clamp(0.9rem,1.2vw,1rem)] leading-[1.5] text-muted-foreground max-[1080px]:text-[0.84rem] max-[1080px]:leading-[1.35]">
                  {selectedSource.measurement}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 max-[1080px]:gap-1.5 max-[760px]:grid-cols-2 max-[760px]:gap-2.5">
              {dimensions.map((dimension, index) => {
                const visual = dimensionVisuals[dimension.key];
                const Icon = visual.Icon;
                const SecondaryIcon = visual.SecondaryIcon;

                return (
                  <div
                    className="mirror-dimension-tag grid min-h-[clamp(66px,9vh,92px)] content-between gap-2 rounded-md border p-2.5 max-[1080px]:min-h-[52px] max-[1080px]:gap-1.5 max-[1080px]:p-2 max-[760px]:min-h-[96px] max-[760px]:gap-2 max-[760px]:p-3"
                    key={dimension.key}
                    style={
                      {
                        '--tag-index': index,
                        backgroundColor: visual.background,
                        borderColor: visual.border,
                      } as CSSProperties
                    }
                  >
                    <span className="flex items-start justify-between gap-2">
                      <span
                        className="relative grid size-8 shrink-0 place-items-center rounded-full bg-white max-[1080px]:size-6 max-[760px]:size-8"
                        style={{ color: visual.color }}
                        aria-hidden="true"
                      >
                        <Icon size={17} />
                        {SecondaryIcon && (
                          <SecondaryIcon
                            className="absolute -right-1 -top-1 rounded-full bg-white"
                            size={12}
                            strokeWidth={2.4}
                          />
                        )}
                      </span>
                      <span className="text-right text-[0.64rem] font-medium uppercase leading-tight text-muted-foreground max-[1080px]:hidden">
                        {visual.cue}
                      </span>
                    </span>
                    <strong className="text-[clamp(0.78rem,0.95vw,0.92rem)] leading-tight text-foreground max-[1080px]:text-[0.72rem] max-[760px]:text-[clamp(0.78rem,0.95vw,0.92rem)]">
                      {dimension.name}
                    </strong>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        <SourceQuadrant
          className="border-r max-[760px]:border-b max-[760px]:border-r-0"
          isActive={activeSource === 'actual'}
          onActivate={() => setActiveSource('actual')}
          source={sourceById.actual}
        />

        <SourceQuadrant
          className="max-[760px]:border-b"
          isActive={activeSource === 'friends'}
          onActivate={() => setActiveSource('friends')}
          source={sourceById.friends}
        />
        </div>
      </div>
    </section>
  );
}
