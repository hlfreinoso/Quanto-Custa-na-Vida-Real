# Validação da entrega

- Referência: main fe3103d. Clone obtido do repositório oficial, sem mudanças rastreadas iniciais; cópia local anterior fora deste checkout preservada.
- Baseline: npm ci, sete arquivos/31 casos aprovados e typecheck aprovado.
- Harness: smoke de integração real das telas/storage/core aprovado; adaptação somente de fronteiras nativas/roteamento. Não conta como geração LLM.
- Quatro chamadas reais: A V1/V2 e B V1/V2; respostas, eventos, metadados e hashes preservados. Sem ferramentas ou delegação nas chamadas geradoras.
- Originais no mesmo produto: 61 executáveis, 43 aprovados/18 falhas. Typecheck aprovado para cada fonte. Erros separados em D-01/D-02 (produto) e T-01 (preparação do teste).
- T-01 isolado: B V2 20/25 no produto ainda original. Comparação por AST confirma todas as chamadas expect inalteradas.
- Produto corrigido: 61/61 gerados e 93/93 gerais, zero ignorados. Typecheck geral aprovado.
- Build Expo web exportado; fluxo operado no navegador com Expo Router/AsyncStorage web reais, incluindo rejeição de renda vazia, cálculo, novo comparativo e recuperação de perfil. Sem Android/iOS.
- Reprodução em extração nova de fe3103d com as fontes originais das respostas: 43/61 aprovados e as mesmas 18 falhas. Relatórios em evidencias/replay-original/.
- Revisão de código integrada (skill code-review): diff de produção, harness, configuração, fontes geradas, scripts e documentação conferidos. Nenhum achado relevante pendente no recorte. Não é revisão exaustiva de todo o produto ou auditoria de segurança.
- Original de todos os sete arquivos de teste .test.ts preservado, assim como core e storage de produção. Única fonte de produto alterada: ComparisonPreferencesScreen.tsx.
- Links Markdown locais e hashes conferidos. Prompts mantêm os espaços de quebra de linha da especificação original e logs mantêm o alinhamento de tabelas/linhas em branco do executor; esses artefatos arquivados não são formatados pelo gate de whitespace. Código e prosa nova passam no diff check.

## Limitações e decisões pendentes

LAC-02/03/04/11, teste nativo, navegação de dispositivo, deduplicação semântica exata, repetição estatística, custos e produtividade humana não foram resolvidos/medidos. A suíte geral cobriu 127/128 statements e 85/88 ramos do recorte; não se afirma cobertura completa ou ausência de defeitos.

## Publicação

Branch `test/genai-integration-unit3` publicada; [PR #5](https://github.com/hlfreinoso/Quanto-Custa-na-Vida-Real/pull/5) integrado à `main` por autorização explícita do usuário em 25/10/2026, commit `a7c55824539c65130e9e61cfbe745dbf40ee1f67`. Sem publicação no AVA.

[GitHub Actions, execução 40149381436](https://github.com/hlfreinoso/Quanto-Custa-na-Vida-Real/actions/runs/40149381436), evento push do commit `144522f3537254aa7dd80db0f94584ad12a6b9e8`, concluído com sucesso em 25/10/2026 às 01:08:03 UTC. Checkout limpo Ubuntu, Node 24.12.0, npm ci, typecheck, verificador de evidências, 12 arquivos/93 testes aprovados e upload dos relatórios aprovados. Cobertura geral no CI: statements 99,21%, ramos 96,59%, funções 100% e linhas 99,20%, concordantes com a execução local. A referência é imutável; o registro posterior destes links altera somente a documentação.
