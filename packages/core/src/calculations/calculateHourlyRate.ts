import type { UserFinancialProfile } from "../models/UserFinancialProfile";

export function calculateHourlyRate(profile: UserFinancialProfile): number {
  if (profile.monthlyIncome <= 0) {
    throw new RangeError("monthlyIncome must be greater than zero");
  }

  if (profile.workHoursPerDay <= 0) {
    throw new RangeError("workHoursPerDay must be greater than zero");
  }

  if (profile.workDaysPerMonth <= 0) {
    throw new RangeError("workDaysPerMonth must be greater than zero");
  }

  const monthlyWorkHours = profile.workHoursPerDay * profile.workDaysPerMonth;

  return profile.monthlyIncome / monthlyWorkHours;
}
