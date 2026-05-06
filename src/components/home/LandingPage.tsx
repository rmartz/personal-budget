import Link from "next/link";

import {
  buttonVariants,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

import { LANDING_PAGE_COPY } from "./LandingPage.copy";

export function LandingPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{LANDING_PAGE_COPY.heading}</CardTitle>
          <CardDescription>{LANDING_PAGE_COPY.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Link href="/sign-in" className={buttonVariants()}>
            {LANDING_PAGE_COPY.signInButton}
          </Link>
          <Link
            href="/sign-up"
            className={buttonVariants({ variant: "outline" })}
          >
            {LANDING_PAGE_COPY.createAccountButton}
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
