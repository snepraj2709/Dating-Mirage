import { History, MessageCircle, Target } from 'lucide-react';
import { Pill } from '@/components/ui/pill';
import { ProgressRail } from '@/components/ui/progress-rail';
import { ContentBand, SectionHeading } from '@/components/ui/section';
import { Surface } from '@/components/ui/surface';

const steps = [
  {
    icon: Target,
    title: 'Name the partner you say you want.',
    label: 'Ideal signal',
    header: 'Launch my mirror: Step 1',
    dimension: 'Dimension 1 of 3',
    progress: '33%',
    lowLabel: 'Unclear preferences',
    highLabel: 'Defined priorities',
    detail:
      'Eight dimensions capture your stated ideal: consistency, autonomy, communication, values, vulnerability, and repair.',
    footer: 'Your aspiration becomes the first vector.',
  },
  {
    icon: History,
    title: 'Map who you actually keep choosing.',
    label: 'Actual pattern',
    header: 'Launch my mirror: Step 2',
    dimension: 'Dimension 2 of 3',
    progress: '66%',
    lowLabel: 'Claimed taste',
    highLabel: 'Repeated behavior',
    detail:
      'A rapid history round turns recent choices into a behavioral vector without asking you to over-explain every date.',
    footer: 'Your choices become the second vector.',
  },
  {
    icon: MessageCircle,
    title: 'Add what trusted observers notice.',
    label: 'Friend feedback',
    header: 'Launch my mirror: Step 3',
    dimension: 'Dimension 3 of 3',
    progress: '100%',
    lowLabel: 'Private self-view',
    highLabel: 'Outside signal',
    detail:
      'Close observers add anonymous signal about what they see you tolerate, repeat, excuse, and chase.',
    footer: 'Friend feedback completes the mirror.',
  },
];

export function MirrorStepper() {
  return (
    <ContentBand id="how-it-works">
      <SectionHeading
        centered
        eyebrow="How your mirror gets formed"
        title="Three inputs become one pattern map."
        description="The product compares who you want, who you choose, and what your trusted observers notice."
      />

      <div className="grid gap-[18px] overflow-visible" role="list">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <Surface
              asChild
              className="grid gap-7 overflow-visible max-[620px]:gap-[22px] max-[620px]:p-[22px]"
              key={step.header}
              padding="roomy"
            >
              <article role="listitem">
              <header className="flex items-center justify-between gap-4 text-[0.9rem] font-medium uppercase tracking-normal text-subtle-foreground max-[620px]:flex-col max-[620px]:items-start max-[620px]:gap-2">
                <span>{step.header}</span>
                <span>{step.dimension}</span>
              </header>

              <ProgressRail value={parseFloat(step.progress)} aria-label={step.dimension} />

              <div className="grid max-w-[820px] gap-[22px] max-[620px]:gap-[18px]">
                <Pill className="w-fit border-border-strong bg-card text-foreground">
                  <Icon size={16} />
                  {step.label}
                </Pill>
                <h3 className="mb-0 max-w-[820px] text-[clamp(1.65rem,3.6vw,3rem)] leading-[1.08] text-foreground">
                  {step.title}
                </h3>
              </div>

              <Surface className="grid gap-5" padding="panel" variant="muted">
                <div className="flex items-center justify-between gap-4 text-[0.84rem] font-medium uppercase tracking-normal text-subtle-foreground max-[620px]:flex-col max-[620px]:items-start max-[620px]:gap-2">
                  <span>{step.lowLabel}</span>
                  <span>{step.highLabel}</span>
                </div>
                <div
                  className="relative h-2 overflow-hidden rounded-full bg-muted after:absolute after:left-1/2 after:top-1/2 after:size-4 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:border-[3px] after:border-muted after:bg-foreground after:content-['']"
                  aria-hidden="true"
                >
                  <span className="block size-full rounded-[inherit] bg-border-strong" />
                </div>
                <div className="grid gap-3 border-t border-border pt-5 text-center max-[620px]:text-left">
                  <span className="text-[0.84rem] font-medium uppercase tracking-normal text-subtle-foreground">
                    Selected direction detail
                  </span>
                  <strong className="mx-auto max-w-[780px] text-[clamp(1rem,1.8vw,1.18rem)] leading-[1.55] text-foreground max-[620px]:mx-0">
                    {step.detail}
                  </strong>
                </div>
              </Surface>

              <footer className="flex items-center justify-between gap-4 border-t border-border pt-[22px] text-[0.84rem] font-medium text-subtle-foreground max-[620px]:flex-col max-[620px]:items-start max-[620px]:gap-2">
                <span>{step.footer}</span>
              </footer>
              </article>
            </Surface>
          );
        })}
      </div>
    </ContentBand>
  );
}
