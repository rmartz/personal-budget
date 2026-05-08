import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import { makeSentryBuildOptions } from "./src/lib/sentry-build-options";

const nextConfig: NextConfig = {
  // Never emit browser-side source maps to the public output directory.
  // withSentryConfig generates and uploads them internally, then deletes them.
  productionBrowserSourceMaps: false,
};

export default withSentryConfig(nextConfig, makeSentryBuildOptions());
