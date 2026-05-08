import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fireEvent, getByRole } from "storybook/test";
import { AddDepositDialogView } from "./AddDepositDialog";
import { ADD_DEPOSIT_DIALOG_COPY } from "./AddDepositDialog.copy";

const meta: Meta<typeof AddDepositDialogView> = {
  component: AddDepositDialogView,
  title: "Ledgers/AddDepositDialog",
  args: {
    open: true,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onClose: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onSubmit: async () => {},
    isSubmitting: false,
  },
};

export default meta;
type Story = StoryObj<typeof AddDepositDialogView>;

export const Empty: Story = {};

export const Submitting: Story = {
  args: {
    isSubmitting: true,
  },
};

export const WithValidationErrors: Story = {
  play: ({ canvasElement }) => {
    void fireEvent.click(
      getByRole(canvasElement, "button", {
        name: ADD_DEPOSIT_DIALOG_COPY.submitButton,
      }),
    );
  },
};
