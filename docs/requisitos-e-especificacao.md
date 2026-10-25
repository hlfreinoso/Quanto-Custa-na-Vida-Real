# Requisitos e Especificação do MVP — Quanto Custa na Vida Real

> **Projeto:** Quanto Custa na Vida Real  
> **Repositório:** https://github.com/hlfreinoso/Quanto-Custa-na-Vida-Real  
> **Versão do documento:** 1.1<br>
> **Data:** 25/10/2026 (criado em 08/08/2026)<br>
> **Autor:** Heitor Reinoso  
> **Situação:** Em validação  
> **Escopo analisado:** protótipo mobile navegável — Fase 1 do roadmap

---

## 1. Finalidade deste documento

Este documento consolida os requisitos do MVP do aplicativo **Quanto Custa na Vida Real**, relacionando:

- necessidades do usuário;
- requisitos funcionais;
- requisitos não funcionais;
- regras de negócio;
- histórias de usuário;
- critérios de aceitação;
- caso de uso principal;
- lacunas, ambiguidades e inconsistências;
- rastreabilidade entre requisitos, código, testes e documentação;
- curadoria das sugestões produzidas com apoio de Inteligência Artificial Generativa.

A especificação foi derivada da documentação e do comportamento atual do repositório, principalmente dos seguintes artefatos:

- [`README.md`](../README.md);
- [`docs/product.md`](product.md);
- [`docs/architecture.md`](architecture.md);
- [`docs/flowchart.md`](flowchart.md);
- [`docs/testing.md`](testing.md);
- [`docs/roadmap.md`](roadmap.md);
- [`docs/ai-usage.md`](ai-usage.md);
- código existente em [`apps/mobile`](../apps/mobile);
- regras de domínio existentes em [`packages/core`](../packages/core).

