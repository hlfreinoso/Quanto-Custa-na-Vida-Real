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

## Diagnóstico de falha no laboratório de DevOps

No [PR do Módulo 14](https://github.com/hlfreinoso/Quanto-Custa-na-Vida-Real/pull/6), a expressão `amount / hourlyRate` foi invertida de propósito. Com um preço de R$ 299,90 e uma taxa de aproximadamente R$ 25,57 por hora, dois testes do Vitest acusaram `0,085256` no lugar de aproximadamente `11,729` horas.

O Codex cruzou as asserções do log com o diff da função. A conferência da fórmula confirmou que dividir reais pela taxa em reais por hora dá o resultado em horas. A expressão invertida calcula o recíproco. A correção restaura a ordem dos operandos e mantém as asserções originais.

O caso ilustra como a IA ajuda a ligar duas falhas de teste a uma única linha. O log mostra o valor divergente. A validação exige conferir a fórmula contra a regra de negócio e rodar novamente a mesma suíte. O diagnóstico foi feito manualmente com o Codex.

## Responsabilidade Humana

A IA atuou como ferramenta de apoio. As decisões de produto, validação dos requisitos, direção das etapas, aceite das mudanças e revisão final permanecem sob responsabilidade humana.

## Limites do Uso

A IA não substitui:

- validação com usuários reais;
- revisão técnica independente;
- testes manuais em dispositivos físicos;
- avaliação acadêmica;
- verificação jurídica sobre licença, privacidade e termos de uso.
