export const ANNUITY_LIST_COPY = {
  columnMonthly: "Monthly",
  columnName: "Name",
  columnTerm: "Term",
  emptyStateMessage: "You don't have any annuities yet.",
  indefiniteTerm: "Indefinite",
  newAnnuityButton: "New Annuity",
  termSuffix: "months",
  title: "Annuities",
} as const;

export const NEW_ANNUITY_DIALOG_COPY = {
  cancelButton: "Cancel",
  durationMonthsLabel: "Duration (months, optional)",
  durationMonthsPlaceholder: "e.g. 24",
  monthlyAmountInvalidError: "Monthly amount must be a positive number.",
  monthlyAmountLabel: "Monthly Amount",
  monthlyAmountPlaceholder: "0.00",
  monthlyAmountRequiredError: "Monthly amount is required.",
  nameLabel: "Name",
  namePlaceholder: "e.g. Car Loan",
  nameRequiredError: "Name is required.",
  submitButton: "Create Annuity",
  submitError: "Something went wrong. Please try again.",
  title: "New Annuity",
} as const;
