import { Heart } from 'lucide-react';

export function Navigation() {
  return (
    <header className="site-nav">
      <a className="brand-mark" href="/" aria-label="Dating Mirror landing page">
        <span className="brand-icon" aria-hidden="true">
          <Heart size={18} fill="currentColor" />
        </span>
        <span>Dating Mirror</span>
      </a>
    </header>
  );
}
