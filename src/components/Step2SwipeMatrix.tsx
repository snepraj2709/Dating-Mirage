import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { InlineError } from '@/components/ui/flow';
import {
  QuestionnaireCard,
  QuestionnaireFooterButton,
  QuestionnaireOptionButton,
} from '@/components/ui/questionnaire-card';
import { swipeStatements } from '../data/datingMirrorContent';
import { loadActualAnswers, saveActualAnswers } from '../lib/localState';
import { buildActualProfile } from '../lib/scoring';
import type { ActualAnswerMap, ActualFrequencyValue, IntrospectionOption, VectorProfile } from '../types/dating-mirror';

interface Step2SwipeMatrixProps {
  isSaving: boolean;
  saveError?: string | null;
  onBack: () => void;
  onComplete: (actualProfile: VectorProfile) => void;
}

type QuestionMotionState = 'idle' | 'exiting' | 'entering' | 'settling';

const QUESTION_EXIT_MS = 180;
const QUESTION_ENTER_MS = 220;
const QUESTION_ENTER_START_MS = 20;

function answerValueForWeight(weight: IntrospectionOption['weight']): ActualFrequencyValue {
  if (weight === 1.0) {
    return 'always';
  }

  if (weight === 0.66) {
    return 'often';
  }

  if (weight === 0.33) {
    return 'sometimes';
  }

  return 'never';
}

export function Step2SwipeMatrix({ isSaving, saveError, onBack, onComplete }: Step2SwipeMatrixProps) {
  const initialAnswers = useMemo(() => loadActualAnswers(), []);
  const [answers, setAnswers] = useState<ActualAnswerMap>(initialAnswers);
  const [activeIndex, setActiveIndex] = useState(() => {
    const firstUnanswered = swipeStatements.findIndex((statement) => initialAnswers[statement.id] === undefined);
    return firstUnanswered === -1 ? swipeStatements.length - 1 : firstUnanswered;
  });
  const exitTimeoutRef = useRef<number | null>(null);
  const enterTimeoutRef = useRef<number | null>(null);
  const [motionState, setMotionState] = useState<QuestionMotionState>('idle');

  const current = swipeStatements[activeIndex];
  const selectedAnswer = current ? answers[current.id] : undefined;
  const progress = Math.min(activeIndex + 1, swipeStatements.length);
  const progressPercent = (progress / swipeStatements.length) * 100;
  const isLast = activeIndex === swipeStatements.length - 1;
  const isTransitioning = motionState !== 'idle';

  useEffect(() => {
    return () => {
      if (exitTimeoutRef.current !== null) {
        window.clearTimeout(exitTimeoutRef.current);
      }

      if (enterTimeoutRef.current !== null) {
        window.clearTimeout(enterTimeoutRef.current);
      }
    };
  }, []);

  const updateAnswer = (value: ActualFrequencyValue) => {
    if (!current || isSaving) {
      return answers;
    }

    const nextAnswers = { ...answers, [current.id]: value };
    setAnswers(nextAnswers);
    saveActualAnswers(nextAnswers);
    return nextAnswers;
  };

  const resetDeck = () => {
    if (isSaving || isTransitioning) {
      return;
    }

    setAnswers({});
    saveActualAnswers({});
    setActiveIndex(0);
  };

  const answersAreComplete = (source: ActualAnswerMap) =>
    swipeStatements.every((statement) => source[statement.id] !== undefined);

  const transitionToNextQuestion = (next: () => void) => {
    setMotionState('exiting');
    exitTimeoutRef.current = window.setTimeout(() => {
      next();
      setMotionState('entering');
      enterTimeoutRef.current = window.setTimeout(() => {
        setMotionState('idle');
        enterTimeoutRef.current = null;
      }, QUESTION_ENTER_MS);
      window.setTimeout(() => setMotionState('settling'), QUESTION_ENTER_START_MS);
      exitTimeoutRef.current = null;
    }, QUESTION_EXIT_MS);
  };

  const lockActual = (source = answers) => {
    if (!answersAreComplete(source) || isSaving) {
      return;
    }

    onComplete(buildActualProfile(source, swipeStatements));
  };

  const chooseAnswer = (value: ActualFrequencyValue) => {
    if (isSaving || isTransitioning) {
      return;
    }

    const nextAnswers = updateAnswer(value);

    if (isLast) {
      transitionToNextQuestion(() => lockActual(nextAnswers));
      return;
    }

    transitionToNextQuestion(() => setActiveIndex((index) => index + 1));
  };

  const goNext = () => {
    if (!selectedAnswer || isSaving || isTransitioning) {
      return;
    }

    if (isLast) {
      transitionToNextQuestion(() => lockActual());
      return;
    }

    transitionToNextQuestion(() => setActiveIndex((index) => index + 1));
  };

  const goPrevious = () => {
    if (activeIndex === 0) {
      onBack();
      return;
    }

    setActiveIndex((index) => index - 1);
  };

  return (
    <QuestionnaireCard
      titleId="swipe-title"
      stepLabel="Step 2- Actual pattern"
      progressValue={progressPercent}
      progressLabel={`Reality swipe ${progress} of ${swipeStatements.length}`}
      prompt={current.situation}
      helper={current.subtext}
      motionState={motionState}
      footerLeft={
        <QuestionnaireFooterButton onClick={goPrevious}>
          <ArrowLeft size={18} />
          Back
        </QuestionnaireFooterButton>
      }
      footerCenter={
        <QuestionnaireFooterButton onClick={resetDeck} disabled={isSaving || isTransitioning}>
          <RotateCcw size={16} />
          Reset
        </QuestionnaireFooterButton>
      }
      footerRight={
        <QuestionnaireFooterButton
          tone="primary"
          onClick={goNext}
          disabled={!selectedAnswer || isSaving || isTransitioning}
        >
          {isSaving ? 'Saving your pattern...' : isLast ? 'Lock my Actuals' : 'Next'}
          <ArrowRight size={18} />
        </QuestionnaireFooterButton>
      }
    >
      <div className="mx-auto grid w-full max-w-[680px] gap-3" role="radiogroup" aria-labelledby="swipe-title">
        {current.options.map((option) => {
          const value = answerValueForWeight(option.weight);
          const isSelected = selectedAnswer === value;

          return (
            <QuestionnaireOptionButton
              key={`${current.id}-${option.weight}`}
              selected={isSelected}
              role="radio"
              onClick={() => chooseAnswer(value)}
              disabled={isSaving || isTransitioning}
            >
              {option.label}
            </QuestionnaireOptionButton>
          );
        })}
      </div>

      {saveError && <InlineError className="mb-0">{saveError}</InlineError>}
    </QuestionnaireCard>
  );
}
