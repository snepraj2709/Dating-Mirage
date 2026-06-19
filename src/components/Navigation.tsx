import { Heart, ShieldCheck } from 'lucide-react';

interface NavigationProps {
  onStart: () => void;
}

export function Navigation({ onStart }: NavigationProps) {
  return (
    <header className="site-nav">
      <a className="brand-mark" href="#top" aria-label="Dating Mirror home">
        <span className="brand-icon" aria-hidden="true">
          <Heart size={18} fill="currentColor" />
        </span>
        <span>Dating Mirror</span>
      </a>
      <nav className="nav-actions" aria-label="Primary navigation">
        <a href="#privacy" className="nav-pill">
          <ShieldCheck size={16} />
          Privacy
        </a>
        <button className="nav-button" onClick={onStart}>
          Show me Mirror
        </button>
      </nav>
    </header>
  );
}

