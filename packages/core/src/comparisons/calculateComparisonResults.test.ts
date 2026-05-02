import { describe, expect, it } from "vitest";

import { calculateComparisonResults } from "./calculateComparisonResults";
import { defaultComparisonPreferences } from "./defaultComparisonPreferences";

describe("calculateComparisonResults", () => {
  it("calculates quantities for selected comparison preferences", () => {
    const results = calculateComparisonResults({
      amount: 180,
      preferences: defaultComparisonPreferences,
      selectedIds: ["coffee", "netflix", "chocolate"],
    });

    expect(results).toEqual([
      {
        id: "coffee",
        label: "Cafe",
        quantity: 30,
        unitLabel: "cafes",
      },
      {
        id: "netflix",
        label: "Netflix",
        quantity: 180 / 39.9,
        unitLabel: "meses de Netflix",
      },
      {
        id: "chocolate",
        label: "Bombons",
        quantity: 72,
        unitLabel: "bombons",
      },
    ]);
  });

  it("ignores unknown selected ids", () => {
    const results = calculateComparisonResults({
      amount: 180,
      preferences: defaultComparisonPreferences,
      selectedIds: ["unknown"],
    });

    expect(results).toEqual([]);
  });
});
