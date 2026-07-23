import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui";

import { LANDING_PAGE_COPY } from "./LandingPage.copy";
import { PublicHeader } from "./PublicHeader";

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex flex-1 flex-col items-center px-4 py-20 md:px-8">
        <div className="w-full max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            {LANDING_PAGE_COPY.eyebrow}
          </p>
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
            {LANDING_PAGE_COPY.headline}
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
            {LANDING_PAGE_COPY.bodyCopy}
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/sign-up"
              prefetch={false}
              className={buttonVariants({ size: "lg" })}
            >
              {LANDING_PAGE_COPY.primaryCta}
            </Link>
            <Button type="button" variant="ghost" size="sm">
              {LANDING_PAGE_COPY.secondaryCta}
            </Button>
          </div>
        </div>
        <div className="mt-16 flex w-full max-w-4xl items-center justify-center rounded-xl border bg-muted px-6 py-20 text-sm text-muted-foreground">
          {LANDING_PAGE_COPY.placeholderCaption}
        </div>
      </main>
    </div>
  );
}
