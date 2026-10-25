import { useSyncExternalStore } from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { HomeScreen } from "../../apps/mobile/src/screens/home/HomeScreen";
import { ComparisonPreferencesScreen } from "../../apps/mobile/src/screens/onboarding/ComparisonPreferencesScreen";
import { CalculatorScreen } from "../../apps/mobile/src/screens/calculator/CalculatorScreen";
import { ResultScreen } from "../../apps/mobile/src/screens/result/ResultScreen";
import { getRoute, subscribe, navigate, nativeData, PROFILE_KEY, type Route } from "./boundaries";
import type { InitialProfile } from "../../apps/mobile/src/storage/InitialProfileStorage";

function Flow() {
  const route = useSyncExternalStore(subscribe, getRoute, getRoute);
  switch (route.pathname) {
    case "/": return <HomeScreen />;
    case "/onboarding": return <ComparisonPreferencesScreen />;
    case "/calculator": return <CalculatorScreen />;
    case "/result": return <ResultScreen />;
    default: throw new Error(`Unexpected test route: ${route.pathname}`);
  }
}
export function renderFlow(route: Route = { pathname: "/" }) {
  navigate("replace", route);
  return render(<Flow />);
}
export function seedProfile(profile: InitialProfile) { nativeData.set(PROFILE_KEY, JSON.stringify(profile)); }
export function persistedProfile(): InitialProfile | null {
  const value = nativeData.get(PROFILE_KEY);
  return value ? JSON.parse(value) as InitialProfile : null;
}
export function enterIncome(value: string) { fireEvent.change(screen.getByPlaceholderText("Ex: 4500,00"), { target: { value } }); }
export function enterPurchase(name: string, amount: string) {
  fireEvent.change(screen.getByPlaceholderText("Ex: Cadeira ergonômica"), { target: { value: name } });
  fireEvent.change(screen.getByPlaceholderText("Ex: 1499,00"), { target: { value: amount } });
}
export async function press(label: string) {
  fireEvent.click(screen.getByText(label, { exact: true }));
  // Await state updates from async storage without timers or swallowing errors.
  await Promise.resolve();
}
export async function atRoute(pathname: string) { await waitFor(() => { if (getRoute().pathname !== pathname) throw new Error(`Expected ${pathname}, observed ${getRoute().pathname}`); }); }
export { screen, fireEvent, waitFor };
export { nativeData, nativeStorage, PROFILE_KEY, routes, getRoute } from "./boundaries";
