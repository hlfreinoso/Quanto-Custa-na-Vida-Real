import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  renderFlow, seedProfile, persistedProfile, enterIncome, enterPurchase,
  press, atRoute, screen, waitFor, nativeData, nativeStorage,
  PROFILE_KEY, routes, getRoute,
} from '../../../../tests/integration/flow-harness';
import { resetBoundaries } from '../../../../tests/integration/boundaries';
import { loadInitialProfile, saveInitialProfile } from '../storage/InitialProfileStorage';

// Vitest 4.1.5; React 19.1; RTL 16.3.3.
// Integração de telas reais com React Native Web/jsdom, não E2E em dispositivo.
// Core e storage do aplicativo não são substituídos. Somente adapters são controlados.
// RTL executa cleanup automaticamente após cada caso.
// Pendências: LAC-02 não define formatos alternativos; LAC-03 não fixa fallback vazio;
// LAC-04 não confirma pré-preenchimento; LAC-11 não define recuperação/aviso na Home.
// Estes testes não executam chamadas externas ou pagas.

type TestRoute = Parameters<typeof renderFlow>[0];
const oldProfile = { monthlyIncome: '3520', selectedComparisonIds: ['coffee'] };
const sessionParams = { monthlyIncome: '1760', selectedComparisonIds: 'coffee' };

// Oráculo literal independente das funções e dos dados exportados pelo core.
// Compra de R$ 60: quantidade = 60 / preço local documentado.
const comparisonsAt60 = [
  { id: 'coffee', text: '10 cafés' },
  { id: 'beer_can', text: '12 cervejas em lata' },
  { id: 'bonbon', text: '24 bombons' },
  { id: 'burger', text: '2,0 hambúrgueres' },
  { id: 'netflix', text: '1,5 meses de Netflix' },
  { id: 'gasoline', text: '10 litros de gasolina' },
  { id: 'bus_ticket', text: '12 passagens de ônibus' },
  { id: 'movie_ticket', text: '1,7 ingressos de cinema' },
  { id: 'acai', text: '3,3 açaís' },
  { id: 'pizza', text: '1,0 pizzas' },
  { id: 'bread', text: '50 pães franceses' },
  { id: 'soda_2l', text: '6,0 refrigerantes 2L' },
  { id: 'ride_short', text: '3,0 corridas curtas' },
];
const comparisonPattern = /^\d+(?:,\d+)? (?:cafés|cervejas em lata|bombons|hambúrgueres|meses de Netflix|litros de gasolina|passagens de ônibus|ingressos de cinema|açaís|pizzas|pães franceses|refrigerantes 2L|corridas curtas)$/;

function assertComparisonsAt60(): string[] {
  const lines = screen.queryAllByText(comparisonPattern).map(node => node.textContent!.trim());
  expect(lines.length).toBeGreaterThan(0);
  expect(lines.length).toBeLessThanOrEqual(4);
  expect(new Set(lines).size).toBe(lines.length);
  for (const line of lines) {
    expect(comparisonsAt60.map(item => item.text)).toContain(line);
  }
  return lines.map(line => comparisonsAt60.find(item => item.text === line)!.id);
}

function assertNoNumericResult() {
  expect(screen.queryByText(/NaN|Infinity/)).toBeNull();
  expect(screen.queryByText(/horas do seu trabalho/)).toBeNull();
  expect(screen.queryAllByText(comparisonPattern)).toHaveLength(0);
}

function expectLastNavigation(method: 'push' | 'replace', pathname: string, params?: Record<string, string>) {
  expect(routes[routes.length - 1]).toEqual({
    method,
    route: params === undefined ? { pathname } : { pathname, params },
  });
}

async function calculate60(name = 'Livro') {
  enterPurchase(name, '60');
  await press('Calcular custo real');
  await atRoute('/result');
  expect(screen.getByText(/6,00 horas do seu trabalho/).textContent).toBe('6,00 horas do seu trabalho');
}

