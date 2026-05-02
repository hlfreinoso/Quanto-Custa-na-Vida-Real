# CONTEXT.md — Instruções para Agente de IA

## Aplicação: Vale o Pix? / Quanto Custa na Vida Real

Este documento define as instruções técnicas, arquiteturais e operacionais para agentes de IA que atuarão no desenvolvimento, revisão, refatoração, testes, documentação e evolução da aplicação **Vale o Pix?**, também referenciada como **Quanto Custa na Vida Real**.

A aplicação tem como objetivo converter valores monetários em comparações reais da vida do usuário, como horas de trabalho, dias de trabalho, percentual da renda, cafés, gasolina, streaming, refeições, delivery e impacto mensal/anual de gastos recorrentes.

O produto deve ser simples, visual, provocativo, compartilhável, mobile-first, offline-first e barato de operar.

---

## 1. Papel do agente

Você é um agente de IA responsável por auxiliar no desenvolvimento da aplicação **Quanto Custa na Vida Real**.

Sua função é atuar como um **copiloto técnico**, não como autor autônomo sem supervisão. Toda sugestão deve preservar a arquitetura definida, respeitar o escopo do MVP e manter o projeto simples, rápido, testável, barato de operar e com foco em viralidade.

Você deve ajudar em:

- desenvolvimento de funcionalidades;
- revisão de código;
- refatoração;
- criação de testes;
- documentação;
- organização de arquitetura;
- análise de riscos;
- sugestões de commits;
- preparação de releases;
- manutenção da coerência técnica do projeto.

Você não deve adicionar complexidade desnecessária ao produto.

---

## 2. Direcionamento principal do produto

### 2.1 O que o app é

O app é uma **calculadora de impacto financeiro pessoal**, com foco em transformar preços em comparações fáceis de entender e compartilhar.

Ele deve responder perguntas como:

```text
Quanto isso custa na minha vida real?
Quantas horas eu preciso trabalhar para pagar isso?
Esse valor representa quanto da minha renda?
Se esse gasto se repetir, quanto ele vira no mês ou no ano?
Vale o Pix?
```

### 2.2 O que o app não é

O app não deve se transformar em:

```text
- controle financeiro completo;
- app de orçamento mensal;
- app bancário;
- consultoria financeira;
- recomendador de investimentos;
- ferramenta contábil;
- sistema de gestão financeira robusto;
- app com IA pesada no MVP;
- app dependente de backend no MVP.
```

Sempre que uma solicitação caminhar para essas direções, o agente deve alertar que isso foge do escopo inicial e sugerir uma alternativa mais simples, compatível com o MVP.

---

## 3. Estratégia arquitetural obrigatória

### 3.1 Arquitetura do MVP

A arquitetura do MVP deve ser:

```text
Mobile-first
Offline-first
Sem backend no MVP
Cálculo local
Persistência local
Cards gerados localmente
Compartilhamento nativo
Premium via compra in-app
Analytics externo
Crash reporting externo
```

A aplicação deve funcionar sem login e sem internet para os cálculos principais.

Backend, sincronização, login, ranking público, referral, links públicos e atualização remota de referências só devem ser considerados em fases futuras.

### 3.2 Stack obrigatória do MVP

Use como referência principal:

```text
React Native
Expo
TypeScript
Expo Router
Zustand
Expo SQLite
RevenueCat
PostHog
Sentry
react-native-view-shot
expo-sharing
expo-media-library
```

### 3.3 Decisões arquiteturais

Respeite as seguintes decisões:

```text
- Não criar backend no MVP.
- Não criar login no MVP.
- Não usar IA generativa dentro do app no MVP.
- Não fazer scraping de preços.
- Não fazer integração bancária.
- Não implementar OCR no MVP.
- Não sincronizar histórico entre dispositivos no MVP.
- Não criar dashboard administrativo no MVP.
- Não criar marketplace ou comunidade no MVP.
```

Esses itens podem ser documentados como evolução futura, mas não devem ser implementados na primeira versão.

---

## 4. Estrutura de repositório

O projeto deve ser organizado como monorepo simples, mesmo que inicialmente exista apenas o app mobile.

Estrutura recomendada:

```text
vale-o-pix/
  apps/
    mobile/
  packages/
    core/
    ui/
  docs/
```

### 4.1 Estrutura detalhada

```text
vale-o-pix/
  apps/
    mobile/
      src/
        app/
        screens/
        components/
        services/
        domain/
        storage/
        data/
        hooks/
        utils/
        theme/
        analytics/
        billing/
        sharing/

  packages/
    core/
      src/
        calculations/
        comparisons/
        scoring/
        insights/
        formatting/
        validators/

    ui/
      src/
        components/
        theme/

  docs/
    product.md
    architecture.md
    roadmap.md
    monetization.md
    analytics.md
```

### 4.2 Regra sobre `packages/core`

O pacote `packages/core` deve conter toda lógica pura e reutilizável:

```text
- cálculos financeiros;
- cálculo de equivalências;
- score de impacto;
- geração de frases;
- formatação de números;
- validações puras.
```

Esse pacote **não deve depender de React Native, Expo, AsyncStorage, SQLite, RevenueCat, PostHog, Sentry ou qualquer API nativa**.

A lógica em `packages/core` deve ser testável de forma isolada.

---

## 5. Estrutura interna do app mobile

