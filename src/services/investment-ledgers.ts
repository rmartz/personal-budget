/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  CreateInvestmentLedgerInput,
  InvestmentLedger,
  UpdateInvestmentLedgerInput,
} from "@/lib/types";

export function getInvestmentLedgers(
  _uid: string,
): Promise<InvestmentLedger[]> {
  // TODO: implement with Firebase
  return Promise.resolve([]);
}

export function createInvestmentLedger(
  _uid: string,
  _data: CreateInvestmentLedgerInput,
): Promise<InvestmentLedger> {
  // TODO: implement with Firebase
  return Promise.reject(new Error("Not implemented"));
}

export function updateInvestmentLedger(
  _uid: string,
  _id: string,
  _data: UpdateInvestmentLedgerInput,
): Promise<void> {
  // TODO: implement with Firebase
  return Promise.reject(new Error("Not implemented"));
}

export function deleteInvestmentLedger(
  _uid: string,
  _id: string,
): Promise<void> {
  // TODO: implement with Firebase
  return Promise.reject(new Error("Not implemented"));
}