const purchaseRows = [
  { id: 'B-V2-02-empty', amount: '', empty: true },
  { id: 'B-V2-02-zero', amount: '0', empty: false },
  { id: 'B-V2-02-negative', amount: '-1', empty: false },
  { id: 'B-V2-02-text', amount: 'abc', empty: false },
  { id: 'B-V2-02-infinity', amount: 'Infinity', empty: false },
];
const incomeRows = [
  { id: 'B-V2-03-empty', income: '' },
  { id: 'B-V2-03-zero', income: '0' },
  { id: 'B-V2-03-negative', income: '-1' },
  { id: 'B-V2-03-text', income: 'abc' },
];
const resultRows: Array<{
  id: string; description: string; route: TestRoute; valid: boolean;
  returned: Record<string, string>;
}> = [
  { id: 'B-V2-04-no-params', description: 'params ausente', route: { pathname: '/result' }, valid: false, returned: { monthlyIncome: '', selectedComparisonIds: '' } },
  { id: 'B-V2-04-no-income', description: 'amount=60; monthlyIncome ausente', route: { pathname: '/result', params: { amount: '60', selectedComparisonIds: 'coffee' } }, valid: false, returned: { monthlyIncome: '', selectedComparisonIds: 'coffee' } },
  { id: 'B-V2-04-no-amount', description: 'monthlyIncome=1760; amount ausente', route: { pathname: '/result', params: sessionParams }, valid: false, returned: sessionParams },
  { id: 'B-V2-04-inconsistent', description: 'monthlyIncome=abc; amount=60', route: { pathname: '/result', params: { monthlyIncome: 'abc', amount: '60', selectedComparisonIds: 'coffee' } }, valid: false, returned: { monthlyIncome: 'abc', selectedComparisonIds: 'coffee' } },
  { id: 'B-V2-04-optional', description: 'nome e preferências ausentes; renda=1760; amount=60', route: { pathname: '/result', params: { monthlyIncome: '1760', amount: '60' } }, valid: true, returned: { monthlyIncome: '1760', selectedComparisonIds: '' } },
];
const preferenceRows = [
  { id: 'B-V2-05-duplicate', ids: ['coffee', 'coffee', 'desconhecido'], firstAccess: false },
  { id: 'B-V2-05-empty', ids: [] as string[], firstAccess: true },
  { id: 'B-V2-05-limit', ids: ['coffee', 'beer_can', 'bonbon', 'burger', 'netflix'], firstAccess: false },
];
const storageRows = [
  { id: 'B-V2-07-json', mode: 'json' },
  { id: 'B-V2-07-read', mode: 'read' },
  { id: 'B-V2-07-write', mode: 'write' },
] as const;
const editRows: Array<{ id: string; origin: string; route: TestRoute }> = [
  { id: 'B-V2-08-home', origin: 'Home', route: { pathname: '/' } },
  { id: 'B-V2-08-calculator', origin: 'Calculator', route: { pathname: '/calculator', params: { monthlyIncome: '3520', selectedComparisonIds: 'coffee' } } },
  { id: 'B-V2-08-result', origin: 'Result', route: { pathname: '/result', params: { monthlyIncome: '3520', selectedComparisonIds: 'coffee', amount: '60' } } },
];

