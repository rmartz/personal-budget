import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { LandingPage } from "./LandingPage";

export default {
  title: "Home/LandingPage",
  component: LandingPage,
} satisfies Meta<typeof LandingPage>;

type Story = StoryObj<typeof LandingPage>;

export const Default: Story = {};
