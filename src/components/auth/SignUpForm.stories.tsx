import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SignUpFormView } from "./SignUpForm";

const meta: Meta<typeof SignUpFormView> = {
  component: SignUpFormView,
  title: "Auth/SignUpForm",
  args: {
    onSubmit: (() => undefined) as (email: string, password: string) => void,
  },
};

export default meta;

type Story = StoryObj<typeof SignUpFormView>;

export const Default: Story = {
  args: {
    isLoading: false,
    error: undefined,
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    error: undefined,
  },
};

export const WithError: Story = {
  args: {
    isLoading: false,
    error: "An account with this email address already exists.",
  },
};
