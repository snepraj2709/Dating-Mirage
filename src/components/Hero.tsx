import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
}

export function Hero({ onStart }: HeroProps) {
  return (
    <section className="hero-section" id="top">
      <div className="hero-copy">
        <h1>
          See the <span className="hero-emphasis">pattern</span> you date
        </h1>
        <p className="hero-lede">
          Reflect on who you attract - and the gap between your history and your ideal partner.
        </p>
        <div className="hero-actions">
          <button className="primary-button hero-primary" onClick={onStart}>
            Start your reflection
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
