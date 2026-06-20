import * as React from 'react';
import { cn } from '@/lib/utils';
import { Eyebrow } from './pill';

function ContentBand({ className, ...props }: React.ComponentProps<'section'>) {
  return (
    <section
      data-slot="content-band"
      className={cn(
        'landing-container landing-section py-[clamp(40px,7svh,72px)] max-[620px]:py-5',
        className,
      )}
      {...props}
    />
  );
}

interface SectionHeadingProps extends React.ComponentProps<'div'> {
  eyebrow: string;
  title: string;
  description?: React.ReactNode;
  centered?: boolean;
}

function SectionHeading({ eyebrow, title, description, centered, className, ...props }: SectionHeadingProps) {
  return (
    <div
      data-slot="section-heading"
      className={cn(
        'mb-8 grid max-w-[820px] gap-2.5',
        centered && 'mx-auto justify-items-center text-center',
        className,
      )}
      {...props}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mb-0 text-[clamp(1.75rem,4vw,3rem)] leading-[1.05] tracking-normal text-foreground">{title}</h2>
      {description && <p className="mb-0 max-w-[680px] text-base leading-[1.6] text-muted-foreground">{description}</p>}
    </div>
  );
}

export { ContentBand, SectionHeading };
