import { type CSSProperties, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { sliderQuestions } from '../data/datingMirrorContent';
import { baselineVector, clampScore } from '../lib/scoring';
import { loadIdealDraft, saveIdealDraft } from '../lib/localState';
import type { DimensionKey, VectorProfile } from '../types/dating-mirror';

interface Step1IdealFlowProps {
  isSaving: boolean;
  saveError?: string | null;
  onBack: () => void;
  onComplete: (profile: VectorProfile) => void;
}

export function Step1IdealFlow({ isSaving, saveError, onBack, onComplete }: Step1IdealFlowProps) {
  const initialDraft = useMemo(() => loadIdealDraft(), []);
  const [answers, setAnswers] = useState<Partial<VectorProfile>>(initialDraft);
  const [activeIndex, setActiveIndex] = useState(() => {
    const firstMissing = sliderQuestions.findIndex((question) => initialDraft[question.key] === undefined);
    return firstMissing === -1 ? 0 : firstMissing;
  });
  const question = sliderQuestions[activeIndex];
  const value = answers[question.key] ?? 5.5;
  const progress = activeIndex + 1;
  const isLast = activeIndex === sliderQuestions.length - 1;

  const updateAnswer = (key: DimensionKey, rawValue: number) => {
    const nextValue = clampScore(rawValue);
    const nextAnswers = { ...answers, [key]: nextValue };
    setAnswers(nextAnswers);
    saveIdealDraft(nextAnswers);
  };

  const buildProfile = (): VectorProfile => {
    const profile = baselineVector();
    sliderQuestions.forEach((item) => {
      profile[item.key] = clampScore(answers[item.key] ?? 5.5);
    });
    return profile;
  };

  const goNext = () => {
    if (isLast) {
      onComplete(buildProfile());
      return;
    }

    setActiveIndex((index) => index + 1);
  };

  const goPrevious = () => {
    if (activeIndex === 0) {
      onBack();
      return;
    }
    setActiveIndex((index) => index - 1);
  };

  const selectedDetail =
    value < 4
      ? question.leftAnchor
      : value > 7
        ? question.rightAnchor
        : question.centerAnchor;
  const scorePercent = ((value - 1) / 9) * 100;

  return (
    <main className="flow-screen ideal-flow-screen">
      <section className="question-stage" aria-labelledby="ideal-title">
        <article className="question-card">
          <div className="question-card-header">
            <span>Launch my mirror: Step 1</span>
            <span>
              Dimension {progress} of {sliderQuestions.length}
            </span>
          </div>

          <div className="progress-rail" aria-label={`Question ${progress} of ${sliderQuestions.length}`}>
            <span style={{ width: `${(progress / sliderQuestions.length) * 100}%` }} />
          </div>

          <div className="question-card-body">
            <span className="dimension-token">{question.title}</span>
            <h2 id="ideal-title">{question.scenario}</h2>
          </div>

          <div className="score-detail-panel">
            <div className="score-target-row">
              <span>Low score target</span>
              <span>High score target</span>
            </div>

            <div className="score-track">
              <input
                aria-label={`Preference slider for ${question.title}`}
                type="range"
                min="1"
                max="10"
                step="0.1"
                value={value}
                style={{ '--score-percent': `${scorePercent}%` } as CSSProperties}
                onChange={(event) => updateAnswer(question.key, Number(event.target.value))}
              />
            </div>

            <div className="selected-detail">
              <span>Selected direction detail</span>
              <strong>{selectedDetail}</strong>
            </div>
          </div>

          {saveError && <p className="inline-error">{saveError}</p>}

          <div className="question-card-footer">
            <button className="ghost-button" onClick={goPrevious}>
              <ArrowLeft size={18} />
              {activeIndex === 0 ? 'Back' : 'Previous'}
            </button>
            <button className="primary-button flow-continue" onClick={goNext} disabled={isSaving}>
              {isSaving ? 'Saving your mirror...' : isLast ? 'Lock my ideal' : 'Next'}
              <ArrowRight size={18} />
            </button>
          </div>
        </article>
      </section>
    </main>
  );
}
