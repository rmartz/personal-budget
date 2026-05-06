import { cn } from "@/lib/utils";

export interface LabelProps
  extends React.ComponentPropsWithoutRef<"label"> {}

function Label({ className, ...props }: LabelProps) {
  return (
    <label
      data-slot="label"
      className={cn(
        "text-sm leading-none font-medium text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
