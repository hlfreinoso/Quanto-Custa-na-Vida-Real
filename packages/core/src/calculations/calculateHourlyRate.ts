import type { UserFinancialProfile } from "../models/UserFinancialProfile";

export function calculateHourlyRate(profile: UserFinancialProfile): number {
  if (!Number.isFinite(profile.monthlyIncome) || profile.monthlyIncome <= 0) {
    throw new RangeError("monthlyIncome must be a finite number greater than zero");
  }

  if (
    !Number.isFinite(profile.workHoursPerDay) ||
    profile.workHoursPerDay <= 0
  ) {
    throw new RangeError("workHoursPerDay must be a finite number greater than zero");
  }

  if (
    !Number.isFinite(profile.workDaysPerMonth) ||
    profile.workDaysPerMonth <= 0
  ) {
    throw new RangeError("workDaysPerMonth must be a finite number greater than zero");
  }

  const monthlyWorkHours = profile.workHoursPerDay * profile.workDaysPerMonth;

  return profile.monthlyIncome / monthlyWorkHours;
}
