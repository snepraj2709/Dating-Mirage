import * as React from 'react';
import { cn } from '@/lib/utils';

function Pill({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="pill"
      className={cn(
        'inline-flex min-h-[34px] items-center gap-2 rounded-full border border-border bg-muted px-3 text-[0.88rem] font-medium text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
}

function Eyebrow({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="eyebrow"
      className={cn('m-0 mb-3 text-[0.88rem] font-medium uppercase tracking-normal text-muted-foreground', className)}
      {...props}
    />
  );
}

export { Eyebrow, Pill };