describe('B-V2', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    resetBoundaries();
    vi.spyOn(Math, 'random').mockReturnValue(0.25);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('B-V2-01 primeiro acesso: renda=1760; Livro=60; Ingresso=30', async () => {
    renderFlow();
    await press('Iniciar');
    await atRoute('/onboarding');
    expect(nativeStorage.getItem).toHaveBeenCalledWith(PROFILE_KEY);
    expectLastNavigation('push', '/onboarding');
    enterIncome('1760');
    await press('Café');
    await press('Netflix');
    await press('Continuar');
    await atRoute('/calculator');
    const profile = { monthlyIncome: '1760', selectedComparisonIds: ['coffee', 'netflix'] };
    expect(persistedProfile()).toEqual(profile);
    expect(nativeData.get(PROFILE_KEY)).toBe(JSON.stringify(profile));
    expect(nativeStorage.setItem).toHaveBeenCalledWith(PROFILE_KEY, JSON.stringify(profile));
    const params = { monthlyIncome: '1760', selectedComparisonIds: 'coffee,netflix' };
    expectLastNavigation('push', '/calculator', params);
    await calculate60('Livro');
    expectLastNavigation('push', '/result', { ...params, amount: '60', expenseName: 'Livro' });
    expect(screen.getByText(/Livro custa:/).textContent).toBe('Livro custa:');
    expect(screen.getByText(/^10 cafés$/).textContent).toBe('10 cafés');
    expect(screen.getByText(/^1,5 meses de Netflix$/).textContent).toBe('1,5 meses de Netflix');
    assertComparisonsAt60();
    await press('Novo comparativo');
    await atRoute('/calculator');
    expectLastNavigation('replace', '/calculator', params);
    enterPurchase('Ingresso', '30');
    await press('Calcular custo real');
    await atRoute('/result');
    expect(screen.getByText(/Ingresso custa:/).textContent).toBe('Ingresso custa:');
    expect(screen.getByText(/3,00 horas do seu trabalho/).textContent).toBe('3,00 horas do seu trabalho');
    expectLastNavigation('push', '/result', { ...params, amount: '30', expenseName: 'Ingresso' });
    expect(persistedProfile()).toEqual(profile);
    expect(nativeStorage.setItem).toHaveBeenCalledTimes(1);
  });

  it.each(purchaseRows)('$id compra amount="$amount": erro e correção', async ({ amount, empty }) => {
    const profile = { monthlyIncome: '1760', selectedComparisonIds: ['coffee'] };
    seedProfile(profile);
    renderFlow({ pathname: '/calculator', params: sessionParams });
    const initialRoutes = [...routes];
    enterPurchase('Teste', amount);
    await press('Calcular custo real');
    if (empty) {
      await atRoute('/calculator');
      expect(routes).toEqual(initialRoutes);
      expect(screen.getByRole('alert').textContent).toBe('Informe o valor da compra.');
    } else {
      // CA-03.3 permite rejeitar na entrada ou no Result.
      await waitFor(() => {
        expect(screen.getByRole('alert').textContent).toMatch(/(?:confira|corrija|informe|inválid|maior|positiv).*(?:renda|valor)|(?:renda|valor).*(?:inválid|maior|positiv|válid)/i);
      });
      const errorRoute = getRoute().pathname;
      expect(['/calculator', '/result']).toContain(errorRoute);
      await atRoute(errorRoute);
      if (errorRoute === '/result') {
        expectLastNavigation('push', '/result', { ...sessionParams, amount, expenseName: 'Teste' });
      } else {
        expect(routes).toEqual(initialRoutes);
      }
    }
    assertNoNumericResult();
    if (getRoute().pathname === '/result') {
      await press('Novo comparativo');
      await atRoute('/calculator');
      expectLastNavigation('replace', '/calculator', sessionParams);
    }
    expect(getRoute().params).toEqual(sessionParams);
    await calculate60('Corrigida');
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByText(/Corrigida custa:/).textContent).toBe('Corrigida custa:');
    expectLastNavigation('push', '/result', { ...sessionParams, amount: '60', expenseName: 'Corrigida' });
    expect(persistedProfile()).toEqual(profile);
    expect(nativeStorage.setItem).not.toHaveBeenCalled();
  });

  it.each(incomeRows)('$id onboarding monthlyIncome="$income": bloqueia sem escrita', async ({ income }) => {
    renderFlow({ pathname: '/onboarding' });
    const initialRoutes = [...routes];
    enterIncome(income);
    await press('Continuar');
    // Assertions soft registram todas as violações sem transformar defeitos em sucesso.
    expect.soft(getRoute().pathname).toBe('/onboarding');
    expect.soft(routes).toEqual(initialRoutes);
    expect.soft(nativeStorage.setItem).not.toHaveBeenCalled();
    expect.soft(persistedProfile()).toBeNull();
    const alert = screen.queryByRole('alert');
    expect.soft(alert).not.toBeNull();
    expect.soft(alert?.textContent ?? '').toMatch(/renda/i);
    expect.soft(alert?.textContent ?? '').toMatch(/inform|inválid|válid|positiv|maior|obrigat/i);
  });

  it.each(resultRows)('$id Result: $description', async ({ route, valid, returned }) => {
    renderFlow(route);
    if (valid) {
      expect(screen.queryByRole('alert')).toBeNull();
      expect(screen.getByText(/Essa compra custa:/).textContent).toBe('Essa compra custa:');
      expect(screen.getByText(/6,00 horas do seu trabalho/).textContent).toBe('6,00 horas do seu trabalho');
      assertComparisonsAt60();
    } else {
      expect(screen.getByRole('alert').textContent).toBe('Não foi possível calcular. Volte e confira renda e valor.');
      assertNoNumericResult();
    }
    await press('Novo comparativo');
    await atRoute('/calculator');
    expectLastNavigation('replace', '/calculator', returned);
    expect(screen.getByPlaceholderText('Ex: Cadeira ergonômica').getAttribute('value')).toBe('');
    expect(screen.getByPlaceholderText('Ex: 1499,00').getAttribute('value')).toBe('');
    expect(nativeStorage.setItem).not.toHaveBeenCalled();
  });

  it.each(preferenceRows)('$id fallback: selectedComparisonIds=$ids', async ({ ids, firstAccess }) => {
    const profile = { monthlyIncome: '1760', selectedComparisonIds: ids };
    if (firstAccess) {
      renderFlow({ pathname: '/onboarding' });
      enterIncome('1760');
      // Nenhuma assertion de aria aqui: a falha web não deve abortar este contrato.
      await press('Continuar');
      await atRoute('/calculator');
      expect(nativeStorage.setItem).toHaveBeenCalledWith(PROFILE_KEY, JSON.stringify(profile));
    } else {
      seedProfile(profile);
      renderFlow();
      await press('Iniciar');
      await atRoute('/calculator');
      expect(nativeStorage.getItem).toHaveBeenCalledWith(PROFILE_KEY);
    }
    expect(persistedProfile()).toEqual(profile);
    expectLastNavigation('push', '/calculator', { monthlyIncome: '1760', selectedComparisonIds: ids.join(',') });
    await calculate60();
    const renderedIds = assertComparisonsAt60();
    expect(screen.queryByText(/desconhecido/)).toBeNull();
    if (ids.includes('desconhecido')) {
      expect(screen.getAllByText(/^10 cafés$/)).toHaveLength(1);
      expect(renderedIds).toContain('coffee');
      expect(renderedIds).not.toContain('desconhecido');
      expect(renderedIds).toHaveLength(4);
      expect(renderedIds.filter(id => id !== 'coffee')).toHaveLength(3);
    }
    if (ids.length > 4) {
      expect(renderedIds).toHaveLength(4);
      for (const id of renderedIds) expect(ids).toContain(id);
    }
    expect(persistedProfile()).toEqual(profile);
  });

  it('B-V2-06 checkbox web Café: aria-checked=false,true,false; persistência final=netflix', async () => {
    renderFlow({ pathname: '/onboarding' });
    enterIncome('1760');
    for (const checkbox of screen.getAllByRole('checkbox')) {
      expect.soft(checkbox.getAttribute('aria-checked')).toBe('false');
    }
    const coffee = () => screen.getByRole('checkbox', { name: 'Café' });
    expect.soft(coffee().getAttribute('aria-checked')).toBe('false');
    await press('Café');
    expect.soft(coffee().getAttribute('aria-checked')).toBe('true');
    await press('Café');
    expect.soft(coffee().getAttribute('aria-checked')).toBe('false');
    await press('Netflix');
    expect.soft(screen.getByRole('checkbox', { name: 'Netflix' }).getAttribute('aria-checked')).toBe('true');
    await press('Continuar');
    await atRoute('/calculator');
    const profile = { monthlyIncome: '1760', selectedComparisonIds: ['netflix'] };
    expect(persistedProfile()).toEqual(profile);
    expect(nativeStorage.setItem).toHaveBeenCalledWith(PROFILE_KEY, JSON.stringify(profile));
    expectLastNavigation('push', '/calculator', { monthlyIncome: '1760', selectedComparisonIds: 'netflix' });
  });

  it.each(storageRows)('$id storage real: falha=$mode, rejeição aguardada pelo controlador', async ({ mode }) => {
    seedProfile(oldProfile);
    renderFlow({ pathname: mode === 'write' ? '/onboarding' : '/' });
    const initialRoutes = [...routes];
    const failure = new Error(`adapter-${mode}`);
    if (mode === 'json') {
      nativeData.set(PROFILE_KEY, '{invalid-json');
      await expect(loadInitialProfile()).rejects.toBeInstanceOf(SyntaxError);
      expect(nativeStorage.getItem).toHaveBeenCalledExactlyOnceWith(PROFILE_KEY);
      expect(nativeData.get(PROFILE_KEY)).toBe('{invalid-json');
      expect(nativeStorage.setItem).not.toHaveBeenCalled();
    } else if (mode === 'read') {
      nativeStorage.getItem.mockRejectedValueOnce(failure);
      await expect(loadInitialProfile()).rejects.toBe(failure);
      expect(nativeStorage.getItem).toHaveBeenCalledExactlyOnceWith(PROFILE_KEY);
      expect(persistedProfile()).toEqual(oldProfile);
      expect(nativeStorage.setItem).not.toHaveBeenCalled();
    } else {
      enterIncome('1760');
      await press('Netflix');
      const input = screen.getByPlaceholderText('Ex: 4500,00') as HTMLInputElement;
      const updated = { monthlyIncome: input.value, selectedComparisonIds: ['netflix'] };
      nativeStorage.setItem.mockRejectedValueOnce(failure);
      // Chamada real aguardada; não dispara handler de UI com rejeição não tratada.
      await expect(saveInitialProfile(updated)).rejects.toBe(failure);
      expect(nativeStorage.setItem).toHaveBeenCalledExactlyOnceWith(PROFILE_KEY, JSON.stringify(updated));
      expect(nativeStorage.getItem).not.toHaveBeenCalled();
      expect(persistedProfile()).toEqual(oldProfile);
    }
    expect(routes).toEqual(initialRoutes);
    expect(getRoute().pathname).toBe(mode === 'write' ? '/onboarding' : '/');
  });

  it.each(editRows)('$id edição a partir de $origin: salva e recupera via Home', async ({ route }) => {
    seedProfile(oldProfile);
    const view = renderFlow(route);
    await press('Mudar preferências');
    await atRoute('/onboarding');
    expectLastNavigation('push', '/onboarding');
    enterIncome('1760');
    // Define a seleção final sem exigir nem proibir pré-preenchimento (LAC-04).
    // Correção de preparação do teste: um div descendente não identifica seleção.
    // O estado semântico do controle permite preparar a seleção final sem
    // exigir ou proibir pré-preenchimento. Assertions permanecem inalteradas.
    for (const checkbox of screen.getAllByRole('checkbox')) {
      const label = checkbox.textContent!.trim();
      const selected = checkbox.getAttribute('aria-checked') === 'true';
      if ((label === 'Netflix') !== selected) await press(label);
    }
    await press('Continuar');
    await atRoute('/calculator');
    const updated = { monthlyIncome: '1760', selectedComparisonIds: ['netflix'] };
    expect(persistedProfile()).toEqual(updated);
    expect(nativeStorage.setItem).toHaveBeenCalledWith(PROFILE_KEY, JSON.stringify(updated));
    expectLastNavigation('push', '/calculator', { monthlyIncome: '1760', selectedComparisonIds: 'netflix' });
    // Escrita confirmada antes da nova montagem: simula retorno à Home, sem inventar botão.
    view.unmount();
    renderFlow({ pathname: '/' });
    const readsBeforeStart = nativeStorage.getItem.mock.calls.length;
    await press('Iniciar');
    await atRoute('/calculator');
    expect(nativeStorage.getItem).toHaveBeenCalledTimes(readsBeforeStart + 1);
    expect(nativeStorage.getItem).toHaveBeenLastCalledWith(PROFILE_KEY);
    expectLastNavigation('push', '/calculator', { monthlyIncome: '1760', selectedComparisonIds: 'netflix' });
    await calculate60('Perfil atualizado');
    expect(screen.getByText(/Perfil atualizado custa:/).textContent).toBe('Perfil atualizado custa:');
    expect(screen.getByText(/^1,5 meses de Netflix$/).textContent).toBe('1,5 meses de Netflix');
    expect(persistedProfile()).toEqual(updated);
    expect(nativeStorage.setItem).toHaveBeenCalledTimes(1);
  });
});
