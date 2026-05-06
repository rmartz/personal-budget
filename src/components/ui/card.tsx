import { cn } from "@/lib/utils";

export interface CardProps extends React.ComponentPropsWithoutRef<"div"> {}

function Card({ className, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(
        "rounded-xl border border-border bg-background text-foreground shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

export interface CardHeaderProps
  extends React.ComponentPropsWithoutRef<"div"> {}

function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 p-6", className)}
      {...props}
    />
  );
}

export interface CardTitleProps
  extends React.ComponentPropsWithoutRef<"h2"> {}

function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <h2
      data-slot="card-title"
      className={cn("text-xl font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

export interface CardDescriptionProps
  extends React.ComponentPropsWithoutRef<"p"> {}

function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export interface CardContentProps
  extends React.ComponentPropsWithoutRef<"div"> {}

function CardContent({ className, ...props }: CardContentProps) {
  return (
    <div
      data-slot="card-content"
      className={cn("p-6 pt-0", className)}
      {...props}
    />
  );
}

export interface CardFooterProps
  extends React.ComponentPropsWithoutRef<"div"> {}

function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
