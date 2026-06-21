import * as React from 'react';
import { Button } from '@/components/ui/button';
import { FlowShell } from '@/components/ui/flow';
import { ProgressRail } from '@/components/ui/progress-rail';
import { cn } from '@/lib/utils';

type QuestionnaireMotionState = 'idle' | 'exiting' | 'entering' | 'settling';

interface QuestionnaireCardProps {
  titleId: string;
  stepLabel?: React.ReactNode;
  progressValue: number;
  progressLabel: string;
  prompt: React.ReactNode;
  helper?: React.ReactNode;
  children?: React.ReactNode;
  footerLeft?: React.ReactNode;
  footerCenter?: React.ReactNode;
  footerRight?: React.ReactNode;
  motionState?: QuestionnaireMotionState;
  className?: string;
  contentClassName?: string;
  promptClassName?: string;
}

type QuestionnaireOptionButtonProps = Omit<React.ComponentProps<typeof Button>, 'variant' | 'size'> & {
  selected?: boolean;
};

type QuestionnaireFooterButtonProps = Omit<React.ComponentProps<typeof Button>, 'variant'> & {
  tone?: 'ghost' | 'primary';
};

function QuestionnaireCard({
  titleId,
  stepLabel,
  progressValue,
  progressLabel,
  prompt,
  helper,
  children,
  footerLeft,
  footerCenter,
  footerRight,
  motionState = 'idle',
  className,
  contentClassName,
  promptClassName,
}: QuestionnaireCardProps) {
  const hasFooter = footerLeft || footerCenter || footerRight;
  const hasThreePartFooter = footerLeft || footerCenter;

  return (
    <FlowShell className="grid min-h-svh w-[min(760px,calc(100%_-_32px))] content-center py-[clamp(18px,4vh,48px)] max-[620px]:w-[min(100%_-_20px,520px)] max-[620px]:content-start max-[620px]:py-2.5">
      <section
        aria-labelledby={titleId}
        className={cn(
          'grid min-h-[min(720px,calc(100svh_-_clamp(36px,8vh,96px)))] content-between gap-[clamp(24px,4vh,48px)] rounded-[24px] border border-[#f2f2f2] bg-card p-[clamp(30px,4.8vw,52px)] text-card-foreground shadow-[0_26px_80px_rgba(17,17,17,0.09)] max-[620px]:min-h-[calc(100svh_-_20px)] max-[620px]:gap-6 max-[620px]:rounded-[20px] max-[620px]:p-5',
          className,
        )}
      >
        <div
          className={cn(
            'grid gap-[clamp(28px,5vh,48px)] transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none',
            motionState === 'exiting' &&
              '-translate-x-[22px] scale-[0.985] opacity-0 motion-reduce:translate-x-0 motion-reduce:scale-100 motion-reduce:opacity-100',
            motionState === 'entering' &&
              'translate-x-[22px] scale-[0.985] opacity-0 motion-reduce:translate-x-0 motion-reduce:scale-100 motion-reduce:opacity-100',
            contentClassName,
          )}
        >
          <div className="flex min-h-5 items-center justify-between gap-4">
            {stepLabel ? (
              <span className="text-[0.95rem] font-medium leading-none text-subtle-foreground max-[620px]:text-[0.88rem]">
                {stepLabel}
              </span>
            ) : (
              <span aria-hidden="true" />
            )}
            <ProgressRail
              value={progressValue}
              variant="accent"
              className="h-1.5 w-14 shrink-0 bg-[#eceff3]"
              aria-label={progressLabel}
            />
          </div>

          <div className={cn('mx-auto grid w-full max-w-[690px] justify-items-center gap-5 text-center', promptClassName)}>
            <h2
              id={titleId}
              className="mb-0 text-[clamp(1.55rem,2.35vw,2rem)] font-semibold leading-[1.38] tracking-normal text-foreground max-[620px]:text-[1.42rem] max-[620px]:leading-[1.28]"
            >
              {prompt}
            </h2>
            {helper && (
              <p className="mb-0 max-w-[650px] text-[clamp(0.9rem,1.35vw,0.98rem)] font-semibold italic leading-[1.25] text-subtle-foreground max-[620px]:text-[0.88rem]">
                {helper}
              </p>
            )}
          </div>

          {children}
        </div>

        {hasFooter && (
          <footer
            className={cn(
              'border-t border-border pt-[clamp(18px,2.8vh,26px)] max-[620px]:pt-4',
              hasThreePartFooter
                ? 'grid grid-cols-[1fr_auto_1fr] items-center gap-3 max-[620px]:gap-2'
                : 'flex items-center justify-end',
            )}
          >
            {hasThreePartFooter ? (
              <>
                <div className="justify-self-start">{footerLeft}</div>
                <div className="justify-self-center">{footerCenter}</div>
                <div className="justify-self-end">{footerRight}</div>
              </>
            ) : (
              footerRight
            )}
          </footer>
        )}
      </section>
    </FlowShell>
  );
}

function QuestionnaireOptionButton({
  selected = false,
  className,
  children,
  ...props
}: QuestionnaireOptionButtonProps) {
  return (
    <Button
      aria-checked={props.role === 'radio' ? selected : undefined}
      className={cn(
        'min-h-[74px] w-full justify-start rounded-[14px] border border-border bg-card px-7 py-5 text-left text-[clamp(1rem,1.45vw,1.12rem)] font-medium leading-[1.22] text-foreground shadow-none transition-[background,border-color,color,transform] hover:border-primary hover:bg-[#fff7fb] hover:text-foreground max-[620px]:min-h-[64px] max-[620px]:rounded-xl max-[620px]:px-4 max-[620px]:py-3 max-[620px]:text-[0.98rem]',
        selected && 'border-primary bg-[#fff7fb] text-foreground ring-1 ring-primary hover:border-primary hover:bg-[#fff7fb]',
        className,
      )}
      size="option"
      type="button"
      variant="option"
      {...props}
    >
      {children}
    </Button>
  );
}

function QuestionnaireFooterButton({
  tone = 'ghost',
  className,
  children,
  ...props
}: QuestionnaireFooterButtonProps) {
  return (
    <Button
      className={cn(
        tone === 'primary'
          ? 'min-h-12 min-w-[122px] rounded-full border-primary bg-primary px-7 text-[0.95rem] font-semibold text-primary-foreground hover:border-primary-hover hover:bg-primary-hover max-[620px]:min-w-[104px] max-[620px]:px-5'
          : 'min-h-11 border-transparent bg-transparent px-2 text-[0.95rem] font-semibold text-subtle-foreground hover:border-transparent hover:bg-transparent hover:text-foreground max-[620px]:px-1',
        className,
      )}
      size={tone === 'primary' ? 'pill' : 'compact'}
      variant={tone === 'primary' ? 'primary' : 'ghostPill'}
      {...props}
    >
      {children}
    </Button>
  );
}

export { QuestionnaireCard, QuestionnaireFooterButton, QuestionnaireOptionButton };
export type { QuestionnaireMotionState };
