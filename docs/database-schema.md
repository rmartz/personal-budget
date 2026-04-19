# Firebase Realtime Database Schema

## Multi-User Extensibility

All user data is stored under `/users/{uid}/...`. This path prefix ensures every read and write is scoped to a single authenticated user. Future features — shared budgets, household accounts, delegated access — can be layered on without restructuring existing paths; a new top-level key (e.g. `/households/{householdId}/`) can be added alongside `/users/` without touching any existing data.

Timestamps are stored as ISO 8601 strings (e.g. `"2024-01-15T00:00:00.000Z"`). This format is human-readable in the Firebase console, sorts lexicographically, and round-trips through `new Date()` without loss of precision.

## Path Tree

```
/users/{uid}/
  budgetLedgers/
    {ledgerId}/
      name              string        Required. Display name (e.g. "Car Maintenance")
      cashCap           number|null   Optional. Max liquid balance; excess is marked for investment

  budgetLedgerTransactions/
    {ledgerId}/
      {transactionId}/
        type            string        "deposit" | "expense"
        date            string        ISO 8601 timestamp
        amount          number        Transaction amount (always positive)
        description     string        Free-text description

  budgetLedgerSavingsGoals/
    {ledgerId}/
      {goalId}/
        name            string        Display name (e.g. "Emergency Fund")
        targetAmount    number        Total amount to save toward this goal
        fundedAmount    number        Amount currently funded
        priority        number        Integer; lower value = higher priority

  investmentLedgers/
    {ledgerId}/
      name              string        Required. Display name (e.g. "Stocks")
      targetAllocationPct number      Target allocation as a percentage (0–100)

  investmentLots/
    {ledgerId}/
      {lotId}/
        type            string        "purchase" | "sale"
        date            string        ISO 8601 timestamp
        units           number        Number of units transacted
        pricePerUnit    number        Price per unit at time of transaction

  annuities/
    {annuityId}/
      name              string        Display name (e.g. "Netflix")
      monthlyAmount     number        Monthly payment or liability amount
      startDate         string        ISO 8601 timestamp; first payment date
      durationMonths    number|null   Optional. Total number of months; null = indefinite

  reconciliationAccounts/
    {accountId}/
      name              string        Display name (e.g. "Chase Checking")
      tier              string        "short-term" | "reserve" | "long-term"
      targetFloat       number        Target balance to maintain in this account

  reconciliationExpenses/
    {expenseId}/
      name              string        Display name (e.g. "Electric Bill")
      type              string        "statement-balance" | "running-balance"
      typicalAmount     number        Expected typical charge amount
```

## Security Rules

All paths under `/users/{uid}/` are readable and writable only by the authenticated user whose UID matches `{uid}`. All other paths deny access by default. See `firebase/database.rules.json`.

## Design Notes

- `budgetLedgerTransactions` and `budgetLedgerSavingsGoals` are nested under the ledger ID to keep related data co-located and to enable efficient Firebase queries scoped to a single ledger.
- `investmentLots` follow the same pattern, nested under the parent `investmentLedger` ID.
- `annuities`, `reconciliationAccounts`, and `reconciliationExpenses` are flat (not nested under another entity) because they are independent domain objects.
- Optional fields that Firebase cannot store as `undefined` are written as `null` in the Firebase layer and converted back to `undefined` in the domain layer by the serialization helpers.
