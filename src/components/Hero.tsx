import { ArrowDown, Sparkles } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
}

export function Hero({ onStart }: HeroProps) {
  return (
    <section className="hero-section" id="top">
      <div className="hero-copy">
        <p className="eyebrow">Your love-life wrapped report</p>
        <h1>Dating Mirror</h1>
        <p className="hero-lede">
          Compare who you say you want, who you actually choose, and what your
          friends can already see from the group chat.
        </p>
        <div className="hero-actions">
          <button className="primary-button" onClick={onStart}>
            Show me Mirror
            <Sparkles size={18} />
          </button>
          <a className="secondary-link" href="#how-it-works">
            How it forms
            <ArrowDown size={16} />
          </a>
        </div>
      </div>
      <div className="hero-visual" aria-label="Mirror split between calm romance and shimmering mirage">
        <img src="/images/hero-mirror-mirage.png" alt="" />
      </div>
    </section>
  );
}

