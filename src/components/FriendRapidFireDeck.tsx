import { useState } from 'react';
import { Check, HeartHandshake, LockKeyhole, Send } from 'lucide-react';
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
      <main className="friend-screen friend-complete-screen">
        <section className="friend-complete">
          <HeartHandshake size={38} />
          <p className="eyebrow">Feedback sent</p>
          <h2>You did the brave friend thing.</h2>
          <p>
            Your individual answers stay private and only blend into {userLabel}'s aggregate
            Dating Mirror.
          </p>
          {submitMessage && <p className="inline-error">{submitMessage}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="friend-screen">
      <header className="privacy-header">
        <LockKeyhole size={17} />
        Your answers are anonymized and aggregated.
      </header>

      {!relationshipType ? (
        <section className="friend-onboarding">
          <p className="eyebrow">Social Mirror</p>
          <h2>Be as honest as a true friend should be.</h2>
          <p>
            Your individual responses are completely private and aggregated into a high-level report.
          </p>

          <div className="relationship-grid">
            {relationshipOptions.map(([value, label]) => (
              <button key={value} className="relationship-option" onClick={() => setRelationshipType(value)}>
                <Check size={18} />
                {label}
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section className="rapid-fire-stage">
          <div className="progress-rail" aria-label={`Friend question ${activeIndex + 1} of 8`}>
            <span style={{ width: `${((activeIndex + 1) / friendRapidFireQuestions.length) * 100}%` }} />
          </div>
          <p className="eyebrow">
            Quick-Fire Round - {activeIndex + 1}/{friendRapidFireQuestions.length}
          </p>
          <article className="friend-question-card">
            <span className="dimension-token">{context}</span>
            <h2>{current.prompt.replace(/\[User\]/g, userLabel)}</h2>
            <div className="friend-choice-grid">
              <button onClick={() => chooseAnswer(current.optionA.score)} disabled={isSubmitting}>
                {current.optionA.label}
              </button>
              <button onClick={() => chooseAnswer(current.optionB.score)} disabled={isSubmitting}>
                {current.optionB.label}
              </button>
            </div>
            {isSubmitting && (
              <p className="submitting-note">
                <Send size={16} />
                Sending the vibe check...
              </p>
            )}
          </article>
        </section>
      )}
    </main>
  );
}