Dentro de `apps/mobile/src`, use a seguinte organização:

```text
src/
  app/
    _layout.tsx
    index.tsx
    onboarding.tsx
    calculator.tsx
    result.tsx
    share.tsx
    history.tsx
    settings.tsx
    premium.tsx

  screens/
    onboarding/
      OnboardingScreen.tsx
    calculator/
      CalculatorScreen.tsx
    result/
      ResultScreen.tsx
    share/
      ShareCardScreen.tsx
    history/
      HistoryScreen.tsx
    settings/
      SettingsScreen.tsx
    premium/
      PremiumScreen.tsx

  components/
    AppButton.tsx
    MoneyInput.tsx
    NumberInput.tsx
    CategorySelector.tsx
    FrequencySelector.tsx
    ResultSummaryCard.tsx
    ComparisonItemCard.tsx
    ImpactScoreBadge.tsx
    ShareCardPreview.tsx
    PremiumBadge.tsx

  domain/
    models/
      UserFinancialProfile.ts
      ExpenseInput.ts
      ExpenseResult.ts
      ComparisonItem.ts
      ComparisonResult.ts
      GeneratedInsight.ts
      ShareCardTemplate.ts
      UsageLimit.ts

  services/
    CalculationService.ts
    ComparisonService.ts
    ImpactScoreService.ts
    InsightService.ts
    ShareCardService.ts
    UsageLimitService.ts

  storage/
    ProfileStorage.ts
    HistoryStorage.ts
    SettingsStorage.ts
    UsageStorage.ts

  data/
    defaultComparisonItems.ts
    defaultCardTemplates.ts
    defaultPhrases.ts
    defaultSettings.ts

  analytics/
    AnalyticsService.ts
    events.ts

  billing/
    BillingService.ts
    entitlements.ts

  sharing/
    NativeShareService.ts

  hooks/
    useFinancialProfile.ts
    useCalculation.ts
    useUsageLimit.ts
    usePremium.ts

  utils/
    currency.ts
    date.ts
    number.ts
    validators.ts

  theme/
    colors.ts
    spacing.ts
    typography.ts
```

---

## 6. Separação de responsabilidades

### 6.1 Interface

A camada de interface contém telas e componentes.

Exemplos:

```text
CalculatorScreen
ResultScreen
ShareCardScreen
HistoryScreen
SettingsScreen
PremiumScreen
```

Regras:

```text
- Telas não devem conter regra de cálculo.
- Telas não devem acessar SQLite diretamente.
- Telas não devem chamar RevenueCat diretamente.
- Telas não devem chamar PostHog diretamente.
- Telas devem chamar hooks ou services.
- Componentes devem ser reutilizáveis e simples.
```

### 6.2 Domínio

A camada de domínio contém modelos e tipos centrais.

Exemplos:

```text
UserFinancialProfile
ExpenseInput
ExpenseResult
ComparisonItem
GeneratedInsight
ShareCardTemplate
```

Regras:

```text
- Modelos devem ser claros e tipados.
- Evitar tipos genéricos como any.
- Evitar strings soltas para domínios fechados; preferir union types.
- Modelos não devem depender de UI.
```

### 6.3 Serviços

A camada de serviços contém a lógica de negócio.

Serviços obrigatórios:

```text
CalculationService
ComparisonService
ImpactScoreService
InsightService
ShareCardService
UsageLimitService
```

Regras:

```text
- Serviços recebem dados e retornam resultados.
- Serviços não devem renderizar UI.
- Serviços não devem misturar persistência com cálculo.
- Serviços não devem misturar analytics com regra central.
- Serviços devem ser testáveis.
```

### 6.4 Persistência

A camada de persistência salva e carrega dados locais.

Storages obrigatórios:

```text
ProfileStorage
HistoryStorage
SettingsStorage
UsageStorage
```

Regras:

```text
- Nenhuma tela deve acessar SQLite/AsyncStorage diretamente.
- Toda persistência deve passar por classes storage.
- Dados persistidos devem ter versão ou estratégia de migração quando necessário.
- Histórico deve ser local no MVP.
```

### 6.5 Integrações externas

Integrações externas devem ficar isoladas.

```text
BillingService      -> RevenueCat
AnalyticsService    -> PostHog ou Firebase Analytics
NativeShareService  -> expo-sharing
ShareCardService    -> react-native-view-shot
CrashService        -> Sentry
```

Regras:

```text
- Não espalhar chamadas de bibliotecas externas pela aplicação.
- Encapsular cada integração.
- Facilitar troca futura da ferramenta.
```

---

## 7. Funcionalidades obrigatórias do MVP

O MVP deve entregar:

```text
- onboarding simples;
- cadastro rápido de perfil financeiro;
- uso sem informar renda;
- cálculo usando referência padrão;
- entrada de valor da compra;
- nome da compra;
- categoria da compra;
- frequência do gasto;
- cálculo de compra única;
- cálculo de gasto recorrente;
- cálculo de parcelamento;
- cálculo de horas de trabalho;
- cálculo de dias de trabalho;
- cálculo de percentual da renda;
- cálculo de impacto mensal;
- cálculo de impacto anual;
- cálculo de equivalências;
- score de impacto;
- geração de frases;
- tela de resultado;
- geração de card compartilhável;
- compartilhamento como imagem;
- compartilhamento como texto;
- histórico local;
- limite gratuito;
- tela premium;
- liberação premium via RevenueCat;
- analytics básico;
- crash reporting.
```

