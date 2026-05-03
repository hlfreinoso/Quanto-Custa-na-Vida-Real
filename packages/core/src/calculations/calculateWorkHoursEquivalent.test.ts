import { describe, expect, it } from "vitest";

import { calculateWorkHoursEquivalent } from "./calculateWorkHoursEquivalent";

describe("calculateWorkHoursEquivalent", () => {
  it("calculates how many work hours are needed to pay an expense", () => {
    expect(
      calculateWorkHoursEquivalent({
        amount: 299.9,
        hourlyRate: 25.568181818,
      }),
    ).toBeCloseTo(11.729, 3);
  });

  it("rejects non-positive expense amount", () => {
    expect(() =>
      calculateWorkHoursEquivalent({
        amount: 0,
        hourlyRate: 25.568181818,
      }),
    ).toThrow("amount must be a finite number greater than zero");
  });

  it("rejects non-positive hourly rate", () => {
    expect(() =>
      calculateWorkHoursEquivalent({
        amount: 299.9,
        hourlyRate: 0,
      }),
    ).toThrow("hourlyRate must be a finite number greater than zero");
  });

  it("rejects non-finite values", () => {
    expect(() =>
      calculateWorkHoursEquivalent({
        amount: Number.NaN,
        hourlyRate: 25.568181818,
      }),
    ).toThrow("amount must be a finite number greater than zero");

    expect(() =>
      calculateWorkHoursEquivalent({
        amount: 299.9,
        hourlyRate: Number.POSITIVE_INFINITY,
      }),
    ).toThrow("hourlyRate must be a finite number greater than zero");
  });
});
