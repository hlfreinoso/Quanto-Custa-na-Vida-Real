# Quanto custa na vida real

Aplicativo mobile que transforma o preço de uma compra em comparações simples e concretas, como horas do trabalho do usuário, meses de Netflix, cafés, bombons, gasolina e outros itens tangíveis do dia a dia.

## Descrição

O projeto tem como proposta ajudar o usuário a entender o custo real de uma compra antes de decidir se ela faz sentido. Em vez de mostrar apenas o valor em reais, o app traduz o preço para equivalências mais fáceis de sentir na vida real.

Exemplo de resultado esperado:

```text
Essa compra custa:
52 horas do seu trabalho
6 meses de Netflix
180 cafés
250 bombons
```

O MVP é mobile-first, offline-first e sem backend. A aplicação funciona com dados locais, sem login obrigatório.

## Objetivos

- Validar se a experiência de comparar compras com horas de trabalho e itens cotidianos é útil.
- Criar um protótipo navegável com fluxo simples: início, onboarding, calculadora e resultado.
- Manter as regras principais em um pacote testável e independente da interface.
- Trabalhar em etapas pequenas, com histórico de commits claro.
- Construir a base do projeto com testes automatizados desde o início.
- Preparar o projeto para evoluir futuramente para histórico, compartilhamento nativo, premium e analytics.

## Arquitetura

A arquitetura atual segue uma divisão simples em camadas:

```text
Interface mobile
  apps/mobile
  Telas, navegação, storage local e integrações nativas

Core
  packages/core
  Cálculos, comparações, modelos e validações puras

UI compartilhada
  packages/ui
  Componentes reutilizáveis quando fizer sentido

Documentação
  docs
  Produto, arquitetura, testes, roadmap, monetização, analytics e fluxogramas
```

Princípios do MVP:

- mobile-first;
- offline-first;
- sem backend;
- sem login obrigatório;
- cálculos locais;
- preferências locais;
- equivalências locais;
- testes no core antes de expandir comportamento.

Mais detalhes:

- [docs/architecture.md](docs/architecture.md)
- [docs/flowchart.md](docs/flowchart.md)

## Tecnologias

- React Native
- Expo
- Expo Router
- TypeScript
- AsyncStorage no protótipo
- Vitest
- Mermaid para fluxogramas em Markdown
- Makefile como atalho opcional para comandos comuns

Tecnologias planejadas para fases futuras:

- Expo SQLite
- RevenueCat
- PostHog
- Sentry
- react-native-view-shot
- expo-sharing

## Estrutura de Pastas

```text
apps/
  mobile/
    src/
      app/
      screens/
      storage/

packages/
  core/
    src/
      calculations/
      comparisons/
      models/
  ui/

docs/
  analytics.md
  architecture.md
  ai-usage.md
  flowchart.md
  monetization.md
  product.md
  roadmap.md
  testing.md
```

Responsabilidades principais:

- `apps/mobile`: app Expo, telas, rotas e persistência local.
- `packages/core`: regras puras e testáveis, sem dependência de React Native ou Expo.
- `packages/ui`: espaço para componentes compartilhados.
- `docs`: documentação funcional, técnica e de produto.

## Como Executar

### Pré-requisitos

- Git
- Node.js LTS
- npm
- Expo Go no celular, se for testar em dispositivo físico

### 1. Clonar o repositório

