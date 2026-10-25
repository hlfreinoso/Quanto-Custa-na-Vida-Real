# Método e linha de base

Referência: main, commit fe3103d9d9946b3a449469e5bf675b038ce6e3ed, obtido por clone do repositório oficial em 25/10/2026 (Australia/Sydney). Cópia local anterior fora deste checkout preservada; não foram incorporadas mudanças dela. Não havia alterações rastreadas neste clone antes do trabalho.

Linha de base: Node 24.12.0, npm 11.7.0, npm ci pelo lockfile; 31/31 testes em sete arquivos aprovados; npm run typecheck aprovado. Código e requisitos analisados antes de modificar a infraestrutura. A configuração original inclui apenas .test.ts; não há testes de telas/navegação. Lint é placeholder e não será reportado como validação real.

## Escopo e oráculos prévios

Home → Onboarding → InitialProfileStorage → Calculator → core → Result, incluindo retorno com perfil salvo e novo comparativo. RF-01..17, RN-02/04/05/10..14 e critérios CA-01..06, conforme docs/requisitos-e-especificacao.md. Não alterar requisitos durante a comparação.

Confirmados: persistir/recuperar renda e preferências; navegar sem perfil para onboarding; propagar parâmetros; cálculos positivos finitos com jornada atual 176h; priorizar IDs válidos, ignorar desconhecidos/repetidos, fallback sem duplicação e limite quatro; erro de cálculo sem NaN/Infinity; novo comparativo preserva perfil. CA-02.3/RF-08 prevê bloquear renda inválida antes da continuidade, apesar da implementação parcial: cenário capaz de revelar defeito.

Pendentes: formatos monetários alternativos (LAC-02), escolha específica do fallback quando preferências vazias (LAC-03), pré-preenchimento na edição (CA-06.2/LAC-04 depende de confirmação) e política de recuperação/aviso de armazenamento (LAC-11). Exercitar essas fronteiras e registrar observação, sem inventar texto/fluxo de recuperação nem transformar proposta em oráculo aprovado. Confirmar apenas invariantes já definidas (não apresentar números incorretos, preservar dados, propagar erros do storage). Não implementar solução ampla para resolver decisões de produto.

## Infraestrutura escolhida

Avaliar Vitest existente com React Testing Library + jsdom, utilizando React Native Web já incluído no aplicativo e alias apenas no projeto de testes de integração. Isso renderiza as mesmas telas React do produto na implementação web dos primitivos nativos. Não é execução em Android/iOS, Expo Router real ou E2E de dispositivo.

InitialProfileStorage e funções do core permanecem reais. AsyncStorage recebe adapter em memória isolado (fronteira nativa). Expo Router recebe um adapter de parâmetros/chamadas que conecta as telas reais; testes verificam o destino e o conteúdo que atravessam a fronteira. Não simular Home, Onboarding, Calculator, Result ou core. Aleatoriedade controlada/restaurada por teste. Nenhuma dependência de runtime do app será adicionada para os testes.

