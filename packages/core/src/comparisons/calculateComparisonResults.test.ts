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
    ).toThrow("amount must be a finite number greater than zero");
  });

  it("rejects non-finite amount", () => {
    expect(() =>
      calculateComparisonResults({
        amount: Number.NaN,
        preferences: defaultComparisonPreferences,
        selectedIds: ["coffee"],
      }),
    ).toThrow("amount must be a finite number greater than zero");
  });

  it("returns an empty list when limit is zero", () => {
    const results = calculateComparisonResults({
      amount: 180,
      preferences: defaultComparisonPreferences,
      selectedIds: ["coffee"],
      limit: 0,
    });

    expect(results).toEqual([]);
  });

  it("does not duplicate repeated selected ids", () => {
    const results = calculateComparisonResults({
      amount: 180,
      preferences: defaultComparisonPreferences,
      selectedIds: ["coffee", "coffee", "coffee"],
      limit: 4,
      random: () => 0,
    });

    expect(results.filter(({ id }) => id === "coffee")).toHaveLength(1);
  });

  it("returns every available preference when limit is greater than available options", () => {
    const preferences = defaultComparisonPreferences.slice(0, 2);
    const results = calculateComparisonResults({
      amount: 180,
      preferences,
      selectedIds: preferences.map(({ id }) => id),
      limit: 10,
      random: () => 0,
    });

    expect(results).toHaveLength(2);
  });

  it("rejects invalid unit prices", () => {
    expect(() =>
      calculateComparisonResults({
        amount: 180,
        preferences: [
          {
            id: "invalid",
            label: "Invalid",
            category: "test",
            unitPrice: 0,
            unitLabel: "invalid units",
          },
        ],
        selectedIds: ["invalid"],
      }),
    ).toThrow("unitPrice must be a finite number greater than zero");
  });
});