```bash
git clone https://github.com/hlfreinoso/Quanto-Custa-na-Vida-Real
cd Quanto-Custa-na-Vida-Real
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Rodar no celular com Expo

```bash
npm run dev:mobile
```

Depois, leia o QR Code com o Expo Go.

### 4. Rodar no navegador

```bash
npm run web:mobile
```

Abra:

```text
http://localhost:8081
```

### Atalhos com Makefile

O projeto também possui um `Makefile`:

```bash
make install
make dev
make web
make test
make typecheck
make validate
```

No Windows, caso `make` não esteja instalado, use os comandos `npm` diretamente.

## Como Usar o App

1. Abra a tela inicial.
2. Toque em `Iniciar`.
3. No primeiro uso, informe a renda mensal líquida.
4. Escolha preferências de comparação, se quiser.
5. Toque em `Continuar`.
6. Informe o nome do produto e o preço.
7. Toque em `Calcular custo real`.
8. Veja o resultado com horas do trabalho e comparações sorteadas.

Se o perfil inicial já estiver salvo, o botão `Iniciar` pula o onboarding e abre direto a calculadora.

## Testes

Comandos principais:

```bash
npm test
npm run typecheck
```

Atalho equivalente:

```bash
make validate
```

Cobertura atual:

- cálculo de valor-hora;
- cálculo de horas equivalentes;
- cálculo básico de impacto;
- validações de entradas zeradas, negativas e não finitas;
- lista padrão de comparações;
- seleção aleatória e limitada de comparações;
- fallback quando o usuário escolhe poucas preferências;
- rejeição de preço unitário inválido;
- persistência inicial com AsyncStorage;
- falhas de leitura e JSON inválido no storage.

Ainda não coberto:

- componentes React Native;
- navegação Expo Router;
- fluxo visual completo de onboarding até resultado;
- testes end-to-end.

Mais detalhes:

- [docs/testing.md](docs/testing.md)

## Uso de IA

A IA foi usada como apoio durante várias etapas do projeto.

Primeiro, foi usada para dialogar com o GPT e definir qual projeto seria desenvolvido. Depois, foi usada para extrair os requisitos do MVP a partir dos materiais fornecidos pela universidade.

Em seguida, a IA ajudou a definir a arquitetura do projeto, incluindo a decisão por uma abordagem mobile-first, offline-first e sem backend no MVP. Também foi usada para construir arquivos de instrução e prompts de execução que guiaram o desenvolvimento.

Depois disso, o Codex foi usado para auxiliar na criação da estrutura do repositório, configuração do projeto, escrita de testes, documentação, ajustes de dependências, correção de textos, implementação das telas iniciais e desenvolvimento incremental da aplicação.

Mais detalhes:

- [docs/ai-usage.md](docs/ai-usage.md)

## Limitações

- O app ainda é um protótipo em evolução.
- Não há backend, login ou sincronização entre dispositivos.
- O histórico local ainda não foi implementado.
- O compartilhamento de card como imagem ainda não foi implementado.
- A monetização ainda não foi implementada.
- Os valores de referência das comparações são locais e fixos.
- Ainda não há testes automatizados para componentes React Native e navegação.
- O lint ainda é um placeholder no `package.json`.

## Próximos Passos

- Adicionar testes de UI com React Native Testing Library.
- Melhorar validações e máscaras de entrada monetária.
- Implementar histórico local.
- Implementar geração de card compartilhável.
- Implementar compartilhamento nativo.
- Adicionar tela de configurações.
- Evoluir AsyncStorage para SQLite no MVP publicável.
- Integrar analytics e crash reporting.
- Avaliar premium com RevenueCat.

Mais detalhes:

- [docs/roadmap.md](docs/roadmap.md)

## Versionamento

O projeto usa Git com commits pequenos e incrementais.

Padrão de mensagem:

```text
<tipo>(escopo): <descricao>
```

Exemplos:

```text
feat(calculator): show preference comparisons
test: cover edge cases and storage failures
docs(project): add makefile and flowcharts
```

Tipos usados até aqui:

- `feat`: nova funcionalidade;
- `fix`: correção;
- `test`: testes;
- `docs`: documentação;
- `chore`: tarefas de manutenção.

## Licença

A licença ainda não foi definida formalmente. Até que um arquivo `LICENSE` seja adicionado, o projeto deve ser tratado como código proprietário/acadêmico sem permissão explícita de reutilização por terceiros.