Fontes de suporte: [React Native Web](https://necolas.github.io/react-native-web/docs/installation/), [React Testing Library com outros runners](https://testing-library.com/docs/react-testing-library/setup/), [Vitest jsdom](https://vitest.dev/config/environment.html). RNTL/Jest também foi avaliado; manter Vitest e a superfície web existente evita introduzir outro runner e uma cadeia de transformação do código nativo nesta atividade. Essa escolha limita a validade às integrações JavaScript/componentes compartilhados.

Etapas: infraestrutura mínima e smoke do harness → A/B V1 → análise efetiva → A/B V2 → comparação no mesmo código-base → diagnóstico de falhas → correções relacionadas separadas → reexecução final, typecheck, cobertura e PR. Relatórios originais preservados; falhas de produto, teste e ambiente separadas. Sem pontuação subjetiva de qualidade ou deduplicação semântica inventada.

## Execução efetiva da LLM e curadoria

Codex CLI 0.164.0-alpha.11.1, OpenAI, modelo configurado gpt-6.1-sol e reasoning effort medium, quatro invocações de `codex exec --ephemeral --json --sandbox read-only --skip-git-repo-check`, com prompt por stdin e saída em arquivo. Cada sessão é nova; eventos confirmam somente uma mensagem gerada e nenhum uso de ferramentas/delegação. O cliente injeta também instruções/contexto de sistema não inteiramente controláveis. Cache do provedor, quando indicado no uso de tokens, não equivale a reaproveitamento de histórico da conversa. Modelo de snapshot exato, temperatura e seed não foram expostos.

Os prompts integrais contêm a especificação então vigente e fontes reais, sem styles irrelevantes ao comportamento, mais a API integral do harness. A não recebeu exemplos de código/casos resolvidos, mas recebeu contexto contratual, inclusive fórmula e formato de horas. B recebeu exemplos de situações e resultados retirados dos requisitos. Assim, o controle compara estratégias contextualizadas, não texto livre sem contrato.

Primeiro foram analisadas e executadas V1; só depois V2 foi escrito e chamado. Não houve correção de produção entre as quatro gerações/avaliações originais. A comparação original teve 61 casos e 43 aprovados. Houve uma correção automática pelo agente coordenador na preparação de B V2 (T-01), registrada separadamente; reexecução apenas dela demonstrou 20/25. Só depois a fonte do onboarding foi corrigida para D-01/D-02 e todas as suítes reexecutadas.

Três arquivos executados são idênticos ao campo source da resposta original. B V2 tem hash original e executado distintos, com intervenção explícita; as chamadas expect foram comparadas por AST e não mudaram. Não houve ajuste de assertions, remoção de teste revelador ou alteração de requisito para obter resultado verde. Metadados de B V1 agregam suas 18 linhas em oito grupos; V2 identifica os 25 casos individualmente. Isso é limitação/rastreabilidade da saída original, não um dado corrigido retroativamente.

## Medição, isolamento e limites

O setup reinicia o Map do adapter AsyncStorage e as rotas a cada caso; executa cleanup e restaura spies. Math.random é controlado em 0.25; não se afirma uma ordem universal das comparações. O adapter de navegação renderiza telas reais de acordo com pathname e repassa os parâmetros, mas não reproduz a pilha nativa, back button, deep links ou ciclo de vida do Expo Router real. Storage tests com falha aguardam rejeição em controlador de teste, respeitando LAC-11.

Vitest JSON registra casos, resultados e falhas; TypeScript valida cada arquivo gerado e a suíte geral. V8 mede statements, branches, functions e lines filtrados para quatro telas, InitialProfileStorage e core; não mede framework/dependências ou dispositivo. A fonte original tem 121 statements/82 ramos; a corrigida tem 128/88. Comparar V1/V2 dentro de cada versão do produto; não atribuir mudança de denominador aos prompts.

Uma geração por versão e um modelo configurado, sem controle de snapshot, objetivos diferentes e número de métodos solicitado. Não foram medidas economia de tempo, produtividade humana, custo monetário ou significância estatística. Nomes únicos do executor não significam comportamentos únicos: a redundância é discutida por requisito/família, sem inventar deduplicação semântica exata.

Relatórios públicos substituem os caminhos locais (inclusive chaves/valores de JSON), removem sequências de cores, normalizam LF e formatam JSON; valores de assertions, resultados e tempos são preservados. Hashes originais e públicos registram a transformação. Prompts, respostas e eventos da LLM permanecem integrais e sem normalização de bytes no Git. Scripts de reprodução criam diretórios novos e recusam sobrescrita dos relatórios históricos.

O smoke do build web utilizou os módulos reais do Expo Router/AsyncStorage web, sem os adapters Vitest, com renda/compra fictícias. Essa observação adicional não é nova geração de testes nem execução em Android/iOS. Não houve deploy, backend ou postagem no AVA. Publicação de branch/PR autoriza revisão, não merge.

O script replay-original.ps1 foi executado com o combinado: extraiu fe3103d, instalou pelo lockfile, montou a infraestrutura e restaurou exatamente as fontes do campo source das respostas. Reproduziu **43/61 aprovados e 18 falhas**, inclusive T-01. Relatórios em resultados/evidencias/replay-original/. Essa repetição é validação da reprodução do código arquivado, não uma nova amostra independente de geração LLM.
