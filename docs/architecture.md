# Arquitetura

## Decisões Principais

- Mobile-first.
- Offline-first.
- Sem backend no MVP.
- Sem login obrigatório.
- Cálculos locais.
- Persistência local para perfil e preferências.
- Cards gerados localmente.
- Compartilhamento nativo.

## Tecnologias

- React Native.
- Expo.
- Expo Router.
- TypeScript.
- AsyncStorage no protótipo.
- Vitest.
- Mermaid para fluxogramas.
- Expo SQLite, PostHog e Sentry em fases futuras.

## Camadas

```text
Interface
  Screens, components e navegação

Domínio/Core
  Cálculos, comparações, score, insights e validações puras

Persistência
  InitialProfileStorage no protótipo
  ProfileStorage, HistoryStorage, SettingsStorage e UsageStorage no MVP

Integrações
  PostHog, Sentry e compartilhamento nativo
```

## Regra Para o Core

`packages/core` não pode depender de React Native, Expo, SQLite, PostHog, Sentry ou APIs nativas.

## Backend

Backend fica fora do MVP. Supabase ou outra camada remota só deve ser considerada após validação do produto.

## Fluxo Mobile Atual

```text
Home
  -> Iniciar
    -> Onboarding, se perfil/preferências ainda não existem
    -> Calculator, se perfil/preferências já existem

Onboarding
  -> salva renda mensal e preferências no AsyncStorage
  -> Calculator

Calculator
  -> coleta produto e preço
  -> Result

Result
  -> mostra horas do trabalho e comparações sorteadas
  -> Novo comparativo
  -> Mudar preferências
```

Para diagramas Mermaid do fluxo, veja [flowchart.md](flowchart.md).

## Testes

O `packages/core` é a fonte de verdade das regras testáveis. A Unidade III acrescenta testes de integração das telas compartilhadas com storage e core reais, renderizadas na implementação React Native Web; somente fronteiras de AsyncStorage e Expo Router recebem adapters no Vitest. [Metodologia e limites](academic/unidade-3-testes-integracao/metodologia.md).

Cobertura atual:

- cálculos puros;
- validações de caminho feliz, bordas e falhas;
- base local de comparações;
- seleção aleatória/limitada de comparações;
- persistência inicial em AsyncStorage.

Lacunas conhecidas:

- renderização nativa Android/iOS;
- navegação Expo Router em dispositivo;
- testes end-to-end nativos.
