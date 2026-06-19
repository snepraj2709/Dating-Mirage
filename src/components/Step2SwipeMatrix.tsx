import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FlowCard } from '@/components/ui/flow-card';
import { InlineError } from '@/components/ui/flow';
import { Pill } from '@/components/ui/pill';
import { cn } from '@/lib/utils';
import { dimensions, swipeStatements } from '../data/datingMirrorContent';
import { loadActualAnswers, saveActualAnswers } from '../lib/localState';
import { buildActualProfile } from '../lib/scoring';
import type { ActualAnswerMap, ActualFrequencyValue, DimensionKey, VectorProfile } from '../types/dating-mirror';

interface Step2SwipeMatrixProps {
  isSaving: boolean;
  saveError?: string | null;
  onBack: () => void;
  onComplete: (actualProfile: VectorProfile) => void;
}

const frequencyOptions: Array<{ value: ActualFrequencyValue; label: string; description: string }> = [
  { value: 'never', label: 'Never', description: 'This was not really my pattern.' },
  { value: 'sometimes', label: 'Sometimes', description: 'It happened, but it was not the default.' },
  { value: 'often', label: 'Often', description: 'This was a real pattern in my history.' },
  { value: 'always', label: 'Always', description: 'This showed up almost every time.' },
];

const contextLabels: Partial<Record<DimensionKey, string>> = {
  CON: 'Communication consistency',
  INT: 'Pace and intensity',
  AUT: 'Autonomy balance',
  VAL: 'Validation pull',
  GOC: 'Conflict comfort',
  VUL: 'Vulnerability pace',
  REA: 'Emotional reactivity',
  RWO: 'Boundary standard',
};

const dimensionNames = dimensions.reduce<Record<DimensionKey, string>>((names, dimension) => {
  names[dimension.key] = dimension.name;
  return names;
}, {} as Record<DimensionKey, string>);

export function Step2SwipeMatrix({ isSaving, saveError, onBack, onComplete }: Step2SwipeMatrixProps) {
  const initialAnswers = useMemo(() => loadActualAnswers(), []);
  const [answers, setAnswers] = useState<ActualAnswerMap>(initialAnswers);
  const [activeIndex, setActiveIndex] = useState(() => {
    const firstUnanswered = swipeStatements.findIndex((statement) => initialAnswers[statement.id] === undefined);
    return firstUnanswered === -1 ? swipeStatements.length - 1 : firstUnanswered;
  });

  const current = swipeStatements[activeIndex];
  const selectedAnswer = current ? answers[current.id] : undefined;
  const completedCount = swipeStatements.filter((statement) => answers[statement.id] !== undefined).length;
  const progress = Math.min(activeIndex + 1, swipeStatements.length);
  const progressPercent = (progress / swipeStatements.length) * 100;
  const isComplete = completedCount >= swipeStatements.length;
  const isLast = activeIndex === swipeStatements.length - 1;

  const updateAnswer = (value: ActualFrequencyValue) => {
    if (!current || isSaving) {
      return;
    }

    const nextAnswers = { ...answers, [current.id]: value };
    setAnswers(nextAnswers);
    saveActualAnswers(nextAnswers);
  };

  const resetDeck = () => {
    setAnswers({});
    saveActualAnswers({});
    setActiveIndex(0);
  };

  const goNext = () => {
    if (!selectedAnswer || isSaving) {
      return;
    }

    if (isLast) {
      lockActual();
      return;
    }

    setActiveIndex((index) => index + 1);
  };

  const lockActual = () => {
    if (!isComplete || isSaving) {
      return;
    }

    onComplete(buildActualProfile(answers, swipeStatements));
  };

  return (
    <FlowCard
      aria-labelledby="swipe-title"
      headerLabel={`Step 2 - your history - swipe ${progress} of ${swipeStatements.length}`}
      headerMeta={`${Math.round(progressPercent)}%`}
      headerClassName="normal-case text-[clamp(0.95rem,1.6vw,1.08rem)] text-muted-foreground"
      progressValue={progressPercent}
      progressLabel={`Reality swipe ${progress} of ${swipeStatements.length}`}
      contentClassName="gap-[clamp(18px,2.4vh,28px)]"
      footerLeft={
        <Button variant="ghostPill" onClick={onBack} className="max-[620px]:w-full">
          <ArrowLeft size={18} />
          Back
        </Button>
      }
      footerRight={
        <div className="flex justify-end gap-3 max-[620px]:contents">
          <Button
            variant="ghostPill"
            size="compact"
            onClick={resetDeck}
            disabled={isSaving}
            className="max-[620px]:w-full"
          >
            <RotateCcw size={17} />
            Reset
          </Button>

          <Button
            variant="ghostPill"
            className="min-w-[150px] max-[620px]:w-full"
            onClick={goNext}
            disabled={!selectedAnswer || isSaving}
          >
            {isSaving ? 'Saving your pattern...' : isLast ? 'Lock my Actuals' : 'Next'}
            <ArrowRight size={18} />
          </Button>
        </div>
      }
    >
      <div className="grid max-w-[900px] gap-[clamp(14px,2vh,18px)]">
        <Pill className="min-h-[34px] w-fit border-border-strong bg-card px-4 text-[0.92rem] tracking-normal text-foreground">
          {contextLabels[current.key] ?? dimensionNames[current.key]}
        </Pill>

        <h2
          className="mb-0 text-[clamp(1.15rem,2vw,1.45rem)] leading-[1.25] text-muted-foreground"
          id="swipe-title"
        >
          How often did this show up in your past relationships?
        </h2>
      </div>

      <figure className="mb-0 grid min-h-[clamp(140px,22vh,190px)] place-items-center rounded-lg border border-border bg-muted p-[clamp(22px,4vw,38px)]">
        <blockquote className="mb-0 max-w-[860px] text-[clamp(1.2rem,2.7vw,2rem)] font-medium italic leading-[1.45] text-foreground max-[620px]:text-[1.05rem]">
          "{current.statement}"
        </blockquote>
      </figure>

      <div className="grid gap-3" role="radiogroup" aria-labelledby="swipe-title">
        <span className="text-[0.9rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          How true was this for you
        </span>
        {frequencyOptions.map((option) => {
          const isSelected = selectedAnswer === option.value;

          return (
            <Button
              aria-checked={isSelected}
              className={cn(
                'grid min-h-[70px] grid-cols-[96px_1fr] items-center justify-start gap-3 rounded-lg px-6 py-4 text-left text-[clamp(1rem,1.45vw,1.12rem)] leading-[1.4] max-[620px]:min-h-[64px] max-[620px]:grid-cols-1 max-[620px]:gap-1.5 max-[620px]:px-4 max-[620px]:py-3',
                isSelected
                  ? 'border-primary bg-[#fff2f8] text-foreground hover:border-primary hover:bg-[#fff2f8]'
                  : 'border-input bg-card text-muted-foreground hover:border-border-strong hover:bg-muted hover:text-foreground',
              )}
              key={option.value}
              role="radio"
              size="option"
              type="button"
              variant="option"
              onClick={() => updateAnswer(option.value)}
              disabled={isSaving}
            >
              <span className={cn('text-[0.96rem] text-muted-foreground', isSelected && 'text-primary')}>
                {option.label}
              </span>
              <span className={cn('block', isSelected && 'font-semibold')}>{option.description}</span>
            </Button>
          );
        })}
      </div>

      {saveError && <InlineError className="mb-0">{saveError}</InlineError>}
    </FlowCard>
  );
}
