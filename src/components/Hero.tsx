import { ArrowRight, ChevronDown } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
}

export function Hero({ onStart }: HeroProps) {
  return (
    <section className="hero-section" id="top">
      <div className="hero-copy">
        <p className="hero-kicker">A cognitive psychology dating diagnostic</p>
        <h1>
          Dating is not just your preference. <span className="hero-emphasis">It is your pattern.</span>
        </h1>
        <p className="hero-lede">
          You know what you claim to want. Your friends know who you actually choose. Dating Mirror
          compares both before the pattern repeats.
        </p>
        <div className="hero-actions">
          <button className="primary-button hero-primary" onClick={onStart}>
            Start your mirror
            <ArrowRight size={18} />
          </button>
          <a className="secondary-link hero-secondary" href="#how-it-works">
            See the method
            <ChevronDown size={18} />
          </a>
        </div>
        <div className="hero-report-preview" aria-label="Example mirror report summary">
          <span>Mirror report preview</span>
          <strong>You want peace, but you keep responding to intensity.</strong>
        </div>
      </div>
    </section>
  );
}
