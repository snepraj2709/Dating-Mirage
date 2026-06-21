import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FlowCard } from '@/components/ui/flow-card';

interface Step2RealityIntroProps {
  statusMessage?: string | null;
  onBack: () => void;
  onContinue: () => void;
}

export function Step2RealityIntro({ onBack, onContinue }: Step2RealityIntroProps) {
  return (
    <FlowCard
      aria-labelledby="actual-intro-title"
      headerLabel="THE PATTERN REALITY CHECK"
      headerMeta="DIMENSION 8 OF 8"
      progressValue={100}
      progressLabel="Step 1 complete"
      contentClassName="place-items-center self-stretch text-center"
      hideHeader
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
            Having an Ideal standard is easy. Knowing who you actually right swipe on and tolerate is where the reality hide.
            Think of your last 3 relationships while answering the next set of questions. Be brutally honest with yourself.
          </p>
        </div>

      </div>
    </FlowCard>
  );
}
