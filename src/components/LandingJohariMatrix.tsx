import { CircleDashed, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconBadge } from '@/components/ui/icon-badge';
import { Eyebrow, Pill } from '@/components/ui/pill';
import { ContentBand, SectionHeading } from '@/components/ui/section';
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
    <ContentBand className="pt-[72px]" id="matrix-breakdown">
      <SectionHeading
        centered
        eyebrow="Dating Johari Matrix"
        title="The report separates what you know from what others can see."
        description="The framework maps romantic choices through self-awareness, friend-observed behavior, and the gap between the two."
      />

      <div className="mb-6 flex flex-wrap justify-center gap-2.5" aria-label="Awareness legend">
        <Pill className="bg-card">
          <i className="size-2.5 rounded-full bg-positive" />
          Self-aware
        </Pill>
        <Pill className="bg-card">
          <i className="size-2.5 rounded-full bg-warning" />
          Friend-revealed
        </Pill>
        <Pill className="bg-card">
          <i className="size-2.5 rounded-full bg-subtle-foreground" />
          Unscored
        </Pill>
      </div>

      <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] items-stretch gap-6 max-[960px]:grid-cols-1">
        <div className="grid grid-cols-2 gap-3.5 max-[620px]:grid-cols-1" role="list">
          {matrixItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.key === activeKey;
            return (
              <Button
                className={cn(
                  'grid min-h-[230px] content-start gap-3 rounded-lg p-5 text-left font-medium text-foreground max-[620px]:min-h-auto',
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
                <strong className="text-[1.18rem] leading-[1.25] text-foreground">{item.title}</strong>
                <span className="text-muted-foreground leading-[1.5]">{item.copy}</span>
              </Button>
            );
          })}
        </div>

        <Surface asChild className="grid content-start gap-3 p-6" aria-live="polite">
          <aside>
          <IconBadge aria-hidden="true">
            <ActiveIcon size={22} />
          </IconBadge>
          <Eyebrow>{activeItem.badge}</Eyebrow>
          <h3 className="mb-0 text-xl leading-[1.2] text-foreground">{activeItem.title}</h3>
          <p className="mb-0">{activeItem.detail}</p>
          </aside>
        </Surface>
      </div>
    </ContentBand>
  );
}
