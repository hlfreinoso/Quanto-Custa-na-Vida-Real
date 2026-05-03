import { describe, expect, it } from "vitest";

import { calculateBasicExpenseImpact } from "./calculateBasicExpenseImpact";
import type { ExpenseInput } from "../models/ExpenseInput";
import type { UserFinancialProfile } from "../models/UserFinancialProfile";

const profile: UserFinancialProfile = {
  monthlyIncome: 4500,
  workHoursPerDay: 8,
  workDaysPerMonth: 22,
  currency: "BRL",
};

const expense: ExpenseInput = {
  amount: 299.9,
  frequency: "once",
};

describe("calculateBasicExpenseImpact", () => {
  it("calculates hourly rate and work hours equivalent for an expense", () => {
    const result = calculateBasicExpenseImpact(profile, expense);

    expect(result.hourlyRate).toBeCloseTo(25.568, 3);
    expect(result.workHoursEquivalent).toBeCloseTo(11.729, 3);
  });

  it("rejects invalid profile data", () => {
    expect(() =>
      calculateBasicExpenseImpact(
        { ...profile, monthlyIncome: Number.NaN },
        expense,
      ),
    ).toThrow("monthlyIncome must be a finite number greater than zero");
  });

  it("rejects invalid expense amount", () => {
    expect(() =>
      calculateBasicExpenseImpact(profile, { ...expense, amount: -1 }),
    ).toThrow("amount must be a finite number greater than zero");
  });
});
