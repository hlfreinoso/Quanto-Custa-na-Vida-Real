# Testes

## Comandos

### Unidade III — infraestrutura de integração

A branch da atividade acrescenta o projeto Vitest `integration`, com React Testing Library/jsdom e a implementação React Native Web já utilizada no aplicativo. `unit` mantém os testes originais em Node. A linha de base `fe3103d` passou em 31/31 casos e typecheck. Não houve exclusão ou alteração dos testes unitários.

`npm test -- --project=unit` executa os testes existentes; `npm test -- --project=integration` executa os arquivos `.test.tsx`. O smoke de infraestrutura em `tests/integration/harness.smoke.test.tsx` é autoria do assistente coordenador e não conta como saída dos prompts do experimento. Telas, InitialProfileStorage e core são reais; adapter AsyncStorage e roteamento são simulados. Não é E2E em Android/iOS. [Método da atividade](academic/unidade-3-testes-integracao/metodologia.md).

```bash
npm test
npm run typecheck
```

Atalhos equivalentes:

```bash
make test
make typecheck
make validate
```

## O Que Está Coberto

- `calculateHourlyRate`
- `calculateWorkHoursEquivalent`
- `calculateBasicExpenseImpact`
- `defaultComparisonPreferences`
- `calculateComparisonResults`
- `InitialProfileStorage`

## Tipos de Cenário Cobertos

- caminho feliz;
- entradas zeradas, negativas ou não finitas;
- limite de comparações igual a zero;
- limite maior do que a quantidade de opções disponíveis;
- ids de preferência desconhecidos ou repetidos;
- preço unitário inválido;
- perfil inicial inexistente;
- JSON salvo inválido;
- falha de leitura do AsyncStorage.

## O Que Ainda Não Está Coberto

- fluxo visual de home, onboarding, calculadora e resultado;
- navegação entre rotas;
- renderização de componentes React Native;
- testes end-to-end.

## Diretriz

Toda regra nova deve nascer no `packages/core` com teste antes de ser conectada na UI.

Quando a UI estabilizar, adicionar uma biblioteca de teste para React Native e cobrir:

- home pula onboarding quando existe perfil salvo;
- onboarding salva perfil e preferências;
- calculadora envia produto e preço para resultado;
- resultado exibe horas do trabalho e comparações;
- botão `Novo comparativo` volta para calculadora.

## Limitações Atuais

O projeto ainda não possui testes de renderização de componentes, testes de navegação e testes end-to-end. Esses pontos devem ser tratados quando o fluxo visual estabilizar.
