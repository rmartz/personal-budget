import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { UserProfileView } from "./UserProfileView";

const meta: Meta<typeof UserProfileView> = {
  component: UserProfileView,
  title: "Profile/UserProfileView",
  args: {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onUpdateDisplayName: async () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onUpdateEmail: async () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onUpdatePassword: async () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSignOut: async () => {},
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
