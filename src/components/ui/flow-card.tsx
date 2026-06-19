import * as React from 'react';
import { FlowShell } from '@/components/ui/flow';
import { ProgressRail } from '@/components/ui/progress-rail';
import { Surface } from '@/components/ui/surface';
import { cn } from '@/lib/utils';

interface FlowCardProps {
  headerLabel: React.ReactNode;
  headerMeta: React.ReactNode;
  progressValue: number;
  progressLabel?: string;
  progressVariant?: React.ComponentProps<typeof ProgressRail>['variant'];
  children: React.ReactNode;
  footerLeft: React.ReactNode;
  footerRight?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  flowClassName?: string;
  headerClassName?: string;
  'aria-labelledby'?: string;
}

function FlowCard({
  headerLabel,
  headerMeta,
  progressValue,
  progressLabel,
  progressVariant,
  children,
  footerLeft,
  footerRight,
  className,
  contentClassName,
  flowClassName,
  headerClassName,
  'aria-labelledby': ariaLabelledby,
}: FlowCardProps) {
  return (
    <FlowShell
      className={cn(
        'grid min-h-svh w-[min(1120px,calc(100%_-_32px))] content-center py-[clamp(12px,3vh,28px)] max-[620px]:w-[min(100%_-_24px,560px)] max-[620px]:content-start max-[620px]:py-2',
        flowClassName,
      )}
    >
      <Surface
        asChild
        className={cn(
          'relative grid min-h-[min(720px,calc(100svh_-_clamp(24px,6vh,56px)))] content-between gap-[clamp(16px,2.2vh,28px)] overflow-visible p-[clamp(20px,3vw,36px)] max-[620px]:min-h-[calc(100svh_-_16px)] max-[620px]:gap-3.5 max-[620px]:p-[18px]',
          className,
        )}
      >
        <section aria-labelledby={ariaLabelledby}>
          <header className="grid gap-3 max-[620px]:gap-2.5">
            <div
              className={cn(
                'flex items-center justify-between gap-4 text-[0.9rem] font-medium uppercase tracking-normal text-subtle-foreground max-[620px]:flex-col max-[620px]:items-start max-[620px]:gap-2.5',
                headerClassName,
              )}
            >
              <span>{headerLabel}</span>
              <span>{headerMeta}</span>
            </div>
            <ProgressRail value={progressValue} variant={progressVariant} aria-label={progressLabel} />
          </header>

          <div className={cn('grid gap-[clamp(18px,2.5vh,28px)]', contentClassName)}>
            {children}
          </div>

          <footer className="flex items-center justify-between gap-[18px] border-t border-border pt-[clamp(16px,2.4vh,22px)] max-[620px]:flex-col max-[620px]:items-stretch max-[620px]:gap-2.5 max-[620px]:pt-3">
            {footerLeft}
            {footerRight && <div className="flex justify-end max-[620px]:contents">{footerRight}</div>}
          </footer>
        </section>
      </Surface>
    </FlowShell>
  );
}

export { FlowCard };
