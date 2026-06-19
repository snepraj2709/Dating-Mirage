import { ChartNoAxesCombined, FlameKindling, MessageCircleHeart, WandSparkles } from 'lucide-react';

const steps = [
  {
    icon: WandSparkles,
    title: 'Who I Say I Want',
    copy: 'Eight vivid sliders capture your ideal partner without showing numbers.',
  },
  {
    icon: FlameKindling,
    title: 'Who I Actually Choose',
    copy: 'A rapid swipe stack checks the patterns hiding in your last 2-3 connections.',
  },
  {
    icon: MessageCircleHeart,
    title: 'What Friends Notice',
    copy: 'A private link lets close observers answer an anonymous 60-second vibe check.',
  },
  {
    icon: ChartNoAxesCombined,
    title: 'The Mirror Analysis',
    copy: 'The Johari engine finds the top two gaps and turns them into a share card.',
  },
];

export function MirrorStepper() {
  return (
    <section className="content-band" id="how-it-works">
      <div className="section-heading">
        <p className="eyebrow">How your mirror gets formed</p>
        <h2>The gap is usually obvious to the people who know you.</h2>
      </div>
      <div className="step-grid">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <article className="flow-step" key={step.title}>
              <span className="step-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="step-icon" aria-hidden="true">
                <Icon size={22} />
              </span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

