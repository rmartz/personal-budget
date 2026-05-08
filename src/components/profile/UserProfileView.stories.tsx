import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { UserProfileView } from "./UserProfileView";

const meta: Meta<typeof UserProfileView> = {
  component: UserProfileView,
  title: "Profile/UserProfileView",
  args: {
    onUpdateDisplayName: () => Promise.resolve(),
    onUpdateEmail: () => Promise.resolve(),
    onUpdatePassword: () => Promise.resolve(),
    onSignOut: () => Promise.resolve(),
  },
};

export default meta;
type Story = StoryObj<typeof UserProfileView>;

export const Populated: Story = {
  args: {
    displayName: "Jane Smith",
    email: "jane@example.com",
  },
};

export const EmptyDisplayName: Story = {
  args: {
    displayName: "",
    email: "jane@example.com",
  },
};
