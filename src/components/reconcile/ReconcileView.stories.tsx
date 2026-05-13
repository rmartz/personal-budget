import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ReconcileView } from "./ReconcileView";

const meta: Meta<typeof ReconcileView> = {
  title: "Reconcile/ReconcileView",
  component: ReconcileView,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof ReconcileView>;

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
