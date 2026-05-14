import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { LandingPage } from "./LandingPage";

const meta: Meta<typeof LandingPage> = {
  title: "Home/LandingPage",
  component: LandingPage,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof LandingPage>;

export const Desktop: Story = {
  parameters: {
    viewport: { defaultViewport: "responsive" },
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
