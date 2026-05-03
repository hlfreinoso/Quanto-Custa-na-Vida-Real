export interface CalculateWorkHoursEquivalentParams {
  amount: number;
  hourlyRate: number;
}

export function calculateWorkHoursEquivalent({
  amount,
  hourlyRate,
}: CalculateWorkHoursEquivalentParams): number {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new RangeError("amount must be a finite number greater than zero");
  }

  if (!Number.isFinite(hourlyRate) || hourlyRate <= 0) {
    throw new RangeError("hourlyRate must be a finite number greater than zero");
  }

  return amount / hourlyRate;
}
