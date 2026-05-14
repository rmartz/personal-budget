import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ACCOUNTS_PAGE_COPY } from "./copy";
import { SetupSummaryRow } from "./SetupSummaryRow";

afterEach(cleanup);

describe("SetupSummaryRow", () => {
  describe("renders the section label", () => {
    it("shows the label", () => {
      render(
        <SetupSummaryRow
          label="Accounts"
          count={3}
          sublabel="Short-term · Reserve"
        />,
      );
      expect(screen.getByText("Accounts")).toBeDefined();
    });
  });

  describe("renders the configured count", () => {
    it("shows the count using the copy template", () => {
      render(
        <SetupSummaryRow
          label="Accounts"
          count={5}
          sublabel="Short-term · Reserve"
        />,
      );
      expect(
        screen.getByText(ACCOUNTS_PAGE_COPY.configuredCount(5)),
      ).toBeDefined();
    });

    it("shows zero count using the copy template", () => {
      render(
        <SetupSummaryRow
          label="Accounts"
          count={0}
          sublabel="Short-term · Reserve"
        />,
      );
      expect(
        screen.getByText(ACCOUNTS_PAGE_COPY.configuredCount(0)),
      ).toBeDefined();
    });
  });

  describe("renders the sublabel", () => {
    it("shows the sublabel text", () => {
      render(
        <SetupSummaryRow
          label="Accounts"
          count={0}
          sublabel="Short-term · Reserve · Long-term · Investment"
        />,
      );
      expect(
        screen.getByText("Short-term · Reserve · Long-term · Investment"),
      ).toBeDefined();
    });
  });
});
