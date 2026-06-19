import * as React from 'react';
import { Slot } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const surfaceVariants = cva('border shadow-none', {
  variants: {
    variant: {
      card: 'border-border bg-card text-card-foreground',
      muted: 'border-border bg-muted text-foreground',
      dark: 'border-[#333333] bg-[#111111] text-white',
    },
    radius: {
      card: 'rounded-lg',
      pill: 'rounded-full',
      circle: 'rounded-full',
    },
    padding: {
      none: '',
      card: 'p-[clamp(24px,5vw,42px)]',
      compact: 'p-5',
      roomy: 'p-[clamp(24px,4vw,48px)]',
      panel: 'p-[clamp(20px,3vw,32px)]',
      story: 'p-[clamp(24px,5vw,36px)]',
    },
  },
  defaultVariants: {
    variant: 'card',
    radius: 'card',
    padding: 'card',
  },
});

type SurfaceProps = React.ComponentProps<'div'> &
  VariantProps<typeof surfaceVariants> & {
    asChild?: boolean;
  };

function Surface({ className, variant, radius, padding, asChild = false, ...props }: SurfaceProps) {
  const Comp = asChild ? Slot.Root : 'div';

  return <Comp data-slot="surface" className={cn(surfaceVariants({ variant, radius, padding }), className)} {...props} />;
}

export { Surface, surfaceVariants };
