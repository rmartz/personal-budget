import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SignInFormView } from "./SignInForm";

const meta: Meta<typeof SignInFormView> = {
  component: SignInFormView,
  title: "Auth/SignInForm",
  args: {
    onSubmit: () => undefined,
  },
};

export default meta;

type Story = StoryObj<typeof SignInFormView>;

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
    error: "The email address or password is incorrect. Please try again.",
  },
};
