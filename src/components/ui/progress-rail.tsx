import { cn } from '@/lib/utils';

interface ProgressRailProps {
  value: number;
  variant?: 'accent' | 'muted';
  className?: string;
  barClassName?: string;
  'aria-label'?: string;
}

function ProgressRail({
  value,
  variant = 'muted',
  className,
  barClassName,
  'aria-label': ariaLabel,
}: ProgressRailProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div
      className={cn('h-2 overflow-hidden rounded-full bg-muted', variant === 'muted' && 'bg-border', className)}
      aria-label={ariaLabel}
    >
      <span
        className={cn(
          'block h-full rounded-[inherit] bg-primary transition-[width] duration-150 ease-out',
          variant === 'muted' && 'bg-border-strong',
          barClassName,
        )}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}

export { ProgressRail };
