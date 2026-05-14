import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PROFILE_SETTINGS_COPY } from "./copy";
import { ProfileSettingsView } from "./ProfileSettingsView";

afterEach(cleanup);

function makeProps(
  overrides: Partial<Parameters<typeof ProfileSettingsView>[0]> = {},
) {
  return {
    displayName: "Reed Martz",
    email: "reed@example.com",
    initials: "RM",
    onSignOut: vi.fn(),
    ...overrides,
  };
}

describe("ProfileSettingsView", () => {
  describe("renders the page header", () => {
    it("shows the Profile title", () => {
      render(<ProfileSettingsView {...makeProps()} />);
      expect(
        screen.getByRole("heading", {
          level: 1,
          name: PROFILE_SETTINGS_COPY.title,
        }),
      ).toBeDefined();
    });
  });

  describe("renders the identity row", () => {
    it("shows the user's display name", () => {
      render(
        <ProfileSettingsView {...makeProps({ displayName: "Jane Smith" })} />,
      );
      expect(screen.getByText("Jane Smith")).toBeDefined();
    });

    it("shows the user's email", () => {
      render(
        <ProfileSettingsView {...makeProps({ email: "jane@example.com" })} />,
      );
      expect(screen.getByText("jane@example.com")).toBeDefined();
    });

    it("shows the avatar initials", () => {
      render(<ProfileSettingsView {...makeProps({ initials: "JS" })} />);
      expect(screen.getByText("JS")).toBeDefined();
    });
  });

  describe("renders settings rows", () => {
    it("shows the Display name row", () => {
      render(<ProfileSettingsView {...makeProps()} />);
      expect(
        screen.getByText(PROFILE_SETTINGS_COPY.rowDisplayName),
      ).toBeDefined();
    });

    it("shows the Change password row", () => {
      render(<ProfileSettingsView {...makeProps()} />);
      expect(
        screen.getByText(PROFILE_SETTINGS_COPY.rowChangePassword),
      ).toBeDefined();
    });

    it("shows the Currency row", () => {
      render(<ProfileSettingsView {...makeProps()} />);
      expect(screen.getByText(PROFILE_SETTINGS_COPY.rowCurrency)).toBeDefined();
    });

    it("shows the Time zone row", () => {
      render(<ProfileSettingsView {...makeProps()} />);
      expect(screen.getByText(PROFILE_SETTINGS_COPY.rowTimeZone)).toBeDefined();
    });

    it("shows the Notifications row", () => {
      render(<ProfileSettingsView {...makeProps()} />);
      expect(
        screen.getByText(PROFILE_SETTINGS_COPY.rowNotifications),
      ).toBeDefined();
    });

    it("shows the Sign out row", () => {
      render(<ProfileSettingsView {...makeProps()} />);
      expect(screen.getByText(PROFILE_SETTINGS_COPY.rowSignOut)).toBeDefined();
    });
  });

  describe("Sign out interaction", () => {
    it("calls onSignOut when the Sign out row is clicked", () => {
      const onSignOut = vi.fn();
      render(<ProfileSettingsView {...makeProps({ onSignOut })} />);
      fireEvent.click(screen.getByText(PROFILE_SETTINGS_COPY.rowSignOut));
      expect(onSignOut).toHaveBeenCalledOnce();
    });
  });
});
