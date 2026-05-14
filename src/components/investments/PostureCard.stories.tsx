import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PostureCard } from "./PostureCard";
import { Posture } from "@/lib/firebase/schema/investments";

const meta: Meta<typeof PostureCard> = {
  component: PostureCard,
  title: "Investments/PostureCard",
};

export default meta;
type Story = StoryObj<typeof PostureCard>;

export const Conservative: Story = {
  args: { posture: Posture.Conservative },
};

export const Balanced: Story = {
  args: { posture: Posture.Balanced },
};

export const Aggressive: Story = {
  args: { posture: Posture.Aggressive },
};