---

## 8. Funcionalidades proibidas no MVP

Não implementar no MVP:

```text
- login;
- cadastro obrigatório;
- backend próprio;
- Supabase em produção;
- sincronização entre dispositivos;
- links públicos de compartilhamento;
- OCR;
- leitura de nota fiscal;
- scraping de marketplace;
- integração bancária;
- controle financeiro completo;
- orçamento mensal;
- recomendação de investimento;
- IA generativa dentro do app;
- ranking público;
- comunidade;
- gamificação complexa;
- push notifications complexas;
- painel administrativo.
```

Se o usuário pedir uma dessas funcionalidades, o agente deve responder com a recomendação técnica de adiar para fase futura e, se possível, propor uma alternativa local e simples.

---

## 9. Modelos de domínio obrigatórios

### 9.1 UserFinancialProfile

```ts
export interface UserFinancialProfile {
  id?: string;
  monthlyIncome: number;
  workHoursPerDay: number;
  workDaysPerMonth: number;
  currency: "BRL";
  createdAt?: string;
  updatedAt?: string;
}
```

Regras:

```text
- monthlyIncome deve ser maior que zero quando informado.
- workHoursPerDay deve ser maior que zero.
- workDaysPerMonth deve ser maior que zero.
- Se o usuário não informar renda, usar perfil padrão configurável.
```

### 9.2 ExpenseInput

```ts
export type ExpenseFrequency =
  | "once"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly";

export interface ExpenseInput {
  name?: string;
  amount: number;
  category?: string;
  frequency: ExpenseFrequency;
  installments?: number;
  installmentAmount?: number;
  isNeed?: boolean;
  isImpulse?: boolean;
}
```

Regras:

```text
- amount deve ser maior que zero.
- frequency deve ser obrigatória.
- installments deve ser maior que zero quando informado.
- installmentAmount deve ser maior que zero quando informado.
- Se houver parcelamento, calcular valor total e impacto mensal.
```

### 9.3 ExpenseResult

```ts
export interface ExpenseResult {
  hourlyRate: number;
  workHoursEquivalent: number;
  workDaysEquivalent: number;
  incomePercentage: number;
  monthlyImpact: number;
  yearlyImpact: number;
  impactScore: number;
  impactClassification: ImpactClassification;
}
```

### 9.4 ComparisonItem

```ts
export interface ComparisonItem {
  id: string;
  name: string;
  unitPrice: number;
  unitLabel: string;
  category: string;
  active: boolean;
  country: "BR";
  currency: "BRL";
  isPremium?: boolean;
}
```

### 9.5 ComparisonResult

```ts
export interface ComparisonResult {
  id: string;
  name: string;
  quantity: number;
  unitLabel: string;
  text: string;
  isPremium?: boolean;
}
```

### 9.6 GeneratedInsight

```ts
export type InsightTone =
  | "neutral"
  | "funny"
  | "provocative"
  | "educational"
  | "motivational";

export interface GeneratedInsight {
  id: string;
  type:
    | "work_hours"
    | "work_days"
    | "income_percentage"
    | "recurring_impact"
    | "comparison"
    | "impact_score";

  title: string;
  value?: number;
  text: string;
  tone: InsightTone;
}
```

### 9.7 ShareCardTemplate

```ts
export interface ShareCardTemplate {
  id: string;
  name: string;
  format: "square" | "story";
  tone: InsightTone;
  isPremium: boolean;
}
```

---

## 10. Motor de cálculo

O motor de cálculo é o coração da aplicação. Ele deve ficar em `packages/core` e ser utilizado pelo app mobile.

### 10.1 Cálculo do valor da hora

```text
horas_trabalhadas_mes = horas_por_dia * dias_trabalhados_mes
valor_hora = renda_mensal_liquida / horas_trabalhadas_mes
```

### 10.2 Horas necessárias

```text
horas_necessarias = valor_compra / valor_hora
```

### 10.3 Dias de trabalho

```text
dias_trabalho = horas_necessarias / horas_por_dia
```

### 10.4 Percentual da renda

```text
percentual_renda = valor_compra / renda_mensal_liquida * 100
```

### 10.5 Recorrência

```text
daily:
  monthlyImpact = amount * 30
  yearlyImpact = amount * 365

weekly:
  monthlyImpact = amount * 4.33
  yearlyImpact = amount * 52

monthly:
  monthlyImpact = amount
  yearlyImpact = amount * 12

yearly:
  monthlyImpact = amount / 12
  yearlyImpact = amount

once:
  monthlyImpact = amount
  yearlyImpact = amount
```

### 10.6 Parcelamento

```text
valor_total = valor_parcela * quantidade_parcelas
percentual_mensal = valor_parcela / renda_mensal * 100
```

### 10.7 Regras do CalculationService

```text
- Deve validar entradas.
- Deve impedir divisão por zero.
- Deve retornar erro controlado para renda inválida.
- Deve retornar erro controlado para horas inválidas.
- Deve retornar erro controlado para valor de compra inválido.
- Não deve acessar UI.
- Não deve acessar storage.
- Não deve enviar analytics.
- Não deve depender de React Native.
```

---

## 11. Score de impacto

O score deve variar de 0 a 100.

### 11.1 Faixas por percentual da renda

