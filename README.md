# Quanto custa na vida real

Aplicativo mobile para transformar valores monetarios em comparacoes reais da vida do usuario: horas de trabalho, dias de trabalho, percentual da renda, impacto mensal/anual e equivalencias do cotidiano.

## Instalar e Rodar

Estas instrucoes partem de uma maquina limpa.

### Pre-requisitos

- Git
- Node.js LTS
- npm

### 1. Clonar o repositorio

```bash
git clone <url-do-repositorio>
cd Quanto-Custa-na-Vida-Real
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Validar a estrutura atual

```bash
npm test
npm run lint
```

## Escopo do MVP

O MVP deve ser mobile-first, offline-first e sem backend. O app deve funcionar sem login para os calculos principais, usando dados locais e compartilhamento nativo.

Foco inicial:

- calculo local de impacto financeiro;
- perfil financeiro local;
- historico local;
- equivalencias locais;
- geracao local de card/imagem;
- compartilhamento nativo;
- premium via compra in-app em fase publicavel;
- analytics e crash reporting externos.

Fora do MVP:

- backend proprio;
- login obrigatorio;
- sincronizacao entre dispositivos;
- IA generativa;
- OCR;
- scraping;
- integracao bancaria;
- controle financeiro completo.

## Stack Alvo

- React Native
- Expo
- TypeScript
- Expo Router
- Zustand
- Expo SQLite
- RevenueCat
- PostHog
- Sentry
- react-native-view-shot
- expo-sharing
- expo-media-library

## Estrutura

```text
apps/
  mobile/
    src/
packages/
  core/
    src/
  ui/
    src/
docs/
```

## Camadas

- `packages/core`: regras puras e testaveis, sem dependencia de React Native ou Expo.
- `apps/mobile`: telas, navegacao, storage local e integracoes nativas.
- `packages/ui`: componentes compartilhaveis quando fizer sentido.
- `docs`: produto, arquitetura, roadmap, monetizacao e analytics.

## Como Comecar

Este commit inicial contem apenas a estrutura base do projeto. As dependencias e funcionalidades serao adicionadas em tarefas separadas, com commits pequenos e Conventional Commits.

## Regras de Commit

Formato:

```text
<tipo>(escopo): <descricao>
```

Exemplo:

```text
chore(project): create initial monorepo structure
```
