import { ArrowRight, Heart } from 'lucide-react';

interface NavigationProps {
  onStart: () => void;
}

export function Navigation({ onStart }: NavigationProps) {
  return (
    <header className="site-nav">
      <a className="brand-mark" href="/" aria-label="Dating Mirror landing page">
        <span className="brand-icon" aria-hidden="true">
          <Heart size={18} fill="currentColor" />
        </span>
        <span>Dating Mirror</span>
      </a>
      <nav className="nav-links" aria-label="Home sections">
        <a href="#how-it-works">How it works</a>
        <a href="#matrix-breakdown">Matrix</a>
        <a href="#mirror-sandbox">Simulator</a>
      </nav>
      <button className="nav-start-button" onClick={onStart}>
        Start
        <ArrowRight size={16} />
      </button>
    </header>
  );
}