```text
até 1%       = 10 pontos
1% a 3%      = 20 pontos
3% a 5%      = 35 pontos
5% a 10%     = 50 pontos
10% a 20%    = 70 pontos
20% a 30%    = 85 pontos
acima de 30% = 100 pontos
```

### 11.2 Ajustes

```text
+10 pontos se for recorrente mensal
+15 pontos se for recorrente semanal
+20 pontos se for recorrente diário
+10 pontos se for parcelado em mais de 6 vezes
-10 pontos se o usuário marcou como necessidade
+10 pontos se o usuário marcou como impulso
```

### 11.3 Classificação

```text
0 a 20    = impacto muito baixo
21 a 40   = impacto baixo
41 a 60   = impacto moderado
61 a 80   = impacto alto
81 a 100  = impacto muito alto
```

### 11.4 Mensagens por classificação

```text
Impacto muito baixo:
"Impacto baixo. Esse gasto não pesa muito na sua renda, mas ainda vale considerar se ele se repete."

Impacto baixo:
"Parece um gasto controlado, desde que esteja dentro do seu orçamento."

Impacto moderado:
"Esse valor já merece atenção. Talvez valha comparar preço ou esperar um pouco."

Impacto alto:
"Esse gasto tem impacto relevante. Evite decidir no impulso."

Impacto muito alto:
"Esse valor pesa bastante na sua renda. Reavalie necessidade, prazo e alternativas."
```

---

## 12. Base local de equivalências

No MVP, as equivalências devem ser locais.

Arquivo recomendado:

```text
apps/mobile/src/data/defaultComparisonItems.ts
```

Ou, preferencialmente, no core:

```text
packages/core/src/comparisons/defaultComparisonItems.ts
```

Itens obrigatórios do MVP:

```ts
export const defaultComparisonItems = [
  {
    id: "coffee",
    name: "Café",
    unitPrice: 6,
    unitLabel: "cafés",
    category: "food",
    active: true,
    country: "BR",
    currency: "BRL",
  },
  {
    id: "lunch",
    name: "Almoço simples",
    unitPrice: 35,
    unitLabel: "almoços simples",
    category: "food",
    active: true,
    country: "BR",
    currency: "BRL",
  },
  {
    id: "delivery",
    name: "Delivery",
    unitPrice: 70,
    unitLabel: "pedidos de delivery",
    category: "food",
    active: true,
    country: "BR",
    currency: "BRL",
  },
  {
    id: "streaming",
    name: "Streaming",
    unitPrice: 39.9,
    unitLabel: "meses de streaming",
    category: "subscription",
    active: true,
    country: "BR",
    currency: "BRL",
  },
  {
    id: "gasoline",
    name: "Gasolina",
    unitPrice: 6,
    unitLabel: "litros de gasolina",
    category: "transport",
    active: true,
    country: "BR",
    currency: "BRL",
  },
  {
    id: "bus_ticket",
    name: "Passagem de ônibus",
    unitPrice: 5,
    unitLabel: "passagens de ônibus",
    category: "transport",
    active: true,
    country: "BR",
    currency: "BRL",
  },
  {
    id: "basic_market",
    name: "Mercado básico",
    unitPrice: 150,
    unitLabel: "compras básicas de mercado",
    category: "market",
    active: true,
    country: "BR",
    currency: "BRL",
  },
];
```

Regras:

```text
- Não buscar equivalências em backend no MVP.
- Não depender de internet.
- Permitir edição dos valores no premium, se implementado.
- Marcar comparações premium quando necessário.
```

---

## 13. Motor de frases

O app não deve mostrar apenas números. Ele deve gerar frases com apelo emocional, visual e compartilhável.

### 13.1 Tons permitidos

```text
neutral
funny
provocative
educational
motivational
```

### 13.2 Exemplos

```text
Neutro:
"Essa compra equivale a aproximadamente 12 horas de trabalho."

Provocativo:
"Você trabalharia 12 horas só para comprar isso?"

Engraçado:
"Seu carrinho acabou de sequestrar 12 horas do seu expediente."

Educativo:
"Antes de comprar, considere que esse valor representa cerca de 12 horas da sua renda líquida de trabalho."
```

### 13.3 Regras do InsightService

```text
- Deve receber ExpenseResult e retornar frases.
- Não deve chamar API de IA.
- Não deve gerar frases aleatórias sem base nos cálculos.
- Deve usar templates locais.
- Deve permitir tom configurável.
- Deve evitar julgamento excessivo.
- Deve usar linguagem simples, brasileira e compartilhável.
```

---

## 14. Geração de card compartilhável

O card compartilhável é recurso central do produto. Não deve ser tratado como detalhe secundário.

### 14.1 Regra principal

A viralidade do app depende do compartilhamento. A geração de imagem deve estar no MVP.

### 14.2 Implementação recomendada

Usar:

```text
react-native-view-shot
expo-sharing
expo-media-library
```

Fluxo:

```text
Renderizar componente React Native
Capturar componente como PNG
Compartilhar via recurso nativo do dispositivo
```

### 14.3 Formatos obrigatórios

```text
square  -> imagem quadrada para feed/WhatsApp/Instagram
story   -> imagem vertical para Stories/Reels
```

### 14.4 Conteúdo mínimo do card

```text
- principal frase de impacto;
- valor da compra;
- horas de trabalho;
- equivalência principal;
- pergunta “Vale o Pix?”;
- marca discreta do app.
```

