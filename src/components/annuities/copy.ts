export const ANNUITY_CARD_COPY = {
  balanceTrendChartPlaceholder: "Balance trend chart",
  balanceTrendNowLabel: "Now",
  balanceTrendPayoffLabel: "Payoff",
  balanceTrendPlaceholderValue: "—",
  balanceTrendStartedLabel: "Started",
  balanceTrendTitle: (annuityName: string) =>
    `Balance trend · ${annuityName} principal`,
  columnBalance: "Balance",
  columnInterest: "Interest",
  columnMonth: "Month",
  columnPayment: "Payment",
  columnPrincipal: "Principal",
  deleteAriaLabel: "Delete annuity",
  editAriaLabel: "Edit annuity",
  monthlyModeFlatSublabel: "monthly · Flat",
  monthlyModePVDerivedSublabel: "monthly · PV-derived",
  paymentHistoryEmpty: "No payment history yet.",
  paymentHistoryTitle: (annuityName: string) =>
    `${annuityName} · payment history`,
  selectAriaLabel: "Select annuity",
  termRemainingIndefinite: "Ongoing",
  termRemainingLabel: "Term remaining",
  termRemainingMonths: (months: number) => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years > 0 && remainingMonths > 0) {
      return `${String(years)} yr ${String(remainingMonths)} mo left`;
    } else if (years > 0) {
      return `${String(years)} yr left`;
    } else {
      return `${String(remainingMonths)} mo left`;
    }
  },
} as const;

export const ANNUITY_LIST_COPY = {
  columnMonthly: "Monthly",
  columnName: "Name",
  columnTerm: "Term",
  emptyStateMessage: "You don't have any annuities yet.",
  indefiniteTerm: "Indefinite",
  newAnnuityButton: "New Annuity",
  summaryLine: (count: number, total: string) =>
    `${String(count)} active · ${total} / month total`,
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

export const DELETE_ANNUITY_DIALOG_COPY = {
  cancelButton: "Cancel",
  confirmButton: "Delete",
  confirmMessage: (name: string) =>
    `Are you sure you want to permanently delete "${name}"? This cannot be undone.`,
  deletingButton: "Deleting…",
  title: "Delete Annuity",
} as const;

export const EDIT_ANNUITY_DIALOG_COPY = {
  cancelButton: "Cancel",
  monthlyAmountInvalidError: "Monthly amount must be a positive number.",
  monthlyAmountLabel: "Monthly amount",
  monthlyAmountPlaceholder: "e.g. 150.00",
  nameLabel: "Name",
  namePlaceholder: "e.g. Car loan",
  nameRequiredError: "Name is required.",
  savingButton: "Saving…",
  submitButton: "Save Changes",
  submitError: "Failed to save changes. Please try again.",
  title: "Edit Annuity",
} as const;

export const CREATE_ANNUITY_DIALOG_COPY = {
  annualRateLabel: "Annual interest rate (%)",
  annualRatePlaceholder: "e.g. 5",
  annualRateInvalidError: "Annual rate must be a positive number.",
  cancelButton: "Cancel",
  creatingButton: "Creating…",
  durationLabel: "Duration (months)",
  durationPlaceholder: "e.g. 60",
  durationInvalidError: "Duration must be a positive whole number.",
  modeFlatButton: "Flat amount",
  modeLoanButton: "Calculate from loan terms",
  monthlyAmountLabel: "Monthly amount",
  monthlyAmountPlaceholder: "e.g. 150.00",
  monthlyAmountInvalidError: "Monthly amount must be a positive number.",
  nameLabel: "Name",
  namePlaceholder: "e.g. Car loan",
  nameRequiredError: "Name is required.",
  presentValueLabel: "Starting value",
  presentValuePlaceholder: "e.g. 10000",
  presentValueInvalidError: "Starting value must be a positive number.",
  previewLabel: "Monthly payment",
  submitButton: "Create Annuity",
  submitError: "Failed to create annuity. Please try again.",
  title: "New Annuity",
} as const;
