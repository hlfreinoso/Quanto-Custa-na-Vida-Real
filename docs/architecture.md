# Arquitetura

## Decisoes Principais

- Mobile-first.
- Offline-first.
- Sem backend no MVP.
- Sem login obrigatorio.
- Calculos locais.
- Persistencia local para perfil e preferencias.
- Cards gerados localmente.
- Compartilhamento nativo.

## Camadas

```text
Interface
  Screens, components e navegacao

Dominio/Core
  Calculos, comparacoes, score, insights e validacoes puras

Persistencia
  InitialProfileStorage no prototipo
  ProfileStorage, HistoryStorage, SettingsStorage e UsageStorage no MVP

Integracoes
  RevenueCat, PostHog, Sentry e compartilhamento nativo
```

## Regra Para o Core

`packages/core` nao pode depender de React Native, Expo, SQLite, RevenueCat, PostHog, Sentry ou APIs nativas.

## Backend

Backend fica fora do MVP. Supabase ou outra camada remota so deve ser considerada apos validacao do produto.

## Fluxo Mobile Atual

```text
Home
  -> Iniciar
    -> Onboarding, se perfil/preferencias ainda nao existem
    -> Calculator, se perfil/preferencias ja existem

Onboarding
  -> salva renda mensal e preferencias no AsyncStorage
  -> Calculator

Calculator
  -> coleta produto e preco
  -> Result

Result
  -> mostra horas do trabalho e comparacoes sorteadas
  -> Novo comparativo
  -> Mudar preferencias
```

## Testes

O `packages/core` e a fonte de verdade das regras testaveis. Telas e navegacao ainda nao possuem testes automatizados dedicados.

Cobertura atual:

- calculos puros;
- validacoes basicas;
- base local de comparacoes;
- selecao aleatoria/limitada de comparacoes.

Lacunas conhecidas:

- testes de componentes React Native;
- testes de navegacao Expo Router;
- testes de AsyncStorage.
