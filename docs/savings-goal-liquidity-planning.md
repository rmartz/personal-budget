---
type: Design
title: Savings Goal Liquidity Planning
description: Purchase-date-aware savings goals that glide funds between investments and cash to hit expected purchase dates without forced sales, via a planning layer that emits a thin liquidity target the reconcile engine executes.
resource: (design proposal — tracked by the "Savings Goal Liquidity Planning" epic)
tags:
  [
    savings-goals,
    reconciliation,
    investments,
    planning,
    liquidity,
    glide-path,
    financing,
  ]
---

# Savings Goal Liquidity Planning

> Status: **design** (pre-implementation). Tracked by the **Savings Goal Liquidity Planning** epic and milestone.

## Summary

Let a savings goal carry an **expected purchase date** so the app can:

1. **Hold more of the goal's balance in investments early**, when there is time for it to grow and time to de-risk it safely.
2. **Glide it toward cash as the date approaches**, so the money is liquid when it is needed — without forcing an investment sale (a taxable event this app tries to avoid).
3. **Fund the goal to match the date** — steer enough of each deposit to reach the target by the purchase date.
4. **(Long tail) Amortize liquidation over a financed purchase's term** — a $1,000 balance bought on a 12-month 0% plan liquidates ~$88/month rather than all at once, keeping the financed remainder invested longer.

## First principles: why this works without asset segregation

The current model already supports this **without** tracking cash vs. investment per goal:

- A savings goal is a scalar: `{ targetAmount, fundedAmount, priority, ledgerId }` (see `src/lib/firebase/schema/savings-goals.ts`). There is **no per-goal cash/investment split**.
- Cash vs. investment lives at the **account tier** level (`ReconciliationAccountTier`: `Investment` vs. the cash tiers `ShortTerm` / `LongTerm` / `Reserve`). The reconcile engine reconciles _aggregate_ holdings against the _sum_ of goal funding.

So "liquidate goal A's investments" is not a sale of segregated assets — it is **reassigning which goal backs the pooled investments while steering fresh cash to the goal that needs liquidity**. No shares are sold as long as some other goal is patient enough to keep backing those investments. This gives a precise:

### Feasibility law

> **Maximum amount that can stay invested without a forced sale ≈ Σ(funding of goals not yet needing liquidity).**

This is _self-limiting_: aggressiveness auto-scales with how much patient (abstract / far-dated) goal capacity exists. Abstract "optimistic" goals are the natural ballast that lets concrete near-term goals ride invested until their glide begins — e.g. a travel budget's abstract future trips back the investments that let its concrete cruise stay invested until the last months.

**Important nuance:** the reassignment avoids the _tax/transaction event_, but not the _market value at liquidation_ — reassigning a position that is currently down still books it at today's value for the goal. The glide's timing therefore still matters; the benefit of the mechanic is a **longer safe investment duration**, not risk elimination.

**Limit to respect:** deposit-steering only de-risks while deposits are still flowing. A fully-funded, far-along goal near its date with no new inflows can only be de-risked by taking another goal's cash (which that goal may need) or by an actual sale — which is why selling has to remain an available (advisory) lever.

## Core concepts

### The draw primitive

The atomic unit is a **dated purchase / draw**, not the goal:

```
Draw = { amount, date?, liquidation }
Goal = a bucket of draws + an optional undated residual ("optimistic headroom")
```

- The liquidity schedule is the **union of all draws** across all goals — airfare (paid in March), hotel (financed over 6 months), activities (May) each contribute their own dated/amortized cash demand, with no special-casing.
- A goal-level date is the degenerate case (a goal with one draw). Model the general list-of-draws **at the data layer now** and expose only single-purchase input in the v1 UI — retrofitting a schedule onto a scalar later is the painful path; starting with a length-1 list is free.
- `targetAmount` becomes derived (Σ draws + buffer); `fundedAmount` stays the scalar saved-so-far. A draw is a **planned outflow** — when paid, it draws down funding and the remaining schedule re-plans.

### Liquidation policy → cash-demand schedule

Each draw carries a **liquidation policy** that _produces a cash-demand schedule_ (how much must be cash, by when). Downstream code consumes the schedule and never branches on the policy:

