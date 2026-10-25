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
- integração Home → Onboarding → persistência → Calculator → core → Result e retorno;
- alteração/reutilização de perfil, validação de renda, parâmetros de rota e comparações;
- falhas isoladas da fronteira nativa de armazenamento e semântica de checkbox no alvo web.

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

- renderização nativa em Android/iOS;
- Expo Router nativo em dispositivo;
- testes end-to-end de dispositivo.

## Diretriz

Toda regra nova deve nascer no `packages/core` com teste antes de ser conectada na UI.

Na Unidade III, estes fluxos passaram a ter testes de integração das telas compartilhadas na implementação web:

- home pula onboarding quando existe perfil salvo;
- onboarding salva perfil e preferências;
- calculadora envia produto e preço para resultado;
- resultado exibe horas do trabalho e comparações;
- botão `Novo comparativo` volta para calculadora.

## Limitações Atuais

Os testes de integração da Unidade III renderizam telas reais usando React Native Web e adapters de roteamento/AsyncStorage. Não substituem validação nativa em Android/iOS. Um smoke adicional operou o build Expo web com roteamento e storage reais da implementação web; não foi contado como geração LLM ou teste em dispositivo. A atividade e os relatórios antes/depois estão em [docs/academic/unidade-3-testes-integracao](academic/unidade-3-testes-integracao/README.md).

## Resultados da Unidade III

Baseline 31/31; quatro suítes geradas com 12, 6, 18 e 25 casos. Após diagnóstico/correções: 61/61 gerados e 93/93 na suíte geral. Typecheck inclui as fontes geradas importadas em apps/mobile/src/integration. `npm test -- --coverage` mede quatro telas, InitialProfileStorage e core, excluindo testes/framework: suíte geral com 127/128 statements e 85/88 ramos na execução registrada. Isso não representa cobertura de toda a plataforma nativa.

Scripts: `node scripts/academic/verify-evidence.mjs` confere hashes e assertions; `node scripts/academic/evaluate.mjs nome-novo` mede cada suíte e combinado em diretório novo. O [relatório completo](academic/unidade-3-testes-integracao/resultados/execucoes.md) separa saídas originais, correção do teste e produto corrigido. Não comparar percentuais com denominadores diferentes como efeito do prompt.
