import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  QuestionnaireCard,
  QuestionnaireFooterButton,
  QuestionnaireOptionButton,
} from '@/components/ui/questionnaire-card';
import { submitFriendFeedback } from '../api/client';
import {
  friendRapidFireQuestions,
  relationshipContext,
  relationshipLabels,
} from '../data/datingMirrorContent';
import { appendLocalFriendFeedback } from '../lib/localState';
import { buildFriendProfile } from '../lib/scoring';
import type { DimensionKey, FriendFeedbackSubmission, RelationshipType } from '../types/dating-mirror';

interface FriendRapidFireDeckProps {
  sessionId: string;
  displayName: string;
}

type QuestionMotionState = 'idle' | 'exiting' | 'entering' | 'settling';

const QUESTION_EXIT_MS = 180;
const QUESTION_ENTER_MS = 220;
const QUESTION_ENTER_START_MS = 20;
const ANONYMOUS_FRIEND_NAME = 'anonymous';
const relationshipOptions = Object.entries(relationshipLabels) as Array<[RelationshipType, string]>;

export function FriendRapidFireDeck({ sessionId, displayName }: FriendRapidFireDeckProps) {
  const [relationshipType, setRelationshipType] = useState<RelationshipType | ''>('');
  const [hasStartedQuestions, setHasStartedQuestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<DimensionKey, 1 | 10>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const exitTimeoutRef = useRef<number | null>(null);
  const enterTimeoutRef = useRef<number | null>(null);
  const [motionState, setMotionState] = useState<QuestionMotionState>('idle');

  const userLabel = displayName || 'your friend';
  const current = friendRapidFireQuestions[activeIndex];
  const context = relationshipType ? relationshipContext[relationshipType] : 'from up close';
  const canStartQuestions = relationshipType !== '';
  const selectedScore = current ? answers[current.key] : undefined;
  const progressPercent = ((activeIndex + 1) / friendRapidFireQuestions.length) * 100;
  const isLast = activeIndex === friendRapidFireQuestions.length - 1;
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

  const submitAnswers = async (nextAnswers: Partial<Record<DimensionKey, 1 | 10>>) => {
    if (!relationshipType || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    const feedback: FriendFeedbackSubmission = {
      friendName: ANONYMOUS_FRIEND_NAME,
      relationshipType,
      relationshipLabel: relationshipLabels[relationshipType],
      socialVector: buildFriendProfile(nextAnswers),
    };

    try {
      await submitFriendFeedback(sessionId, feedback);
      setIsComplete(true);
    } catch {
      const friendCount = appendLocalFriendFeedback(sessionId, feedback);
      setSubmitMessage(`Saved locally as friend response ${friendCount}.`);
      setIsComplete(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const startQuestions = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || isTransitioning) {
      return;
    }

    if (!canStartQuestions) {
      return;
    }

    setHasStartedQuestions(true);
    setActiveIndex(0);
    setAnswers({});
  };

  const chooseAnswer = (score: 1 | 10) => {
    if (!hasStartedQuestions || !relationshipType || isSubmitting || isTransitioning) {
      return;
    }

    const nextAnswers = { ...answers, [current.key]: score };
    setAnswers(nextAnswers);

    if (isLast) {
      void submitAnswers(nextAnswers);
      return;
    }

    transitionToNextQuestion(() => setActiveIndex((index) => index + 1));
  };

  const goPrevious = () => {
    if (isSubmitting || isTransitioning) {
      return;
    }

    if (activeIndex === 0) {
      setHasStartedQuestions(false);
      setAnswers({});
      return;
    }

    setActiveIndex((index) => index - 1);
  };

  const resetFeedback = () => {
    if (isSubmitting || isTransitioning) {
      return;
    }

    setRelationshipType('');
    setHasStartedQuestions(false);
    setActiveIndex(0);
    setAnswers({});
    setSubmitMessage(null);
  };

  const goNext = () => {
    if (selectedScore === undefined || isSubmitting || isTransitioning) {
      return;
    }

    if (isLast) {
      void submitAnswers(answers);
      return;
    }

    transitionToNextQuestion(() => setActiveIndex((index) => index + 1));
  };

  if (isComplete) {
    return (
      <QuestionnaireCard
        titleId="friend-complete-title"
        stepLabel="Step 3- Friends feedback"
        progressValue={100}
        progressLabel="Feedback sent"
        contentClassName="min-h-[620px] grid-rows-[auto_1fr] max-[620px]:min-h-[calc(100svh_-_60px)]"
        prompt={`You just helped ${userLabel} see their dating patterns.`}
        promptClassName="self-center gap-6"
        helper="Want to see yours? Build your own Dating Mirror and invite friends to return the favor."
        promptFooter={
          <>
            {submitMessage && (
              <p className="mb-0 text-[clamp(0.95rem,1.35vw,1.05rem)] font-medium text-primary">
                {submitMessage}
              </p>
            )}
            <Button
              asChild
              className="mt-4 min-h-[52px] rounded-full border-primary bg-primary px-8 text-[1rem] font-semibold text-primary-foreground hover:border-primary-hover hover:bg-primary-hover max-[620px]:mt-2 max-[620px]:w-full max-[620px]:max-w-[280px]"
              size="pill"
              variant="primary"
            >
              <a href="/?start=ideal">
                Start my Dating Mirror
                <ArrowRight size={18} />
              </a>
            </Button>
          </>
        }
      />
    );
  }

  if (!hasStartedQuestions) {
    return (
      <QuestionnaireCard
        titleId="friend-relationship-title"
        stepLabel="Step 3- Friends feedback"
        progressValue={0}
        progressLabel="Friend intake"
        prompt="Be as honest as a true friend should be."
        footerRight={
          <QuestionnaireFooterButton
            className="max-[620px]:min-h-12 max-[620px]:max-w-[220px] max-[620px]:px-4 max-[620px]:text-[0.86rem] max-[620px]:leading-[1.15]"
            disabled={!canStartQuestions || isSubmitting || isTransitioning}
            form="friend-intake-form"
            tone="primary"
            type="submit"
          >
            Let's see how well you know your friend
          </QuestionnaireFooterButton>
        }
      >
        <form
          id="friend-intake-form"
          className="mx-auto grid w-full max-w-[680px] gap-5 text-left"
          onSubmit={startQuestions}
        >
          <Label className="gap-2 text-[0.95rem] text-muted-foreground">
            How are you two related
            <select
              className="min-h-[50px] rounded-lg border border-border bg-card px-4 text-[1rem] font-medium text-foreground outline-none transition-colors focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
              onChange={(event) => setRelationshipType(event.target.value as RelationshipType)}
              value={relationshipType}
            >
              <option disabled value="">
                Select relationship
              </option>
              {relationshipOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Label>
        </form>
      </QuestionnaireCard>
    );
  }

  return (
    <QuestionnaireCard
      titleId="friend-question-title"
      stepLabel="Step 3- Friends feedback"
      progressValue={progressPercent}
      progressLabel={`Friend question ${activeIndex + 1} of ${friendRapidFireQuestions.length}`}
      prompt={current.prompt.replace(/\[User\]/g, userLabel)}
      helper={`Answer from what you notice ${context}. Your response stays private.`}
      motionState={motionState}
      footerLeft={
        <QuestionnaireFooterButton onClick={goPrevious} disabled={isSubmitting || isTransitioning}>
          <ArrowLeft size={18} />
          Back
        </QuestionnaireFooterButton>
      }
      footerCenter={
        <QuestionnaireFooterButton onClick={resetFeedback} disabled={isSubmitting || isTransitioning}>
          <RotateCcw size={16} />
          Reset
        </QuestionnaireFooterButton>
      }
      footerRight={
        <QuestionnaireFooterButton
          tone="primary"
          onClick={goNext}
          disabled={selectedScore === undefined || isSubmitting || isTransitioning}
        >
          {isSubmitting ? 'Sending...' : isLast ? 'Send' : 'Next'}
          {isSubmitting ? <Send size={17} /> : <ArrowRight size={18} />}
        </QuestionnaireFooterButton>
      }
    >
      <div className="mx-auto grid w-full max-w-[680px] grid-cols-2 gap-3 max-[620px]:grid-cols-1" role="radiogroup" aria-labelledby="friend-question-title">
        <QuestionnaireOptionButton
          selected={selectedScore === current.optionA.score}
          role="radio"
          onClick={() => chooseAnswer(current.optionA.score)}
          disabled={isSubmitting || isTransitioning}
        >
          {current.optionA.label}
        </QuestionnaireOptionButton>
        <QuestionnaireOptionButton
          selected={selectedScore === current.optionB.score}
          role="radio"
          onClick={() => chooseAnswer(current.optionB.score)}
          disabled={isSubmitting || isTransitioning}
        >
          {current.optionB.label}
        </QuestionnaireOptionButton>
      </div>
    </QuestionnaireCard>
  );
}
