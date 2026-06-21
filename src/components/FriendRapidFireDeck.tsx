import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Send } from 'lucide-react';
import { InlineError } from '@/components/ui/flow';
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
import { appendLocalFriendProfile } from '../lib/localState';
import { buildFriendProfile } from '../lib/scoring';
import type { DimensionKey, RelationshipType } from '../types/dating-mirror';

interface FriendRapidFireDeckProps {
  sessionId: string;
  displayName: string;
}

type QuestionMotionState = 'idle' | 'exiting' | 'entering' | 'settling';

const QUESTION_EXIT_MS = 180;
const QUESTION_ENTER_MS = 220;
const QUESTION_ENTER_START_MS = 20;
const relationshipOptions = Object.entries(relationshipLabels) as Array<[RelationshipType, string]>;

export function FriendRapidFireDeck({ sessionId, displayName }: FriendRapidFireDeckProps) {
  const [relationshipType, setRelationshipType] = useState<RelationshipType | null>(null);
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

    try {
      const profile = buildFriendProfile(nextAnswers);
      await submitFriendFeedback(sessionId, relationshipType, profile);
      setIsComplete(true);
    } catch {
      const profile = buildFriendProfile(nextAnswers);
      const friendCount = appendLocalFriendProfile(sessionId, profile);
      setSubmitMessage(`Saved locally as friend response ${friendCount}.`);
      setIsComplete(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const chooseRelationship = (value: RelationshipType) => {
    if (isSubmitting || isTransitioning) {
      return;
    }

    setRelationshipType(value);
    setActiveIndex(0);
    setAnswers({});
  };

  const chooseAnswer = (score: 1 | 10) => {
    if (!relationshipType || isSubmitting || isTransitioning) {
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
      setRelationshipType(null);
      setAnswers({});
      return;
    }

    setActiveIndex((index) => index - 1);
  };

  const resetFeedback = () => {
    if (isSubmitting || isTransitioning) {
      return;
    }

    setRelationshipType(null);
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
        prompt="You did the brave friend thing."
        helper={`Your individual answers stay private and only blend into ${userLabel}'s aggregate Dating Mirror.`}
      >
        {submitMessage && <InlineError className="mx-auto mb-0 max-w-[680px] text-center">{submitMessage}</InlineError>}
      </QuestionnaireCard>
    );
  }

  if (!relationshipType) {
    return (
      <QuestionnaireCard
        titleId="friend-relationship-title"
        stepLabel="Step 3- Friends feedback"
        progressValue={0}
        progressLabel="Choose your relationship"
        prompt="Be as honest as a true friend should be."
        helper="Your answers are anonymized and aggregated."
      >
        <div className="mx-auto grid w-full max-w-[680px] grid-cols-2 gap-3 max-[620px]:grid-cols-1">
          {relationshipOptions.map(([value, label]) => (
            <QuestionnaireOptionButton key={value} onClick={() => chooseRelationship(value)}>
              {label}
            </QuestionnaireOptionButton>
          ))}
        </div>
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
