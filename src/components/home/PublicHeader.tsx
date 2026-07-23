import Link from "next/link";

import { PUBLIC_HEADER_COPY } from "./PublicHeader.copy";

export function PublicHeader() {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4 md:px-8">
      <Link href="/" className="text-base font-bold tracking-tight">
        {PUBLIC_HEADER_COPY.brand}
      </Link>
      <nav className="flex items-center gap-4 text-sm">
        <Link
          href="#pricing"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          {PUBLIC_HEADER_COPY.navPricing}
        </Link>
        <Link
          href="/sign-in"
          prefetch={false}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          {PUBLIC_HEADER_COPY.navSignIn}
        </Link>
        <Link
          href="/sign-up"
          prefetch={false}
          className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
        >
          {PUBLIC_HEADER_COPY.navGetStarted}
        </Link>
      </nav>
    </header>
  );
}
