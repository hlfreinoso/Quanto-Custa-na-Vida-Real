# Unidade III — Testes de integração com IA generativa

Atividade da pós-graduação em Engenharia de Software: Automação e Inovação com Inteligência Artificial Generativa — UFG, disciplina Testes de Software Automatizados com IA Generativa, professora Mariana Crisóstomo Martins. [Solicitação integral](solicitacao.md).

Trabalho no projeto acadêmico oficial [Quanto Custa na Vida Real](https://github.com/hlfreinoso/Quanto-Custa-na-Vida-Real), branch `test/genai-integration-unit3`. Arquitetura preservada: monorepo React Native/Expo/TypeScript, AsyncStorage, core independente, mobile/offline-first, sem backend ou autenticação no MVP. Não foi criado outro sistema para esta atividade.

## Cenário real

Home → Onboarding → InitialProfileStorage → Calculator → core → Result → Novo comparativo. Inclui retorno com perfil salvo, alteração/reutilização de renda e preferências, parâmetros inválidos, fallback de comparações e falhas da fronteira nativa de storage.

No Vitest, telas/storage do aplicativo/core são reais; somente AsyncStorage nativo e mecanismos de rota/params recebem adapters. As mesmas telas usam React Native Web já incluído no app, renderizadas por React Testing Library/jsdom. São testes de integração de componentes/módulos JavaScript, **não E2E em Android/iOS**. Um smoke separado operou o build Expo web com router e storage web reais. [Detalhes e limites](metodologia.md).

## Experimento efetivamente executado

Quatro sessões independentes via OpenAI/Codex CLI, modelo configurado `gpt-6.1-sol`, esforço medium, em 25/10/2026. Não foram feitas chamadas a provedores/modelos fictícios. Alias exato de snapshot, temperatura e seed não foram expostos. Eventos e hashes em [geracoes.json](geracoes.json). Não houve uso de ferramentas ou subagentes nas sessões geradoras: emitiram somente o texto JSON com casos e TSX.

| Estratégia | Prompt | Resposta original | Metadados | Testes executados |
|---|---|---|---|---|
| A V1 — funcional, zero-shot | [integral](prompts/prompt-a-v1.md) | [JSON](respostas-llm/a-v1.json) | [casos](respostas-llm/a-v1-cases.json) | [TSX](../../../apps/mobile/src/integration/a-v1.integration.test.tsx) |
| A V2 — refinamento funcional | [integral](prompts/prompt-a-v2.md) | [JSON](respostas-llm/a-v2.json) | [casos](respostas-llm/a-v2-cases.json) | [TSX](../../../apps/mobile/src/integration/a-v2.integration.test.tsx) |
| B V1 — negativos, few-shot | [integral](prompts/prompt-b-v1.md) | [JSON](respostas-llm/b-v1.json) | [casos](respostas-llm/b-v1-cases.json) | [TSX](../../../apps/mobile/src/integration/b-v1.integration.test.tsx) |
| B V2 — refinamento de fronteiras | [integral](prompts/prompt-b-v2.md) | [JSON](respostas-llm/b-v2.json) | [casos](respostas-llm/b-v2-cases.json) | [TSX](../../../apps/mobile/src/integration/b-v2.integration.test.tsx) |

Antes das correções e no mesmo produto: A V1 7/12, A V2 6/6, B V1 13/18, B V2 17/25. O combinado original teve 43/61 aprovados. Diagnóstico: duas causas no produto e uma causa na preparação de três casos B V2. A renda inválida confirma LAC-01, já conhecida na especificação; o checkbox revela uma incompatibilidade no alvo web. Não foram contados como 18 bugs diferentes.

Corrigir somente o Arrange de B V2 levou a 20/25 no produto original; nenhuma assertion mudou. Depois, duas correções pequenas em um componente de produção levaram a **61/61 casos gerados aprovados**. A suíte completa tem **93/93 aprovados**: 31 originais + 61 gerados + um smoke de infraestrutura não gerado pela LLM. Typecheck e build Expo web aprovados. Cobertura completa do recorte instrumentado: statements 127/128 (99,21%), ramos 85/88 (96,59%). Não é cobertura de toda a plataforma Expo.

## Evidências e interpretação

- [Execuções e tabelas separadas antes/depois](resultados/execucoes.md), [dados estruturados](resultados/metricas.json) e [relatórios brutos publicados](resultados/evidencias/).
- [Defeitos, diagnóstico, intervenção T-01 e confirmação](resultados/defeitos-identificados.md).
- [Comparativo dos prompts](resultados/comparativo.md) e [rastreabilidade RF-01..17](resultados/rastreabilidade.md).
- [Smoke web adicional](resultados/smoke-web.json), com [registro visual](resultados/evidencias/smoke-web.png).
- [Resposta preparada para o fórum](resposta-forum.md), sem publicação automática.

Não usar somente taxa de aprovação para julgar qualidade. A V2 passou no produto original porque priorizou fluxos funcionais; não eliminou os defeitos que outras suítes detectaram. B V2 ampliou ramos e casos de fronteira, mas exigiu curadoria do teste. As 61 identidades incluem redundâncias semânticas. Uma geração por versão, objetivos e instruções diferentes impedem uma conclusão causal/universal sobre zero-shot versus few-shot.

## Reproduzir

Na raiz de um clone da branch:

```sh
npm ci
npm test
npm run typecheck
node scripts/academic/verify-evidence.mjs
npm test -- --coverage
```

Node usado: 24.12.0. O jsdom 27.3.0 foi escolhido porque o release mais novo consultado exigia Node >=24.15 nessa linha; a versão selecionada aceita o Node existente. Dependências de runtime do app mantidas; cinco dependências de teste adicionadas no root, com lockfile.

Uma suíte: `npm test -- --project=integration apps/mobile/src/integration/a-v2.integration.test.tsx`. Originais: `npm test -- --project=unit`. Projeto integration completo inclui o smoke; o combinado do experimento filtra apenas `apps/mobile/src/integration`, excluindo esse smoke.

Nova avaliação do código atual sem sobrescrever evidências históricas: `node scripts/academic/evaluate.mjs minha-reexecucao`. O script grava em `.experiment-local/minha-reexecucao/` e recusa sobrescrita. Para reproduzir as saídas originais sobre o produto original, PowerShell 7: `./scripts/academic/replay-original.ps1`. Requer Git, tar e npm; extrai fe3103d em diretório novo ignorado, copia somente infraestrutura e restaura as quatro fontes diretamente das respostas originais (inclusive T-01). Não altera o checkout principal nem usa reset; as falhas esperadas ficam registradas nos status.json. É um arquivo temporário do mesmo projeto, não outro repositório/sistema. Para executar só o combinado: `./scripts/academic/replay-original.ps1 -Suites combined`.

Reexecutar a LLM é opcional e consome a cota da conta configurada do Codex. `scripts/academic/run-generation.ps1` recebe o identificador do prompt e grava em diretório novo; precisa de Codex CLI autenticado. Os testes existentes não precisam de API key ou chamadas externas. Prompts e respostas arquivados têm bytes preservados por .gitattributes.

Os originais dos relatórios permanecem localmente em .experiment-local/ (ignorado). Cópias públicas substituem caminhos locais, removem cores ANSI, normalizam LF e formatam JSON; os valores de assertions, resultados e tempos são preservados, com hashes antes/depois. O verificador também compara por AST todas as chamadas expect das fontes originais/executadas, para confirmar que T-01 não alterou assertions.

## Limites e estado de entrega

LAC-02/03/04/11 continuam pendentes: formato monetário alternativo, fallback específico de lista vazia, pré-preenchimento na edição e política de recuperação da Home após erro no storage. Não se inventaram mensagens/fluxos para essas decisões. Não houve teste nativo em Android/iOS, avaliação estatística, custo monetário, produtividade humana ou deduplicação semântica perfeita. Nenhum teste verde prova ausência de defeitos.

Branch `test/genai-integration-unit3` publicada e [PR #5](https://github.com/hlfreinoso/Quanto-Custa-na-Vida-Real/pull/5) aberto para revisão, sem merge. O [CI em Ubuntu](https://github.com/hlfreinoso/Quanto-Custa-na-Vida-Real/actions/runs/40149381436) aprovou typecheck, integridade das evidências e 93/93 testes no commit `144522f3537254aa7dd80db0f94584ad12a6b9e8`; a cobertura geral confirmou 99,21% de statements e 96,59% de ramos. O texto do fórum permanece para publicação manual pelo usuário, sem postagem no AVA.
