import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { UserProfileView } from "./UserProfileView";
import { USER_PROFILE_COPY } from "./copy";

afterEach(cleanup);

function makeProps(
  overrides: Partial<Parameters<typeof UserProfileView>[0]> = {},
) {
  return {
    displayName: "Jane Smith",
    email: "jane@example.com",
    onUpdateDisplayName: vi.fn().mockResolvedValue(undefined),
    onUpdateEmail: vi.fn().mockResolvedValue(undefined),
    onUpdatePassword: vi.fn().mockResolvedValue(undefined),
    onSignOut: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe("UserProfileView", () => {
  it("renders the page title", () => {
    render(<UserProfileView {...makeProps()} />);
    expect(screen.getByText(USER_PROFILE_COPY.title)).toBeDefined();
  });

  it("pre-populates the display name field from props", () => {
    render(<UserProfileView {...makeProps({ displayName: "Jane Smith" })} />);
    const input = screen.getByLabelText(USER_PROFILE_COPY.displayNameLabel);
    expect((input as HTMLInputElement).value).toBe("Jane Smith");
  });

  it("pre-populates the email field from props", () => {
    render(<UserProfileView {...makeProps({ email: "jane@example.com" })} />);
    const input = screen.getByLabelText(USER_PROFILE_COPY.changeEmailLabel);
    expect((input as HTMLInputElement).value).toBe("jane@example.com");
  });

  it("calls onUpdateDisplayName with new value on submit", () => {
    const onUpdateDisplayName = vi.fn().mockResolvedValue(undefined);
    render(<UserProfileView {...makeProps({ onUpdateDisplayName })} />);
    const input = screen.getByLabelText(USER_PROFILE_COPY.displayNameLabel);
    fireEvent.change(input, { target: { value: "New Name" } });
    fireEvent.submit(input.closest("form")!);
    expect(onUpdateDisplayName).toHaveBeenCalledWith("New Name");
  });

  it("calls onUpdateEmail with new value on submit", () => {
    const onUpdateEmail = vi.fn().mockResolvedValue(undefined);
    render(<UserProfileView {...makeProps({ onUpdateEmail })} />);
    const input = screen.getByLabelText(USER_PROFILE_COPY.changeEmailLabel);
    fireEvent.change(input, { target: { value: "new@example.com" } });
    fireEvent.submit(input.closest("form")!);
    expect(onUpdateEmail).toHaveBeenCalledWith("new@example.com");
  });

  it("calls onUpdatePassword with current and new password on submit", () => {
    const onUpdatePassword = vi.fn().mockResolvedValue(undefined);
    render(<UserProfileView {...makeProps({ onUpdatePassword })} />);
    const currentInput = screen.getByLabelText(
      USER_PROFILE_COPY.changePasswordCurrentLabel,
    );
    const newInput = screen.getByLabelText(
      USER_PROFILE_COPY.changePasswordNewLabel,
    );
    fireEvent.change(currentInput, { target: { value: "oldPass" } });
    fireEvent.change(newInput, { target: { value: "newPass" } });
    fireEvent.submit(currentInput.closest("form")!);
    expect(onUpdatePassword).toHaveBeenCalledWith("oldPass", "newPass");
  });

  it("calls onSignOut when the sign out button is clicked", () => {
    const onSignOut = vi.fn().mockResolvedValue(undefined);
    render(<UserProfileView {...makeProps({ onSignOut })} />);
    fireEvent.click(screen.getByText(USER_PROFILE_COPY.signOutButton));
    expect(onSignOut).toHaveBeenCalled();
  });

  it("renders section headings", () => {
    render(<UserProfileView {...makeProps()} />);
    expect(
      screen.getByText(USER_PROFILE_COPY.profileSectionTitle),
    ).toBeDefined();
    expect(screen.getByText(USER_PROFILE_COPY.emailSectionTitle)).toBeDefined();
    expect(
      screen.getByText(USER_PROFILE_COPY.passwordSectionTitle),
    ).toBeDefined();
  });
});
