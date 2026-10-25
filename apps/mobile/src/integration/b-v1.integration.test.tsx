import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { calculateComparisonResults, defaultComparisonPreferences } from '@vale-o-pix/core';
import { loadInitialProfile, saveInitialProfile } from '../storage/InitialProfileStorage';
import {
  renderFlow, seedProfile, persistedProfile, enterIncome, enterPurchase,
  press, atRoute, screen, waitFor, nativeData, nativeStorage,
  PROFILE_KEY, routes, getRoute,
} from '../../../../tests/integration/flow-harness';
import { resetBoundaries } from '../../../../tests/integration/boundaries';

// Integração de telas reais em React Native Web + jsdom; não é E2E em dispositivo.
// Reais: telas, storage do aplicativo, catálogo e regras do core.
// Simulados: transporte AsyncStorage e navegação Expo Router já configurados.
// Nenhuma chamada externa ou API paga é necessária.
// Pendências: LAC-02 não define formato internacional; LAC-03 não fixa fallback
// vazio; LAC-04/CA-06.2 não confirma pré-preenchimento; LAC-11 não define
// recuperação/aviso na Home. Estes pontos não recebem expectativas inventadas.

const references = [
  { id: 'coffee', unit: 'cafés', price: 6 },
  { id: 'beer_can', unit: 'cervejas em lata', price: 5 },
  { id: 'bonbon', unit: 'bombons', price: 2.5 },
  { id: 'burger', unit: 'hambúrgueres', price: 30 },
  { id: 'netflix', unit: 'meses de Netflix', price: 39.9 },
  { id: 'gasoline', unit: 'litros de gasolina', price: 6 },
  { id: 'bus_ticket', unit: 'passagens de ônibus', price: 5 },
  { id: 'movie_ticket', unit: 'ingressos de cinema', price: 35 },
  { id: 'acai', unit: 'açaís', price: 18 },
  { id: 'pizza', unit: 'pizzas', price: 60 },
  { id: 'bread', unit: 'pães franceses', price: 1.2 },
  { id: 'soda_2l', unit: 'refrigerantes 2L', price: 10 },
  { id: 'ride_short', unit: 'corridas curtas', price: 20 },
] as const;

// Oráculo independente: preços especificados, divisão aritmética e apresentação
// atual RN-19. Não usa calculateComparisonResults para produzir expectativas.
function quantityText(amount: number, price: number): string {
  const quantity = amount / price;
  return quantity >= 10
    ? String(Math.round(quantity))
    : quantity.toFixed(1).replace('.', ',');
}

function comparisonRows() {
  return screen.queryAllByText(/^\d+(?:,\d+)? (?:cafés|cervejas em lata|bombons|hambúrgueres|meses de Netflix|litros de gasolina|passagens de ônibus|ingressos de cinema|açaís|pizzas|pães franceses|refrigerantes 2L|corridas curtas)$/);
}

function assertComparisons(amount: number): string[] {
  const rows = comparisonRows();
  expect(rows.length).toBeGreaterThan(0);
  expect(rows.length).toBeLessThanOrEqual(4);
  const ids = rows.map((row) => {
    const text = row.textContent ?? '';
    const reference = references.find(({ unit }) => text.endsWith(' ' + unit));
    if (!reference) throw new Error('Comparação fora do catálogo: ' + text);
    expect(text).toBe(quantityText(amount, reference.price) + ' ' + reference.unit);
    return reference.id;
  });
  expect(new Set(ids).size).toBe(ids.length);
  return ids;
}

function assertNoNumericalResult() {
  expect(screen.queryByText(/horas do seu trabalho/)).toBeNull();
  expect(comparisonRows()).toHaveLength(0);
  expect(screen.queryByText(/NaN|Infinity/)).toBeNull();
}

function assertCorrectionMessage() {
  const alert = screen.getByRole('alert');
  expect(alert.textContent).toMatch(/renda|valor/i);
  expect(alert.textContent).toMatch(/informe|confira|corrija|válid|maior|positiv|preencha/i);
}

