import * as React from 'react';
import { cn } from '@/lib/utils';

function IconBadge({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="icon-badge"
      className={cn(
        'inline-flex size-[34px] items-center justify-center rounded-full border border-border bg-muted text-foreground',
        className,
      )}
      {...props}
    />
  );
}

export { IconBadge };
