import { ArrowRight, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavigationProps {
  onStart: () => void;
}

export function Navigation({ onStart }: NavigationProps) {
  const [isOverDarkSurface, setIsOverDarkSurface] = useState(true);

  useEffect(() => {
    const updateSurfaceState = () => {
      const probeY = window.scrollY + 48;
      const hero = document.getElementById('top');
      const footer = document.querySelector<HTMLElement>('main > footer');
      const isOverHero =
        hero !== null && probeY >= hero.offsetTop && probeY < hero.offsetTop + hero.offsetHeight;
      const isOverFooter =
        footer !== null && probeY >= footer.offsetTop && probeY < footer.offsetTop + footer.offsetHeight;

      setIsOverDarkSurface(isOverHero || isOverFooter);
    };
    const handleSurfaceChange = () => {
      updateSurfaceState();
      window.requestAnimationFrame(updateSurfaceState);
    };

    updateSurfaceState();
    window.addEventListener('scroll', handleSurfaceChange, { passive: true });
    window.addEventListener('resize', handleSurfaceChange);

    return () => {
      window.removeEventListener('scroll', handleSurfaceChange);
      window.removeEventListener('resize', handleSurfaceChange);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-30 pt-2">
      <div
        style={{
          backgroundColor: isOverDarkSurface ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.24)',
          borderColor: isOverDarkSurface ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.45)',
        }}
        className={cn(
          'landing-container flex min-h-[58px] items-center justify-between gap-6 rounded-[1.35rem] border px-[clamp(16px,3vw,28px)] transition-[background-color,border-color,box-shadow,backdrop-filter,color] duration-300 ease-out max-[620px]:min-h-12 max-[620px]:gap-3 max-[620px]:rounded-[1.1rem] max-[620px]:px-3',
          isOverDarkSurface
            ? 'text-white shadow-[0_14px_48px_rgba(0,0,0,0.16)] backdrop-blur-2xl'
            : 'text-foreground shadow-[0_14px_46px_rgba(17,17,17,0.08)] backdrop-blur-2xl',
        )}
      >
        <a
          className={cn(
            'inline-flex min-h-9 items-center gap-2.5 font-medium no-underline',
            isOverDarkSurface ? 'text-white' : 'text-foreground',
          )}
          href="/"
          aria-label="Dating Mirror landing page"
        >
          <span
            className="inline-flex size-[28px] items-center justify-center text-primary max-[620px]:hidden"
            aria-hidden="true"
          >
            <Heart size={18} fill="currentColor" />
          </span>
          <span>Dating Mirror</span>
        </a>
        <nav
          className={cn(
            'ml-auto flex items-center gap-6 text-[0.95rem] max-[960px]:hidden [&_a]:no-underline [&_a]:transition-colors [&_a]:duration-150',
            isOverDarkSurface
              ? 'text-white/78 [&_a:hover]:text-white'
              : 'text-muted-foreground [&_a:hover]:text-foreground',
          )}
          aria-label="Home sections"
        >
          <a href="#how-it-works">How it works</a>
          <a href="#matrix-breakdown">Matrix</a>
          <a href="#map-analysis">Map Analysis</a>
        </nav>
        <Button
          variant="primary"
          size="nav"
          className="min-h-9 shadow-[0_10px_32px_rgba(232,62,140,0.28)] max-[620px]:min-h-8 max-[620px]:px-3"
          onClick={onStart}
        >
          Start
          <ArrowRight size={16} />
        </Button>
      </div>
    </header>
  );
}