describe('B-V1', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    resetBoundaries();
    vi.spyOn(Math, 'random').mockReturnValue(0.25);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    resetBoundaries();
  });

  it('B-V1-01 — compra vazia permanece na Calculator com mensagem específica', async () => {
    const profile = { monthlyIncome: '1760', selectedComparisonIds: ['coffee'] };
    seedProfile(profile);
    renderFlow();
    await press('Iniciar');
    await atRoute('/calculator');
    expect(nativeStorage.getItem).toHaveBeenCalledWith(PROFILE_KEY);
    expect(getRoute().params).toEqual({ monthlyIncome: '1760', selectedComparisonIds: 'coffee' });
    const routeCount = routes.length;
    enterPurchase('Cadeira', '   ');
    await press('Calcular custo real');
    expect(screen.getByRole('alert').textContent).toBe('Informe o valor da compra.');
    expect(getRoute().pathname).toBe('/calculator');
    expect(routes).toHaveLength(routeCount);
    expect(persistedProfile()).toEqual(profile);
    expect(nativeStorage.setItem).not.toHaveBeenCalled();
    assertNoNumericalResult();
  });

  it('B-V1-02 — core e Result deduplicam preferências e completam fallback', () => {
    const results = calculateComparisonResults({
      amount: 60,
      preferences: defaultComparisonPreferences,
      selectedIds: ['coffee', 'coffee', 'desconhecido'],
    });
    expect(results).toHaveLength(4);
    expect(new Set(results.map(({ id }) => id)).size).toBe(4);
    expect(results.filter(({ id }) => id === 'coffee')).toHaveLength(1);
    expect(results.some(({ id }) => id === 'desconhecido')).toBe(false);
    expect(results[0]?.id).toBe('coffee');
    for (const result of results) {
      const reference = references.find(({ id }) => id === result.id);
      if (!reference) throw new Error('ID fora do catálogo: ' + result.id);
      expect(result.quantity).toBeCloseTo(60 / reference.price, 10);
      expect(result.unitLabel).toBe(reference.unit);
    }
    renderFlow({ pathname: '/result', params: {
      monthlyIncome: '1760', amount: '60', expenseName: 'Cadeira',
      selectedComparisonIds: 'coffee,coffee,desconhecido',
    } });
    expect(screen.getByText(/^Cadeira custa:$/).textContent).toBe('Cadeira custa:');
    expect(screen.getByText(/^6,00 horas do seu trabalho$/).textContent).toBe('6,00 horas do seu trabalho');
    expect(screen.getAllByText(/^10 cafés$/)).toHaveLength(1);
    const ids = assertComparisons(60);
    expect(ids).toHaveLength(4);
    expect(ids[0]).toBe('coffee');
    expect(ids).not.toContain('desconhecido');
  });

  it.each(['', '0', '-1', 'abc'])(
    'B-V1-03 — onboarding bloqueia renda inválida %j sem persistir',
    async (income) => {
      renderFlow({ pathname: '/onboarding' });
      enterIncome(income);
      const routeCount = routes.length;
      await press('Continuar');
      // Contrato CA-02.3: falha legítima na implementação parcial fornecida.
      await waitFor(() => {
        expect(getRoute().pathname).toBe('/onboarding');
        assertCorrectionMessage();
      });
      expect(routes).toHaveLength(routeCount);
      expect(nativeStorage.setItem).not.toHaveBeenCalled();
      expect(nativeData.has(PROFILE_KEY)).toBe(false);
      assertNoNumericalResult();
    },
  );

  it.each(['0', '-1', 'abc', 'Infinity'])(
    'B-V1-04 — compra inválida %j recebe mensagem sem resultado numérico',
    async (amount) => {
      renderFlow({ pathname: '/calculator', params: {
        monthlyIncome: '1760', selectedComparisonIds: 'coffee',
      } });
      enterPurchase('Teste inválido', amount);
      await press('Calcular custo real');
      await waitFor(assertCorrectionMessage);
      const pathname = getRoute().pathname;
      expect(['/calculator', '/result']).toContain(pathname);
      await atRoute(pathname);
      assertNoNumericalResult();
      expect(nativeStorage.setItem).not.toHaveBeenCalled();
    },
  );

  it.each(['', '0', '-1', 'abc', 'Infinity'])(
    'B-V1-05 — Result rejeita renda inválida %j recebida por rota',
    (monthlyIncome) => {
      renderFlow({ pathname: '/result', params: {
        monthlyIncome, amount: '60', expenseName: 'Teste',
        selectedComparisonIds: 'coffee',
      } });
      expect(screen.getByRole('alert').textContent).toBe(
        'Não foi possível calcular. Volte e confira renda e valor.',
      );
      assertNoNumericalResult();
      expect(nativeStorage.setItem).not.toHaveBeenCalled();
    },
  );

  it('B-V1-06 — pt-BR preserva strings e calcula renda e compra normalizadas', async () => {
    renderFlow();
    await press('Iniciar');
    await atRoute('/onboarding');
    enterIncome(' 1.760,00 ');
    await press('Café');
    await press('Netflix');
    await press('Continuar');
    await atRoute('/calculator');
    const profile = { monthlyIncome: '1.760,00', selectedComparisonIds: ['coffee', 'netflix'] };
    expect(persistedProfile()).toEqual(profile);
    expect(nativeStorage.setItem).toHaveBeenCalledWith(PROFILE_KEY, JSON.stringify(profile));
    expect(await loadInitialProfile()).toEqual(profile);
    expect(getRoute().params).toEqual({ monthlyIncome: '1.760,00', selectedComparisonIds: 'coffee,netflix' });
    enterPurchase(' Cadeira ', ' 60,50 ');
    await press('Calcular custo real');
    await atRoute('/result');
    expect(getRoute().params).toEqual({
      monthlyIncome: '1.760,00', selectedComparisonIds: 'coffee,netflix',
      expenseName: 'Cadeira', amount: '60,50',
    });
    // 1760 / (8 * 22) = 10; 60.50 / 10 = 6.05.
    expect(screen.getByText(/^6,05 horas do seu trabalho$/).textContent).toBe('6,05 horas do seu trabalho');
    expect(screen.getByText(/^Cadeira custa:$/).textContent).toBe('Cadeira custa:');
    expect(screen.getByText(/^10 cafés$/).textContent).toBe('10 cafés');
    expect(screen.getByText(/^1,5 meses de Netflix$/).textContent).toBe('1,5 meses de Netflix');
    const ids = assertComparisons(60.5);
    expect(new Set(ids.slice(0, 2))).toEqual(new Set(['coffee', 'netflix']));
    expect(persistedProfile()).toEqual(profile);
  });

  it('B-V1-07 — zero preferências aceita fallback e preserva perfil no novo comparativo', async () => {
    renderFlow({ pathname: '/onboarding' });
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(13);
    for (const checkbox of checkboxes) {
      expect(checkbox.getAttribute('aria-checked')).toBe('false');
    }
    enterIncome('1760');
    await press('Café');
    expect(screen.getByRole('checkbox', { name: 'Café' }).getAttribute('aria-checked')).toBe('true');
    await press('Café');
    expect(screen.getByRole('checkbox', { name: 'Café' }).getAttribute('aria-checked')).toBe('false');
    await press('Continuar');
    await atRoute('/calculator');
    const profile = { monthlyIncome: '1760', selectedComparisonIds: [] };
    expect(persistedProfile()).toEqual(profile);
    expect(getRoute().params).toEqual({ monthlyIncome: '1760', selectedComparisonIds: '' });
    enterPurchase('', '60');
    await press('Calcular custo real');
    await atRoute('/result');
    expect(screen.getByText(/^Essa compra custa:$/).textContent).toBe('Essa compra custa:');
    expect(screen.getByText(/^6,00 horas do seu trabalho$/).textContent).toBe('6,00 horas do seu trabalho');
    assertComparisons(60);
    const routeCount = routes.length;
    await press('Novo comparativo');
    await atRoute('/calculator');
    expect(routes).toHaveLength(routeCount + 1);
    expect(routes[routes.length - 1]).toEqual({
      method: 'replace',
      route: { pathname: '/calculator', params: { monthlyIncome: '1760', selectedComparisonIds: '' } },
    });
    enterPurchase('Livro', '30');
    await press('Calcular custo real');
    await atRoute('/result');
    expect(screen.getByText(/^Livro custa:$/).textContent).toBe('Livro custa:');
    expect(screen.getByText(/^3,00 horas do seu trabalho$/).textContent).toBe('3,00 horas do seu trabalho');
    assertComparisons(30);
    expect(persistedProfile()).toEqual(profile);
    expect(nativeStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it('B-V1-08 — storage real propaga corrupção e falhas controladas antes de reutilização válida', async () => {
    expect(await loadInitialProfile()).toBeNull();
    nativeData.set(PROFILE_KEY, '{json-corrompido');
    await expect(loadInitialProfile()).rejects.toBeInstanceOf(SyntaxError);
    const readFailure = new Error('Leitura nativa indisponível');
    nativeStorage.getItem.mockRejectedValueOnce(readFailure);
    await expect(loadInitialProfile()).rejects.toBe(readFailure);
    expect(nativeStorage.getItem).toHaveBeenLastCalledWith(PROFILE_KEY);

    const previous = { monthlyIncome: '1760', selectedComparisonIds: ['coffee'] };
    seedProfile(previous);
    const updated = { monthlyIncome: '3520', selectedComparisonIds: ['netflix'] };
    const writeFailure = new Error('Escrita nativa indisponível');
    nativeStorage.setItem.mockRejectedValueOnce(writeFailure);
    await expect(saveInitialProfile(updated)).rejects.toBe(writeFailure);
    expect(nativeStorage.setItem).toHaveBeenLastCalledWith(PROFILE_KEY, JSON.stringify(updated));
    expect(persistedProfile()).toEqual(previous);

    // Retomada controlada pelo teste; não presume recuperação automática da Home.
    await saveInitialProfile(updated);
    expect(await loadInitialProfile()).toEqual(updated);
    renderFlow();
    await press('Iniciar');
    await atRoute('/calculator');
    expect(getRoute().params).toEqual({ monthlyIncome: '3520', selectedComparisonIds: 'netflix' });
    expect(persistedProfile()).toEqual(updated);
    expect(screen.getByPlaceholderText('Ex: 1499,00')).toBeTruthy();
  });
});
