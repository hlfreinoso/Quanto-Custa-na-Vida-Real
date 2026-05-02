import { describe, expect, it } from "vitest";

import { calculateComparisonResults } from "./calculateComparisonResults";
import { defaultComparisonPreferences } from "./defaultComparisonPreferences";

describe("calculateComparisonResults", () => {
  it("selects a limited random set from preferred options", () => {
    const results = calculateComparisonResults({
      amount: 180,
      preferences: defaultComparisonPreferences,
      selectedIds: ["coffee", "netflix", "bonbon"],
      limit: 3,
      random: () => 0.99,
    });

    expect(results).toHaveLength(3);
    expect(results.map(({ id }) => id).sort()).toEqual([
      "bonbon",
      "coffee",
      "netflix",
    ]);
    expect(results.find(({ id }) => id === "netflix")).toMatchObject({
      label: "Netflix",
      quantity: 180 / 39.9,
      unitLabel: "meses de Netflix",
    });
  });

  it("ignores unknown selected ids", () => {
    const results = calculateComparisonResults({
      amount: 180,
      preferences: defaultComparisonPreferences,
      selectedIds: ["unknown"],
      limit: 1,
      random: () => 0.99,
    });

    expect(results).toHaveLength(1);
  });

  it("uses fallback preferences when selected ids are not enough", () => {
    const results = calculateComparisonResults({
      amount: 180,
      preferences: defaultComparisonPreferences,
      selectedIds: ["netflix"],
      limit: 3,
      random: () => 0.99,
    });

    expect(results).toHaveLength(3);
    expect(results.map(({ id }) => id)).toContain("netflix");
  });

  it("rejects non-positive amount", () => {
    expect(() =>
      calculateComparisonResults({
        amount: 0,
        preferences: defaultComparisonPreferences,
        selectedIds: ["coffee"],
      }),
    ).toThrow("amount must be greater than zero");
  });
});
