# Arquitetura

## Decisoes Principais

- Mobile-first.
- Offline-first.
- Sem backend no MVP.
- Sem login obrigatorio.
- Calculos locais.
- Persistencia local.
- Cards gerados localmente.
- Compartilhamento nativo.

## Camadas

```text
Interface
  Screens, components e navegacao

Dominio/Core
  Calculos, comparacoes, score, insights e validacoes puras

Persistencia
  ProfileStorage, HistoryStorage, SettingsStorage e UsageStorage

Integracoes
  RevenueCat, PostHog, Sentry e compartilhamento nativo
```

## Regra Para o Core

`packages/core` nao pode depender de React Native, Expo, SQLite, RevenueCat, PostHog, Sentry ou APIs nativas.

## Backend

Backend fica fora do MVP. Supabase ou outra camada remota so deve ser considerada apos validacao do produto.
