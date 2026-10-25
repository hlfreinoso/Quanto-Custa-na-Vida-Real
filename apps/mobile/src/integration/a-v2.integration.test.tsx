import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  renderFlow, seedProfile, persistedProfile, enterIncome, enterPurchase,
  press, atRoute, screen, nativeData, nativeStorage, PROFILE_KEY, routes, getRoute,
} from '../../../../tests/integration/flow-harness';
import { loadInitialProfile } from '../storage/InitialProfileStorage';

// Integração de telas reais em React Native Web + jsdom, não E2E em dispositivo.
// Nenhum mock de tela, storage do aplicativo ou core; nenhuma API externa.
// Preços documentados são dados independentes do retorno das funções do core.
const references = [
  { id: 'coffee', price: 6, unit: 'cafés' },
  { id: 'beer_can', price: 5, unit: 'cervejas em lata' },
  { id: 'bonbon', price: 2.5, unit: 'bombons' },
  { id: 'burger', price: 30, unit: 'hambúrgueres' },
  { id: 'netflix', price: 39.9, unit: 'meses de Netflix' },
  { id: 'gasoline', price: 6, unit: 'litros de gasolina' },
  { id: 'bus_ticket', price: 5, unit: 'passagens de ônibus' },
  { id: 'movie_ticket', price: 35, unit: 'ingressos de cinema' },
  { id: 'acai', price: 18, unit: 'açaís' },
  { id: 'pizza', price: 60, unit: 'pizzas' },
  { id: 'bread', price: 1.2, unit: 'pães franceses' },
  { id: 'soda_2l', price: 10, unit: 'refrigerantes 2L' },
  { id: 'ride_short', price: 20, unit: 'corridas curtas' },
] as const;

function expectRoute(pathname: string, params: Record<string, string>) {
  expect(getRoute()).toEqual({ pathname, params });
}

function expectComparisons(amount: number, preferredIds: readonly string[], fillLimit = true) {
  // Reconhece todas as linhas numéricas do resultado, incluindo uma unidade
  // inesperada. A linha de horas é verificada separadamente em cada caso.
  const rows = screen.queryAllByText(/^\d+(?:[.,]\d+)?\s+.+$/)
    .filter((node) => !/horas do seu trabalho$/.test(node.textContent ?? ''));
  expect(rows.length).toBeGreaterThan(0);
  expect(rows.length).toBeLessThanOrEqual(4);
  if (fillLimit) expect(rows).toHaveLength(4);

  const observedIds = rows.map((row) => {
    const text = row.textContent ?? '';
    const reference = references.find(({ unit }) => text.endsWith(` ${unit}`));
    if (!reference) throw new Error(`Comparação fora do catálogo documentado: ${text}`);
    const quantity = amount / reference.price;
    expect(Number.isFinite(quantity)).toBe(true);
    expect(quantity).toBeGreaterThan(0);
    const displayedQuantity = quantity >= 10
      ? String(Math.round(quantity))
      : new Intl.NumberFormat('pt-BR', {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
          useGrouping: false,
        }).format(quantity);
    expect(text).toBe(`${displayedQuantity} ${reference.unit}`);
    return reference.id;
  });

  expect(new Set(observedIds).size).toBe(observedIds.length);
  for (const id of preferredIds) expect(observedIds).toContain(id);
  expect(screen.queryAllByText(/NaN|Infinity|∞/)).toHaveLength(0);
  expect(screen.queryByRole('alert')).toBeNull();
  return observedIds;
}

beforeEach(() => {
  vi.restoreAllMocks();
  nativeData.clear();
  routes.length = 0;
  nativeStorage.getItem.mockReset().mockImplementation(async (key: string) => nativeData.get(key) ?? null);
  nativeStorage.setItem.mockReset().mockImplementation(async (key: string, value: string) => {
    nativeData.set(key, value);
  });
  vi.spyOn(Math, 'random').mockReturnValue(0.25);
  // Cada renderFlow inicializa a rota; seu replace inicial integra routes.
});

afterEach(() => {
  vi.restoreAllMocks();
  // O cleanup por caso é realizado automaticamente pela React Testing Library.
});

