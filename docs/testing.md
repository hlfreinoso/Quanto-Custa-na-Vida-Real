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

## O Que Esta Coberto

- `calculateHourlyRate`
- `calculateWorkHoursEquivalent`
- `calculateBasicExpenseImpact`
- `defaultComparisonPreferences`
- `calculateComparisonResults`
- `InitialProfileStorage`

## Tipos de Cenario Cobertos

- caminho feliz;
- entradas zeradas, negativas ou nao finitas;
- limite de comparacoes igual a zero;
- limite maior do que a quantidade de opcoes disponiveis;
- ids de preferencia desconhecidos ou repetidos;
- preco unitario invalido;
- perfil inicial inexistente;
- JSON salvo invalido;
- falha de leitura do AsyncStorage.

## O Que Ainda Nao Esta Coberto

- fluxo visual de home, onboarding, calculadora e resultado;
- navegacao entre rotas;
- renderizacao de componentes React Native;
- testes end-to-end.

## Diretriz

Toda regra nova deve nascer no `packages/core` com teste antes de ser conectada na UI.

Quando a UI estabilizar, adicionar uma biblioteca de teste para React Native e cobrir:

- home pula onboarding quando existe perfil salvo;
- onboarding salva perfil e preferencias;
- calculadora envia produto e preco para resultado;
- resultado exibe horas do trabalho e comparacoes;
- botao `Novo comparativo` volta para calculadora.