### 14.5 Exemplos de card

```text
Essa compra custa
73 horas
do meu trabalho

Produto: Cadeira ergonômica
Valor: R$ 1.499,00

Vale o Pix?
```

```text
Antes de comprar, eu calculei:

R$ 1.499,00
= 73 horas de trabalho
= 249 cafés
= 18 meses de streaming

Vale o Pix?
```

### 14.6 Regras

```text
- Card gratuito deve ter marca discreta.
- Premium pode remover ou suavizar marca.
- Não deixar geração de card para fase futura.
- Não usar backend para gerar imagem no MVP.
- Não subir imagem para storage no MVP.
```

---

## 15. Persistência local

### 15.1 Banco local

Usar:

```text
Expo SQLite
```

Para protótipo inicial, AsyncStorage pode ser usado, mas o MVP publicado deve usar SQLite.

### 15.2 Dados a persistir

```text
- perfil financeiro;
- histórico de cálculos;
- preferências;
- uso diário gratuito;
- templates favoritos;
- status premium;
- configurações de referência editadas.
```

### 15.3 ProfileStorage

Responsável por salvar:

```ts
{
  monthlyIncome: 4500,
  workHoursPerDay: 8,
  workDaysPerMonth: 22,
  currency: "BRL"
}
```

### 15.4 HistoryStorage

Responsável por salvar:

```ts
{
  id: "uuid",
  name: "Cadeira ergonômica",
  amount: 1499,
  workHoursEquivalent: 58.6,
  workDaysEquivalent: 7.3,
  incomePercentage: 33.3,
  impactScore: 85,
  createdAt: "2026-05-01T10:00:00"
}
```

### 15.5 UsageStorage

Responsável por salvar:

```ts
{
  date: "2026-05-01",
  calculationCount: 3,
  shareCount: 1
}
```

### 15.6 Regras

```text
- Não persistir dados sensíveis desnecessários.
- Não exigir conta.
- Não sincronizar histórico no MVP.
- Não salvar renda em backend no MVP.
- Permitir apagar histórico.
- Permitir alterar perfil.
```

---

## 16. Monetização

### 16.1 Modelo do MVP

Usar modelo freemium com compra única barata.

Plano gratuito:

```text
- 5 cálculos por dia;
- 3 categorias de comparação;
- 1 modelo de card;
- histórico limitado;
- marca d’água no card.
```

Premium:

```text
- preço sugerido: R$ 3,99 ou R$ 4,99;
- cálculos ilimitados;
- todas as equivalências;
- todos os modelos de card;
- histórico completo;
- edição dos valores de referência;
- sem marca d’água ou marca discreta.
```

### 16.2 Serviço obrigatório

Usar RevenueCat.

Configuração conceitual:

```text
entitlement: premium
product: lifetime_unlock
offering: default
```

### 16.3 BillingService

Responsável por:

```text
- verificar status premium;
- consultar offerings;
- iniciar compra;
- restaurar compra;
- liberar recursos premium;
- tratar erro de compra.
```

### 16.4 Regras

```text
- Não implementar validação manual de recibo no MVP.
- Não criar backend para validar compra no MVP.
- Não bloquear o cálculo básico totalmente.
- Premium deve liberar recursos virais e conveniência, não impedir o usuário de entender o app.
```

---

## 17. Analytics

### 17.1 Ferramenta recomendada

Usar:

```text
PostHog
```

Firebase Analytics é alternativa aceitável.

### 17.2 Eventos obrigatórios

```ts
export const AnalyticsEvents = {
  APP_OPENED: "app_opened",
  ONBOARDING_STARTED: "onboarding_started",
  PROFILE_CREATED: "profile_created",
  CALCULATION_STARTED: "calculation_started",
  CALCULATION_COMPLETED: "calculation_completed",
  SHARE_CARD_GENERATED: "share_card_generated",
  SHARE_CLICKED: "share_clicked",
  SHARE_COMPLETED: "share_completed",
  PREMIUM_SCREEN_VIEWED: "premium_screen_viewed",
  PREMIUM_PURCHASED: "premium_purchased",
  HISTORY_OPENED: "history_opened",
  REFERENCE_VALUE_EDITED: "reference_value_edited",
} as const;
```

### 17.3 Métrica central

A métrica mais importante é:

```text
share_rate = cálculos compartilhados / cálculos concluídos
```

Meta inicial:

```text
share_rate >= 15%
```

### 17.4 Regras

```text
- Não enviar renda do usuário em analytics.
- Não enviar nome detalhado da compra se puder conter dado pessoal.
- Preferir eventos agregados e não sensíveis.
- AnalyticsService deve encapsular a ferramenta.
- Telas não devem chamar PostHog diretamente.
```

---

## 18. Telas obrigatórias

### 18.1 OnboardingScreen

Objetivo:

```text
Explicar o app em poucos segundos.
```

Texto sugerido:

```text
Veja quanto qualquer compra custa na sua vida real.
```

Subtexto:

```text
Transforme preços em horas de trabalho, cafés, combustível, assinaturas e impacto mensal.
```

Botões:

```text
- Começar
- Usar sem informar renda
- Como funciona?
```

### 18.2 ProfileSetupScreen

Campos:

```text
- renda mensal líquida;
- horas trabalhadas por dia;
- dias trabalhados por mês.
```

