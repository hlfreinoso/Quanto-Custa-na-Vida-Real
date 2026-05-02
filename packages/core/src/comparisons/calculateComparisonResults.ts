import type {
  ComparisonPreference,
  ComparisonResult,
} from "../models/ComparisonPreference";

export interface CalculateComparisonResultsParams {
  amount: number;
  preferences: readonly ComparisonPreference[];
  selectedIds: readonly string[];
}

export function calculateComparisonResults({
  amount,
  preferences,
  selectedIds,
}: CalculateComparisonResultsParams): ComparisonResult[] {
  if (amount <= 0) {
    throw new RangeError("amount must be greater than zero");
  }

  return selectedIds.flatMap((selectedId) => {
    const preference = preferences.find(({ id }) => id === selectedId);

    if (!preference) {
      return [];
    }

    return {
      id: preference.id,
      label: preference.label,
      quantity: amount / preference.unitPrice,
      unitLabel: preference.unitLabel,
    };
  });
}
