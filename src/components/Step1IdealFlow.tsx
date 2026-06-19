import { type CSSProperties, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FlowCard } from '@/components/ui/flow-card';
import { InlineError } from '@/components/ui/flow';
import { Pill } from '@/components/ui/pill';
import { Surface } from '@/components/ui/surface';
import { sliderQuestions } from '../data/datingMirrorContent';
import { baselineVector, clampScore } from '../lib/scoring';
import { loadIdealDraft, saveIdealDraft } from '../lib/localState';
import type { DimensionKey, VectorProfile } from '../types/dating-mirror';

interface Step1IdealFlowProps {
  isSaving: boolean;
  initialProfile?: VectorProfile | null;
  saveError?: string | null;
  onBack: () => void;
  onComplete: (profile: VectorProfile) => void;
}

export function Step1IdealFlow({ isSaving, initialProfile, saveError, onBack, onComplete }: Step1IdealFlowProps) {
  const initialAnswers = useMemo<Partial<VectorProfile>>(() => {
    const draft = loadIdealDraft();
    return Object.keys(draft).length > 0 ? draft : (initialProfile ?? {});
  }, [initialProfile]);
  const [answers, setAnswers] = useState<Partial<VectorProfile>>(initialAnswers);
  const [activeIndex, setActiveIndex] = useState(() => {
    const firstMissing = sliderQuestions.findIndex((question) => initialAnswers[question.key] === undefined);
    return firstMissing === -1 ? sliderQuestions.length - 1 : firstMissing;
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
    <FlowCard
      aria-labelledby="ideal-title"
      headerLabel="Launch my mirror: Step 1"
      headerMeta={`Dimension ${progress} of ${sliderQuestions.length}`}
      progressValue={(progress / sliderQuestions.length) * 100}
      progressLabel={`Question ${progress} of ${sliderQuestions.length}`}
      footerLeft={
        <Button variant="ghostPill" onClick={goPrevious} className="max-[620px]:w-full">
          <ArrowLeft size={18} />
          {activeIndex === 0 ? 'Back' : 'Previous'}
        </Button>
      }
      footerRight={
        <Button
          size="flow"
          className="w-[min(320px,100%)] max-[620px]:w-full max-[620px]:min-h-12"
          onClick={goNext}
          disabled={isSaving}
        >
          {isSaving ? 'Saving your mirror...' : isLast ? 'Lock my ideal' : 'Next'}
          <ArrowRight size={18} />
        </Button>
      }
    >
      <div className="grid max-w-[860px] gap-[clamp(14px,2vh,20px)] max-[620px]:gap-3">
        <Pill className="min-h-[30px] w-fit justify-self-start px-2.5 text-[0.82rem]">{question.title}</Pill>
        <h2
          className="max-w-[820px] text-[clamp(1.6rem,3.35vw,2.75rem)] leading-[1.08] text-foreground max-[620px]:text-[clamp(1.5rem,8.5vw,2.1rem)] max-[620px]:leading-[1.04]"
          id="ideal-title"
        >
          {question.scenario}
        </h2>
      </div>

      <Surface className="grid gap-[clamp(14px,2vh,20px)] p-[clamp(18px,2.6vw,28px)] max-[620px]:gap-3 max-[620px]:p-4" variant="muted">
        <div className="flex items-center justify-between gap-4 text-[0.86rem] font-medium uppercase tracking-normal text-subtle-foreground max-[620px]:flex-col max-[620px]:items-start max-[620px]:gap-2.5">
          <span>Low score target</span>
          <span>High score target</span>
        </div>

        <div className="grid min-h-[34px] items-center max-[620px]:min-h-7">
          <input
            aria-label={`Preference slider for ${question.title}`}
            className="score-range"
            type="range"
            min="1"
            max="10"
            step="0.1"
            value={value}
            style={{ '--score-percent': `${scorePercent}%` } as CSSProperties}
            onChange={(event) => updateAnswer(question.key, Number(event.target.value))}
          />
        </div>

        <div className="grid gap-2.5 border-t border-border pt-[clamp(14px,2vh,20px)] text-center max-[620px]:gap-2 max-[620px]:pt-3 max-[620px]:text-left">
          <span className="text-[0.86rem] font-medium uppercase tracking-normal text-subtle-foreground">
            Selected direction detail
          </span>
          <strong className="mx-auto max-w-[780px] text-[clamp(0.98rem,1.5vw,1.1rem)] leading-[1.45] text-foreground max-[620px]:mx-0 max-[620px]:text-[0.96rem] max-[620px]:leading-[1.35]">
            {selectedDetail}
          </strong>
        </div>
      </Surface>

      {saveError && <InlineError>{saveError}</InlineError>}
    </FlowCard>
  );
}
