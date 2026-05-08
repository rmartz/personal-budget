import { cn } from "@/lib/utils";

export interface BarProps {
  value: number;
  className?: string;
  "aria-label"?: string;
}

export function Bar({ value, className, "aria-label": ariaLabel }: BarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-muted",
        className,
      )}
    >
      <div
        className="h-full rounded-full bg-primary transition-all"
        style={{ width: `${clampedValue}%` }}
        role="progressbar"
        aria-label={ariaLabel}
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
