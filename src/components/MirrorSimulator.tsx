import { ArrowRight } from 'lucide-react';
import { useMemo, useState } from 'react';

interface MirrorSimulatorProps {
  onStart: () => void;
}

function clampWidth(gap: number) {
  return `${Math.min(100, (gap / 9) * 100)}%`;
}

export function MirrorSimulator({ onStart }: MirrorSimulatorProps) {
  const [ideal, setIdeal] = useState(5);
  const [actual, setActual] = useState(7.4);
  const [friends, setFriends] = useState(8.2);

  const result = useMemo(() => {
    const consciousGap = Math.abs(ideal - actual);
    const blindSpotGap = Math.abs(actual - friends);

    if (consciousGap >= 3 && blindSpotGap < 3) {
      return {
        title: 'Q1: Guilty Pleasure Pattern',
        copy: 'Your choices drift from your stated standard, and the outside view mostly agrees with your history.',
      };
    }

    if (consciousGap < 3 && blindSpotGap >= 3) {
      return {
        title: 'Q2: True Blind Spot',
        copy: 'Your self-read feels consistent, but friend feedback says the pattern is landing differently in real life.',
      };
    }

    if (consciousGap >= 3 && blindSpotGap >= 3) {
      return {
        title: 'Q3: Total Disconnect',
        copy: 'Your stated ideal, actual choices, and social mirror are all pulling in different directions.',
      };
    }

    return {
      title: 'Aligned Balance Profile',
      copy: 'The simulated ideal, history, and friend-observed pattern are close enough to tell one coherent story.',
    };
  }, [actual, friends, ideal]);

  const consciousGap = Math.abs(ideal - actual);
  const blindSpotGap = Math.abs(actual - friends);

  return (
    <section className="content-band simulator-section" id="mirror-sandbox">
      <div className="section-heading">
        <p className="eyebrow">Mirror simulator</p>
        <h2>Move the vectors and watch the classification change.</h2>
        <p>
          The live report compares stated preference, actual history, and friend-observed behavior before it
          recommends a quadrant.
        </p>
      </div>

      <div className="simulator-layout">
        <div className="simulator-controls" aria-label="Simulator controls">
          <label className="range-field">
            <span>
              Ideal partner intensity
              <strong>{ideal.toFixed(1)}</strong>
            </span>
            <input
              aria-label="Ideal partner intensity"
              max="10"
              min="1"
              onChange={(event) => setIdeal(Number(event.target.value))}
              step="0.1"
              type="range"
              value={ideal}
            />
            <small>
              <span>Slow burn</span>
              <span>Whirlwind</span>
            </small>
          </label>

          <label className="range-field">
            <span>
              Actual chosen intensity
              <strong>{actual.toFixed(1)}</strong>
            </span>
            <input
              aria-label="Actual chosen intensity"
              max="10"
              min="1"
              onChange={(event) => setActual(Number(event.target.value))}
              step="0.1"
              type="range"
              value={actual}
            />
            <small>
              <span>Steady</span>
              <span>Volatile</span>
            </small>
          </label>

          <label className="range-field">
            <span>
              What friends observe
              <strong>{friends.toFixed(1)}</strong>
            </span>
            <input
              aria-label="What friends observe"
              max="10"
              min="1"
              onChange={(event) => setFriends(Number(event.target.value))}
              step="0.1"
              type="range"
              value={friends}
            />
            <small>
              <span>Grounded</span>
              <span>Chasing the rush</span>
            </small>
          </label>
        </div>

        <aside className="simulator-output">
          <p className="eyebrow">Live calculator result</p>
          <h3>{result.title}</h3>

          <div className="gap-stack" aria-label="Simulated gaps">
            <div>
              <span>
                Conscious self-gap
                <strong>{consciousGap.toFixed(1)}</strong>
              </span>
              <div className="gap-bar">
                <i className="gap-bar__fill gap-bar__fill--self" style={{ width: clampWidth(consciousGap) }} />
              </div>
            </div>
            <div>
              <span>
                Social blind-spot gap
                <strong>{blindSpotGap.toFixed(1)}</strong>
              </span>
              <div className="gap-bar">
                <i className="gap-bar__fill gap-bar__fill--social" style={{ width: clampWidth(blindSpotGap) }} />
              </div>
            </div>
          </div>

          <p>{result.copy}</p>
          <button className="primary-button" onClick={onStart}>
            Build my real mirror
            <ArrowRight size={18} />
          </button>
        </aside>
      </div>
    </section>
  );
}
