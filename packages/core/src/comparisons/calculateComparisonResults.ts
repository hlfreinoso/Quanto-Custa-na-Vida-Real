import type {
  ComparisonPreference,
  ComparisonResult,
} from "../models/ComparisonPreference";

export interface CalculateComparisonResultsParams {
  amount: number;
  preferences: readonly ComparisonPreference[];
  selectedIds: readonly string[];
  limit?: number;
  random?: () => number;
}

export function calculateComparisonResults({
  amount,
  preferences,
  selectedIds,
  limit = 4,
  random = Math.random,
}: CalculateComparisonResultsParams): ComparisonResult[] {
  if (amount <= 0) {
    throw new RangeError("amount must be greater than zero");
  }

  if (limit <= 0) {
    return [];
  }

  const preferredResults = shuffleResults(
    buildResults(amount, preferences, selectedIds),
    random,
  );
  const fallbackResults = buildResults(
    amount,
    preferences,
    preferences.map(({ id }) => id),
  ).filter(
    (result) =>
      !preferredResults.some(
        (preferredResult) => preferredResult.id === result.id,
      ),
  );

  return [
    ...preferredResults,
    ...shuffleResults(fallbackResults, random),
  ].slice(0, limit);
}

function buildResults(
  amount: number,
  preferences: readonly ComparisonPreference[],
  selectedIds: readonly string[],
): ComparisonResult[] {
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

function shuffleResults(
  results: ComparisonResult[],
  random: () => number,
): ComparisonResult[] {
  const shuffledResults = [...results];

  for (let index = shuffledResults.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    const currentResult = shuffledResults[index];
    const swapResult = shuffledResults[swapIndex];

    if (!currentResult || !swapResult) {
      continue;
    }

    shuffledResults[index] = swapResult;
    shuffledResults[swapIndex] = currentResult;
  }

  return shuffledResults;
}
