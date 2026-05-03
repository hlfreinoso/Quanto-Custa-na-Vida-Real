import AsyncStorage from "@react-native-async-storage/async-storage";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  loadInitialProfile,
  saveInitialProfile,
  type InitialProfile,
} from "./InitialProfileStorage";

vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
  },
}));

const mockedAsyncStorage = vi.mocked(AsyncStorage);

describe("InitialProfileStorage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when no initial profile was saved", async () => {
    mockedAsyncStorage.getItem.mockResolvedValue(null);

    await expect(loadInitialProfile()).resolves.toBeNull();
    expect(mockedAsyncStorage.getItem).toHaveBeenCalledWith(
      "@quanto-custa/initial-profile",
    );
  });

  it("loads a saved initial profile", async () => {
    const profile: InitialProfile = {
      monthlyIncome: "4500",
      selectedComparisonIds: ["coffee", "netflix"],
    };
    mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(profile));

    await expect(loadInitialProfile()).resolves.toEqual(profile);
  });

  it("saves an initial profile as JSON", async () => {
    const profile: InitialProfile = {
      monthlyIncome: "4500",
      selectedComparisonIds: ["coffee", "netflix"],
    };

    await saveInitialProfile(profile);

    expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
      "@quanto-custa/initial-profile",
      JSON.stringify(profile),
    );
  });

  it("rejects invalid stored JSON", async () => {
    mockedAsyncStorage.getItem.mockResolvedValue("{invalid-json");

    await expect(loadInitialProfile()).rejects.toThrow(SyntaxError);
  });

  it("propagates AsyncStorage read failures", async () => {
    mockedAsyncStorage.getItem.mockRejectedValue(new Error("storage failed"));

    await expect(loadInitialProfile()).rejects.toThrow("storage failed");
  });
});
