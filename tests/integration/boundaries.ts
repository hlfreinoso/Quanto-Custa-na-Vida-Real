import { vi } from "vitest";

export const PROFILE_KEY = "@quanto-custa/initial-profile";
export interface Route { pathname: string; params?: Record<string, string>; }
export const nativeData = new Map<string, string>();
export const nativeStorage = {
  getItem: vi.fn(async (key: string) => nativeData.get(key) ?? null),
  setItem: vi.fn(async (key: string, value: string) => { nativeData.set(key, value); }),
};
let current: Route = { pathname: "/" };
const listeners = new Set<() => void>();
export const routes: Array<{ method: "push" | "replace"; route: Route }> = [];
export function navigate(method: "push" | "replace", target: string | Route) {
  current = typeof target === "string" ? { pathname: target } : target;
  routes.push({ method, route: current });
  listeners.forEach((listener) => listener());
}
export function getRoute() { return current; }
export function subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }
export function resetBoundaries() {
  nativeData.clear(); routes.length = 0;
  current = { pathname: "/" };
  nativeStorage.getItem.mockReset().mockImplementation(async (key) => nativeData.get(key) ?? null);
  nativeStorage.setItem.mockReset().mockImplementation(async (key, value) => { nativeData.set(key, value); });
}
