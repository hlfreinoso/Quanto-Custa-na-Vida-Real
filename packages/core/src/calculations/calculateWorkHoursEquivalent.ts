export interface CalculateWorkHoursEquivalentParams {
  amount: number;
  hourlyRate: number;
}

export function calculateWorkHoursEquivalent({
  amount,
  hourlyRate,
}: CalculateWorkHoursEquivalentParams): number {
  if (amount <= 0) {
    throw new RangeError("amount must be greater than zero");
  }

  if (hourlyRate <= 0) {
    throw new RangeError("hourlyRate must be greater than zero");
  }

  return amount / hourlyRate;
}
