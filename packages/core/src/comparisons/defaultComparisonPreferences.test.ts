import { describe, expect, it } from "vitest";

import { defaultComparisonPreferences } from "./defaultComparisonPreferences";

describe("defaultComparisonPreferences", () => {
  it("contains unique preference ids", () => {
    const ids = defaultComparisonPreferences.map((preference) => preference.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("starts with lightweight everyday comparison options", () => {
    expect(defaultComparisonPreferences.map((preference) => preference.id)).toEqual([
      "coffee",
      "beer_can",
      "bonbon",
      "burger",
      "netflix",
      "gasoline",
      "bus_ticket",
      "movie_ticket",
      "acai",
      "pizza",
      "bread",
      "soda_2l",
      "ride_short",
    ]);
  });

  it("uses a specific Netflix monthly reference instead of a generic streaming option", () => {
    expect(
      defaultComparisonPreferences.find(
        (preference) => preference.id === "netflix",
      ),
    ).toMatchObject({
      label: "Netflix",
      unitPrice: 39.9,
      unitLabel: "meses de Netflix",
    });
  });

  it("uses only tangible comparison items with direct prices", () => {
    expect(defaultComparisonPreferences).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "market" }),
        expect.objectContaining({ id: "delivery" }),
      ]),
    );

    expect(defaultComparisonPreferences.every(({ unitPrice }) => unitPrice > 0))
      .toBe(true);
  });
});
