import { ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  onStart: () => void;
}

export function Navigation({ onStart }: NavigationProps) {
  return (
    <header className="sticky top-0 z-20 flex min-h-[72px] items-center justify-between gap-6 border-b border-border bg-card px-[clamp(16px,5vw,64px)] max-[620px]:min-h-16 max-[620px]:px-3">
      <a
        className="inline-flex min-h-11 items-center gap-2.5 font-medium text-foreground no-underline"
        href="/"
        aria-label="Dating Mirror landing page"
      >
        <span
          className="inline-flex size-[34px] items-center justify-center rounded-full border border-border bg-muted text-foreground max-[620px]:hidden"
          aria-hidden="true"
        >
          <Heart size={18} fill="currentColor" />
        </span>
        <span>Dating Mirror</span>
      </a>
      <nav
        className="ml-auto flex items-center gap-6 text-[0.95rem] text-muted-foreground max-[960px]:hidden [&_a]:no-underline [&_a:hover]:text-foreground"
        aria-label="Home sections"
      >
        <a href="#how-it-works">How it works</a>
        <a href="#matrix-breakdown">Matrix</a>
        <a href="#map-analysis">Map Analysis</a>
      </nav>
      <Button variant="nav" size="nav" className="max-[620px]:min-h-[38px] max-[620px]:px-3" onClick={onStart}>
        Start
        <ArrowRight size={16} />
      </Button>
    </header>
  );
}
