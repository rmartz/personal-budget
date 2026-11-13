import Link from "next/link";

import { buttonVariants } from "@/components/ui";

import { LANDING_PAGE_COPY } from "./LandingPage.copy";
import { PublicHeader } from "./PublicHeader";

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-20 md:px-8">
        <div className="w-full max-w-xl text-center">
          <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">
            {LANDING_PAGE_COPY.headline}
          </h1>
          <p className="mb-10 text-lg text-muted-foreground">
            {LANDING_PAGE_COPY.tagline}
          </p>
          <Link
            href="/sign-up"
            prefetch={false}
            className={buttonVariants({ size: "lg" })}
          >
            {LANDING_PAGE_COPY.primaryCta}
          </Link>
        </div>
      </main>
    </div>
  );
}
