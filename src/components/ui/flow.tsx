import * as React from 'react';
import { cn } from '@/lib/utils';

function FlowShell({ className, ...props }: React.ComponentProps<'main'>) {
  return (
    <main
      data-slot="flow-shell"
      className={cn(
        'mx-auto min-h-screen w-[min(980px,calc(100%_-_32px))] py-6 pb-12 max-[620px]:w-[min(100%_-_24px,520px)] max-[620px]:pt-4',
        className,
      )}
      {...props}
    />
  );
}

function TopBar({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="top-bar"
      className={cn('mb-7 flex min-h-16 items-center justify-between gap-4 max-[620px]:mb-3', className)}
      {...props}
    />
  );
}

function InlineError({ className, ...props }: React.ComponentProps<'p'>) {
  return <p data-slot="inline-error" className={cn('mb-3.5 font-medium text-primary', className)} {...props} />;
}

function CompactLoader({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('size-12 animate-spin rounded-full border-2 border-border border-t-foreground', className)} />;
}

export { CompactLoader, FlowShell, InlineError, TopBar };
