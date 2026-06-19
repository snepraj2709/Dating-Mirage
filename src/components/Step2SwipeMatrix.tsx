import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Check, RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FlowShell, InlineError, TopBar } from '@/components/ui/flow';
import { Eyebrow } from '@/components/ui/pill';
import { ProgressRail } from '@/components/ui/progress-rail';
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
    return firstUnanswered === -1 ? 0 : firstUnanswered;
  });
  const feedbackTimeoutRef = useRef<number | null>(null);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragX, setDragX] = useState(0);
  const [stamp, setStamp] = useState<SwipeDirection | null>(null);

  const current = swipeStatements[activeIndex];
  const completedCount = Object.keys(swipes).length;
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

  if (isComplete && !current) {
    return null;
  }

  return (
    <FlowShell className="max-w-[780px]">
      <TopBar>
        <Button variant="ghostPill" onClick={onBack}>
          <ArrowLeft size={18} />
          Back to ideal
        </Button>
        <Button variant="ghostPill" onClick={resetDeck}>
          <RotateCcw size={17} />
          Reset
        </Button>
      </TopBar>

      <section className="grid gap-[18px]" aria-labelledby="swipe-title">
        <ProgressRail
          value={(progress / swipeStatements.length) * 100}
          aria-label={`Card ${progress} of ${swipeStatements.length}`}
        />
        <Eyebrow>
          {progress}/{swipeStatements.length} - Who I Actually Choose
        </Eyebrow>

        <p className="mb-0 max-w-[760px] font-medium leading-[1.5] text-foreground">
          Aspirations are beautiful, but patterns live in our history. Think of your last
          2-3 relationships or situationships. Swipe right if this happened frequently.
        </p>

        <div className="grid gap-[22px]">
          <div className="relative h-[clamp(430px,66vh,580px)] touch-pan-y max-[620px]:h-[470px]" aria-live="polite">
            <div className="absolute inset-0 grid select-none content-start overflow-hidden rounded-lg border border-border bg-card p-[clamp(22px,5vw,42px)] opacity-20 shadow-none [transform:translateY(32px)_scale(0.9)]" />
            <div className="absolute inset-0 grid select-none content-start overflow-hidden rounded-lg border border-border bg-card p-[clamp(22px,5vw,42px)] opacity-40 shadow-none [transform:translateY(16px)_scale(0.95)]" />
            {current && (
              <article
                className="absolute inset-0 grid cursor-grab select-none content-start overflow-hidden rounded-lg border border-border bg-card p-[clamp(22px,5vw,42px)] shadow-none transition-transform duration-100 ease-out active:cursor-grabbing"
                style={{ transform: `translateX(${dragX}px) rotate(${dragX / 18}deg)` }}
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
                      'absolute bottom-[30px] left-[26px] z-10 rounded-lg border-2 border-current px-3.5 py-2.5 font-medium tracking-normal text-foreground [transform:rotate(-8deg)]',
                      stamp === 'right' && 'left-auto right-[26px] [transform:rotate(8deg)]',
                      stamp === 'left' && 'text-muted-foreground',
                    )}
                  >
                    {stamp === 'right' ? 'HELL YES!' : 'THANK U, NEXT'}
                  </span>
                )}
                <h2
                  className="mb-0 text-[clamp(1.65rem,3.6vw,2.75rem)] leading-[1.08] text-foreground"
                  id="swipe-title"
                >
                  {current.statement}
                </h2>
              </article>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 max-[620px]:sticky max-[620px]:bottom-3.5" aria-label="Swipe decisions">
            <Button
              variant="choiceReject"
              size="choice"
              onClick={() => submitSwipe('left')}
              disabled={isSaving || isShowingFeedback}
            >
              <X size={24} />
              Rarely
            </Button>
            <Button
              variant="choiceAccept"
              size="choice"
              onClick={() => submitSwipe('right')}
              disabled={isSaving || isShowingFeedback}
            >
              <Check size={24} />
              Frequently
            </Button>
          </div>
          {saveError && <InlineError>{saveError}</InlineError>}
        </div>
      </section>
    </FlowShell>
  );
}
