import { withSentryConfig } from "@sentry/nextjs/config";
import type { NextConfig } from "next";

import { makeSentryBuildOptions } from "./src/lib/sentry-build-options";

const nextConfig: NextConfig = {
  // Never emit browser-side source maps to the public output directory.
  // withSentryConfig generates and uploads them internally, then deletes them.
  productionBrowserSourceMaps: false,
  // Bundle firebase-admin instead of loading it as a runtime external (Next
  // externalises it by default). As an external, its jwks-rsa dependency
  // require()s the ESM-only jose at runtime, which fails with ERR_REQUIRE_ESM
  // in the Vercel function runtime and 500s every route that touches
  // firebase-admin/auth (#515).
  transpilePackages: ["firebase-admin"],
};

export default withSentryConfig(nextConfig, makeSentryBuildOptions());
