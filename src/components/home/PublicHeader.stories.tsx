import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PublicHeader } from "./PublicHeader";

const meta: Meta<typeof PublicHeader> = {
  title: "Home/PublicHeader",
  component: PublicHeader,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof PublicHeader>;

export const Default: Story = {};
