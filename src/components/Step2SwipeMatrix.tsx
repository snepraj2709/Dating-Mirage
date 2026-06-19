import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FlowCard } from '@/components/ui/flow-card';
import { InlineError } from '@/components/ui/flow';
import { Pill } from '@/components/ui/pill';
import { cn } from '@/lib/utils';
import { swipeStatements } from '../data/datingMirrorContent';
import { loadActualSwipes, saveActualSwipes } from '../lib/localState';
import { buildActualProfile } from '../lib/scoring';
import type { VectorProfile } from '../types/dating-mirror';

type SwipeDirection = 'left' | 'right';

const SWIPE_STAMP_DURATION_MS = 700;

interface Step2SwipeMatrixProps {
  isSaving: boolean;
  saveError?: string | null;
  onBack: () => void;
  onComplete: (actualProfile: VectorProfile) => void;
}

export function Step2SwipeMatrix({ isSaving, saveError, onBack, onComplete }: Step2SwipeMatrixProps) {
  const initialSwipes = useMemo(() => loadActualSwipes(), []);
  const [swipes, setSwipes] = useState<Record<string, SwipeDirection>>(initialSwipes);
  const [activeIndex, setActiveIndex] = useState(() => {
    const firstUnanswered = swipeStatements.findIndex((statement) => initialSwipes[statement.id] === undefined);
    return firstUnanswered === -1 ? swipeStatements.length - 1 : firstUnanswered;
  });
  const feedbackTimeoutRef = useRef<number | null>(null);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragX, setDragX] = useState(0);
  const [stamp, setStamp] = useState<SwipeDirection | null>(null);

  const current = swipeStatements[activeIndex];
  const completedCount = swipeStatements.filter((statement) => swipes[statement.id] !== undefined).length;
  const progress = Math.min(activeIndex + 1, swipeStatements.length);
  const isComplete = completedCount >= swipeStatements.length;
  const isShowingFeedback = stamp !== null;

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current !== null) {
        window.clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  const triggerHaptic = (direction: SwipeDirection) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(direction === 'right' ? [18, 22, 18] : 18);
    }
  };

  const submitSwipe = (direction: SwipeDirection) => {
    if (!current || isSaving || isShowingFeedback) {
      return;
    }

    const nextSwipes = { ...swipes, [current.id]: direction };
    setSwipes(nextSwipes);
    saveActualSwipes(nextSwipes);
    setStamp(direction);
    triggerHaptic(direction);

    feedbackTimeoutRef.current = window.setTimeout(() => {
      setStamp(null);
      setDragX(0);
      feedbackTimeoutRef.current = null;

      if (activeIndex === swipeStatements.length - 1) {
        setActiveIndex(swipeStatements.length - 1);
        onComplete(buildActualProfile(nextSwipes, swipeStatements));
      } else {
        setActiveIndex((index) => index + 1);
      }
    }, SWIPE_STAMP_DURATION_MS);
  };

  const resetDeck = () => {
    if (feedbackTimeoutRef.current !== null) {
      window.clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = null;
    }
    setSwipes({});
    saveActualSwipes({});
    setActiveIndex(0);
    setStamp(null);
    setDragX(0);
  };

  const handlePointerUp = (clientX: number) => {
    if (dragStart === null) {
      return;
    }

    const delta = clientX - dragStart;
    setDragStart(null);

    if (Math.abs(delta) > 82) {
      submitSwipe(delta > 0 ? 'right' : 'left');
      return;
    }

    setDragX(0);
  };

  const lockActual = () => {
    if (!isComplete || isSaving || isShowingFeedback) {
      return;
    }

    onComplete(buildActualProfile(swipes, swipeStatements));
  };

  return (
    <FlowCard
      aria-labelledby="swipe-title"
      headerLabel="LAUNCH MY MIRROR: STEP 2 (REALITY SWIPES)"
      headerMeta={`REALITY SWIPE ${progress} OF ${swipeStatements.length}`}
      progressValue={(progress / swipeStatements.length) * 100}
      progressLabel={`Reality swipe ${progress} of ${swipeStatements.length}`}
      contentClassName="place-items-center"
      footerLeft={
        <Button variant="ghostPill" onClick={onBack} className="max-[620px]:w-full">
          <ArrowLeft size={18} />
          Back
        </Button>
      }
      footerRight={
        isComplete ? (
          <Button
            variant="ghostPill"
            className="min-w-[170px] max-[620px]:w-full"
            onClick={lockActual}
            disabled={isSaving || isShowingFeedback}
          >
            {isSaving ? 'Saving your pattern...' : 'Lock my Actual'}
            <ArrowRight size={18} />
          </Button>
        ) : (
          <Button variant="ghostPill" size="compact" onClick={resetDeck} className="max-[620px]:w-full">
            <RotateCcw size={17} />
            Reset
          </Button>
        )
      }
    >
      <div className="grid w-full max-w-[940px] justify-items-center gap-[clamp(22px,3.2vh,34px)] text-center">
        <Pill className="min-h-[34px] border-border-strong bg-muted px-5 text-[0.86rem] uppercase tracking-normal text-foreground">
          ACTUAL HISTORY SWIPES
        </Pill>

        <h2
          className="mb-0 text-[clamp(1.75rem,3.6vw,2.85rem)] leading-[1.08] text-foreground max-[620px]:text-[clamp(1.55rem,8vw,2.15rem)]"
          id="swipe-title"
        >
          How frequently did this dynamic happen in your past?
        </h2>

        <div className="relative w-full touch-pan-y" aria-live="polite">
          {current && (
            <article
              className="relative grid min-h-[clamp(180px,28vh,250px)] cursor-grab select-none place-items-center overflow-hidden rounded-lg border border-border bg-muted p-[clamp(22px,4vw,46px)] shadow-none transition-transform duration-100 ease-out active:cursor-grabbing"
              style={{ transform: `translateX(${dragX}px) rotate(${dragX / 24}deg)` }}
              onPointerDown={(event) => {
                setDragStart(event.clientX);
                event.currentTarget.setPointerCapture(event.pointerId);
              }}
              onPointerMove={(event) => {
                if (dragStart !== null) {
                  setDragX(event.clientX - dragStart);
                }
              }}
              onPointerUp={(event) => handlePointerUp(event.clientX)}
              onPointerCancel={() => {
                setDragStart(null);
                setDragX(0);
              }}
            >
              {stamp && (
                <span
                  className={cn(
                    'absolute left-5 top-5 z-10 rounded-full border border-current bg-card px-3.5 py-2 text-[0.78rem] font-medium uppercase tracking-normal text-muted-foreground [transform:rotate(-6deg)]',
                    stamp === 'right' && 'left-auto right-5 text-primary [transform:rotate(6deg)]',
                  )}
                >
                  {stamp === 'right' ? 'Frequently' : 'Rarely'}
                </span>
              )}
              <p className="mb-0 max-w-[820px] text-[clamp(1.18rem,2.6vw,2rem)] font-medium italic leading-[1.45] text-foreground max-[620px]:text-[1.08rem]">
                "{current.statement}"
              </p>
            </article>
          )}
        </div>

        <div className="grid w-full max-w-[440px] grid-cols-2 gap-3 max-[620px]:max-w-none" aria-label="Swipe decisions">
          <Button
            variant="choiceReject"
            size="choice"
            onClick={() => submitSwipe('left')}
            disabled={isSaving || isShowingFeedback}
          >
            Rarely 💔
          </Button>
          <Button
            size="choice"
            className="border-primary bg-primary text-primary-foreground hover:border-primary-hover hover:bg-primary-hover"
            onClick={() => submitSwipe('right')}
            disabled={isSaving || isShowingFeedback}
          >
            Frequently 💘
          </Button>
        </div>

        {isComplete && (
          <Button
            variant="ghostPill"
            size="compact"
            onClick={resetDeck}
            disabled={isSaving || isShowingFeedback}
          >
            <RotateCcw size={17} />
            Reset answers
          </Button>
        )}

        {saveError && <InlineError className="mb-0 text-center">{saveError}</InlineError>}
      </div>
    </FlowCard>
  );
}
