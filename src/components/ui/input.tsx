import * as React from 'react';
import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      data-slot="input"
      type={type}
      className={cn(
        'min-h-[50px] rounded-lg border border-input bg-card px-4 font-medium text-foreground',
        'focus:border-foreground focus:outline-2 focus:outline-offset-2 focus:outline-border',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