| Policy                               | Cash-demand schedule                                                                                                                                                        |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Pay-in-full**                      | full amount as cash by the date                                                                                                                                             |
| **Financed — amortized liquidation** | down payment by the date; the invested remainder _is_ the payment source and releases as monthly draws over the term                                                        |
| **Financed — income-funded padding** | down payment (or a fixed cash target) by the date; loan payments come from ongoing income, so the invested remainder is a _cushion_ generating **no** scheduled cash demand |
| **Manual / padding**                 | a fixed cash target (maybe just the down payment, maybe zero); the remainder stays invested with no demand — the "I'll time the sale myself" mode                           |

The amortized-vs-income-funded distinction is declared, not inferred: both "keep it invested," but only the first generates future cash demand from the goal.

### Binary invest/cash in planning

Only the **investment ↔ cash** boundary carries a tax cost (buy vs. sell). The ShortTerm / LongTerm / Reserve subdivision of cash has no such cost, so **planning treats cash as a single concept**; how that cash lands across the tiers is entirely reconcile's concern. This keeps the planning→reconcile interface to a single scalar and means planning never imports the tier enum.

## Architecture: two purpose-focused engines, one thin contract

```
                     LiquidityTarget (value object)
  ┌───────────────┐   e.g. { period, targetCashFloor }   ┌──────────────────┐
  │ Planning layer │ ───────────────────────────────────▶ │ Reconcile engine │
  │ (this epic)    │                                       │ (existing)       │
  └───────────────┘                                       └──────────────────┘
  owns: time, returns,                                     owns: current holdings,
  financing, glide,                                        tier subdivision,
  feasibility projection                                   minimum-transaction moves
```

- **Planning layer** reasons about the _future_: it builds the liquidity schedule from all draws, applies the glide, and collapses the whole forward schedule into a **current-period target** — a `LiquidityTarget` (a target cash floor / investable ceiling).
- **Reconcile engine** stays a _snapshot optimizer_: given the target plus current holdings, it computes the minimum set of moves to satisfy it and subdivides the cash across its tiers. It only ever needs "how much must be liquid now," never the schedule.
- The **contract is data, not a shared function.** Keeping planning and reconcile as separate code paths — communicating only through a versioned `LiquidityTarget` — avoids a shared "cash/investment optimizer" that would accumulate mode flags to gate two subtly different semantics. Each side is tested independently (planning by the targets it emits, reconcile by the targets it consumes). Split-then-share is cheap if they later converge; share-then-split is not.

## Governing principle: stability

Recommendations favor **stability and few long-term transactions**. The app should not tell a user to buy $500 of investments one month and sell $500 the next unless the user changed something. This principle drives the mechanics — and notably unifies the "no churn" and "no forced sale" goals into a single mechanism:

- **De-risk by withholding new cash from investments, not by selling.** If the only tool for moving a goal toward cash is redirecting _inflows_ (and reassigning which goal backs existing investments), de-risking is inherently churn-free _and_ sale-free.
- **Deadband / hysteresis.** The target moves only when drift exceeds a band or a date materially approaches, so month-to-month noise never generates a recommendation.
- **Minimum-transaction reconciliation.** "Fewest / smallest moves that reach the banded target, closest to the current allocation" is an explicit objective, not merely _a_ solution.
- **Cadence & lumpiness.** Batch recommendations; suggest reviewing on a slow cadence rather than continuously.
- **Selling is demoted** to a surfaced, user-timed option — never an automatic recommendation.

The glide shape is a reasonable default (this is rough planning): stay maximally invested until a de-risking window, then glide to cash, assuming investments are safe over a reasonably long horizon. The window length can scale with volatility once the return model exists.

## Feasibility: project, don't decide

The app tracks and plans; it does **not** make allocation decisions under scarcity. Planning is a **deterministic chronological cash-flow simulation**: walk time forward in date order, applying deposits (in) and each draw's cash-demand (out), tracking a running **projected cash balance** (the glide governs how much sits in investments vs. cash). Infeasibility is simply the **projected balance going negative** — a red region on a balance-over-time line, with an onset date and a magnitude.

