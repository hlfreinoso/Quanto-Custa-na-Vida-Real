# Rastreabilidade e diversidade

Os metadados originais de cada geração registram objetivo, pré-condições, componentes, ações, resultados e requisitos em `respostas-llm/*-cases.json`. Eles são declarações produzidas pela LLM, não prova automática de que todas as assertions chegaram a executar. Esta matriz foi conferida contra as fontes executadas e o resultado final; no produto original, falhas precoces impedem observar verificações posteriores.

| Requisito/critério | Casos representativos | Fronteira/oráculo efetivamente verificado |
|---|---|---|
| RF-01/02, CA-01.1 | A-V1-01; A-V2-01; B-V2-01 | Home real lê storage real; perfil ausente encaminha onboarding via adapter |
| RF-03, CA-01.2 | A-V1-02; A-V2-02; B-V2-08-* | perfil recuperado, renda/IDs na Calculator; não passa pelo onboarding |
| RF-04/06, CA-02.1 | A-V1-01; A-V2-01/04 | UI escreve JSON pelo InitialProfileStorage; recupera o mesmo perfil e encaminha os parâmetros |
| RF-05, RN-08/09, CA-02.2 | A-V1-03; A-V2-03; B-V2-05-empty/06 | selecionar/desmarcar, nenhuma preferência obrigatória, persistência final e estado web do controle |
| RF-08, CA-02.3 | A-V1-05-*; B-V1-03; B-V2-03-* | quatro rendas inválidas; sem gravação/navegação e com orientação |
| RF-07/08, CA-03.1/03.2/03.3 | A-V1-06-*; B-V1-01/04; B-V2-02-* | compra vazia permanece na Calculator; inválidas não apresentam números; correção posterior em B V2 |
| RF-09/10, RN-04/05, CA-04.1 | A-V1-01/04; A-V2-01/04/05; B-V2-01 | aritmética independente (1760/176=10; 60/10=6) atravessa UI, parâmetros e core real |
| RF-11/12/13, RN-06/10..14, CA-04.2..04.4 | A-V1-02; A-V2-02; B-V1-02; B-V2-05-* | prioridade, IDs repetidos/desconhecidos, fallback distinto, máximo quatro; expectativas do core em A V1 são limitação registrada |
| RF-14/15, CA-03.4/04.5 | A-V1-03/06; B-V1-05; B-V2-04-* | nome opcional, parâmetros ausentes/inválidos, mensagem e ausência de NaN/Infinity |
| RF-16, CA-05.1 | A-V1-04; A-V2-05; B-V2-02/04 | replace para Calculator, renda/IDs preservados e nova compra permitida |
| RF-17, CA-06.1 | A-V2-06; B-V2-08-* | acesso à edição a partir de Home/Calculator/Result; gravação atualizada e reutilização posterior |
| RF-06 e LAC-11 | B-V1-08; B-V2-07-json/read/write | storage real propaga corrupção/erros do adapter nativo; dados não são sobrescritos em falha; caminho válido posterior funciona |

Há referências verificáveis a RF-01..17, mas isso **não significa cobertura completa de todos os requisitos e critérios**. CA-06.2 (pré-preenchimento) continua pendente; não é declarado aprovado. O limite específico do fallback vazio e a política de recuperação da Home também não foram definidos pelo experimento.

## Diversidade efetiva e redundância

- A V1: seis métodos/12 casos, misturando fluxos funcionais e negativos, inclusive quatro rendas e quatro compras inválidas. Omite alteração/reutilização de perfil e usa parte do próprio core para calcular uma expectativa de lista.
- A V2: seis métodos/seis casos, focados em fluxos funcionais, com alteração/reutilização e oráculos aritméticos independentes. Não substitui os casos negativos de V1/B. Reduzir casos parametrizados foi uma mudança de foco solicitada no refinamento, não uma melhoria numérica automática.
- B V1: oito métodos/18 casos; inclui limites, parâmetros inválidos e falhas do storage, mas reúne três falhas em um método e não exercita retorno após falha nem parâmetros ausentes.
- B V2: oito métodos/25 casos; inclui parâmetros ausentes, retorno após erro, três origens de edição e falhas de storage separadas. A preparação dos casos de edição exigiu T-01. A semântica web fica num teste próprio; expect.soft preserva todas as verificações e falha o caso quando qualquer estado não corresponde.

As 61 identidades no executor são distintas; semanticamente, renda inválida, compra inválida, fallback, retorno e persistência se repetem entre suítes. Não foi usada similaridade textual ou nota subjetiva para fingir uma contagem de comportamentos únicos. A matriz acima fornece classes e exemplos inspecionáveis; a deduplicação semântica exata não foi quantificada.

## Componentes reais e simulações

Reais: quatro telas, serialização do InitialProfileStorage, catálogo e funções do core, React e componentes da implementação React Native Web. Simulados no Vitest: adapter nativo AsyncStorage com Map novo por caso e a fronteira de rotas/params do Expo Router. O teste de corrupção/falha do storage aguarda a rejeição pelo controlador de teste, não reproduz uma recuperação da Home que não foi especificada.

O smoke adicional do build web usa Expo Router e AsyncStorage web reais, com dados sintéticos, e não entra nas 61 gerações nem nas 93 execuções Vitest. Nenhum teste aqui demonstra execução nativa Android/iOS.
