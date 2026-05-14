import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProfileSettingsView } from "./ProfileSettingsView";

const meta: Meta<typeof ProfileSettingsView> = {
  component: ProfileSettingsView,
  title: "Profile/ProfileSettingsView",
};

export default meta;
type Story = StoryObj<typeof ProfileSettingsView>;

export const Default: Story = {
  args: {
    displayName: "Reed Martz",
    email: "reed@example.com",
    initials: "RM",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSignOut: () => {},
  },
};

export const SingleName: Story = {
  args: {
    displayName: "Alice",
    email: "alice@example.com",
    initials: "A",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSignOut: () => {},
  },
};

export const EmailFallback: Story = {
  args: {
    displayName: "",
    email: "bob@example.com",
    initials: "B",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSignOut: () => {},
  },
};
