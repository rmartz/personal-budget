import { describe, expect, it } from "vitest";

import { store } from "./index";

const EXPECTED_INITIAL_STATE = { app: {} };

describe("store", () => {
  it("initializes with a valid reducer map", () => {
    expect(store.getState()).toEqual(EXPECTED_INITIAL_STATE);
  });
});
