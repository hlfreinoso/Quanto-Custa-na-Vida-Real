import { describe, expect, it } from "vitest";

import { calculateHourlyRate } from "./calculateHourlyRate";
import type { UserFinancialProfile } from "../models/UserFinancialProfile";

const validProfile: UserFinancialProfile = {
  monthlyIncome: 4500,
  workHoursPerDay: 8,
  workDaysPerMonth: 22,
  currency: "BRL",
};

describe("calculateHourlyRate", () => {
  it("calculates the hourly rate from monthly income and monthly work hours", () => {
    expect(calculateHourlyRate(validProfile)).toBeCloseTo(25.568, 3);
  });

  it("rejects non-positive monthly income", () => {
    expect(() =>
      calculateHourlyRate({ ...validProfile, monthlyIncome: 0 }),
    ).toThrow("monthlyIncome must be greater than zero");
  });

  it("rejects non-positive work hours per day", () => {
    expect(() =>
      calculateHourlyRate({ ...validProfile, workHoursPerDay: 0 }),
    ).toThrow("workHoursPerDay must be greater than zero");
  });

  it("rejects non-positive work days per month", () => {
    expect(() =>
      calculateHourlyRate({ ...validProfile, workDaysPerMonth: 0 }),
    ).toThrow("workDaysPerMonth must be greater than zero");
  });
});
