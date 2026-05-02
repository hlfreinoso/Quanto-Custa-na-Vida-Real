export type ExpenseFrequency = "once" | "daily" | "weekly" | "monthly" | "yearly";

export interface ExpenseInput {
  name?: string;
  amount: number;
  category?: string;
  frequency: ExpenseFrequency;
  installments?: number;
  installmentAmount?: number;
  isNeed?: boolean;
  isImpulse?: boolean;
}
