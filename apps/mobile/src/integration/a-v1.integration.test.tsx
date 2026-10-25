import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { calculateComparisonResults, defaultComparisonPreferences } from '@vale-o-pix/core';
import { loadInitialProfile } from '../storage/InitialProfileStorage';
import {
  renderFlow, seedProfile, persistedProfile, enterIncome, enterPurchase,
  press, atRoute, screen, waitFor, nativeData, nativeStorage,
  PROFILE_KEY, routes, getRoute,
} from '../../../../tests/integration/flow-harness';

// Integração de telas, storage do aplicativo e core reais em RN Web/jsdom.
// Apenas AsyncStorage nativo e Expo Router usam os adapters do harness.
// Não é E2E em dispositivo. Nenhuma API externa é chamada por estes testes.
// Pendências: LAC-02 (formatos alternativos), LAC-03 (fallback específico),
// LAC-04/CA-06.2 (pré-preenchimento) e LAC-11 (recuperação na Home).
// confirmed identifica contrato executável; não afirma execução ou aprovação.

const unitLabels = [
  'cafés', 'cervejas em lata', 'bombons', 'hambúrgueres',
  'meses de Netflix', 'litros de gasolina', 'passagens de ônibus',
  'ingressos de cinema', 'açaís', 'pizzas', 'pães franceses',
  'refrigerantes 2L', 'corridas curtas',
] as const;

function comparisonRows() {
  return unitLabels.flatMap((unit) =>
    screen.queryAllByText(new RegExp(`^\\d+(?:,\\d+)? ${unit}$`))
      .map((element) => ({ unit, text: element.textContent ?? '' })),
  );
}

function expectValidComparisons() {
  const rows = comparisonRows();
  expect(rows.length).toBeGreaterThan(0);
  expect(rows.length).toBeLessThanOrEqual(4);
  expect(new Set(rows.map(({ unit }) => unit)).size).toBe(rows.length);
  for (const { text, unit } of rows) {
    const quantity = Number(text.slice(0, -(unit.length + 1)).replace(',', '.'));
    expect(Number.isFinite(quantity)).toBe(true);
    expect(quantity).toBeGreaterThan(0);
  }
  return rows;
}

function expectNoNumericResult() {
  expect(screen.queryByText(/horas do seu trabalho/)).toBeNull();
  expect(comparisonRows()).toEqual([]);
  expect(screen.queryAllByText(/NaN|Infinity/)).toHaveLength(0);
}

const invalidIncomeCases = [
  { id: 'A-V1-05-empty', income: '' },
  { id: 'A-V1-05-zero', income: '0' },
  { id: 'A-V1-05-negative', income: '-1' },
  { id: 'A-V1-05-text', income: 'abc' },
];

const invalidPurchaseCases = [
  { id: 'A-V1-06-empty', amount: '' },
  { id: 'A-V1-06-zero', amount: '0' },
  { id: 'A-V1-06-negative', amount: '-1' },
  { id: 'A-V1-06-text', amount: 'abc' },
];

