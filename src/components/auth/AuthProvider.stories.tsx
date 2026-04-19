import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AuthProviderView } from "./AuthProvider";
import type { User } from "firebase/auth";

const meta: Meta<typeof AuthProviderView> = {
  component: AuthProviderView,
  title: "Auth/AuthProviderView",
};

export default meta;

type Story = StoryObj<typeof AuthProviderView>;

const mockUser = {
  uid: "uid-abc123",
  email: "user@example.com",
  displayName: "Test User",
} as User;

export const Loading: Story = {
  args: {
    user: null,
    loading: true,
    children: <div>App content</div>,
  },
};

export const Authenticated: Story = {
  args: {
    user: mockUser,
    loading: false,
    children: <div>App content</div>,
  },
};

export const Unauthenticated: Story = {
  args: {
    user: null,
    loading: false,
    children: <div>App content</div>,
  },
};
