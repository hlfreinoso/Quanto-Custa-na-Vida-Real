# Diagnóstico antes das correções

Referência de produção: fe3103d. A V1: 12 casos, 7 aprovados/5 falhas; B V1: 18 casos, 13 aprovados/5 falhas. Todos compilam. Dez falhas não equivalem a dez bugs: quatro entradas de renda se repetem em A/B e o checkbox ocorre uma vez em cada suíte.

## D-01 — Renda inválida atravessa onboarding e persistência

Requisitos RF-08, RN-02 e CA-02.3, já confirmado como implementação parcial (LAC-01). Entradas vazia, 0, -1 e abc. Esperado: permanecer no onboarding, orientar correção e não persistir. Observado: grava texto inválido e navega à Calculator. Causa: handleContinue não valida a renda antes de saveInitialProfile. Falhas de produto, alta relevância funcional; uma causa, múltiplos casos. Mensagem exata de correção não foi fixada pelo requisito e não será inventada como obrigação do teste.

## D-02 — Seleção de checkbox não expõe estado no alvo web

RF-05/RN-09 e semântica do controle declarado checkbox. Fonte define accessibilityRole=checkbox e accessibilityState.checked. No React Native Web 0.21.2 instalado, createDOMProps mapeia aria-checked/accessibilityChecked, mas não accessibilityState. Observado DOM inicial com role checkbox sem aria-checked; pela análise desse mapeamento, infere-se que o estado também não é exposto após toggles. A falha inicial interrompe o teste antes desses toggles. Não é bug do core nem prova de falha em Android/iOS.

O alvo web é documentado no README e usado pelo próprio aplicativo. O oráculo não deriva apenas de uma suposição da LLM: [API oficial RN Web](https://necolas.github.io/react-native-web/docs/accessibility/) documenta aria-checked; o [padrão W3C checkbox](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/) define false/true para não selecionado/selecionado. Classificação: defeito de integração/acessibilidade no alvo web, impacto médio; não equivale a auditoria completa WCAG nem resolve LAC-13. Correção mínima proposta: expor aria-checked ao lado da propriedade nativa já existente, sem alterar regra de seleção.

## Limitações dos testes gerados observadas

A V1 deriva parte das expectativas da lista pela própria função de comparação, diminuindo a independência do oráculo. Ambos agrupam múltiplas operações; uma falha precoce de ARIA interrompe um fluxo que teria outras verificações. B V1 agrega as três falhas do storage num único teste e não cobre retorno após erro ou parâmetros ausentes. Isso orienta V2, sem fabricar falhas sintáticas/imports inexistentes.

### T-01 — Preparação incorreta em três casos B V2

Os casos B-V2-08-home/calculator/result detectavam seleção por `aria-checked=true OU querySelector('div > div')`. Todos os checkboxes possuem elementos descendentes mesmo desmarcados. Isso fazia a preparação alternar opções erradas, e o perfil persistido não era o esperado. A V2 já testava edição com sucesso no mesmo produto, reforçando a necessidade de investigar o teste antes de atribuir defeito a RF-17.

Correção exclusivamente no Arrange: remover a heurística estrutural e um loop sem efeito; usar o estado semântico para preparar a seleção Netflix. **Nenhuma assertion foi alterada.** Resposta original e hash preservados; hash da fonte executada e intervenção em geracoes.json. Reexecução somente dessa correção, ainda sobre o produto original: B V2 passa de 17/25 para 20/25. Permanecem quatro falhas D-01 e uma D-02. Evidências em test-correction-only/b-v2. Três casos falhos eram uma causa no teste, não três bugs do produto.

## Correções e confirmação

Após completar e medir as quatro gerações sobre o código original, a única fonte de produção alterada foi ComparisonPreferencesScreen.tsx: validação finita/positiva antes de persistir, mensagem inline com role alert e aria-checked para o controle web. Mantida a normalização pt-BR que já existia em Result; não se resolveu a política de formatos alternativos. Mantidos accessibilityState para native e todos os oráculos das suítes.

Reexecução: A V1 12/12, A V2 6/6, B V1 18/18, B V2 25/25; combinado gerado 61/61. Suíte geral: 93/93 (31 originais + 61 gerados + um smoke do harness). Typecheck aprovado. D-01 confirma uma lacuna já documentada, não uma descoberta inédita; D-02 foi diagnosticado na fronteira web. T-01 foi uma correção de teste. Não ocorreu falha de ambiente na execução dos testes; avisos de dependências/MCP não foram contados como defeitos de produto.

Recuperação de Home após corrupção/indisponibilidade, interpretação de decimais ambíguos, fallback específico de lista vazia e pré-preenchimento na edição continuam decisões pendentes. Não atribuir defeito a um comportamento ainda não aprovado. Preservar evidências originais antes de qualquer correção.
