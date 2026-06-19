import { useState } from 'react';
import { Check, HeartHandshake, LockKeyhole, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FlowShell, InlineError } from '@/components/ui/flow';
import { Eyebrow, Pill } from '@/components/ui/pill';
import { ProgressRail } from '@/components/ui/progress-rail';
import { Surface } from '@/components/ui/surface';
import { submitFriendFeedback } from '../api/client';
import {
  friendRapidFireQuestions,
  relationshipContext,
  relationshipLabels,
} from '../data/datingMirrorContent';
import { appendLocalFriendProfile } from '../lib/localState';
import { buildFriendProfile } from '../lib/scoring';
import type { DimensionKey, RelationshipType } from '../types/dating-mirror';
import { VerticalStoryCard } from './VerticalStoryCard';

interface FriendRapidFireDeckProps {
  sessionId: string;
  displayName: string;
}

const relationshipOptions = Object.entries(relationshipLabels) as Array<[RelationshipType, string]>;

export function FriendRapidFireDeck({ sessionId, displayName }: FriendRapidFireDeckProps) {
  const [relationshipType, setRelationshipType] = useState<RelationshipType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<DimensionKey, 1 | 10>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const userLabel = displayName || 'your friend';
  const current = friendRapidFireQuestions[activeIndex];
  const context = relationshipType ? relationshipContext[relationshipType] : 'from up close';

  const chooseAnswer = async (score: 1 | 10) => {
    if (!relationshipType || isSubmitting) {
      return;
    }

    const nextAnswers = { ...answers, [current.key]: score };
    setAnswers(nextAnswers);

    if (activeIndex < friendRapidFireQuestions.length - 1) {
      setActiveIndex((index) => index + 1);
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

  if (isComplete) {
    return (
      <FlowShell className="grid w-[min(1040px,calc(100%_-_32px))] justify-items-center pb-14 max-[620px]:w-[min(100%_-_24px,520px)]">
        <VerticalStoryCard
          icon={<HeartHandshake size={38} />}
          eyebrow="Feedback sent"
          title="You did the brave friend thing."
          body={
            <p>
              Your individual answers stay private and only blend into {userLabel}'s aggregate Dating Mirror.
            </p>
          }
          meta={submitMessage ? <InlineError>{submitMessage}</InlineError> : undefined}
        />
      </FlowShell>
    );
  }

  return (
    <FlowShell className="w-[min(1040px,calc(100%_-_32px))] pb-14 max-[620px]:w-[min(100%_-_24px,520px)]">
      <header className="sticky top-3.5 z-10 mx-auto mb-[22px] flex min-h-[46px] w-fit items-center gap-2 rounded-full border border-border bg-card px-[18px] font-medium text-foreground shadow-none max-[620px]:w-full max-[620px]:justify-center max-[620px]:text-center">
        <LockKeyhole size={17} />
        Your answers are anonymized and aggregated.
      </header>

      {!relationshipType ? (
        <Surface asChild className="mx-auto mt-[clamp(32px,10vh,96px)] w-[min(760px,100%)]">
          <section>
          <Eyebrow>Social Mirror</Eyebrow>
          <h2 className="text-[clamp(1.9rem,5.5vw,3.6rem)] leading-[1.05] text-foreground">
            Be as honest as a true friend should be.
          </h2>
          <p>
            Your individual responses are completely private and aggregated into a high-level report.
          </p>

          <div className="mt-[22px] grid grid-cols-2 gap-3 max-[620px]:grid-cols-1">
            {relationshipOptions.map(([value, label]) => (
              <Button key={value} variant="option" size="option" onClick={() => setRelationshipType(value)}>
                <Check size={18} />
                {label}
              </Button>
            ))}
          </div>
          </section>
        </Surface>
      ) : (
        <section className="mx-auto w-[min(760px,100%)]">
          <ProgressRail
            value={((activeIndex + 1) / friendRapidFireQuestions.length) * 100}
            aria-label={`Friend question ${activeIndex + 1} of 8`}
          />
          <Eyebrow className="mt-[18px]">
            Quick-Fire Round - {activeIndex + 1}/{friendRapidFireQuestions.length}
          </Eyebrow>
          <Surface asChild>
            <article>
            <Pill>{context}</Pill>
            <h2 className="text-[clamp(1.9rem,5.5vw,3.6rem)] leading-[1.05] text-foreground">
              {current.prompt.replace(/\[User\]/g, userLabel)}
            </h2>
            <div className="mt-[22px] grid grid-cols-2 gap-3 max-[620px]:grid-cols-1">
              <Button
                variant="option"
                size="friendChoice"
                onClick={() => chooseAnswer(current.optionA.score)}
                disabled={isSubmitting}
              >
                {current.optionA.label}
              </Button>
              <Button
                variant="option"
                size="friendChoice"
                onClick={() => chooseAnswer(current.optionB.score)}
                disabled={isSubmitting}
              >
                {current.optionB.label}
              </Button>
            </div>
            {isSubmitting && (
              <p className="mt-4 inline-flex items-center gap-2 font-medium">
                <Send size={16} />
                Sending the vibe check...
              </p>
            )}
            </article>
          </Surface>
        </section>
      )}
    </FlowShell>
  );
}
