import { CircleDashed, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

type MatrixKey = 'guilty-pleasure' | 'true-blindspot' | 'facade' | 'deep-void';

const matrixItems = [
  {
    key: 'guilty-pleasure',
    icon: Eye,
    label: 'Q1',
    title: 'The Guilty Pleasure',
    badge: 'Known pattern',
    copy: 'You know the choice is messy, and the people close to you see it too. The issue is not awareness. It is repetition.',
    detail:
      'The mirror treats this as high self-awareness with low behavioral discipline: the gap between what you claim to want and who you keep choosing is already visible.',
  },
  {
    key: 'true-blindspot',
    icon: ShieldAlert,
    label: 'Q2',
    title: 'The True Blind Spot',
    badge: 'Friend-revealed',
    copy: 'You believe your choices are aligned with your standards, but your social mirror reports a different pattern.',
    detail:
      'This is where friend feedback matters most. The mirror compares your actual history with what close observers keep seeing from the outside.',
  },
  {
    key: 'facade',
    icon: EyeOff,
    label: 'Q3',
    title: 'The Facade',
    badge: 'Hidden mismatch',
    copy: 'You know where you are settling, reacting, or over-accommodating, but the pattern stays out of the group chat.',
    detail:
      'This lands as a private self-gap: your stated ideal and actual choices disagree even before friend feedback enters the model.',
  },
  {
    key: 'deep-void',
    icon: CircleDashed,
    label: 'Q4',
    title: 'The Deep Void',
    badge: 'Not scored',
    copy: 'A deeper psychological layer that neither you nor your friends can reliably observe through surface behavior.',
    detail:
      'Dating Mirror does not pretend to calculate this layer. It keeps the report focused on observable choices and social feedback.',
  },
] satisfies Array<{
  key: MatrixKey;
  icon: typeof Eye;
  label: string;
  title: string;
  badge: string;
  copy: string;
  detail: string;
}>;

export function LandingJohariMatrix() {
  const [activeKey, setActiveKey] = useState<MatrixKey>('true-blindspot');
  const activeItem = matrixItems.find((item) => item.key === activeKey) ?? matrixItems[0];
  const ActiveIcon = activeItem.icon;

  return (
    <section className="content-band matrix-section" id="matrix-breakdown">
      <div className="section-heading centered-heading">
        <p className="eyebrow">Dating Johari Matrix</p>
        <h2>The report separates what you know from what others can see.</h2>
        <p>
          The framework maps romantic choices through self-awareness, friend-observed behavior, and the gap
          between the two.
        </p>
      </div>

      <div className="awareness-legend" aria-label="Awareness legend">
        <span>
          <i className="legend-dot legend-dot--self" />
          Self-aware
        </span>
        <span>
          <i className="legend-dot legend-dot--social" />
          Friend-revealed
        </span>
        <span>
          <i className="legend-dot legend-dot--neutral" />
          Unscored
        </span>
      </div>

      <div className="matrix-layout">
        <div className="matrix-grid" role="list">
          {matrixItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.key === activeKey;
            return (
              <button
                className={`matrix-card ${isActive ? 'active' : ''}`}
                type="button"
                aria-pressed={isActive}
                key={item.key}
                onClick={() => setActiveKey(item.key)}
              >
                <span className="matrix-card__topline">
                  <span className="step-icon" aria-hidden="true">
                    <Icon size={20} />
                  </span>
                  <span className="matrix-label">{item.label}</span>
                </span>
                <span className="matrix-badge">{item.badge}</span>
                <strong>{item.title}</strong>
                <span>{item.copy}</span>
              </button>
            );
          })}
        </div>

        <aside className="matrix-detail-panel" aria-live="polite">
          <span className="step-icon" aria-hidden="true">
            <ActiveIcon size={22} />
          </span>
          <p className="eyebrow">{activeItem.badge}</p>
          <h3>{activeItem.title}</h3>
          <p>{activeItem.detail}</p>
        </aside>
      </div>
    </section>
  );
}
