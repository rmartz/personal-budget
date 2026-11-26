import { describe, expect, it } from "vitest";

import { AUTHENTICATED_HOME_PATH } from "@/lib/auth-constants";

import { postAuthPath } from "./post-auth-path";

describe("postAuthPath", () => {
  it("honours a same-origin relative path", () => {
    expect(postAuthPath("/goals?tab=active")).toBe("/goals?tab=active");
  });

  it("falls back to the dashboard when next is absent", () => {
    expect(postAuthPath(null)).toBe(AUTHENTICATED_HOME_PATH);
  });

  it("falls back to the dashboard for the landing page", () => {
    expect(postAuthPath("/")).toBe(AUTHENTICATED_HOME_PATH);
  });

  it("rejects a protocol-relative URL", () => {
    expect(postAuthPath("//evil.example")).toBe(AUTHENTICATED_HOME_PATH);
  });

  it("falls back to the dashboard for the landing page with a query", () => {
    expect(postAuthPath("/?x=1")).toBe(AUTHENTICATED_HOME_PATH);
  });

  it("rejects a backslash host", () => {
    expect(postAuthPath("/\\evil.example")).toBe(AUTHENTICATED_HOME_PATH);
  });

  it("rejects a host hidden behind a control character", () => {
    expect(postAuthPath("/\t/evil.example")).toBe(AUTHENTICATED_HOME_PATH);
  });

  it("rejects a host smuggled in through dot-segments", () => {
    expect(postAuthPath("/.//evil.example")).toBe(AUTHENTICATED_HOME_PATH);
  });

  it("rejects a host smuggled in through encoded dot-segments", () => {
    expect(postAuthPath("/%2e//evil.example")).toBe(AUTHENTICATED_HOME_PATH);
  });

  it("falls back to the dashboard for an unparseable path", () => {
    expect(postAuthPath("///")).toBe(AUTHENTICATED_HOME_PATH);
  });

  it("rejects an absolute URL", () => {
    expect(postAuthPath("https://evil.example/")).toBe(AUTHENTICATED_HOME_PATH);
  });
});