Este documento **não presume como decididos os pontos que o repositório ainda não define**. Esses pontos foram registrados na seção [10. Lacunas, ambiguidades e decisões pendentes](#10-lacunas-ambiguidades-e-decisões-pendentes).

### 1.1 Classificação utilizada

| Classificação | Significado |
|---|---|
| **Confirmado** | Está explicitamente documentado ou implementado no repositório. |
| **Parcial** | Existe implementação ou documentação, mas faltam validações, testes ou definições. |
| **Planejado** | Está previsto no roadmap, mas não pertence à versão atual do protótipo. |
| **A validar** | Foi inferido da solução ou identificado como necessário, mas depende de decisão do responsável pelo produto. |

---

## 2. Contexto e objetivo do produto

O aplicativo busca apoiar decisões de compra transformando um valor monetário em referências mais concretas para o usuário, principalmente:

1. quantidade de horas de trabalho necessárias para pagar a compra;
2. quantidades equivalentes de itens e serviços do cotidiano;
3. comparações personalizadas de acordo com as preferências do usuário.

A proposta não é criar um sistema completo de controle financeiro. O produto deve permanecer simples, visual e direcionado a uma pergunta específica:

> **Quanto esta compra representa na vida real?**

### 2.1 Problema

Preços monetários isolados nem sempre permitem que o consumidor perceba claramente o esforço necessário para realizar uma compra. Essa abstração pode dificultar decisões conscientes e comparações com gastos cotidianos.

### 2.2 Objetivo do MVP

Entregar um fluxo mobile simples que permita:

1. informar a renda mensal líquida;
2. selecionar comparações preferidas;
3. informar uma compra e seu valor;
4. calcular o equivalente em horas de trabalho;
5. exibir comparações tangíveis;
6. repetir o cálculo sem novo cadastro;
7. funcionar localmente, sem login e sem backend.

### 2.3 Fora do escopo atual

Os itens abaixo não fazem parte do protótipo atual:

- autenticação e cadastro de conta;
- sincronização entre dispositivos;
- backend próprio;
- integração bancária;
- OCR de comprovantes ou etiquetas;
- scraping de preços;
- uso de GenAI dentro do aplicativo;
- sistema completo de orçamento ou controle financeiro;
- histórico persistente de cálculos;
- geração e compartilhamento de cards;
- analytics e monitoramento de falhas em produção.

Alguns desses itens aparecem no roadmap como possíveis evoluções, mas não devem ser tratados como implementados.

---

## 3. Stakeholders

| ID | Stakeholder | Tipo | Interesse ou responsabilidade | Origem |
|---|---|---|---|---|
| ST-01 | Consumidor/usuário do aplicativo | Primário | Entender o impacto real de uma compra e tomar uma decisão mais consciente. | Documentação de produto |
| ST-02 | Responsável pelo produto | Secundário | Definir escopo, regras, catálogo de comparações, prioridades e critérios de aceite. | Inferido do contexto do projeto |
| ST-03 | Equipe de desenvolvimento | Secundário | Implementar a solução e preservar a separação entre interface e regras de domínio. | Arquitetura do projeto |
| ST-04 | Equipe de testes/qualidade | Secundário | Verificar regras de cálculo, persistência, navegação e comportamento da interface. | Estratégia de testes |
| ST-05 | Responsável por privacidade e dados | Futuro | Avaliar coleta de eventos, retenção, compartilhamento e tratamento de informações sensíveis caso analytics ou backend sejam introduzidos. | Roadmap e documentação de analytics |

---

## 4. Necessidades e objetivos dos stakeholders

| ID | Necessidade | Stakeholder principal | Critério geral de atendimento |
|---|---|---|---|
| NEC-01 | Compreender quanto tempo de trabalho uma compra representa. | ST-01 | O aplicativo calcula e apresenta o equivalente em horas de trabalho. |
| NEC-02 | Comparar o valor com itens e serviços familiares. | ST-01 | O aplicativo apresenta comparações tangíveis baseadas em valores de referência. |
| NEC-03 | Obter o resultado rapidamente, sem cadastro e sem depender da internet. | ST-01 | O fluxo principal funciona localmente e não exige autenticação. |
| NEC-04 | Personalizar as comparações utilizadas no resultado. | ST-01 | O usuário pode selecionar e alterar preferências. |
| NEC-05 | Repetir cálculos sem informar novamente o perfil financeiro. | ST-01 | O perfil é recuperado localmente e reutilizado em novos cálculos. |
| NEC-06 | Manter regras de cálculo isoladas, verificáveis e reutilizáveis. | ST-03 e ST-04 | As regras permanecem no pacote de domínio e possuem testes automatizados. |
| NEC-07 | Evoluir o produto sem transformar o MVP em um sistema financeiro complexo. | ST-02 | Funcionalidades adicionais são avaliadas e priorizadas no roadmap. |

---

## 5. Requisitos funcionais

### 5.1 Requisitos do protótipo atual

| ID | Requisito funcional | Prioridade | Situação | Origem principal |
|---|---|---:|---|---|
| **RF-01** | Ao acionar **Iniciar**, o sistema deve verificar se existe um perfil inicial salvo localmente. | Must | Confirmado | Home e armazenamento local |
| **RF-02** | Quando não existir perfil salvo, o sistema deve direcionar o usuário para o fluxo de configuração inicial. | Must | Confirmado | Home e fluxograma |
| **RF-03** | Quando existir perfil salvo, o sistema deve direcionar o usuário para a calculadora, reutilizando renda e preferências armazenadas. | Must | Confirmado | Home e armazenamento local |
| **RF-04** | O sistema deve permitir que o usuário informe sua renda mensal líquida. | Must | Parcial | Onboarding |
| **RF-05** | O sistema deve permitir que o usuário selecione ou desmarque zero ou mais preferências de comparação. | Must | Confirmado, com inconsistência descrita em LAC-03 | Produto e onboarding |
| **RF-06** | O sistema deve salvar localmente a renda mensal e os identificadores das preferências selecionadas. | Must | Confirmado | Armazenamento local |
| **RF-07** | O sistema deve permitir que o usuário informe o nome da compra e seu valor. | Must | Confirmado | Calculadora |
| **RF-08** | O sistema deve impedir o cálculo quando renda ou valor forem inválidos, informando o problema ao usuário antes de prosseguir. | Must | Parcial | Core e interface |
| **RF-09** | O sistema deve calcular o valor da hora de trabalho com base na renda mensal e na jornada mensal considerada. | Must | Confirmado | Pacote `core` |
| **RF-10** | O sistema deve calcular quantas horas de trabalho são necessárias para pagar a compra. | Must | Confirmado | Pacote `core` |
| **RF-11** | O sistema deve calcular a quantidade equivalente de cada item de comparação com base no valor da compra e no preço unitário de referência. | Must | Confirmado | Pacote `core` |
| **RF-12** | O sistema deve priorizar comparações escolhidas pelo usuário e completar o resultado com opções de fallback quando necessário. | Must | Confirmado, com inconsistência descrita em LAC-03 | Pacote `core` |
| **RF-13** | O sistema deve apresentar no máximo quatro comparações por resultado. | Must | Confirmado no código; decisão de produto a validar | Pacote `core` |
| **RF-14** | O sistema deve apresentar o resultado com o nome da compra, ou um texto substituto quando o nome estiver vazio, o equivalente em horas de trabalho e as comparações calculadas. | Must | Confirmado | Tela de resultado |
| **RF-15** | Quando não for possível concluir o cálculo, o sistema deve apresentar uma mensagem de erro em vez de encerrar inesperadamente. | Must | Confirmado | Tela de resultado |
| **RF-16** | O sistema deve permitir iniciar um novo comparativo preservando a renda e as preferências da sessão. | Must | Confirmado | Tela de resultado |
| **RF-17** | O sistema deve permitir acessar novamente a configuração de renda e preferências. | Must | Confirmado, com comportamento incompleto descrito em LAC-04 | Home, calculadora e resultado |

### 5.2 Requisitos planejados

Os requisitos desta seção pertencem ao roadmap e **não devem ser considerados entregues no protótipo atual**.

| ID | Requisito planejado | Prioridade sugerida | Situação |
|---|---|---:|---|
| **RF-P01** | Permitir consultar um histórico local de comparações realizadas. | Should | Planejado |
| **RF-P02** | Gerar uma representação visual compartilhável do resultado. | Should | Planejado |
| **RF-P03** | Compartilhar o resultado por meio dos recursos nativos do dispositivo. | Should | Planejado |
| **RF-P04** | Disponibilizar uma área de configurações para manutenção do perfil e das preferências. | Should | Planejado |
| **RF-P05** | Permitir limpar os dados locais e redefinir o perfil. | Should | A validar |
| **RF-P06** | Registrar eventos anônimos de uso, caso analytics seja aprovado e implementado. | Could | Planejado |

---

## 6. Requisitos não funcionais

### 6.1 Requisitos confirmados ou parcialmente definidos

| ID | Categoria | Requisito não funcional | Situação | Evidência |
|---|---|---|---|---|
| **RNF-01** | Operação | O fluxo principal deve funcionar sem conexão com a internet. | Confirmado | Estratégia offline-first |
| **RNF-02** | Arquitetura | O MVP não deve depender de backend para executar cálculos ou recuperar o perfil inicial. | Confirmado | Arquitetura e roadmap |
| **RNF-03** | Privacidade | A renda e as preferências do usuário devem permanecer armazenadas localmente no MVP. | Confirmado | Arquitetura e armazenamento |
| **RNF-04** | Acesso | O fluxo principal não deve exigir login ou criação de conta. | Confirmado | Escopo do MVP |
| **RNF-05** | Manutenibilidade | As regras de domínio devem permanecer independentes de React Native, Expo, navegação e mecanismos de persistência. | Confirmado | Estrutura do monorepo |
| **RNF-06** | Testabilidade | Novas regras de cálculo devem ser implementadas no pacote `core` e acompanhadas de testes automatizados antes de sua integração à interface. | Confirmado como diretriz | Estratégia de testes |
| **RNF-07** | Confiabilidade | Entradas inválidas não devem produzir resultados numéricos incorretos nem causar falhas não tratadas. | Parcial | Core validado; interface incompleta |
| **RNF-08** | Localização | Valores monetários e textos do produto devem considerar o contexto brasileiro, usando BRL e formato numérico compreensível ao público local. | Parcial | Modelo, textos e interface |
| **RNF-09** | Usabilidade | O fluxo principal deve permanecer curto, com linguagem direta e sem exigir conhecimento financeiro especializado. | Parcialmente especificado | Documentação de produto |
| **RNF-10** | Compatibilidade | A solução deve ser executável como aplicação mobile por meio de React Native e Expo. | Confirmado; versões mínimas não definidas | Arquitetura atual |
| **RNF-11** | Privacidade futura | Caso analytics seja implementado, renda, nome detalhado da compra e demais dados sensíveis não devem ser enviados como propriedades de eventos. | Planejado | Documentação de analytics |

### 6.2 Requisitos não funcionais que dependem de definição

Os itens abaixo são relevantes, mas o repositório não contém metas objetivas suficientes. Não foram inventados valores.

| ID | Categoria | Candidato a requisito | Decisão necessária |
|---|---|---|---|
| **RNF-A01** | Desempenho | Definir tempo máximo aceitável para abertura do aplicativo, navegação e cálculo. | Estabelecer cenário, dispositivo de referência, carga e percentil. |
| **RNF-A02** | Acessibilidade | Definir nível mínimo de acessibilidade para textos, contraste, foco, leitores de tela e áreas de toque. | Definir padrão e critérios verificáveis. |
| **RNF-A03** | Compatibilidade | Definir versões mínimas de Android e iOS e dispositivos suportados. | Registrar matriz de compatibilidade. |
| **RNF-A04** | Disponibilidade | Definir comportamento esperado diante de falhas no armazenamento local. | Especificar recuperação, aviso e possibilidade de redefinição. |
| **RNF-A05** | Segurança | Definir se a renda armazenada localmente requer proteção adicional. | Avaliar sensibilidade, modelo de ameaça e recursos do dispositivo. |
| **RNF-A06** | Observabilidade | Definir quais métricas e falhas poderão ser coletadas sem violar a privacidade. | Aprovar taxonomia de eventos e política de dados. |

---

## 7. Regras de negócio e regras de cálculo

| ID | Regra | Situação |
|---|---|---|
| **RN-01** | A moeda utilizada pelo MVP é o real brasileiro (`BRL`). | Confirmado |
| **RN-02** | A renda mensal e o valor da compra devem ser números finitos maiores que zero. | Confirmado no core; validação de interface parcial |
| **RN-03** | O protótipo considera, atualmente, uma jornada padrão de **8 horas por dia e 22 dias por mês**. | Confirmado no código; decisão de produto a validar |
| **RN-04** | O valor da hora de trabalho é calculado por `renda mensal ÷ (horas por dia × dias por mês)`. | Confirmado |
| **RN-05** | O equivalente em horas de trabalho é calculado por `valor da compra ÷ valor da hora de trabalho`. | Confirmado |
| **RN-06** | A quantidade equivalente de uma comparação é calculada por `valor da compra ÷ preço unitário de referência`. | Confirmado |
| **RN-07** | O preço unitário de uma comparação deve ser um número finito maior que zero. | Confirmado |
| **RN-08** | O usuário pode concluir o onboarding sem selecionar uma preferência. | Confirmado na interface; comportamento posterior inconsistente |
| **RN-09** | Nenhuma preferência deve aparecer pré-selecionada no onboarding. | Confirmado na documentação e interface |
| **RN-10** | As preferências selecionadas devem ter prioridade na composição do resultado. | Confirmado |
| **RN-11** | Quando as preferências selecionadas forem insuficientes, o sistema deve utilizar comparações de fallback ainda não exibidas. | Confirmado |
| **RN-12** | Preferências repetidas ou identificadores inexistentes não devem gerar resultados duplicados ou inválidos. | Confirmado |
| **RN-13** | A ordem das comparações pode ser embaralhada. | Confirmado no código; experiência esperada a validar |
| **RN-14** | O resultado atual é limitado a quatro comparações. | Confirmado no código |
| **RN-15** | Os valores unitários de referência são locais e fixos no protótipo. | Confirmado |
| **RN-16** | As comparações devem representar itens ou serviços tangíveis, com referência de preço compreensível; categorias excessivamente amplas devem ser evitadas. | Confirmado na documentação de produto |
| **RN-17** | Quando o nome da compra não for informado, a tela de resultado deve utilizar o texto substituto **“Essa compra”**. | Confirmado no código |
| **RN-18** | Na implementação atual, horas iguais ou superiores a 10 são apresentadas com uma casa decimal; valores menores usam duas casas decimais. | Confirmado no código; regra de apresentação a validar |
| **RN-19** | Na implementação atual, quantidades de comparação iguais ou superiores a 10 são arredondadas para inteiro; valores menores usam uma casa decimal. | Confirmado no código; regra de apresentação a validar |

---

## 8. Histórias de usuário e critérios de aceitação

### HU-01 — Iniciar o aplicativo

**Como** consumidor,  
**quero** iniciar o aplicativo e recuperar meu perfil quando ele já existir,  
**para** realizar uma nova comparação sem repetir a configuração inicial.

#### Critérios de aceitação

**CA-01.1 — Primeiro acesso**

- **Dado** que não existe perfil salvo localmente;
- **Quando** o usuário aciona **Iniciar**;
- **Então** o sistema deve abrir a configuração inicial.

**CA-01.2 — Perfil existente**

- **Dado** que existe um perfil válido salvo localmente;
- **Quando** o usuário aciona **Iniciar**;
- **Então** o sistema deve abrir a calculadora;
- **E** deve reutilizar a renda e as preferências armazenadas.

---

### HU-02 — Configurar renda e preferências

**Como** consumidor,  
**quero** informar minha renda mensal líquida e escolher comparações relevantes,  
**para** obter resultados compatíveis com meu contexto.

#### Critérios de aceitação

**CA-02.1 — Salvar perfil válido**

- **Dado** que o usuário informou uma renda mensal válida;
- **E** selecionou zero ou mais preferências;
- **Quando** aciona **Continuar**;
- **Então** o sistema deve salvar os dados localmente;
- **E** deve abrir a calculadora.

**CA-02.2 — Preferências opcionais**

- **Dado** que o usuário não selecionou nenhuma preferência;
- **Quando** conclui a configuração com uma renda válida;
- **Então** o sistema deve permitir a continuidade;
- **E** deve utilizar o mecanismo geral de fallback na geração das comparações.

> **Observação:** o comportamento esperado acima está alinhado à documentação de produto, mas o código atual prioriza três identificadores específicos quando a lista recebida está vazia. Ver **LAC-03**.

**CA-02.3 — Renda inválida**

- **Dado** que a renda está vazia, é igual ou inferior a zero ou não pode ser interpretada como número;
- **Quando** o usuário aciona **Continuar**;
- **Então** o sistema deve permanecer na tela;
- **E** deve informar claramente o problema.

> **Atualização Unidade III:** a interface passou a bloquear renda vazia, não positiva ou não finita antes de salvar/navegar, com mensagem inline. CA-02.3 foi verificado pelos testes de integração. A interpretação de formatos monetários alternativos continua em LAC-02; não foi decidida por esta correção.

---

### HU-03 — Informar uma compra

**Como** consumidor,  
**quero** informar uma compra e seu valor,  
**para** calcular seu custo em referências mais concretas.

#### Critérios de aceitação

**CA-03.1 — Dados válidos**

- **Dado** que existe um perfil financeiro válido;
- **E** o usuário informou um valor de compra válido;
- **Quando** aciona **Calcular custo real**;
- **Então** o sistema deve abrir o resultado.

**CA-03.2 — Valor não informado**

- **Dado** que o campo de valor está vazio;
- **Quando** o usuário tenta calcular;
- **Então** o sistema deve permanecer na calculadora;
- **E** deve apresentar a mensagem **“Informe o valor da compra.”**

**CA-03.3 — Valor inválido**

- **Dado** que o valor informado é igual ou inferior a zero ou possui formato inválido;
- **Quando** o usuário tenta calcular;
- **Então** o sistema não deve apresentar um resultado;
- **E** deve informar como corrigir o campo.

> **Situação atual:** a interface bloqueia apenas o campo vazio antes da navegação; outras invalidações são tratadas posteriormente por uma mensagem genérica no resultado.

**CA-03.4 — Nome opcional**

- **Dado** que o usuário informou um valor válido e deixou o nome em branco;
- **Quando** o cálculo for concluído;
- **Então** o resultado deve utilizar **“Essa compra”** como identificação.

---

### HU-04 — Consultar o custo real

**Como** consumidor,  
**quero** visualizar o valor da compra em horas de trabalho e comparações cotidianas,  
**para** avaliar melhor seu impacto.

#### Critérios de aceitação

**CA-04.1 — Horas de trabalho**

- **Dado** que renda e valor da compra são válidos;
- **Quando** o resultado é calculado;
- **Então** o sistema deve dividir a renda mensal por 176 horas na configuração atual;
- **E** deve dividir o valor da compra pelo valor da hora obtido;
- **E** deve apresentar o equivalente em horas de trabalho.

**CA-04.2 — Comparações preferidas**

- **Dado** que o usuário selecionou preferências válidas;
- **Quando** o resultado é calculado;
- **Então** o sistema deve priorizar essas preferências;
- **E** pode embaralhar sua ordem.

**CA-04.3 — Fallback**

- **Dado** que as preferências selecionadas não são suficientes para preencher o limite;
- **Quando** o resultado é calculado;
- **Então** o sistema deve completar a lista com comparações distintas do catálogo local.

**CA-04.4 — Limite**

- **Dado** que há mais de quatro comparações disponíveis;
- **Quando** o resultado é produzido;
- **Então** o sistema deve apresentar no máximo quatro.

**CA-04.5 — Falha de cálculo**

- **Dado** que os parâmetros recebidos são inválidos;
- **Quando** a tela tenta montar o resultado;
- **Então** deve apresentar uma mensagem de erro;
- **E** não deve exibir `NaN`, `Infinity` ou valores enganosos.

---

### HU-05 — Realizar outro comparativo

**Como** consumidor,  
**quero** iniciar outro cálculo mantendo meu perfil,  
**para** comparar diferentes compras com menos esforço.

#### Critérios de aceitação

**CA-05.1 — Novo comparativo**

- **Dado** que o usuário está na tela de resultado;
- **Quando** aciona **Novo comparativo**;
- **Então** o sistema deve retornar à calculadora;
- **E** deve preservar renda e preferências;
- **E** deve permitir informar uma nova compra.

---

### HU-06 — Alterar preferências

**Como** consumidor,  
**quero** alterar minha renda ou minhas preferências,  
**para** manter os resultados compatíveis com minha situação atual.

#### Critérios de aceitação

**CA-06.1 — Acesso à edição**

- **Dado** que o usuário está na Home, na calculadora ou no resultado;
- **Quando** aciona **Mudar preferências**;
- **Então** o sistema deve abrir a tela de configuração.

**CA-06.2 — Preservação durante a edição**

- **Dado** que existe um perfil salvo;
- **Quando** a tela de configuração é aberta para alteração;
- **Então** deve apresentar a renda e as preferências atuais antes da edição.

> **Situação atual:** o código abre o onboarding com campos vazios. Este critério depende de confirmação e ajuste. Ver **LAC-04**.

---

## 9. Caso de uso principal

### UC-01 — Calcular o custo real de uma compra

| Campo | Descrição |
|---|---|
| **Objetivo** | Permitir que o consumidor transforme o valor de uma compra em horas de trabalho e comparações cotidianas. |
| **Ator principal** | Consumidor |
| **Pré-condições** | O aplicativo está disponível; para calcular, deve existir renda mensal válida. |
| **Gatilho** | O usuário aciona **Iniciar**. |
| **Pós-condição de sucesso** | O sistema apresenta o equivalente em horas de trabalho e até quatro comparações. |
| **Pós-condição de falha** | Nenhum resultado inválido é apresentado; o usuário recebe orientação para corrigir os dados. |

#### Fluxo principal

1. O usuário abre o aplicativo.
2. O usuário aciona **Iniciar**.
3. O sistema verifica a existência de um perfil local.
4. O sistema recupera renda e preferências existentes.
5. O sistema abre a calculadora.
6. O usuário informa o nome da compra, opcionalmente.
7. O usuário informa o valor da compra.
8. O usuário aciona **Calcular custo real**.
9. O sistema valida os dados.
10. O sistema calcula o valor da hora de trabalho.
11. O sistema calcula o equivalente em horas.
12. O sistema calcula e seleciona as comparações.
13. O sistema apresenta o resultado.

#### Fluxos alternativos e de exceção

**A1 — Perfil inexistente**

1. No passo 3, o sistema não encontra perfil local.
2. O sistema abre a configuração inicial.
3. O usuário informa renda e preferências.
4. O sistema salva o perfil.
5. O fluxo retorna ao passo 5.

**A2 — Nenhuma preferência selecionada**

1. O usuário conclui a configuração sem selecionar preferências.
2. O sistema deve usar comparações de fallback sem bloquear o fluxo.

**E1 — Renda inválida**

1. A renda está vazia, é não numérica ou não é positiva.
2. O sistema deve impedir o cálculo e indicar o campo a corrigir.

**E2 — Valor da compra vazio**

1. O usuário tenta calcular sem informar o valor.
2. O sistema apresenta **“Informe o valor da compra.”**
3. O usuário permanece na calculadora.

**E3 — Outro valor inválido**

1. O valor não pode ser convertido ou não é positivo.
2. O sistema não apresenta resultado numérico.
3. O sistema informa que renda e valor devem ser conferidos.

**E4 — Falha de armazenamento**

1. O sistema não consegue ler ou interpretar o perfil local.
2. O comportamento de recuperação deve seguir a decisão a ser definida em **LAC-11**.

---

## 10. Lacunas, ambiguidades e decisões pendentes

| ID | Severidade | Ponto identificado | Evidência atual | Decisão necessária |
|---|---|---|---|---|
| **LAC-01** | Resolvida nesta branch para os casos confirmados | O onboarding anteriormente salvava renda vazia ou inválida. | Unidade III: `handleContinue` valida positividade/finitude antes da gravação; cenários CA-02.3 aprovados. | Manter regressões; interpretação de formatos alternativos permanece em LAC-02. |
| **LAC-02** | Alta | O formato monetário aceito não está formalmente definido. | O parser remove todos os pontos e troca vírgula por ponto; `1499.00`, por exemplo, pode ser interpretado incorretamente. | Definir máscara, separadores aceitos e estratégia de normalização. |
| **LAC-03** | Alta | Há conflito entre “nenhuma preferência pré-selecionada” e o fallback atual. | O onboarding inicia vazio, mas a tela de resultado usa `coffee`, `netflix` e `bonbon` quando recebe lista vazia. | Decidir se lista vazia deve priorizar itens fixos ou selecionar aleatoriamente no catálogo geral. |
| **LAC-04** | Alta | A ação **Mudar preferências** abre a configuração sem carregar os valores existentes. | O estado inicial do onboarding é vazio. | Criar modo de edição com pré-preenchimento ou definir outro comportamento explicitamente. |
| **LAC-05** | Alta | A jornada de 8 horas × 22 dias é fixa. | Constantes na tela de resultado e texto na calculadora. | Confirmar se é regra definitiva, valor padrão editável ou cálculo simplificado temporário. |
| **LAC-06** | Média | Não está decidido se o nome da compra é realmente opcional. | O código aceita vazio e usa **“Essa compra”**. | Formalizar obrigatoriedade, tamanho máximo e caracteres aceitos. |
| **LAC-07** | Média | A tela de resultado não apresenta explicitamente o valor monetário informado. | O resultado mostra nome, horas e equivalências. | Confirmar se o valor original também deve ser exibido. |
| **LAC-08** | Média | As regras de arredondamento estão no código, mas não foram validadas como decisão de produto. | `formatHours` e `formatQuantity`. | Definir casas decimais, arredondamento e tratamento de valores muito pequenos. |
| **LAC-09** | Média | O embaralhamento pode produzir comparações diferentes para o mesmo cálculo. | Uso de `Math.random`. | Decidir se o resultado deve ser estável durante a sessão ou variar a cada execução. |
| **LAC-10** | Média | Não existe política de atualização dos preços de referência. | Valores fixos no catálogo local. | Definir responsável, periodicidade, origem e possibilidade de edição pelo usuário. |
| **LAC-11** | Alta | O comportamento diante de armazenamento corrompido ou indisponível não está definido na interface. | Existem testes de storage, mas o fluxo de recuperação do usuário não está especificado. | Definir fallback, aviso, limpeza e recriação do perfil. |
| **LAC-12** | Média | Não existe função explícita para apagar todos os dados locais. | Não identificada no fluxo atual. | Decidir sobre redefinição de perfil e exclusão de dados. |
| **LAC-13** | Média | Não existem critérios objetivos de acessibilidade. | Há uso pontual de `accessibilityRole="alert"`. | Definir requisitos de leitor de tela, contraste, foco e área de toque. |
| **LAC-14** | Média | Versões mínimas de Android e iOS não estão documentadas. | Aplicação usa React Native e Expo. | Definir matriz de compatibilidade. |
| **LAC-15** | Média | Não existem metas mensuráveis de desempenho. | A documentação afirma simplicidade, mas não define tempo de resposta. | Definir limites somente após escolher dispositivos e cenários de referência. |
| **LAC-16** | Alta para evolução | Analytics e compartilhamento exigirão decisões adicionais de privacidade. | Recursos constam como futuros. | Definir consentimento, dados permitidos, retenção, exclusão e política de privacidade antes da implementação. |
| **LAC-17** | Baixa | A documentação mistura estado atual e arquitetura planejada. | Arquitetura menciona cards e compartilhamento, enquanto README e roadmap os tratam como não implementados. | Separar claramente **Atual** e **Planejado**. |
| **LAC-18** | Baixa | Há referência ao nome anterior **“Vale o Pix?”** em arquivos do projeto. | README do aplicativo e nomes internos do pacote. | Padronizar nomenclatura ou registrar que o nome técnico foi mantido temporariamente. |
| **LAC-19** | Média | Fluxos visuais, componentes e navegação ainda não possuem testes automatizados. | Documento de testes registra a limitação. | Priorizar testes de interface, navegação e E2E conforme o roadmap. |

---

## 11. Matriz simplificada de rastreabilidade

| Necessidade | Requisitos relacionados | Artefatos de especificação | Implementação principal | Testes/Situação |
|---|---|---|---|---|
| NEC-01 — Entender esforço em horas | RF-09, RF-10, RF-14; RN-03 a RN-05 | HU-03, HU-04, UC-01 | `packages/core/src/calculations` e `ResultScreen.tsx` | Testes unitários do core; interface sem teste automatizado |
| NEC-02 — Comparações tangíveis | RF-05, RF-11 a RF-14; RN-06 a RN-16 | HU-02, HU-04, UC-01 | `packages/core/src/comparisons` | Testes de seleção, fallback, limite e entradas inválidas |
| NEC-03 — Uso rápido e offline | RF-01 a RF-03, RF-06; RNF-01 a RNF-04 | HU-01 | `HomeScreen.tsx` e `InitialProfileStorage.ts` | Storage possui testes; navegação não |
| NEC-04 — Personalização | RF-05, RF-06, RF-12, RF-17 | HU-02, HU-06 | Onboarding, Home, calculadora e resultado | Parcial; LAC-03 e LAC-04 abertas |
| NEC-05 — Repetir cálculos | RF-03, RF-16 | HU-01, HU-05 | Home e ResultScreen | Comportamento implementado; teste de navegação pendente |
| NEC-06 — Regras verificáveis | RF-09 a RF-13; RNF-05 e RNF-06 | Critérios CA-04.* | `packages/core` | Cobertura unitária existente |
| NEC-07 — Escopo controlado | RF-P01 a RF-P06 | Roadmap e decisões de IA | Não aplicável à versão atual | Planejado |

### 11.1 Relações diretas entre requisitos e arquivos

| Requisito | Arquivo ou artefato relacionado |
|---|---|
| RF-01 a RF-03 | `apps/mobile/src/screens/home/HomeScreen.tsx` |
| RF-04, RF-05, RF-06 e RF-17 | `apps/mobile/src/screens/onboarding/ComparisonPreferencesScreen.tsx` |
| RF-07 e parte de RF-08 | `apps/mobile/src/screens/calculator/CalculatorScreen.tsx` |
| RF-09 e RF-10 | `packages/core/src/calculations/` |
| RF-11 a RF-13 | `packages/core/src/comparisons/` |
| RF-14 a RF-17 | `apps/mobile/src/screens/result/ResultScreen.tsx` |
| RF-06 | `apps/mobile/src/storage/InitialProfileStorage.ts` |
| RF-P01 a RF-P06 | `docs/roadmap.md` e `docs/analytics.md` |
| RNF-01 a RNF-06 | `docs/architecture.md` e `docs/testing.md` |

---

## 12. Curadoria das sugestões da Inteligência Artificial Generativa

A GenAI foi utilizada como apoio para analisar a documentação, relacioná-la ao código, estruturar os requisitos e apontar inconsistências. As decisões abaixo representam a curadoria humana aplicada às sugestões.

### 12.1 Sugestões aproveitadas

| ID | Sugestão | Decisão | Justificativa |
|---|---|---|---|
| IA-01 | Separar requisitos funcionais, não funcionais e regras de negócio. | Aproveitada | Evita misturar comportamento, qualidade e política de domínio. |
| IA-02 | Identificar todos os requisitos com códigos únicos. | Aproveitada | Facilita discussão, testes, rastreabilidade e mudanças. |
| IA-03 | Criar histórias de usuário com critérios em Dado/Quando/Então. | Aproveitada | Torna o comportamento esperado verificável. |
| IA-04 | Registrar explicitamente lacunas e ambiguidades. | Aproveitada | Evita que hipóteses sejam tratadas como requisitos aprovados. |
| IA-05 | Criar matriz simplificada de rastreabilidade. | Aproveitada | Relaciona necessidades, especificação, implementação e testes. |
| IA-06 | Separar o protótipo atual das funcionalidades futuras. | Aproveitada | Corrige a mistura entre estado implementado e roadmap. |
| IA-07 | Preservar a estratégia mobile-first, offline-first e sem backend no MVP. | Aproveitada | Está alinhada à arquitetura e reduz complexidade desnecessária. |

### 12.2 Sugestões modificadas

| ID | Sugestão inicial | Modificação realizada | Motivo |
|---|---|---|---|
| IA-08 | Definir metas numéricas de desempenho e disponibilidade. | Convertida em RNFs a validar. | O projeto não fornece cenário, dispositivo ou dados para justificar números. |
| IA-09 | Tratar histórico e compartilhamento como funcionalidades do sistema. | Movida para requisitos planejados. | Esses recursos não estão implementados na fase atual. |
| IA-10 | Considerar a jornada 8 × 22 como regra definitiva. | Registrada como regra atual e lacuna de decisão. | Pode ser apenas uma simplificação temporária. |
| IA-11 | Considerar a ausência de preferências resolvida pelo fallback. | Mantida com ressalva e aberta como LAC-03. | O código atual introduz três preferências fixas, em conflito com a documentação. |
| IA-12 | Descrever “Mudar preferências” como edição completa. | Registrada como implementação parcial. | A tela atual não carrega os valores salvos. |

### 12.3 Sugestões descartadas ou postergadas

| ID | Sugestão | Decisão | Motivo |
|---|---|---|---|
| IA-13 | Incluir login e sincronização em nuvem. | Descartada para o MVP. | Aumentaria escopo, infraestrutura e tratamento de dados sem necessidade atual. |
| IA-14 | Criar backend próprio. | Descartada para o MVP. | Os cálculos e dados atuais são locais. |
| IA-15 | Integrar bancos, OCR ou scraping de preços. | Descartada para o MVP. | Não há necessidade validada e o custo técnico seria desproporcional. |
| IA-16 | Inserir GenAI dentro do produto. | Descartada para o MVP. | Não é necessária para o objetivo central da solução. |
| IA-17 | Transformar o aplicativo em sistema completo de finanças pessoais. | Descartada. | Contraria o posicionamento simples e focado do produto. |
| IA-18 | Criar diagramas extensos de classes e modelo de dados nesta etapa. | Descartada. | São artefatos de projeto técnico e não resolvem as principais lacunas de requisitos do MVP. |
| IA-19 | Inventar limites, prazos ou metas para preencher os RNFs ausentes. | Descartada. | Requisitos não validados não devem ser apresentados como decisões confirmadas. |

---

## 13. Estado da validação

A especificação pode orientar a evolução do protótipo, mas ainda não deve ser considerada uma baseline final. Antes de sua aprovação, recomenda-se:

1. resolver as lacunas de severidade alta;
2. confirmar as regras de jornada de trabalho e fallback;
3. definir o comportamento de edição e exclusão do perfil;
4. padronizar a entrada e a formatação monetária;
5. alinhar documentação e implementação;
6. obter validação do responsável pelo produto;
7. atualizar os testes para refletir as decisões aprovadas;
8. registrar a versão validada no histórico do projeto.

---

## 14. Histórico do documento

| Versão | Data | Alteração |
|---|---|---|
| 1.0 | 08/08/2026 | Criação da especificação inicial a partir da documentação e do código do protótipo. |
| 1.1 | 25/10/2026 | Atualização factual de CA-02.3/LAC-01 após os testes e correção da Unidade III; sem alterar requisitos nem aprovar decisões pendentes. |
