export function getSentryRelease(): string | undefined {
  const release = process.env["SENTRY_RELEASE"];
  if (release) return release;
  const sha = process.env["VERCEL_GIT_COMMIT_SHA"];
  if (sha) return sha;
  return undefined;
}
