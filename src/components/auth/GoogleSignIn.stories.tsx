import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { GoogleSignIn } from "./GoogleSignIn";

const meta: Meta<typeof GoogleSignIn> = {
  component: GoogleSignIn,
  title: "Auth/GoogleSignIn",
  args: {
    onGoogleSignIn: () => undefined,
  },
};

export default meta;

type Story = StoryObj<typeof GoogleSignIn>;

export const Default: Story = {
  args: {
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
