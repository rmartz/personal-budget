import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ForgotPasswordFormView } from "./ForgotPasswordForm";

const meta: Meta<typeof ForgotPasswordFormView> = {
  component: ForgotPasswordFormView,
  title: "Auth/ForgotPasswordForm",
  args: {
    onSubmit: (() => undefined) as (email: string) => void,
  },
};

export default meta;

type Story = StoryObj<typeof ForgotPasswordFormView>;

export const Default: Story = {
  args: {
    isLoading: false,
    isSubmitted: false,
    error: undefined,
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    isSubmitted: false,
    error: undefined,
  },
};

export const WithError: Story = {
  args: {
    isLoading: false,
    isSubmitted: false,
    error: "An unexpected error occurred. Please try again.",
  },
};

export const Submitted: Story = {
  args: {
    isLoading: false,
    isSubmitted: true,
    error: undefined,
  },
};
