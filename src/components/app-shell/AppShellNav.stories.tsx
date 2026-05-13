import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AppShellNavView } from "./AppShellNav";

const meta: Meta<typeof AppShellNavView> = {
  component: AppShellNavView,
  title: "App Shell/AppShellNav",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof AppShellNavView>;

const placeholderChild = (
  <div className="mx-auto max-w-4xl px-4 py-8 text-sm text-muted-foreground">
    Placeholder page content lives here.
  </div>
);

export const DesktopReconcileActive: Story = {
  args: {
    pathname: "/reconcile",
    children: placeholderChild,
  },
  parameters: {
    viewport: { defaultViewport: "responsive" },
  },
};

export const DesktopLedgersActive: Story = {
  args: {
    pathname: "/ledgers",
    children: placeholderChild,
  },
};

export const DesktopLedgerDetail: Story = {
  args: {
    pathname: "/ledgers/abc123",
    children: placeholderChild,
  },
};

export const Mobile: Story = {
  args: {
    pathname: "/reconcile",
    children: placeholderChild,
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
