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
      "beer",
      "chocolate",
      "delivery",
      "streaming",
      "gasoline",
      "lunch",
      "market",
    ]);
  });
});
