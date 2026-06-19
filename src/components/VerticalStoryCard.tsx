import type { ReactNode } from 'react';
import { Eyebrow } from '@/components/ui/pill';
import { Surface } from '@/components/ui/surface';
import { cn } from '@/lib/utils';

interface VerticalStoryCardProps {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  body: ReactNode;
  meta?: ReactNode;
  className?: string;
}

export function VerticalStoryCard({ icon, eyebrow, title, body, meta, className }: VerticalStoryCardProps) {
  return (
    <Surface
      asChild
      className={cn(
        'mx-auto my-6 grid aspect-[9/16] w-[min(420px,100%)] content-center justify-items-start gap-3.5',
        className,
      )}
      padding="story"
    >
      <section>
      <div data-slot="story-card-icon" className="inline-flex min-h-[38px] items-center text-foreground" aria-hidden="true">
        {icon}
      </div>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mb-0 text-[clamp(2rem,5vw,3.2rem)] leading-[1.02] text-foreground">{title}</h2>
      <div data-slot="story-card-body" className="grid gap-3 [&_p]:mb-0">{body}</div>
      {meta && <div data-slot="story-card-meta" className="self-end font-medium text-primary [&_p]:mb-0">{meta}</div>}
      </section>
    </Surface>
  );
}
