import { History, MessageCircle, Target } from 'lucide-react';

const steps = [
  {
    icon: Target,
    title: 'Name the partner you say you want.',
    label: 'Ideal signal',
    header: 'Launch my mirror: Step 1',
    dimension: 'Dimension 1 of 3',
    progress: '33%',
    lowLabel: 'Unclear preferences',
    highLabel: 'Defined priorities',
    detail:
      'Eight dimensions capture your stated ideal: consistency, autonomy, communication, values, vulnerability, and repair.',
    footer: 'Your aspiration becomes the first vector.',
  },
  {
    icon: History,
    title: 'Map who you actually keep choosing.',
    label: 'Actual pattern',
    header: 'Launch my mirror: Step 2',
    dimension: 'Dimension 2 of 3',
    progress: '66%',
    lowLabel: 'Claimed taste',
    highLabel: 'Repeated behavior',
    detail:
      'A rapid history round turns recent choices into a behavioral vector without asking you to over-explain every date.',
    footer: 'Your choices become the second vector.',
  },
  {
    icon: MessageCircle,
    title: 'Add what trusted observers notice.',
    label: 'Friend feedback',
    header: 'Launch my mirror: Step 3',
    dimension: 'Dimension 3 of 3',
    progress: '100%',
    lowLabel: 'Private self-view',
    highLabel: 'Outside signal',
    detail:
      'Close observers add anonymous signal about what they see you tolerate, repeat, excuse, and chase.',
    footer: 'Friend feedback completes the mirror.',
  },
];

export function MirrorStepper() {
  return (
    <section className="content-band process-section" id="how-it-works">
      <div className="section-heading centered-heading">
        <p className="eyebrow">How your mirror gets formed</p>
        <h2>Three inputs become one pattern map.</h2>
        <p>
          The product compares who you want, who you choose, and what your trusted observers notice.
        </p>
      </div>

      <div className="process-card-list" role="list">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <article className="process-step-card" key={step.header} role="listitem">
              <header className="process-step-card__header">
                <span>{step.header}</span>
                <span>{step.dimension}</span>
              </header>

              <div className="process-step-card__progress" aria-hidden="true">
                <span style={{ width: step.progress }} />
              </div>

              <div className="process-step-card__body">
                <span className="process-step-card__pill">
                  <Icon size={16} />
                  {step.label}
                </span>
                <h3>{step.title}</h3>
              </div>

              <div className="process-step-card__detail">
                <div className="process-step-card__targets">
                  <span>{step.lowLabel}</span>
                  <span>{step.highLabel}</span>
                </div>
                <div className="process-step-card__track" aria-hidden="true">
                  <span />
                </div>
                <div className="process-step-card__selected">
                  <span>Selected direction detail</span>
                  <strong>{step.detail}</strong>
                </div>
              </div>

              <footer className="process-step-card__footer">
                <span>{step.footer}</span>
              </footer>
            </article>
          );
        })}
      </div>
    </section>
  );
}
