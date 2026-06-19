import type { ReactNode } from 'react';

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
    <section className={className ? `vertical-story-card ${className}` : 'vertical-story-card'}>
      <div className="vertical-story-card__icon" aria-hidden="true">
        {icon}
      </div>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <div className="vertical-story-card__body">{body}</div>
      {meta && <div className="vertical-story-card__meta">{meta}</div>}
    </section>
  );
}
