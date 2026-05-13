import { RECONCILE_VIEW_COPY } from "./ReconcileView.copy";

// TODO: Replace placeholder data with useReconciliation(uid, month) — see epic #18 (Monthly Reconciliation)

const PLACEHOLDER_MONTH = "May 2026";

const PLACEHOLDER_CASH_FLOW_ACCOUNTS = [
  { account: "Checking", balance: "$4,200" },
  { account: "High-yield savings", balance: "$18,500" },
  { account: "Brokerage", balance: "$62,000" },
];

const PLACEHOLDER_CASH_FLOW_ACTIONS = [
  { action: "Move to investments", amount: "$1,200" },
  { action: "Keep as cash reserve", amount: "$3,000" },
  { action: "Assign to ledgers", amount: "$400" },
];

const PLACEHOLDER_TILES = [
  { label: RECONCILE_VIEW_COPY.tileCashSurplus, value: "$4,200" },
  { label: RECONCILE_VIEW_COPY.tileToInvest, value: "$1,200" },
  { label: RECONCILE_VIEW_COPY.tileInterTierTransfer, value: "$0" },
  { label: RECONCILE_VIEW_COPY.tileAssignToLedgers, value: "$400" },
];

const PLACEHOLDER_INPUTS = [
  { account: "Checking", balance: "$4,200", confirmed: false },
  { account: "High-yield savings", balance: "$18,500", confirmed: true },
  { account: "Brokerage", balance: "$62,000", confirmed: false },
];

const PLACEHOLDER_INVESTMENT_ROWS = [
  { label: "Posture", value: "Moderate growth" },
  { label: "Cash above floors", value: "$1,200" },
  { label: "Margin available", value: "$500" },
  { label: "Target allocation", value: "70 / 30" },
];

export function ReconcileView() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {RECONCILE_VIEW_COPY.pageHeading}
          </h1>
          <p className="text-sm text-muted-foreground">
            {RECONCILE_VIEW_COPY.tagline}
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          <button
            type="button"
            className="rounded-md border px-3 py-1.5 text-muted-foreground hover:bg-muted"
          >
            {RECONCILE_VIEW_COPY.actionConfirmed}
          </button>
          <button
            type="button"
            className="rounded-md border px-3 py-1.5 text-muted-foreground hover:bg-muted"
          >
            {RECONCILE_VIEW_COPY.actionProjected}
          </button>
          <button
            type="button"
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/80"
          >
            {RECONCILE_VIEW_COPY.actionApply}
          </button>
        </div>
      </div>

      {/* Cash flow block */}
      <section className="mb-8 rounded-xl border p-6">
        <h2 className="mb-4 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          {RECONCILE_VIEW_COPY.cashFlowSectionLabel} · {PLACEHOLDER_MONTH}
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              {RECONCILE_VIEW_COPY.cashFlowAccountBalancesLabel}
            </p>
            <ul className="space-y-2">
              {PLACEHOLDER_CASH_FLOW_ACCOUNTS.map((row) => (
                <li key={row.account} className="flex justify-between text-sm">
                  <span>{row.account}</span>
                  <span className="font-medium">{row.balance}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              {RECONCILE_VIEW_COPY.cashFlowRecommendedActionsLabel}
            </p>
            <ul className="space-y-2">
              {PLACEHOLDER_CASH_FLOW_ACTIONS.map((row) => (
                <li key={row.action} className="flex justify-between text-sm">
                  <span>{row.action}</span>
                  <span className="font-medium">{row.amount}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Summary tiles */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {PLACEHOLDER_TILES.map((tile) => (
          <div
            key={tile.label}
            className="rounded-xl border bg-muted/30 p-4 text-center"
          >
            <p className="text-xs text-muted-foreground">{tile.label}</p>
            <p className="mt-1 text-2xl font-bold">{tile.value}</p>
          </div>
        ))}
      </div>

      {/* Inputs needed + investment explanation */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Inputs needed */}
        <section className="rounded-xl border p-6">
          <h2 className="mb-4 text-sm font-semibold">
            {RECONCILE_VIEW_COPY.inputsNeededHeading}
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs text-muted-foreground">
                <th className="pb-2 text-left font-medium">
                  {RECONCILE_VIEW_COPY.inputsTableAccountHeader}
                </th>
                <th className="pb-2 text-right font-medium">
                  {RECONCILE_VIEW_COPY.inputsTableBalanceHeader}
                </th>
                <th className="pb-2 text-right font-medium">
                  {RECONCILE_VIEW_COPY.inputsTableStatusHeader}
                </th>
              </tr>
            </thead>
            <tbody>
              {PLACEHOLDER_INPUTS.map((row) => (
                <tr key={row.account} className="border-b last:border-0">
                  <td className="py-2">{row.account}</td>
                  <td className="py-2 text-right">{row.balance}</td>
                  <td className="py-2 text-right text-xs text-muted-foreground">
                    {row.confirmed
                      ? RECONCILE_VIEW_COPY.inputsTableStatusConfirmed
                      : RECONCILE_VIEW_COPY.inputsTableStatusPending}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Why this investment amount? */}
        <section className="rounded-xl border p-6">
          <h2 className="mb-4 text-sm font-semibold">
            {RECONCILE_VIEW_COPY.investmentExplanationHeading}
          </h2>
          <ul className="space-y-3">
            {PLACEHOLDER_INVESTMENT_ROWS.map((row) => (
              <li key={row.label} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-medium">{row.value}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
