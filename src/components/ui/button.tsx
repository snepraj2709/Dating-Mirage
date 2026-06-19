import * as React from 'react';
import { Slot } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 font-medium',
    'transition-[transform,background,border-color,color] duration-150 ease-out',
    'focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-foreground',
    'disabled:pointer-events-none disabled:opacity-[0.62]',
    'active:scale-[0.98]',
  ],
  {
    variants: {
      variant: {
        primary: 'border border-primary bg-primary text-primary-foreground hover:border-primary-hover hover:bg-primary-hover',
        ghostPill: 'border border-input bg-card text-foreground hover:border-foreground hover:bg-muted',
        secondaryPill: 'border border-input bg-card text-foreground no-underline hover:border-foreground hover:bg-muted',
        nav: 'border border-border-strong bg-card text-foreground hover:border-foreground hover:bg-muted',
        choiceReject: 'border border-input bg-card text-foreground hover:bg-muted',
        choiceAccept: 'border border-foreground bg-foreground text-background hover:bg-foreground',
        option: 'border border-border bg-card text-foreground hover:border-foreground hover:bg-muted',
        dangerGhost: 'border border-input bg-card text-foreground hover:border-foreground hover:bg-muted',
      },
      size: {
        pill: 'min-h-11 rounded-full px-6',
        nav: 'min-h-10 rounded-full px-4 text-sm',
        flow: 'min-h-14 w-full rounded-full px-6',
        compact: 'min-h-9 rounded-full px-3 text-sm',
        choice: 'min-h-[58px] rounded-full px-5',
        option: 'min-h-[74px] justify-start rounded-lg p-4 text-left',
        friendChoice: 'min-h-[190px] items-start justify-start rounded-lg p-4 text-left text-[1.05rem] leading-[1.35] max-[620px]:min-h-[132px]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'pill',
    },
  },
);

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button';

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { Button, buttonVariants };
