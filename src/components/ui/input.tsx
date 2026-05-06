import { cn } from "@/lib/utils";

export interface InputProps
  extends React.ComponentPropsWithoutRef<"input"> {}

function Input({ className, type = "text", ...props }: InputProps) {
  return (
    <input
      data-slot="input"
      type={type}
      className={cn(
        "flex h-8 w-full rounded-lg border border-input bg-background px-2.5 py-1 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
