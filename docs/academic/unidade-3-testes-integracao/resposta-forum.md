# Texto para revisão e publicação manual

Professora Mariana e colegas,

Realizei a atividade no projeto acadêmico **Quanto Custa na Vida Real**, aplicativo React Native/Expo que traduz o preço de uma compra em horas de trabalho e comparações cotidianas. Preservei sua arquitetura mobile-first, offline-first e sem backend.

Repositório: [Quanto-Custa-na-Vida-Real](https://github.com/hlfreinoso/Quanto-Custa-na-Vida-Real). Os [artefatos da Unidade III](https://github.com/hlfreinoso/Quanto-Custa-na-Vida-Real/tree/main/docs/academic/unidade-3-testes-integracao) estão na `main`, após integração do [PR #5](https://github.com/hlfreinoso/Quanto-Custa-na-Vida-Real/pull/5) autorizada pelo autor.

O cenário escolhido foi **Home → Onboarding → persistência local → Calculadora → core de cálculos → Resultado**, incluindo retorno com perfil salvo, novo comparativo e alteração/reutilização de preferências. Antes de editar, executei os testes existentes: 31 aprovados e verificação de tipos sem erros.

O **Prompt A**, funcional e orientado a contratos, utilizou **zero-shot**, com requisitos, código real e interface do ambiente de testes, sem exemplos prontos de testes. A V1 produziu seis métodos/12 casos, com sete aprovados no produto original. A análise revelou ausência de edição/reutilização de perfil e uma expectativa parcialmente calculada pela própria função testada. A V2 pediu oráculos aritméticos independentes e maior foco nos fluxos funcionais: seis casos aprovados. Sua cobertura de decisões passou de 61/82 para 62/82, no mesmo código original. A redução do número de casos não indica perda automática de qualidade, pois o recorte mudou.

O **Prompt B**, negativo e de limites, utilizou **few-shot**, com exemplos documentados de compra vazia, IDs repetidos/desconhecidos e renda inválida. B V1 gerou 18 casos, com 13 aprovados. B V2 ampliou parâmetros ausentes, retorno após erro e separação das falhas do armazenamento: 25 casos e cobertura de decisões de 72/82, frente a 62/82 em V1. Entretanto, três casos refinados tinham um erro de preparação: confundiam elementos internos do checkbox com seleção. Corrigi somente o Arrange, preservando assertions e resposta original; B V2 passou de 17/25 para 20/25 ainda no produto original.

As falhas restantes reproduziram duas causas no produto: renda inválida persistida pelo onboarding, confirmando a lacuna LAC-01 já documentada, e ausência do estado acessível dos checkboxes no alvo web. Após correções pequenas e separadas no onboarding, os **61 casos gerados passaram**. A suíte geral ficou em **93/93**, somando os 31 originais e um smoke de infraestrutura, com 99,21% de statements e 96,59% de ramos no recorte instrumentado. Typecheck e build Expo web também passaram.

As quatro gerações foram chamadas reais em sessões independentes via Codex CLI, com o modelo configurado **gpt-6.1-sol**. Prompts, respostas, eventos, hashes, intervenções e relatórios antes/depois estão preservados. Telas, storage do aplicativo e core são reais no Vitest; apenas fronteiras nativas de AsyncStorage e roteamento são simuladas. Um smoke separado utilizou o build web real, sem ser contado como execução nativa Android/iOS.

A e B se complementaram: A verificou continuidade dos fluxos e dados; B ampliou fronteiras e falhas. Maior volume ou aprovação não prova superioridade: A V2 passou no produto original enquanto outros testes ainda demonstravam defeitos. Houve uma geração por versão, com objetivos e instruções diferentes, portanto sem generalização estatística. A IA apoiou a produção dos testes, mas não eliminou a necessidade de conferir oráculos, diagnosticar falhas e revisar o código gerado. A revisão humana continua essencial.
