# Quanto custa na vida real

Aplicativo mobile que transforma o preco de uma compra em comparacoes simples e concretas, como horas do trabalho do usuario, meses de Netflix, cafes, bombons, gasolina e outros itens tangiveis do dia a dia.

## Descricao

O projeto tem como proposta ajudar o usuario a entender o custo real de uma compra antes de decidir se ela faz sentido. Em vez de mostrar apenas o valor em reais, o app traduz o preco para equivalencias mais faceis de sentir na vida real.

Exemplo de resultado esperado:

```text
Essa compra custa:
52 horas do seu trabalho
6 meses de Netflix
180 cafes
250 bombons
```

O MVP e mobile-first, offline-first e sem backend. A aplicacao funciona com dados locais, sem login obrigatorio.

## Objetivos

- Validar se a experiencia de comparar compras com horas de trabalho e itens cotidianos e util.
- Criar um prototipo navegavel com fluxo simples: inicio, onboarding, calculadora e resultado.
- Manter as regras principais em um pacote testavel e independente da interface.
- Trabalhar em etapas pequenas, com historico de commits claro.
- Construir a base do projeto com testes automatizados desde o inicio.
- Preparar o projeto para evoluir futuramente para historico, compartilhamento nativo, premium e analytics.

## Arquitetura

A arquitetura atual segue uma divisao simples em camadas:

```text
Interface mobile
  apps/mobile
  Telas, navegacao, storage local e integracoes nativas

Core
  packages/core
  Calculos, comparacoes, modelos e validacoes puras

UI compartilhada
  packages/ui
  Componentes reutilizaveis quando fizer sentido

Documentacao
  docs
  Produto, arquitetura, testes, roadmap, monetizacao, analytics e fluxogramas
```

Principios do MVP:

- mobile-first;
- offline-first;
- sem backend;
- sem login obrigatorio;
- calculos locais;
- preferencias locais;
- equivalencias locais;
- testes no core antes de expandir comportamento.

Mais detalhes:

- [docs/architecture.md](docs/architecture.md)
- [docs/flowchart.md](docs/flowchart.md)

## Tecnologias

- React Native
- Expo
- Expo Router
- TypeScript
- AsyncStorage no prototipo
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

- `apps/mobile`: app Expo, telas, rotas e persistencia local.
- `packages/core`: regras puras e testaveis, sem dependencia de React Native ou Expo.
- `packages/ui`: espaco para componentes compartilhados.
- `docs`: documentacao funcional, tecnica e de produto.

## Como Executar

### Pre-requisitos

- Git
- Node.js LTS
- npm
- Expo Go no celular, se for testar em dispositivo fisico

### 1. Clonar o repositorio

```bash
git clone <url-do-repositorio>
cd Quanto-Custa-na-Vida-Real
```

### 2. Instalar dependencias

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

O projeto tambem possui um `Makefile`:

```bash
make install
make dev
make web
make test
make typecheck
make validate
```

No Windows, caso `make` nao esteja instalado, use os comandos `npm` diretamente.

## Como Usar o App

1. Abra a tela inicial.
2. Toque em `Iniciar`.
3. No primeiro uso, informe a renda mensal liquida.
4. Escolha preferencias de comparacao, se quiser.
5. Toque em `Continuar`.
6. Informe o nome do produto e o preco.
7. Toque em `Calcular custo real`.
8. Veja o resultado com horas do trabalho e comparacoes sorteadas.

Se o perfil inicial ja estiver salvo, o botao `Iniciar` pula o onboarding e abre direto a calculadora.

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

- calculo de valor-hora;
- calculo de horas equivalentes;
- calculo basico de impacto;
- validacoes de entradas zeradas, negativas e nao finitas;
- lista padrao de comparacoes;
- selecao aleatoria e limitada de comparacoes;
- fallback quando o usuario escolhe poucas preferencias;
- rejeicao de preco unitario invalido;
- persistencia inicial com AsyncStorage;
- falhas de leitura e JSON invalido no storage.

Ainda nao coberto:

- componentes React Native;
- navegacao Expo Router;
- fluxo visual completo de onboarding ate resultado;
- testes end-to-end.

Mais detalhes:

- [docs/testing.md](docs/testing.md)

## Uso de IA

A IA foi usada como apoio durante varias etapas do projeto.

Primeiro, foi usada para dialogar com o GPT e definir qual projeto seria desenvolvido. Depois, foi usada para extrair os requisitos do MVP a partir dos materiais fornecidos pela universidade.

Em seguida, a IA ajudou a definir a arquitetura do projeto, incluindo a decisao por uma abordagem mobile-first, offline-first e sem backend no MVP. Tambem foi usada para construir arquivos de instrucao e prompts de execucao que guiaram o desenvolvimento.

Depois disso, o Codex foi usado para auxiliar na criacao da estrutura do repositorio, configuracao do projeto, escrita de testes, documentacao, ajustes de dependencias, correcao de textos, implementacao das telas iniciais e desenvolvimento incremental da aplicacao.

Mais detalhes:

- [docs/ai-usage.md](docs/ai-usage.md)

## Limitacoes

- O app ainda e um prototipo em evolucao.
- Nao ha backend, login ou sincronizacao entre dispositivos.
- O historico local ainda nao foi implementado.
- O compartilhamento de card como imagem ainda nao foi implementado.
- A monetizacao ainda nao foi implementada.
- Os valores de referencia das comparacoes sao locais e fixos.
- Ainda nao ha testes automatizados para componentes React Native e navegacao.
- O lint ainda e um placeholder no `package.json`.

## Proximos Passos

- Adicionar testes de UI com React Native Testing Library.
- Melhorar validacoes e mascaras de entrada monetaria.
- Implementar historico local.
- Implementar geracao de card compartilhavel.
- Implementar compartilhamento nativo.
- Adicionar tela de configuracoes.
- Evoluir AsyncStorage para SQLite no MVP publicavel.
- Integrar analytics e crash reporting.
- Avaliar premium com RevenueCat.

Mais detalhes:

- [docs/roadmap.md](docs/roadmap.md)

## Versionamento

O projeto usa Git com commits pequenos e incrementais.

Padrao de mensagem:

```text
<tipo>(escopo): <descricao>
```

Exemplos:

```text
feat(calculator): show preference comparisons
test: cover edge cases and storage failures
docs(project): add makefile and flowcharts
```

Tipos usados ate aqui:

- `feat`: nova funcionalidade;
- `fix`: correcao;
- `test`: testes;
- `docs`: documentacao;
- `chore`: tarefas de manutencao.

## Licenca

A licenca ainda nao foi definida formalmente. Ate que um arquivo `LICENSE` seja adicionado, o projeto deve ser tratado como codigo proprietario/academico sem permissao explicita de reutilizacao por terceiros.
