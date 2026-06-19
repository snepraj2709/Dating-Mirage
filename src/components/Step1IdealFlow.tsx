import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
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
  const completedCount = sliderQuestions.filter((item) => answers[item.key] !== undefined).length;

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

  const highlightClass = value < 4 ? 'left' : value > 7 ? 'right' : 'center';

  return (
    <main className="flow-screen">
      <div className="flow-topbar">
        <button className="ghost-button" onClick={goPrevious}>
          <ArrowLeft size={18} />
          {activeIndex === 0 ? 'Back' : 'Previous'}
        </button>
        <div className="progress-chip">
          <Save size={16} />
          Autosaved
        </div>
      </div>

      <section className="question-stage" aria-labelledby="ideal-title">
        <div className="progress-rail" aria-label={`Question ${progress} of ${sliderQuestions.length}`}>
          <span style={{ width: `${(progress / sliderQuestions.length) * 100}%` }} />
        </div>
        <p className="eyebrow">
          {progress}/{sliderQuestions.length} - Who I Say I Want
        </p>
        <article className="question-card">
          <div className="question-card-header">
            <span className="dimension-token">{question.title}</span>
            <span className="completed-token">{completedCount}/8 answered</span>
          </div>
          < h2 id="ideal-title">{question.scenario}</ h2>

          <div className={`anchor-grid anchor-${highlightClass}`}>
            <button
              className="anchor-copy"
              aria-label="Choose the left anchor"
              onClick={() => updateAnswer(question.key, 1)}
            >
              {question.leftAnchor}
            </button>
            <button
              className="anchor-copy center-anchor"
              aria-label="Choose the center anchor"
              onClick={() => updateAnswer(question.key, 5.5)}
            >
              {question.centerAnchor}
            </button>
            <button
              className="anchor-copy"
              aria-label="Choose the right anchor"
              onClick={() => updateAnswer(question.key, 10)}
            >
              {question.rightAnchor}
            </button>
          </div>

          <div className="slider-wrap">
            <input
              aria-label={`Preference slider for ${question.title}`}
              type="range"
              min="1"
              max="10"
              step="0.1"
              value={value}
              onChange={(event) => updateAnswer(question.key, Number(event.target.value))}
            />
          </div>

          {saveError && <p className="inline-error">{saveError}</p>}

          <button className="primary-button flow-continue" onClick={goNext} disabled={isSaving}>
            {isSaving ? 'Saving your mirror...' : isLast ? 'Lock my ideal' : 'Next card'}
            <ArrowRight size={18} />
          </button>
        </article>
      </section>
    </main>
  );
}