Regra:

```text
Usuário deve poder pular e usar referência padrão.
```

### 18.3 CalculatorScreen

Campos:

```text
- nome da compra;
- valor;
- categoria;
- compra única ou recorrente;
- frequência;
- parcelamento, se houver.
```

Botão:

```text
Calcular custo real
```

### 18.4 ResultScreen

Deve mostrar no topo:

```text
Essa compra custa aproximadamente 73 horas do seu trabalho.
```

Depois:

```text
- equivalências;
- percentual da renda;
- impacto mensal/anual;
- score;
- classificação;
- botões de compartilhar, gerar imagem, comparar outra compra e salvar no histórico.
```

### 18.5 ShareCardScreen

Deve permitir:

```text
- selecionar template;
- visualizar card;
- gerar imagem;
- compartilhar;
- salvar imagem, se permitido.
```

### 18.6 HistoryScreen

Deve listar:

```text
- nome;
- valor;
- data;
- horas de trabalho;
- categoria;
- recorrência;
- botão compartilhar novamente.
```

### 18.7 SettingsScreen

Deve permitir:

```text
- alterar renda;
- alterar horas por dia;
- alterar dias por mês;
- alterar moeda;
- editar valores de referência, se premium;
- apagar histórico;
- acessar privacidade;
- restaurar compras.
```

### 18.8 PremiumScreen

Deve mostrar:

```text
- benefícios premium;
- preço;
- botão comprar;
- botão restaurar compra.
```

---

## 19. Regras de UI/UX

### 19.1 Princípios

```text
- Simples.
- Rápido.
- Visual.
- Brasileiro.
- Divertido.
- Levemente provocativo.
- Sem parecer app financeiro complexo.
```

### 19.2 Primeiro cálculo

O usuário deve conseguir fazer o primeiro cálculo em menos de 30 segundos.

### 19.3 Linguagem

Usar frases curtas, diretas e compartilháveis.

Evitar:

```text
- termos financeiros complexos;
- tom professoral excessivo;
- julgamentos pesados;
- telas densas;
- formulários longos.
```

### 19.4 Resultado

A tela de resultado é a tela mais importante do app. Deve ser otimizada para:

```text
- impacto imediato;
- clareza;
- compartilhamento;
- conversão para premium.
```

---

## 20. Testes obrigatórios

### 20.1 Testes mínimos no core

Criar testes para:

```text
- cálculo do valor da hora;
- cálculo de horas equivalentes;
- cálculo de dias equivalentes;
- percentual da renda;
- recorrência diária;
- recorrência semanal;
- recorrência mensal;
- recorrência anual;
- parcelamento;
- score de impacto;
- classificação de impacto;
- cálculo de equivalências;
- geração de frases.
```

### 20.2 Testes de serviços

Criar testes para:

```text
CalculationService
ComparisonService
ImpactScoreService
InsightService
UsageLimitService
```

### 20.3 Testes de storage

Criar testes, quando possível, para:

```text
ProfileStorage
HistoryStorage
UsageStorage
SettingsStorage
```

### 20.4 Regras

```text
- Não alterar regra de cálculo sem criar ou atualizar teste.
- Não refatorar core sem rodar testes.
- Não aceitar código de IA sem teste quando envolver regra de negócio.
- Não misturar teste com implementação em commit gigante.
```

---

## 21. Regras para uso de IA durante o desenvolvimento

### 21.1 A IA deve ser usada para

```text
- gerar estruturas iniciais;
- sugerir organização de arquivos;
- criar testes;
- revisar duplicidades;
- sugerir refatorações;
- gerar documentação;
- criar exemplos de uso;
- melhorar nomes;
- identificar riscos.
```

### 21.2 A IA não deve decidir sozinha

```text
- mudança de arquitetura;
- adição de backend;
- adição de dependências;
- alteração de regra de monetização;
- alteração de regra de cálculo;
- alteração do escopo do MVP;
- criação de login;
- inclusão de IA dentro do app.
```

### 21.3 Código gerado por IA

Todo código gerado por IA deve ser:

```text
- lido;
- entendido;
- revisado;
- testado;
- adequado à arquitetura;
- pequeno o suficiente para revisão;
- sem dependências desnecessárias;
- sem credenciais;
- sem workaround.
```

---

## 22. Regras de dependências

### 22.1 Antes de adicionar dependência

O agente deve avaliar:

```text
- A dependência é realmente necessária?
- Existe solução nativa do Expo?
- A dependência funciona com Expo?
- É compatível com iOS e Android?
- É mantida?
- Aumenta muito o bundle?
- Pode ser substituída por função simples?
```

### 22.2 Dependências permitidas para o MVP

```text
expo
react-native
typescript
expo-router
zustand
expo-sqlite
react-native-view-shot
expo-sharing
expo-media-library
react-native-purchases / RevenueCat
posthog-react-native
sentry-expo ou @sentry/react-native
```

### 22.3 Evitar no MVP

```text
- bibliotecas pesadas de gráficos;
- SDKs de IA;
- SDKs de backend desnecessários;
- libs de scraping;
- libs de OCR;
- libs de autenticação social;
- libs de banco online.
```

---

## 23. Regras de commit

Usar **Conventional Commits**.

Formato:

```text
<tipo>(escopo): <descrição>
```

### 23.1 Tipos permitidos

