import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FlowCard } from '@/components/ui/flow-card';
import { InlineError } from '@/components/ui/flow';
import { Pill } from '@/components/ui/pill';
import { idealQuestions } from '../data/datingMirrorContent';
import { baselineVector, clampScore } from '../lib/scoring';
import { loadIdealDraft, saveIdealDraft } from '../lib/localState';
import { cn } from '../lib/utils';
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

  return (
    <FlowCard
      aria-labelledby="ideal-title"
      headerLabel={`Your ideal - question ${progress} of ${idealQuestions.length}`}
      headerMeta={`${Math.round(progressPercent)}%`}
      headerClassName="normal-case text-[clamp(0.95rem,1.6vw,1.08rem)] text-muted-foreground"
      progressValue={progressPercent}
      progressLabel={`Question ${progress} of ${idealQuestions.length}`}
      footerLeft={
        <Button variant="ghostPill" onClick={goPrevious} className="max-[620px]:w-full">
          <ArrowLeft size={18} />
          {activeIndex === 0 ? 'Back' : 'Previous'}
        </Button>
      }
      footerRight={
        <Button
          variant="ghostPill"
          className="min-w-[140px] max-[620px]:w-full"
          onClick={goNext}
          disabled={isSaving || !hasSelectedAnswer}
        >
          {isSaving ? 'Saving your mirror...' : isLast ? 'Lock my ideal' : 'Next'}
          <ArrowRight size={18} />
        </Button>
      }
    >
      <div
        className={cn(
          'grid gap-[clamp(18px,2.5vh,28px)] transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none',
          motionState === 'exiting' && '-translate-x-[22px] scale-[0.985] opacity-0 motion-reduce:translate-x-0 motion-reduce:scale-100 motion-reduce:opacity-100',
          motionState === 'entering' && 'translate-x-[22px] scale-[0.985] opacity-0 motion-reduce:translate-x-0 motion-reduce:scale-100 motion-reduce:opacity-100',
        )}
      >
        <div className="grid max-w-[900px] gap-[clamp(16px,2.3vh,24px)] max-[620px]:gap-3">
          <Pill className="min-h-[30px] w-fit justify-self-start border-border-strong bg-card px-3 text-[0.88rem] text-foreground">
            {question.title}
          </Pill>
          <h2
            className="mb-0 max-w-[860px] text-[clamp(1.55rem,3vw,2.4rem)] leading-[1.12] text-foreground max-[620px]:text-[clamp(1.45rem,7.5vw,2rem)] max-[620px]:leading-[1.08]"
            id="ideal-title"
          >
            {question.scenario}
          </h2>
        </div>

        <div className="grid gap-3" role="radiogroup" aria-labelledby="ideal-title">
          {question.options.map((option) => {
            const isSelected = selectedScore === option.score;

            return (
              <Button
                aria-checked={isSelected}
                className={cn(
                  'min-h-[68px] justify-start rounded-lg px-6 py-4 text-left text-[clamp(1rem,1.45vw,1.12rem)] leading-[1.45] transition-[background,border-color,color,transform] max-[620px]:min-h-[60px] max-[620px]:px-4 max-[620px]:py-3 max-[620px]:text-[0.98rem]',
                  isSelected
                    ? 'border-primary bg-[#fff2f8] text-foreground hover:border-primary hover:bg-[#fff2f8]'
                    : 'border-input bg-card text-muted-foreground hover:border-border-strong hover:bg-muted hover:text-foreground',
                )}
                key={option.score}
                role="radio"
                size="option"
                type="button"
                variant="option"
                onClick={() => chooseAnswer(option.score)}
                disabled={isSaving || isTransitioning}
              >
                <span className={cn('block', isSelected && 'font-semibold')}>{option.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {saveError && <InlineError>{saveError}</InlineError>}
    </FlowCard>
  );
}
