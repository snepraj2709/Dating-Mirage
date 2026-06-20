import { CircleDashed, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconBadge } from '@/components/ui/icon-badge';
import { Eyebrow } from '@/components/ui/pill';
import { ContentBand } from '@/components/ui/section';
import { Surface } from '@/components/ui/surface';
import { cn } from '@/lib/utils';

type MatrixKey = 'guilty-pleasure' | 'true-blindspot' | 'facade' | 'deep-void';

const matrixItems = [
  {
    key: 'guilty-pleasure',
    icon: Eye,
    label: 'Q1',
    title: 'The Guilty Pleasure',
    badge: 'Known pattern',
    copy: 'You know the choice is messy, and the people close to you see it too. The issue is not awareness. It is repetition.',
    detail:
      'The mirror treats this as high self-awareness with low behavioral discipline: the gap between what you claim to want and who you keep choosing is already visible.',
  },
  {
    key: 'true-blindspot',
    icon: ShieldAlert,
    label: 'Q2',
    title: 'The True Blind Spot',
    badge: 'Friend-revealed',
    copy: 'You believe your choices are aligned with your standards, but your social mirror reports a different pattern.',
    detail:
      'This is where friend feedback matters most. The mirror compares your actual history with what close observers keep seeing from the outside.',
  },
  {
    key: 'facade',
    icon: EyeOff,
    label: 'Q3',
    title: 'The Facade',
    badge: 'Hidden mismatch',
    copy: 'You know where you are settling, reacting, or over-accommodating, but the pattern stays out of the group chat.',
    detail:
      'This lands as a private self-gap: your stated ideal and actual choices disagree even before friend feedback enters the model.',
  },
  {
    key: 'deep-void',
    icon: CircleDashed,
    label: 'Q4',
    title: 'The Deep Void',
    badge: 'Not scored',
    copy: 'A deeper psychological layer that neither you nor your friends can reliably observe through surface behavior.',
    detail:
      'Dating Mirror does not pretend to calculate this layer. It keeps the report focused on observable choices and social feedback.',
  },
] satisfies Array<{
  key: MatrixKey;
  icon: typeof Eye;
  label: string;
  title: string;
  badge: string;
  copy: string;
  detail: string;
}>;

export function LandingJohariMatrix() {
  const [activeKey, setActiveKey] = useState<MatrixKey>('true-blindspot');
  const activeItem = matrixItems.find((item) => item.key === activeKey) ?? matrixItems[0];
  const ActiveIcon = activeItem.icon;

  return (
    <ContentBand className="grid content-center gap-5 py-[clamp(34px,6svh,56px)] max-[620px]:content-start max-[620px]:gap-4 max-[620px]:py-5" id="matrix-breakdown">
      <div className="mx-auto grid max-w-[760px] justify-items-center gap-2 text-center">
        <Eyebrow>Dating Matrix</Eyebrow>
        <h2 className="mb-0 text-[clamp(1.65rem,3.2vw,2.5rem)] leading-[1.08] tracking-normal text-foreground max-[620px]:text-[clamp(1.35rem,7vw,1.8rem)]">
          What you know <span className="text-primary">Vs</span>{' '}
          <span className="underline decoration-primary decoration-[0.08em] underline-offset-[0.12em]">
            What others can see
          </span>
          .
        </h2>
      </div>

      <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] items-stretch gap-5 max-[960px]:grid-cols-1 max-[620px]:block">
        <div className="mobile-snap-row grid grid-cols-2 gap-3 max-[620px]:grid-cols-none" role="list">
          {matrixItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.key === activeKey;
            return (
              <Button
                className={cn(
                  'mobile-snap-item grid min-h-[176px] content-start gap-2.5 rounded-lg p-4 text-left font-medium text-foreground max-[620px]:min-h-[330px] max-[620px]:w-[min(82vw,312px)] max-[620px]:gap-3',
                  isActive && 'border-foreground bg-muted',
                )}
                variant="option"
                size="option"
                type="button"
                aria-pressed={isActive}
                key={item.key}
                onClick={() => setActiveKey(item.key)}
              >
                <span className="flex items-center justify-between gap-2.5">
                  <IconBadge aria-hidden="true">
                    <Icon size={20} />
                  </IconBadge>
                  <span className="text-[0.86rem] text-subtle-foreground">{item.label}</span>
                </span>
                <span className="text-[0.86rem] text-subtle-foreground">{item.badge}</span>
                <strong className="text-[1.08rem] leading-[1.22] text-foreground">{item.title}</strong>
                <span className="text-[0.92rem] leading-[1.42] text-muted-foreground">{item.copy}</span>
                {isActive && (
                  <span className="mt-1 hidden border-t border-border pt-3 text-[0.9rem] leading-[1.45] text-muted-foreground max-[620px]:block">
                    {item.detail}
                  </span>
                )}
              </Button>
            );
          })}
        </div>

        <Surface asChild className="grid content-start gap-3 p-5 max-[620px]:hidden" aria-live="polite">
          <aside>
            <IconBadge aria-hidden="true">
              <ActiveIcon size={22} />
            </IconBadge>
            <Eyebrow>{activeItem.badge}</Eyebrow>
            <h3 className="mb-0 text-xl leading-[1.2] text-foreground">{activeItem.title}</h3>
            <p className="mb-0 text-[0.95rem] leading-[1.5]">{activeItem.detail}</p>
          </aside>
        </Surface>
      </div>
    </ContentBand>
  );
}