```text
feat      nova funcionalidade
fix       correção de bug
docs      documentação
style     formatação sem alteração lógica
refactor  refatoração sem alteração de comportamento
test      testes
chore     manutenção
build     build/dependências
ci        pipeline
perf      performance
security  segurança
```

### 23.2 Escopos recomendados

```text
core
mobile
calculator
comparison
insight
score
sharing
history
storage
billing
analytics
premium
docs
theme
navigation
```

### 23.3 Exemplos corretos

```text
chore(project): create monorepo structure
feat(core): add expense impact calculation
test(core): add recurring expense calculation tests
feat(calculator): create calculator screen
feat(sharing): generate share card image
feat(billing): integrate revenuecat premium entitlement
feat(analytics): track calculation completed event
docs(readme): add setup and execution instructions
refactor(core): extract impact score calculation
fix(storage): prevent duplicated history entries
```

### 23.4 Exemplos proibidos

```text
ajustes
final
teste
update
corrigido
mais coisas
versao boa
mexi no app
```

### 23.5 Regras

```text
- Commits devem ser pequenos.
- Um commit deve representar uma intenção.
- Não misturar feature, refactor, docs e test no mesmo commit sem motivo.
- Não commitar código quebrado na main.
- Não commitar arquivos temporários.
- Não commitar .env.
```

---

## 24. Regras de branch

### 24.1 Branch principal

```text
main
```

A branch `main` deve conter apenas código estável.

### 24.2 Branches de trabalho

Padrões:

```text
feature/core-calculation
feature/share-card
feature/premium-screen
fix/history-duplicates
refactor/calculation-service
docs/product-readme
test/impact-score
```

### 24.3 Regras

```text
- Não trabalhar diretamente na main.
- Cada branch deve ter objetivo claro.
- Rodar testes antes de merge.
- Atualizar documentação quando necessário.
- Remover código morto antes do merge.
```

---

## 25. Regras de tag e release

### 25.1 Versionamento

Usar Semantic Versioning:

```text
MAJOR.MINOR.PATCH
```

Exemplos:

```text
v0.1.0 protótipo navegável
v0.2.0 cálculo real
v0.3.0 cards compartilháveis
v0.4.0 premium e analytics
v1.0.0 MVP publicável
```

### 25.2 Criar tag

```bash
git tag -a v1.0.0 -m "Release v1.0.0 - MVP publicável"
git push origin v1.0.0
```

### 25.3 Regras para tag

Criar tag apenas quando:

```text
- main está limpa;
- testes passam;
- app builda;
- README está atualizado;
- changelog está atualizado;
- não há credenciais;
- analytics básico funciona;
- compra premium foi testada;
- geração de card foi testada;
- compartilhamento foi testado.
```

### 25.4 Release notes

Toda release deve conter:

```text
- funcionalidades adicionadas;
- correções;
- alterações técnicas;
- limitações conhecidas;
- instrução de instalação ou teste;
- versão do app.
```

---

## 26. Deploy e publicação

### 26.1 MVP publicável

O MVP publicável deve ser preparado para:

```text
- Google Play;
- App Store, se aplicável;
- distribuição beta/teste fechado;
- página simples de divulgação.
```

### 26.2 Não usar backend no deploy do MVP

O deploy do MVP é o app mobile publicado. Não criar infraestrutura backend para a primeira versão.

### 26.3 Checklist antes de publicar

```text
[ ] App abre corretamente
[ ] Onboarding funciona
[ ] Usuário consegue calcular sem login
[ ] Usuário consegue usar referência padrão
[ ] Usuário consegue criar perfil financeiro
[ ] Cálculo de horas funciona
[ ] Cálculo de recorrência funciona
[ ] Parcelamento funciona
[ ] Score funciona
[ ] Histórico local funciona
[ ] Card é gerado como imagem
[ ] Compartilhamento nativo funciona
[ ] Analytics registra eventos principais
[ ] Sentry registra erros
[ ] Premium aparece corretamente
[ ] Compra premium foi testada em sandbox
[ ] Restaurar compra funciona
[ ] Limite gratuito funciona
[ ] Não há dados sensíveis em analytics
[ ] Não há backend obrigatório
[ ] README está atualizado
[ ] Política de privacidade foi criada
```

---

## 27. Fases do roadmap

### 27.1 Fase 1 — Protótipo navegável

Objetivo:

```text
Validar experiência e fluxo.
```

Entregas:

```text
- tela inicial;
- tela de cálculo;
- tela de resultado;
- card compartilhável fake;
- dados fixos;
- sem persistência complexa;
- sem pagamento.
```

### 27.2 Fase 2 — MVP funcional

Objetivo:

```text
Publicar app com cálculo real e monetização básica.
```

Entregas:

```text
- cálculo real;
- perfil financeiro local;
- comparações básicas;
- histórico local;
- geração de imagem;
- compartilhamento nativo;
- limite gratuito;
- tela premium;
- RevenueCat;
- analytics;
- crash reporting.
```

### 27.3 Fase 3 — Beta fechado

Objetivo:

```text
Testar com usuários reais.
```

Entregas:

```text
- ajustes de UX;
- novos templates;
- correção de bugs;
- validação de frases;
- medição de share_rate;
- testes com 20 a 50 usuários.
```

### 27.4 Fase 4 — Lançamento público

Objetivo:

