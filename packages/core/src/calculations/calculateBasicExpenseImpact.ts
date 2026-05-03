import type { ExpenseInput } from "../models/ExpenseInput";
import type { BasicExpenseImpact } from "../models/BasicExpenseImpact";
import type { UserFinancialProfile } from "../models/UserFinancialProfile";
import { calculateHourlyRate } from "./calculateHourlyRate";
import { calculateWorkHoursEquivalent } from "./calculateWorkHoursEquivalent";

export function calculateBasicExpenseImpact(
  profile: UserFinancialProfile,
  expense: ExpenseInput,
): BasicExpenseImpact {
  const hourlyRate = calculateHourlyRate(profile);
  const workHoursEquivalent = calculateWorkHoursEquivalent({
    amount: expense.amount,
    hourlyRate,
  });

  return {
    hourlyRate,
    workHoursEquivalent,
  };
}