describe('A-V2', () => {
  it('A-V2-01 primeiro acesso configura, persiste e calcula', async () => {
    renderFlow();
    await press('Iniciar');
    await atRoute('/onboarding');
    expect(nativeStorage.getItem).toHaveBeenCalledWith(PROFILE_KEY);
    expect(screen.getByText('Escolha suas comparações favoritas.')).toBeTruthy();

    enterIncome(' 1760 ');
    await press('Café');
    await press('Netflix');
    await press('Continuar');
    await atRoute('/calculator');

    const profile = { monthlyIncome: '1760', selectedComparisonIds: ['coffee', 'netflix'] };
    expect(nativeStorage.setItem).toHaveBeenCalledTimes(1);
    expect(nativeStorage.setItem).toHaveBeenCalledWith(PROFILE_KEY, JSON.stringify(profile));
    expect(persistedProfile()).toEqual(profile);
    expect(await loadInitialProfile()).toEqual(profile);
    expectRoute('/calculator', { monthlyIncome: '1760', selectedComparisonIds: 'coffee,netflix' });

    enterPurchase('Fone', '60');
    await press('Calcular custo real');
    await atRoute('/result');
    expectRoute('/result', {
      monthlyIncome: '1760', selectedComparisonIds: 'coffee,netflix', expenseName: 'Fone', amount: '60',
    });
    expect(screen.getByText(/^Fone custa:$/)).toBeTruthy();
    expect(screen.getByText(/^6,00 horas do seu trabalho$/)).toBeTruthy();
    expectComparisons(60, ['coffee', 'netflix']);
  });

  it('A-V2-02 retorno recupera perfil e prioriza quatro escolhas', async () => {
    const ids = ['coffee', 'netflix', 'burger', 'pizza'];
    const profile = { monthlyIncome: '1760', selectedComparisonIds: ids };
    seedProfile(profile);
    renderFlow();
    await press('Iniciar');
    await atRoute('/calculator');
    expect(nativeStorage.getItem).toHaveBeenCalledWith(PROFILE_KEY);
    expectRoute('/calculator', { monthlyIncome: '1760', selectedComparisonIds: ids.join(',') });

    enterPurchase('Livro', '60');
    await press('Calcular custo real');
    await atRoute('/result');
    expectRoute('/result', {
      monthlyIncome: '1760', selectedComparisonIds: ids.join(','), expenseName: 'Livro', amount: '60',
    });
    expect(screen.getByText(/^Livro custa:$/)).toBeTruthy();
    expect(screen.getByText(/^6,00 horas do seu trabalho$/)).toBeTruthy();
    const observed = expectComparisons(60, ids);
    expect([...observed].sort()).toEqual([...ids].sort());
    for (const line of ['10 cafés', '1,5 meses de Netflix', '2,0 hambúrgueres', '1,0 pizzas']) {
      expect(screen.getByText(line, { exact: true })).toBeTruthy();
    }
    expect(persistedProfile()).toEqual(profile);
    expect(nativeStorage.setItem).not.toHaveBeenCalled();
  });

  it('A-V2-03 alternância permite zero preferências e nome opcional', async () => {
    renderFlow({ pathname: '/onboarding' });
    enterIncome('1760');
    await press('Café');
    await press('Netflix');
    await press('Café');
    await press('Netflix');
    await press('Continuar');
    await atRoute('/calculator');

    const profile = { monthlyIncome: '1760', selectedComparisonIds: [] };
    expect(persistedProfile()).toEqual(profile);
    expect(nativeStorage.setItem).toHaveBeenCalledWith(PROFILE_KEY, JSON.stringify(profile));
    expectRoute('/calculator', { monthlyIncome: '1760', selectedComparisonIds: '' });

    enterPurchase('', '60');
    await press('Calcular custo real');
    await atRoute('/result');
    expectRoute('/result', {
      monthlyIncome: '1760', selectedComparisonIds: '', expenseName: '', amount: '60',
    });
    expect(screen.getByText(/^Essa compra custa:$/)).toBeTruthy();
    expect(screen.getByText(/^6,00 horas do seu trabalho$/)).toBeTruthy();
    // LAC-03: não fixa IDs, ordem ou cardinalidade exata do fallback vazio.
    expectComparisons(60, [], false);
  });

  it('A-V2-04 entrada pt-BR preserva strings e calcula valor válido', async () => {
    const profile = { monthlyIncome: '1.760,00', selectedComparisonIds: ['coffee', 'netflix'] };
    seedProfile(profile);
    renderFlow();
    await press('Iniciar');
    await atRoute('/calculator');
    expectRoute('/calculator', { monthlyIncome: '1.760,00', selectedComparisonIds: 'coffee,netflix' });

    enterPurchase('  Notebook  ', ' 1.200,00 ');
    await press('Calcular custo real');
    await atRoute('/result');
    expectRoute('/result', {
      monthlyIncome: '1.760,00', selectedComparisonIds: 'coffee,netflix',
      expenseName: 'Notebook', amount: '1.200,00',
    });
    // 1760 / 176 = 10 por hora; 1200 / 10 = 120 horas.
    expect(screen.getByText(/^Notebook custa:$/)).toBeTruthy();
    expect(screen.getByText(/^120,0 horas do seu trabalho$/)).toBeTruthy();
    expectComparisons(1200, ['coffee', 'netflix']);
    expect(persistedProfile()).toEqual(profile);
  });

  it('A-V2-05 novo comparativo preserva perfil e substitui a compra', async () => {
    const profile = { monthlyIncome: '1760', selectedComparisonIds: ['coffee', 'netflix'] };
    seedProfile(profile);
    renderFlow();
    await press('Iniciar');
    await atRoute('/calculator');
    enterPurchase('Primeira compra', '60');
    await press('Calcular custo real');
    await atRoute('/result');
    expect(screen.getByText(/^6,00 horas do seu trabalho$/)).toBeTruthy();
    expectComparisons(60, ['coffee', 'netflix']);

    const navigationCount = routes.length;
    await press('Novo comparativo');
    await atRoute('/calculator');
    const calculatorRoute = {
      pathname: '/calculator',
      params: { monthlyIncome: '1760', selectedComparisonIds: 'coffee,netflix' },
    };
    expect(getRoute()).toEqual(calculatorRoute);
    expect(routes.slice(navigationCount)).toEqual([{ method: 'replace', route: calculatorRoute }]);

    enterPurchase('Segunda compra', '120');
    await press('Calcular custo real');
    await atRoute('/result');
    expectRoute('/result', {
      monthlyIncome: '1760', selectedComparisonIds: 'coffee,netflix',
      expenseName: 'Segunda compra', amount: '120',
    });
    expect(screen.getByText(/^Segunda compra custa:$/)).toBeTruthy();
    expect(screen.getByText(/^12,0 horas do seu trabalho$/)).toBeTruthy();
    expect(screen.queryByText(/^Primeira compra custa:$/)).toBeNull();
    expect(screen.queryByText(/^6,00 horas do seu trabalho$/)).toBeNull();
    expectComparisons(120, ['coffee', 'netflix']);
    expect(persistedProfile()).toEqual(profile);
    expect(nativeStorage.setItem).not.toHaveBeenCalled();
  });

  it('A-V2-06 alteração é persistida e reutilizada posteriormente pela Home', async () => {
    seedProfile({ monthlyIncome: '1760', selectedComparisonIds: [] });
    const initialFlow = renderFlow();
    await press('Iniciar');
    await atRoute('/calculator');
    expectRoute('/calculator', { monthlyIncome: '1760', selectedComparisonIds: '' });
    await press('Mudar preferências');
    await atRoute('/onboarding');
    expect(screen.getByText('Escolha suas comparações favoritas.')).toBeTruthy();

    // A lista anterior vazia permite selecionar estas opções tanto com quanto
    // sem pré-preenchimento. Não impõe comportamento pendente de CA-06.2.
    enterIncome('3520');
    await press('Café');
    await press('Netflix');
    await press('Continuar');
    await atRoute('/calculator');
    const updated = { monthlyIncome: '3520', selectedComparisonIds: ['coffee', 'netflix'] };
    expect(nativeStorage.setItem).toHaveBeenCalledTimes(1);
    expect(nativeStorage.setItem).toHaveBeenCalledWith(PROFILE_KEY, JSON.stringify(updated));
    expect(persistedProfile()).toEqual(updated);
    expect(await loadInitialProfile()).toEqual(updated);
    expectRoute('/calculator', { monthlyIncome: '3520', selectedComparisonIds: 'coffee,netflix' });

    initialFlow.unmount();
    // Desmontar React preserva nativeData; não executa o setup de outro caso.
    renderFlow({ pathname: '/' });
    const readsBeforeStart = nativeStorage.getItem.mock.calls.length;
    await press('Iniciar');
    await atRoute('/calculator');
    expect(nativeStorage.getItem.mock.calls.slice(readsBeforeStart)).toEqual([[PROFILE_KEY]]);
    expectRoute('/calculator', { monthlyIncome: '3520', selectedComparisonIds: 'coffee,netflix' });

    enterPurchase('Compra após alteração', '60');
    await press('Calcular custo real');
    await atRoute('/result');
    expectRoute('/result', {
      monthlyIncome: '3520', selectedComparisonIds: 'coffee,netflix',
      expenseName: 'Compra após alteração', amount: '60',
    });
    // 3520 / 176 = 20 por hora; 60 / 20 = 3 horas.
    expect(screen.getByText(/^Compra após alteração custa:$/)).toBeTruthy();
    expect(screen.getByText(/^3,00 horas do seu trabalho$/)).toBeTruthy();
    expectComparisons(60, ['coffee', 'netflix']);
    expect(persistedProfile()).toEqual(updated);
    expect(nativeStorage.setItem).toHaveBeenCalledTimes(1);
  });
});
