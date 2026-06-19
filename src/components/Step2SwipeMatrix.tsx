import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Check, RotateCcw, X } from 'lucide-react';
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
    <main className="flow-screen swipe-screen">
      <div className="flow-topbar">
        <button className="ghost-button" onClick={onBack}>
          <ArrowLeft size={18} />
          Back to ideal
        </button>
        <button className="ghost-button" onClick={resetDeck}>
          <RotateCcw size={17} />
          Reset
        </button>
      </div>

      <section className="question-stage" aria-labelledby="swipe-title">
        <div className="progress-rail" aria-label={`Card ${progress} of ${swipeStatements.length}`}>
          <span style={{ width: `${(progress / swipeStatements.length) * 100}%` }} />
        </div>
        <p className="eyebrow">
          {progress}/{swipeStatements.length} - Who I Actually Choose
        </p>

        <p className="swipe-disclaimer">
          Aspirations are beautiful, but patterns live in our history. Think of your last
          2-3 relationships or situationships. Swipe right if this happened frequently.
        </p>

        <div className="swipe-layout">
          <div className="swipe-deck" aria-live="polite">
            <div className="swipe-card shadow-card second-shadow" />
            <div className="swipe-card shadow-card" />
            {current && (
              <article
                className="swipe-card active-card"
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
                  <span className={`swipe-stamp ${stamp}`}>
                    {stamp === 'right' ? 'HELL YES!' : 'THANK U, NEXT'}
                  </span>
                )}
                <h2 id="swipe-title">{current.statement}</h2>
              </article>
            )}
          </div>

          <div className="swipe-actions" aria-label="Swipe decisions">
            <button
              className="choice-button reject"
              onClick={() => submitSwipe('left')}
              disabled={isSaving || isShowingFeedback}
            >
              <X size={24} />
              Rarely
            </button>
            <button
              className="choice-button accept"
              onClick={() => submitSwipe('right')}
              disabled={isSaving || isShowingFeedback}
            >
              <Check size={24} />
              Frequently
            </button>
          </div>
          {saveError && <p className="inline-error">{saveError}</p>}
        </div>
      </section>
    </main>
  );
}
