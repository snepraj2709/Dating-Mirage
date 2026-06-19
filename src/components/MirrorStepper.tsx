import { ChartNoAxesCombined, FlameKindling, MessageCircleHeart, WandSparkles } from 'lucide-react';
import { useState } from 'react';
import type { VectorProfile } from '../types/dating-mirror';
import { RadarChart } from './RadarChart';

const steps = [
  {
    icon: WandSparkles,
    title: 'Your aspiration',
    label: 'Ideal',
    copy: 'Eight dimensions capture the partner you say you want: consistency, autonomy, communication, and boundaries.',
  },
  {
    icon: FlameKindling,
    title: 'Your history',
    label: 'Actual',
    copy: 'A rapid swipe stack converts recent choices into a behavioral vector without asking you to over-explain.',
  },
  {
    icon: MessageCircleHeart,
    title: 'The social mirror',
    label: 'Friends',
    copy: 'Close observers add anonymous signal about what they see you tolerate, repeat, and chase.',
  },
  {
    icon: ChartNoAxesCombined,
    title: 'Triangulated report',
    label: 'Mirror',
    copy: 'The Johari engine compares all three vectors, ranks the largest gaps, and turns them into a report.',
  },
];

const previewIdeal: VectorProfile = {
  CON: 9.1,
  INT: 4.2,
  AUT: 7.4,
  VAL: 2.8,
  GOC: 8.7,
  VUL: 7.1,
  REA: 3.1,
  RWO: 8.9,
};

const previewActual: VectorProfile = {
  CON: 4.1,
  INT: 8.6,
  AUT: 4.3,
  VAL: 7.4,
  GOC: 4.2,
  VUL: 4.8,
  REA: 7.9,
  RWO: 3.6,
};

const previewSocial: VectorProfile = {
  CON: 3.6,
  INT: 8.9,
  AUT: 3.8,
  VAL: 8.1,
  GOC: 3.7,
  VUL: 5.3,
  REA: 8.4,
  RWO: 3.2,
};

export function MirrorStepper() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStep = steps[activeIndex];
  const ActiveIcon = activeStep.icon;

  return (
    <section className="content-band process-section" id="how-it-works">
      <div className="section-heading centered-heading">
        <p className="eyebrow">How your mirror gets formed</p>
        <h2>Three inputs become one pattern map.</h2>
        <p>
          The product compares who you want, who you choose, and what your trusted observers notice.
        </p>
      </div>

      <div className="process-layout">
        <div className="step-grid" role="list">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === activeIndex;
            return (
              <button
                className={`flow-step ${isActive ? 'active' : ''}`}
                key={step.title}
                onClick={() => setActiveIndex(index)}
                type="button"
                aria-pressed={isActive}
              >
                <span className="step-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="step-icon" aria-hidden="true">
                  <Icon size={22} />
                </span>
                <span className="step-label">{step.label}</span>
                <strong>{step.title}</strong>
                <span>{step.copy}</span>
              </button>
            );
          })}
        </div>

        <aside className="process-visual">
          <div className="process-visual__summary">
            <span className="step-icon" aria-hidden="true">
              <ActiveIcon size={22} />
            </span>
            <div>
              <p className="eyebrow">Active layer</p>
              <h3>{activeStep.title}</h3>
              <p>{activeStep.copy}</p>
            </div>
          </div>
          <RadarChart ideal={previewIdeal} actual={previewActual} social={previewSocial} />
        </aside>
      </div>
    </section>
  );
}