The feasibility law is therefore **emergent, not enforced**: transfer-liquidation is a deterministic consequence, not a decision — where patient capacity exists the simulation reassigns investments to patient goals and no sale appears; where it runs out the demand cannot be covered and the balance dips negative (or a forced-sale marker appears). The simulation never _resolves_ scarcity; it reveals exactly when and how much it bites.

### Funding order (deterministic)

Each period's deposits are allocated in a fixed order — no priority-based scarcity decisions:

1. **Dated draws first, by required run-rate** — each dated draw claims enough to keep its prorated progress toward `amount` by `date` (on-track pacing). This is the "feasibility/scarcity" allocation.
2. **Leftover to undated goals, by `priority`** — surplus after the dated draws' on-track needs flows to the undated "optimistic" goals, ordered by the existing Zipf `priority`. `priority` is retained **only** for this undated ordering; it plays no role in scarcity or liquidity.

When even step 1 cannot be met (deposits insufficient), the shortfall surfaces as a dated draw falling behind its prorated line and/or the projected balance going negative.

### Tools, not decisions

When the projection shows a shortfall, the app surfaces it and hands the user levers — it never picks one:

- the shortfall's **onset date and magnitude**;
- the **dated draws falling before the shortfall** — the reschedule / rescope candidates;
- **user-driven what-if**: recompute the whole projection under a change the user is weighing (push a date, cut an amount, add $X/period, plan a $Z sale) and redraw the balance line;
- **impact ranking** of those candidates as pure information (e.g. "rescheduling the cruise 2 months clears the whole shortfall; trimming the wedding $2k clears half").

The "stay invested and sell on my own clock" case needs no special handling: it is just a draw whose liquidation policy demands no cash for the invested remainder, so the projection shows that balance persisting until the user liquidates.

## Return model (prerequisite dependency)

Projections need a **blended projected investment return**, derived from **per-holding expected return × target allocation** (e.g. 80% S&P at 10% + 20% bonds at 3%). Keep it simple and transparent for rough planning — blended mean, optionally a modest "safe" haircut, all user-tunable; no Monte Carlo. It drives two things: funding-pace projections, and the glide's de-risk window.

**Status of the dependency:** target allocation is stubbed (`src/hooks/use-target-allocation.ts` → epic #11, Investment Target Allocation; `src/lib/firebase/schema/investments.ts` models `targetPercent` / `Posture`). **Per-holding expected return does not exist yet** and must be added. This is the first sub-issue and sequences before the planning layer.

## Task decomposition

The epic's sub-issues, along the seams above:

1. **Investment return & allocation config** (prerequisite) — per-holding expected-return input + target allocation → blended projected return.
2. **Draw primitive & goal-as-bucket data model** — goals contain dated draws with liquidation policies; `targetAmount` derived; schema migration.
3. **Liquidity planning layer** — cash-demand schedule, feasibility law, binary invest/cash glide; emits `LiquidityTarget`.
4. **`LiquidityTarget` contract** — the thin, versioned data interface between planning and reconcile.
5. **Reconcile integration** — consume the target as a cash-floor constraint; minimum-transaction reconciliation; deposit-steered de-risk; never auto-sell.
6. **Funding allocation** — dated draws funded first by required run-rate (prorated progress toward `amount` by `date`); leftover distributed to undated goals by the existing Zipf `priority`.
7. **Chronological cash-flow feasibility projection** — forward simulation producing the projected balance timeline, with negative-balance infeasibility surfacing (onset date + magnitude).
8. **Feasibility tools** — user-driven what-if recomputation and impact-ranked reschedule / rescope candidates (information, never a chosen resolution).
9. **UI** — draw / date / financing / liquidation input on goals; the cash-flow projection (balance-over-time with shortfall surfacing); glide visualization.

## Out of scope / non-goals

- **Per-goal asset-lot segregation** — v1 is derived-only; add segregation later only if a concrete need appears.
- **Tax-lot optimization and non-US tax treatment** — US-only assumptions (the investment↔cash boundary is the only tax-relevant one modeled).
- **Probabilistic / Monte Carlo return modeling** — a simple blended mean (plus optional haircut) is sufficient for rough planning.
- **Auto-executing investment sales** — always advisory; the user decides when large investment changes happen.
