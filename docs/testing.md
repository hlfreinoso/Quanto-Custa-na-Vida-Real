# Testes

## Comandos

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