beforeEach(() => {
  vi.restoreAllMocks();
  nativeData.clear();
  routes.length = 0;
  nativeStorage.getItem.mockReset().mockImplementation(async (key: string) => nativeData.get(key) ?? null);
  nativeStorage.setItem.mockReset().mockImplementation(async (key: string, value: string) => {
    nativeData.set(key, value);
  });
  vi.spyOn(Math, 'random').mockReturnValue(0.25);
  // Cada caso chama renderFlow, que substitui a rota corrente antes de montar.
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('A-V1', () => {
  it('A-V1-01 primeiro acesso persiste seleção e apresenta custo real', async () => {
    renderFlow();
    await press('Iniciar');
    await atRoute('/onboarding');
    expect(nativeStorage.getItem).toHaveBeenCalledWith(PROFILE_KEY);
    expect(screen.getByText('Escolha suas comparações favoritas.')).toBeTruthy();
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(13);
    for (const checkbox of checkboxes) {
      expect(checkbox.getAttribute('aria-checked')).toBe('false');
    }

    enterIncome(' 1760 ');
    await press('Café');
    await press('Netflix');
    await press('Bombons');
    await press('Bombons');
    await press('Continuar');
    await atRoute('/calculator');

    const profile = { monthlyIncome: '1760', selectedComparisonIds: ['coffee', 'netflix'] };
    expect(persistedProfile()).toEqual(profile);
    expect(await loadInitialProfile()).toEqual(profile);
    expect(nativeData.get(PROFILE_KEY)).toBe(JSON.stringify(profile));
    expect(nativeStorage.setItem).toHaveBeenCalledTimes(1);
    expect(nativeStorage.setItem).toHaveBeenCalledWith(PROFILE_KEY, JSON.stringify(profile));
    expect(getRoute()).toEqual({
      pathname: '/calculator',
      params: { monthlyIncome: '1760', selectedComparisonIds: 'coffee,netflix' },
    });

    enterPurchase(' Fone de ouvido ', ' 60 ');
    await press('Calcular custo real');
    await atRoute('/result');
    expect(getRoute()).toEqual({
      pathname: '/result',
      params: { monthlyIncome: '1760', selectedComparisonIds: 'coffee,netflix', expenseName: 'Fone de ouvido', amount: '60' },
    });
    expect(screen.getByText(/Fone de ouvido custa:/).textContent).toBe('Fone de ouvido custa:');
    // Oráculos independentes: 1760 / 176 = 10; 60 / 10 = 6;
    // 60 / 6 = 10 cafés; 60 / 39,90 arredonda para 1,5 meses.
    expect(screen.getByText(/^6,00 horas do seu trabalho$/)).toBeTruthy();
    expect(screen.getByText(/^10 cafés$/)).toBeTruthy();
    expect(screen.getByText(/^1,5 meses de Netflix$/)).toBeTruthy();
    expect(screen.queryByRole('alert')).toBeNull();
    expectValidComparisons();
  });

  it('A-V1-02 retorno recupera perfil e integra seleção real sem duplicatas', async () => {
    const profile = {
      monthlyIncome: '1760',
      selectedComparisonIds: ['coffee', 'coffee', 'inexistente', 'netflix'],
    };
    seedProfile(profile);
    renderFlow();
    await press('Iniciar');
    await atRoute('/calculator');
    expect(nativeStorage.getItem).toHaveBeenCalledWith(PROFILE_KEY);
    expect(routes.some(({ route }) => route.pathname === '/onboarding')).toBe(false);
    expect(getRoute().params).toEqual({ monthlyIncome: '1760', selectedComparisonIds: 'coffee,coffee,inexistente,netflix' });

    enterPurchase('Livro', '60');
    await press('Calcular custo real');
    await atRoute('/result');
    expect(getRoute().params).toEqual({
      monthlyIncome: '1760', selectedComparisonIds: 'coffee,coffee,inexistente,netflix', expenseName: 'Livro', amount: '60',
    });
    expect(screen.getByText(/^6,00 horas do seu trabalho$/)).toBeTruthy();
    expect(screen.getByText(/^10 cafés$/)).toBeTruthy();
    expect(screen.getByText(/^1,5 meses de Netflix$/)).toBeTruthy();
    expect(expectValidComparisons()).toHaveLength(4);

    const selected = calculateComparisonResults({
      amount: 60, preferences: defaultComparisonPreferences, selectedIds: profile.selectedComparisonIds,
    });
    expect(selected).toHaveLength(4);
    expect(new Set(selected.map(({ id }) => id)).size).toBe(4);
    expect(selected.map(({ id }) => id)).toEqual(expect.arrayContaining(['coffee', 'netflix']));
    expect(selected.some(({ id }) => id === 'inexistente')).toBe(false);
    expect(selected.find(({ id }) => id === 'coffee')?.quantity).toBe(10);
    expect(selected.find(({ id }) => id === 'netflix')?.quantity).toBeCloseTo(60 / 39.9, 10);
    expect(persistedProfile()).toEqual(profile);
    expect(nativeStorage.setItem).not.toHaveBeenCalled();
  });

  it('A-V1-03 zero preferências aceita pt-BR e nome opcional sem fixar fallback', async () => {
    renderFlow();
    await press('Iniciar');
    await atRoute('/onboarding');
    enterIncome('1.760,00');
    await press('Continuar');
    await atRoute('/calculator');
    expect(persistedProfile()).toEqual({ monthlyIncome: '1.760,00', selectedComparisonIds: [] });
    expect(getRoute().params).toEqual({ monthlyIncome: '1.760,00', selectedComparisonIds: '' });

    enterPurchase('', '60,00');
    await press('Calcular custo real');
    await atRoute('/result');
    expect(getRoute().params).toEqual({ monthlyIncome: '1.760,00', selectedComparisonIds: '', expenseName: '', amount: '60,00' });
    expect(screen.getByText(/^Essa compra custa:$/)).toBeTruthy();
    expect(screen.getByText(/^6,00 horas do seu trabalho$/)).toBeTruthy();
    expect(screen.queryByRole('alert')).toBeNull();
    expectValidComparisons();
  });

  it('A-V1-04 novo comparativo preserva perfil e usa a segunda compra', async () => {
    const profile = { monthlyIncome: '1760', selectedComparisonIds: ['coffee'] };
    seedProfile(profile);
    renderFlow();
    await press('Iniciar');
    await atRoute('/calculator');
    enterPurchase('Primeira compra', '60');
    await press('Calcular custo real');
    await atRoute('/result');
    expect(screen.getByText(/^6,00 horas do seu trabalho$/)).toBeTruthy();

    const routeCount = routes.length;
    await press('Novo comparativo');
    await atRoute('/calculator');
    expect(routes).toHaveLength(routeCount + 1);
    expect(routes[routes.length - 1]).toEqual({
      method: 'replace',
      route: { pathname: '/calculator', params: { monthlyIncome: '1760', selectedComparisonIds: 'coffee' } },
    });
    enterPurchase('Segunda compra', '120');
    await press('Calcular custo real');
    await atRoute('/result');
    expect(getRoute().params).toEqual({ monthlyIncome: '1760', selectedComparisonIds: 'coffee', expenseName: 'Segunda compra', amount: '120' });
    expect(screen.getByText(/^Segunda compra custa:$/)).toBeTruthy();
    expect(screen.queryByText(/^Primeira compra custa:$/)).toBeNull();
    expect(screen.getByText(/^12,0 horas do seu trabalho$/)).toBeTruthy();
    expect(screen.getByText(/^20 cafés$/)).toBeTruthy();
    expect(persistedProfile()).toEqual(profile);
    expect(nativeStorage.setItem).not.toHaveBeenCalled();
  });

  it.each(invalidIncomeCases)('$id bloqueia renda inválida no onboarding', async ({ income }) => {
    renderFlow({ pathname: '/onboarding' });
    enterIncome(income);
    const routeCount = routes.length;
    await press('Continuar');

    // CA-02.3 rege a expectativa; a implementação parcial pode falhar aqui.
    await waitFor(() => {
      expect(screen.getByRole('alert').textContent?.trim().length ?? 0).toBeGreaterThan(0);
    });
    expect(getRoute().pathname).toBe('/onboarding');
    expect(routes).toHaveLength(routeCount);
    expect(persistedProfile()).toBeNull();
    expect(nativeStorage.setItem).not.toHaveBeenCalled();
    expectNoNumericResult();
  });

  it.each(invalidPurchaseCases)('$id rejeita compra inválida sem equivalências numéricas', async ({ amount }) => {
    const profile = { monthlyIncome: '1760', selectedComparisonIds: ['coffee'] };
    seedProfile(profile);
    renderFlow({ pathname: '/calculator', params: { monthlyIncome: '1760', selectedComparisonIds: 'coffee' } });
    enterPurchase('Compra inválida', amount);
    const routeCount = routes.length;
    await press('Calcular custo real');
    await waitFor(() => {
      expect(screen.getByRole('alert').textContent?.trim().length ?? 0).toBeGreaterThan(0);
    });

    const pathname = getRoute().pathname;
    expect(['/calculator', '/result']).toContain(pathname);
    if (pathname === '/result') {
      await atRoute('/result');
      expect(getRoute().params).toEqual({ monthlyIncome: '1760', selectedComparisonIds: 'coffee', expenseName: 'Compra inválida', amount });
    }
    if (amount === '') {
      expect(pathname).toBe('/calculator');
      expect(routes).toHaveLength(routeCount);
      expect(screen.getByRole('alert').textContent).toBe('Informe o valor da compra.');
    }
    expectNoNumericResult();
    expect(persistedProfile()).toEqual(profile);
    expect(nativeStorage.setItem).not.toHaveBeenCalled();
  });
});
