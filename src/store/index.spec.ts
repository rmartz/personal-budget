import { describe, expect, it } from "vitest";
import { store } from "./index";

describe("store", () => {
  it("initializes with a valid reducer map", () => {
    expect(store.getState()).toEqual({ app: { ready: true } });
  });
});
