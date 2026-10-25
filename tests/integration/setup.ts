import { afterEach, beforeEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import { resetBoundaries } from "./boundaries";

vi.mock("@react-native-async-storage/async-storage", async () => {
  const { nativeStorage } = await import("./boundaries");
  return { default: nativeStorage };
});
vi.mock("expo-router", async () => {
  const { navigate, getRoute } = await import("./boundaries");
  return {
    router: {
      push: vi.fn((target) => navigate("push", target)),
      replace: vi.fn((target) => navigate("replace", target)),
    },
    useLocalSearchParams: () => getRoute().params ?? {},
  };
});

beforeEach(() => { resetBoundaries(); vi.spyOn(Math, "random").mockReturnValue(0.25); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
