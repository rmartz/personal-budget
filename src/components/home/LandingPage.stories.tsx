import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { LandingPage } from "./LandingPage";

const meta: Meta<typeof LandingPage> = {
  title: "Home/LandingPage",
  component: LandingPage,
};

export default meta;

type Story = StoryObj<typeof LandingPage>;

export const Default: Story = {};
