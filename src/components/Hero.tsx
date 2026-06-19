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
            How it works
          </a>
        </div>
      </div>
      <div className="hero-visual" aria-hidden="true">
        <img src="/images/hero-mirror-mirage.png" alt="" />
      </div>
    </section>
  );
}
