import { describe, expect, it } from "vitest";
import { renderFlow, press, atRoute, enterIncome, enterPurchase, persistedProfile, screen } from "./flow-harness";

describe("infrastructure smoke (not LLM-generated)", () => {
  it("connects real screens, storage serialization and core using native/router adapters", async () => {
    renderFlow();
    await press("Iniciar"); await atRoute("/onboarding");
    enterIncome("1760"); await press("Café"); await press("Continuar"); await atRoute("/calculator");
    expect(persistedProfile()).toEqual({ monthlyIncome: "1760", selectedComparisonIds: ["coffee"] });
    enterPurchase("Livro", "60"); await press("Calcular custo real"); await atRoute("/result");
    expect(screen.getByText("6,00 horas do seu trabalho")).toBeTruthy();
    expect(screen.getByText("10 cafés")).toBeTruthy();
  });
});
