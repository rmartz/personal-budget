import { afterEach, describe, expect, it, vi } from "vitest";

import { parseCollection } from "./parse-collection";

interface Widget {
  id: string;
  size: number;
}

function makeWidget(id: string, entry: unknown): Widget {
  const record = entry as { size?: unknown };
  if (typeof record.size !== "number") {
    throw new Error(`invalid size for ${id}`);
  }
  return { id, size: record.size };
}

describe("parseCollection", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("converts every valid record to a domain object", () => {
    const result = parseCollection(
      { a: { size: 3 }, b: { size: 7 } },
      makeWidget,
    );
    expect(result).toEqual([
      { id: "a", size: 3 },
      { id: "b", size: 7 },
    ]);
  });

  it("skips a record whose converter throws and keeps the valid ones", () => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const result = parseCollection(
      { good: { size: 5 }, bad: { size: "oops" } },
      makeWidget,
    );
    expect(result).toEqual([{ id: "good", size: 5 }]);
  });

  it("logs the offending record id when a converter throws", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    parseCollection({ bad: { size: "oops" } }, makeWidget);
    expect(warn).toHaveBeenCalledOnce();
    expect(String(warn.mock.calls[0]?.[0])).toContain("bad");
  });
});
