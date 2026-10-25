# Uso de IA

Este projeto utilizou IA como apoio de planejamento, organização e desenvolvimento assistido.

## Etapas com Apoio de IA

1. Definição inicial do projeto por meio de diálogo com o GPT.
2. Extração dos requisitos do MVP a partir dos materiais fornecidos pela universidade.
3. Definição da arquitetura do projeto, incluindo a escolha por mobile-first, offline-first e sem backend no MVP.
4. Criação de arquivos de instrução e prompts de execução para orientar o desenvolvimento.
5. Desenvolvimento assistido com Codex para criar estrutura do repositório, testes, documentação e partes da aplicação.

## Papel do Codex

O Codex foi usado para:

- criar a estrutura inicial do monorepo;
- configurar scripts e dependências;
- implementar o core de cálculos e comparações;
- adicionar testes automatizados;
- revisar e ampliar testes com casos de borda e falha;
- criar e revisar documentação;
- ajustar compatibilidade com Expo Go;
- implementar telas iniciais do app;
- organizar commits pequenos por etapa.

## Atividade Unidade III — integração

Em 25/10/2026, foram executados quatro prompts independentes via OpenAI/Codex CLI, modelo configurado gpt-6.1-sol, esforço medium: A V1/V2 funcional zero-shot e B V1/V2 negativo few-shot. Contexto: requisitos, código real das quatro telas, storage/core e interface do harness. [Prompts, respostas originais, IDs de sessão, tokens, hashes e relatórios](academic/unidade-3-testes-integracao/README.md).

As primeiras saídas foram executadas antes de refinar os prompts e antes de corrigir produção. Os 61 casos revelaram duas causas de falha no produto (uma já registrada na especificação) e um erro na preparação de três casos B V2. Essa preparação foi corrigida pelo agente coordenador, com resposta original preservada e sem alteração de assertions, verificada por AST. Depois foram corrigidas validação de renda e semântica web de checkbox no onboarding, em alteração separada. Não houve substituição da arquitetura, geração de um backend fictício ou uso de resultados de outro projeto.

As telas, serialização e core são reais nos testes; adapters nativos/roteamento isolam fronteiras. A conta/modelo de snapshot exato, temperatura e seed não foram expostos. O procedimento não demonstra execução em Android/iOS, produtividade humana medida ou superioridade universal de prompting. A análise e as intervenções foram coordenadas pela IA; a revisão humana do PR e da resposta acadêmica continuam pendentes. Não se atribui ao usuário uma revisão técnica manual que ainda não ocorreu.

## Responsabilidade Humana

A IA atuou como ferramenta de apoio. As decisões de produto, validação dos requisitos, direção das etapas, aceite das mudanças e revisão final permanecem sob responsabilidade humana.

## Limites do Uso

A IA não substitui:

- validação com usuários reais;
- revisão técnica independente;
- testes manuais em dispositivos físicos;
- avaliação acadêmica;
- verificação jurídica sobre licença, privacidade e termos de uso.
