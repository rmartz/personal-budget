// TODO: Implement reconciliation data fetching in epic #18 (Monthly Reconciliation).
// This hook is a scaffold stub. It returns an empty shape that ReconcileView will
// use once the real reconciliation service layer is built.

export interface ReconciliationData {
  month?: string;
}

export function useReconciliation(
  _uid: string,
  _month?: string,
): ReconciliationData {
  return { month: _month ?? "" };
}
