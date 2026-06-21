import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { InlineError } from '@/components/ui/flow';
import {
  QuestionnaireCard,
  QuestionnaireFooterButton,
  QuestionnaireOptionButton,
} from '@/components/ui/questionnaire-card';
import { idealQuestions } from '../data/datingMirrorContent';
import { baselineVector, clampScore } from '../lib/scoring';
import { clearIdealDraft, loadIdealDraft, saveIdealDraft } from '../lib/localState';
import type { DimensionKey, IdealQuestionScore, VectorProfile } from '../types/dating-mirror';

interface Step1IdealFlowProps {
  isSaving: boolean;
  initialProfile?: VectorProfile | null;
  saveError?: string | null;
  onBack: () => void;
  onComplete: (profile: VectorProfile) => void;
}

type QuestionMotionState = 'idle' | 'exiting' | 'entering' | 'settling';

const QUESTION_EXIT_MS = 180;
const QUESTION_ENTER_MS = 220;
const QUESTION_ENTER_START_MS = 20;
const idealScores = new Set<number>([1, 4, 7, 10]);

function isIdealQuestionScore(value: unknown): value is IdealQuestionScore {
  return typeof value === 'number' && idealScores.has(value);
}

function sanitizeIdealAnswers(source: Partial<VectorProfile> | VectorProfile): Partial<VectorProfile> {
  return idealQuestions.reduce<Partial<VectorProfile>>((validAnswers, question) => {
    const value = source[question.key];

    if (isIdealQuestionScore(value)) {
      validAnswers[question.key] = value;
    }

    return validAnswers;
  }, {});
}

export function Step1IdealFlow({ isSaving, initialProfile, saveError, onBack, onComplete }: Step1IdealFlowProps) {
  const initialAnswers = useMemo<Partial<VectorProfile>>(() => {
    const draft = sanitizeIdealAnswers(loadIdealDraft());

    if (Object.keys(draft).length > 0) {
      return draft;
    }

    return sanitizeIdealAnswers(initialProfile ?? {});
  }, [initialProfile]);
  const [answers, setAnswers] = useState<Partial<VectorProfile>>(initialAnswers);
  const [activeIndex, setActiveIndex] = useState(() => {
    const firstMissing = idealQuestions.findIndex((question) => initialAnswers[question.key] === undefined);
    return firstMissing === -1 ? idealQuestions.length - 1 : firstMissing;
  });
  const exitTimeoutRef = useRef<number | null>(null);
  const enterTimeoutRef = useRef<number | null>(null);
  const [motionState, setMotionState] = useState<QuestionMotionState>('idle');
  const question = idealQuestions[activeIndex];
  const selectedScore = answers[question.key];
  const progress = activeIndex + 1;
  const progressPercent = (progress / idealQuestions.length) * 100;
  const hasSelectedAnswer = selectedScore !== undefined;
  const isLast = activeIndex === idealQuestions.length - 1;
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

  const updateAnswer = (key: DimensionKey, score: IdealQuestionScore) => {
    const nextAnswers = { ...answers, [key]: score };
    setAnswers(nextAnswers);
    saveIdealDraft(nextAnswers);
    return nextAnswers;
  };

  const buildProfile = (source: Partial<VectorProfile>): VectorProfile => {
    const profile = baselineVector();
    idealQuestions.forEach((item) => {
      const answer = source[item.key];

      if (!isIdealQuestionScore(answer)) {
        throw new Error(`Missing ideal answer for ${item.key}`);
      }

      profile[item.key] = clampScore(answer);
    });
    return profile;
  };

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

  const chooseAnswer = (score: IdealQuestionScore) => {
    if (isSaving || isTransitioning) {
      return;
    }

    const nextAnswers = updateAnswer(question.key, score);

    if (isLast) {
      transitionToNextQuestion(() => onComplete(buildProfile(nextAnswers)));
      return;
    }

    transitionToNextQuestion(() => setActiveIndex((index) => index + 1));
  };

  const goNext = () => {
    if (!hasSelectedAnswer || isTransitioning) {
      return;
    }

    if (isLast) {
      transitionToNextQuestion(() => onComplete(buildProfile(answers)));
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

  const resetIdeal = () => {
    if (isSaving || isTransitioning) {
      return;
    }

    setAnswers({});
    clearIdealDraft();
    setActiveIndex(0);
  };

  return (
    <QuestionnaireCard
      titleId="ideal-title"
      stepLabel="Step 1- Ideal partner"
      progressValue={progressPercent}
      progressLabel={`Question ${progress} of ${idealQuestions.length}`}
      prompt={question.scenario}
      motionState={motionState}
      footerLeft={
        <QuestionnaireFooterButton onClick={goPrevious}>
          <ArrowLeft size={18} />
          Back
        </QuestionnaireFooterButton>
      }
      footerCenter={
        <QuestionnaireFooterButton onClick={resetIdeal} disabled={isSaving || isTransitioning}>
          <RotateCcw size={16} />
          Reset
        </QuestionnaireFooterButton>
      }
      footerRight={
        <QuestionnaireFooterButton
          tone="primary"
          onClick={goNext}
          disabled={isSaving || !hasSelectedAnswer || isTransitioning}
        >
          {isSaving ? 'Saving your mirror...' : isLast ? 'Lock my ideal' : 'Next'}
          <ArrowRight size={18} />
        </QuestionnaireFooterButton>
      }
    >
      <div className="mx-auto grid w-full max-w-[680px] gap-3" role="radiogroup" aria-labelledby="ideal-title">
        {question.options.map((option) => {
          const isSelected = selectedScore === option.score;

          return (
            <QuestionnaireOptionButton
              key={option.score}
              selected={isSelected}
              role="radio"
              onClick={() => chooseAnswer(option.score)}
              disabled={isSaving || isTransitioning}
            >
              {option.label}
            </QuestionnaireOptionButton>
          );
        })}
      </div>

      {saveError && <InlineError>{saveError}</InlineError>}
    </QuestionnaireCard>
  );
}
