# Quanto custa na vida real

Aplicativo mobile que transforma o preco de uma compra em comparacoes simples: horas do seu trabalho e equivalencias do dia a dia, como Netflix, cafe, bombons, gasolina e outros itens tangiveis.

## Instalar e Rodar

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

### 3. Rodar o app

```bash
npm run web:mobile
```

Abra no navegador:

```text
http://localhost:8081
```

Para Expo em modo geral:

```bash
npm run dev:mobile
```

## Como Usar o App

1. Abra a pagina inicial.
2. Clique em `Iniciar`.
3. No primeiro uso, informe a renda mensal liquida.
4. Escolha preferencias de comparacao, se quiser.
5. Clique em `Continuar`.
6. Informe o nome do produto e o preco.
7. Clique em `Calcular custo real`.
8. Veja a tela de resultado com:
   - horas do seu trabalho;
   - comparacoes sorteadas com base nas preferencias;
   - botao `Novo comparativo`;
   - atalho para `Mudar preferencias`.

Se o perfil inicial ja estiver salvo, `Iniciar` pula o onboarding e abre direto a calculadora.

## Validar o Projeto

```bash
npm test
npm run typecheck
npm run lint
```

Observacao: `npm run lint` ainda e placeholder. A configuracao real de lint deve entrar em uma etapa futura.

Tambem existe um `Makefile` com atalhos para os comandos mais usados:

```bash
make install
make dev
make web
make test
make typecheck
make validate
```

No Windows, caso `make` nao esteja instalado, use os comandos `npm` acima diretamente.

## Testes Automatizados

Coberto hoje:

- calculo de valor-hora;
- calculo de horas equivalentes;
- calculo basico de impacto;
- rejeicao de entradas invalidas no core;
- lista padrao de comparacoes;
- selecao aleatoria/limitada de comparacoes;
- fallback quando o usuario escolhe poucas preferencias;
- persistencia inicial com AsyncStorage, incluindo falhas de leitura e JSON invalido.

Ainda nao coberto:

- componentes React Native;
- navegacao Expo Router;
- fluxo completo de onboarding ate resultado.

Essas camadas devem ganhar testes quando adicionarmos uma biblioteca de teste para UI mobile.

## Escopo do MVP

O MVP deve ser mobile-first, offline-first e sem backend. O app deve funcionar sem login para os calculos principais, usando dados locais e compartilhamento nativo.

Foco inicial:

- calculo local de impacto financeiro;
- perfil financeiro local;
- preferencias locais;
- equivalencias locais;
- resultado compartilhavel em etapa futura;
- historico local em etapa futura.

Fora do MVP:

- backend proprio;
- login obrigatorio;
- sincronizacao entre dispositivos;
- IA generativa;
- OCR;
- scraping;
- integracao bancaria;
- controle financeiro completo.

## Stack

- React Native
- Expo
- TypeScript
- Expo Router
- AsyncStorage no prototipo
- Expo SQLite no MVP publicado
- Vitest para core

## Estrutura

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
```

## Camadas

- `packages/core`: regras puras e testaveis, sem dependencia de React Native ou Expo.
- `apps/mobile`: telas, navegacao, storage local e integracoes nativas.
- `packages/ui`: componentes compartilhados quando houver ganho real.
- `docs`: produto, arquitetura, fluxogramas, roadmap, monetizacao e analytics.

## Fluxogramas

Os fluxos da aplicacao estao em [docs/flowchart.md](docs/flowchart.md), usando Mermaid.

## Commits

Usar Conventional Commits:

```text
<tipo>(escopo): <descricao>
```

Exemplo:

```text
feat(calculator): show preference comparisons
```
