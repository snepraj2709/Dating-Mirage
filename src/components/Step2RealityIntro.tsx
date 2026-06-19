import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FlowCard } from '@/components/ui/flow-card';
import { InlineError } from '@/components/ui/flow';

interface Step2RealityIntroProps {
  statusMessage?: string | null;
  onBack: () => void;
  onContinue: () => void;
}

export function Step2RealityIntro({ statusMessage, onBack, onContinue }: Step2RealityIntroProps) {
  return (
    <FlowCard
      aria-labelledby="actual-intro-title"
      headerLabel="THE PATTERN REALITY CHECK"
      headerMeta="DIMENSION 8 OF 8"
      progressValue={100}
      progressLabel="Step 1 complete"
      contentClassName="place-items-center text-center"
      footerLeft={
        <Button variant="ghostPill" onClick={onBack} className="max-[620px]:w-full">
          Back
        </Button>
      }
      footerRight={
        <Button size="flow" className="w-[min(320px,100%)] max-[620px]:w-full max-[620px]:min-h-12" onClick={onContinue}>
          Let's Face Reality 😱
        </Button>
      }
    >
      <div className="mx-auto grid max-w-[760px] justify-items-center gap-[clamp(18px,3vh,28px)]">
        <div className="flex items-center justify-center gap-5 text-[clamp(2rem,5vw,3rem)] leading-none" aria-hidden="true">
          <span>💔</span>
          <ArrowRight className="text-foreground" size={44} strokeWidth={2.4} />
          <span>🪞</span>
        </div>

        <div className="grid gap-4">
          <h2
            id="actual-intro-title"
            className="text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] text-foreground max-[620px]:text-[clamp(1.9rem,10vw,2.6rem)]"
          >
            Time for a Reality Check.
          </h2>
          <p className="mx-auto mb-0 max-w-[660px] text-[clamp(1.04rem,2vw,1.35rem)] font-medium leading-[1.48] text-muted-foreground max-[620px]:text-[1rem]">
            Stating what you want is easy. Facing who you actually swipe on and tolerate is where patterns hide.
            Let's audit your last 3 relationships. Be brutally honest; no one is looking.
          </p>
        </div>

        <p className="mb-0 text-[0.92rem] font-medium uppercase tracking-normal text-subtle-foreground">
          Next: Swift Rapid-Fire Choice Matrix
        </p>

        {statusMessage && <InlineError className="mb-0 text-center">{statusMessage}</InlineError>}
      </div>
    </FlowCard>
  );
}