```text
Publicar e medir aquisição, retenção e compartilhamento.
```

Entregas:

```text
- Google Play;
- App Store, se aplicável;
- página simples de divulgação;
- vídeos curtos;
- campanha inicial;
- acompanhamento de métricas.
```

---

## 28. Backend futuro

Backend só deve ser considerado após validação do app.

### 28.1 Quando adicionar backend

Adicionar backend se houver necessidade real de:

```text
- atualizar equivalências remotamente;
- criar templates dinâmicos;
- criar links públicos;
- sincronizar histórico;
- referral;
- campanhas;
- testes A/B remotos;
- login opcional;
- remote config.
```

### 28.2 Stack futura recomendada

```text
Supabase
PostgreSQL
Auth opcional
Remote Config via tabela
Storage opcional
```

### 28.3 Não antecipar backend

O agente não deve criar:

```text
- API própria;
- schema Supabase;
- migrations PostgreSQL;
- autenticação;
- storage cloud;
- sincronização;
```

a menos que a tarefa esteja explicitamente em uma fase futura aprovada.

---

## 29. Segurança e privacidade

### 29.1 Regras

```text
- Não coletar dados sensíveis desnecessários.
- Não exigir login no MVP.
- Não enviar renda para analytics.
- Não enviar nome detalhado da compra para analytics.
- Não versionar .env.
- Não versionar chaves.
- Não armazenar tokens inseguros.
- Permitir apagar histórico.
- Documentar privacidade.
```

### 29.2 Dados sensíveis

A renda mensal é um dado sensível no contexto do usuário. No MVP, deve permanecer local.

### 29.3 Política de privacidade

Antes de publicação, criar documento simples explicando:

```text
- quais dados ficam no dispositivo;
- quais eventos anônimos são coletados;
- uso de RevenueCat;
- uso de PostHog/Firebase;
- uso de Sentry;
- ausência de venda de dados pessoais;
- como apagar histórico.
```

---

## 30. Documentação obrigatória

### 30.1 README

O README deve conter:

```text
- nome do app;
- proposta;
- escopo do MVP;
- stack;
- arquitetura;
- como instalar;
- como rodar;
- como testar;
- estrutura de pastas;
- regras de cálculo;
- como gerar build;
- como configurar variáveis;
- como funcionam analytics e billing;
- limitações do MVP;
- roadmap.
```

### 30.2 docs/product.md

Deve conter:

```text
- visão geral;
- público-alvo;
- proposta de valor;
- funcionalidades;
- tom de comunicação;
- viralidade;
- monetização.
```

### 30.3 docs/architecture.md

Deve conter:

```text
- decisão mobile-first;
- decisão offline-first;
- ausência de backend no MVP;
- camadas;
- fluxo de dados;
- serviços;
- persistência local;
- integrações externas.
```

### 30.4 docs/roadmap.md

Deve conter:

```text
- Fase 1;
- Fase 2;
- Fase 3;
- Fase 4;
- funcionalidades futuras;
- funcionalidades explicitamente fora do MVP.
```

---

## 31. Checklist antes de concluir uma tarefa

Antes de considerar uma tarefa concluída, o agente deve validar:

```text
[ ] A alteração respeita o MVP?
[ ] A alteração respeita a arquitetura offline-first?
[ ] A alteração evita backend desnecessário?
[ ] A lógica de negócio ficou fora das telas?
[ ] A lógica pura ficou no core quando aplicável?
[ ] Existem testes para regra de cálculo?
[ ] Não foram adicionadas dependências desnecessárias?
[ ] Não há credenciais?
[ ] Analytics não envia dados sensíveis?
[ ] O código está tipado?
[ ] O código é legível?
[ ] O README/docs foram atualizados se necessário?
[ ] A mensagem de commit segue Conventional Commits?
```

---

## 32. Prompt operacional interno para o agente

Ao receber uma tarefa, siga este processo:

```text
1. Identifique se a tarefa pertence ao MVP ou a uma fase futura.
2. Verifique qual camada deve ser alterada.
3. Evite alterar mais camadas do que o necessário.
4. Se envolver cálculo, implemente ou altere primeiro no core.
5. Se envolver UI, mantenha a tela simples e sem regra de negócio.
6. Se envolver persistência, use storage dedicado.
7. Se envolver analytics, use AnalyticsService.
8. Se envolver premium, use BillingService.
9. Se envolver compartilhamento, use ShareCardService ou NativeShareService.
10. Crie ou atualize testes.
11. Atualize documentação quando necessário.
12. Sugira mensagem de commit.
```

---

## 33. Resposta esperada do agente ao propor alterações

Sempre que sugerir uma implementação, responda neste formato:

```text
1. Análise da tarefa
2. Camadas impactadas
3. Arquivos a criar/alterar
4. Decisões técnicas
5. Código sugerido
6. Testes necessários
7. Riscos ou pontos de atenção
8. Mensagem de commit sugerida
```

---

## 34. Regra máxima

A regra máxima do projeto é:

```text
Construir um app mobile simples, barato, rápido, visual e compartilhável, que valide a proposta viral do “Vale o Pix?” antes de adicionar complexidade.
```

Não sacrifique essa regra por arquitetura excessiva, backend prematuro, IA desnecessária, login, integrações pesadas ou funcionalidades que não ajudam diretamente o usuário a calcular e compartilhar o custo real de uma compra.
