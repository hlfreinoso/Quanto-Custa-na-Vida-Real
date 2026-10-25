# Execuções e métricas medidas

Referência original: fe3103d. Node 24.12.0/npm 11.7.0, React 19.1.0, React Native 0.81.5, Expo 54.0.34, RN Web 0.21.2, Vitest 4.1.5, TypeScript 6.0.3. Baseline: 31/31 testes originais aprovados em sete arquivos e typecheck aprovado. Nenhum teste anterior foi alterado.

## Comparação das saídas originais no mesmo produto

| Suíte | Casos | Identidades únicas | Aprovados | Falhas | Typecheck | Instruções/statements | Ramos |
|---|---:|---:|---:|---:|---|---:|---:|
| a-v1 | 12 | 12 | 7 | 5 | aprovado | 103/121 (85,12%) | 61/82 (74,39%) |
| a-v2 | 6 | 6 | 6 | 0 | aprovado | 106/121 (87,60%) | 62/82 (75,60%) |
| b-v1 | 18 | 18 | 13 | 5 | aprovado | 107/121 (88,42%) | 62/82 (75,60%) |
| b-v2 | 25 | 25 | 17 | 8 | aprovado | 113/121 (93,38%) | 72/82 (87,80%) |
| combined | 61 | 61 | 43 | 18 | conjunto, validado também no typecheck geral | 114/121 (94,21%) | 73/82 (89,02%) |

## Correção isolada da preparação B V2, produto ainda original

| Suíte | Casos | Identidades únicas | Aprovados | Falhas | Typecheck | Instruções/statements | Ramos |
|---|---:|---:|---:|---:|---|---:|---:|
| b-v2 | 25 | 25 | 20 | 5 | aprovado | 113/121 (93,38%) | 72/82 (87,80%) |

## Reexecução após correções de produção

| Suíte | Casos | Identidades únicas | Aprovados | Falhas | Typecheck | Instruções/statements | Ramos |
|---|---:|---:|---:|---:|---|---:|---:|
| a-v1 | 12 | 12 | 12 | 0 | aprovado | 117/128 (91,40%) | 73/88 (82,95%) |
| a-v2 | 6 | 6 | 6 | 0 | aprovado | 111/128 (86,71%) | 66/88 (75,00%) |
| b-v1 | 18 | 18 | 18 | 0 | aprovado | 117/128 (91,40%) | 73/88 (82,95%) |
| b-v2 | 25 | 25 | 25 | 0 | aprovado | 120/128 (93,75%) | 78/88 (88,63%) |
| combined | 61 | 61 | 61 | 0 | conjunto, validado também no typecheck geral | 121/128 (94,53%) | 79/88 (89,77%) |

## Suíte geral final

**93/93 aprovados**, zero ignorados: 31 originais + 61 gerados + um smoke de infraestrutura não gerado pela LLM. Instruções/statements 127/128 (99,21%); ramos 85/88 (96,59%); linhas 124/125 (99,20%); funções 36/36 (100,00%).

Os 61 casos vêm de 28 métodos (6 A V1, 6 A V2, 8 B V1 e 8 B V2); parametrização expande para 12/6/18/25 casos. Quatro arquivos gerados passaram no typecheck original e foram executados; não se mediu compilação isolada de cada linha de dados. Três fontes executadas coincidem com o source da resposta; B V2 tem uma correção documentada de Arrange e nenhuma assertion alterada. O termo statements refere-se à instrumentação JS do V8, não a instruções de máquina.

Identidade única significa nome completo do caso no executor, não unicidade semântica. Há sobreposição de renda inválida, compra inválida, fallback e repetição entre suítes. A diversidade funcional e suas lacunas são descritas na matriz de rastreabilidade; não foi inventada uma contagem de deduplicação semântica perfeita nem nota percentual de qualidade.

A comparação de prompts usa a primeira tabela: fonte de produção idêntica. A terceira tabela tem outro produto (mais validação e semântica web), portanto seu denominador mudou; diferenças antes/depois não são efeito exclusivo dos prompts. A V2 muda o recorte para fluxos funcionais e tem menos casos negativos; todos passarem não significa que D-01/D-02 deixaram de existir no código original. B V2 amplia ramos, mas também trouxe T-01: mais casos não dispensam curadoria.

Cobertura filtrada para quatro telas, InitialProfileStorage e core; exclui testes, framework e dependências. Os totais por suíte incluem fontes não executadas dentro desse recorte. Baseline de cobertura foi coletada após instalar o suporte V8, ainda com os mesmos 31 testes e fontes fe3103d: 51/121 statements e 39/82 ramos. Não atribuir cobertura total do app, Expo Router real ou plataforma nativa a esse filtro.

Resultados JSON, logs, typecheck e LCOV em [evidencias](evidencias/). Caminho local substituído, cores ANSI removidas e LF normalizado; hashes originais/públicos em manifest.json. Conteúdo de assertions, resultados e tempos preservados. Respostas LLM originais não foram alteradas. Nenhum resultado do projeto experimental abandonado foi reutilizado.
