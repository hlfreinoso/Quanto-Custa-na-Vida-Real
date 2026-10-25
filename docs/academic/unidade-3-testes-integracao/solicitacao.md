# Codex — Atividade da UFG: Testes de Integração com IA Generativa

## 1. Contexto obrigatório

Você atuará como Arquiteto de Software Sênior, Engenheiro de Qualidade e Especialista em Automação de Testes com Inteligência Artificial Generativa.

Sua tarefa é realizar uma atividade acadêmica da pós-graduação em Engenharia de Software: Automação e Inovação com Inteligência Artificial Generativa, da Universidade Federal de Goiás (UFG).

**Repositório obrigatório:**

https://github.com/hlfreinoso/Quanto-Custa-na-Vida-Real

Esse é meu projeto acadêmico oficial e deve continuar sendo utilizado nas atividades da pós-graduação.

**Não crie outro projeto. Não substitua a arquitetura. Não desenvolva um sistema fictício ou uma API REST apenas para atender à atividade.**

Todo o trabalho deverá ocorrer no repositório existente, respeitando seu histórico, suas decisões arquiteturais, seus requisitos e sua organização.

## 2. Solicitação da professora Mariana

A atividade pertence à Unidade III — Automação de Testes com Inteligência Artificial Generativa.

A professora solicitou:

1. Escolher um cenário de integração entre componentes de software.
2. Definir pelo menos dois tipos de prompt para apoiar os testes de integração.
3. Experimentar efetivamente esses prompts com uma LLM.
4. Registrar os casos de teste produzidos em um repositório GitHub.
5. Publicar o link no fórum acadêmico.
6. Explicar como cada prompt influenciou a qualidade e a diversidade dos testes.
7. Descrever os ajustes necessários para melhorar os resultados.

Nossa entrega deverá atender integralmente a esses requisitos, com evidências reais e reproduzíveis.

## 3. Inspeção inicial do repositório

Antes de modificar qualquer arquivo:

1. Obtenha a versão atualizada do repositório.
2. Identifique o commit de referência e a branch principal.
3. Leia o README.
4. Examine a arquitetura.
5. Leia os requisitos e critérios de aceitação.
6. Examine os testes existentes.
7. Identifique os módulos que participam dos fluxos de integração.
8. Identifique as lacunas de cobertura.
9. Execute a suíte atual e registre seus resultados.
10. Verifique as dependências e versões efetivamente utilizadas.

Leia especialmente:

- `README.md`
- `docs/architecture.md`
- `docs/testing.md`
- `docs/requisitos-e-especificacao.md`
- `docs/ai-usage.md`
- `packages/core/`
- `apps/mobile/src/screens/`
- `apps/mobile/src/storage/`
- `vitest.config.mjs`

Não presuma que a documentação e a implementação estejam perfeitamente alinhadas. Identifique divergências e preserve evidências.

## 4. Arquitetura que deve ser preservada

O projeto utiliza um monorepo com:

- React Native.
- Expo e Expo Router.
- TypeScript.
- AsyncStorage.
- Pacote independente de domínio (`packages/core`).
- Vitest para testes automatizados.

O aplicativo foi projetado com os princípios:

- Mobile-first.
- Offline-first.
- Sem backend no MVP.
- Sem autenticação obrigatória.
- Persistência local.
- Cálculos realizados no próprio dispositivo.

Esses princípios são requisitos arquiteturais.

Não introduza backend, banco remoto, autenticação, serviços REST ou dependências externas sem justificativa técnica indispensável.

Não renomeie pacotes nem reorganize a solução simplesmente para facilitar a geração de testes.

## 5. Cenário de integração selecionado

A atividade deverá utilizar o fluxo real do aplicativo **Quanto Custa na Vida Real**.

O processo é:

**Home → Onboarding → Persistência local → Calculadora → Core de cálculos → Resultado**

Também deverá contemplar o fluxo de retorno quando o usuário já possui um perfil salvo.

### Componentes envolvidos

#### HomeScreen

Responsável por verificar se existe um perfil salvo e decidir o próximo destino:

- Onboarding, quando não existe perfil.
- Calculadora, quando existe perfil.

#### ComparisonPreferencesScreen

Responsável por:

- Receber a renda mensal.
- Permitir selecionar preferências.
- Salvar os dados locais.
- Encaminhar os dados à calculadora.

#### InitialProfileStorage

Responsável por salvar e recuperar os dados do usuário no AsyncStorage.

#### CalculatorScreen

Responsável por:

- Receber informações do perfil.
- Capturar o nome e o valor de uma compra.
- Encaminhar os dados necessários à tela de resultados.

#### packages/core

Responsável por:

- Calcular o valor da hora trabalhada.
- Calcular o equivalente da compra em horas.
- Gerar comparações com itens cotidianos.
- Aplicar regras e validações de domínio.

#### ResultScreen

Responsável por:

- Interpretar os parâmetros recebidos.
- Executar as funções de domínio.
- Apresentar os resultados.
- Tratar falhas de cálculo.
- Permitir iniciar uma nova comparação.

### Objetivo dos testes

Verificar se esses componentes funcionam corretamente em conjunto e se os dados são preservados e interpretados adequadamente ao atravessarem as fronteiras entre módulos.

Os testes não devem se limitar a invocar funções matemáticas isoladas, pois essa responsabilidade já é parcialmente coberta pelos testes unitários existentes.

## 6. Requisitos que devem orientar os testes

Utilize como referência os requisitos documentados no projeto.

Priorize:

- RF-01 a RF-03: identificação e reutilização de perfil.
- RF-04 a RF-06: configuração e persistência de preferências.
- RF-07 e RF-08: entrada e validação de compras.
- RF-09 a RF-11: cálculos e comparações.
- RF-12 e RF-13: priorização, fallback e limite de comparações.
- RF-14 e RF-15: apresentação dos resultados e tratamento de erros.
- RF-16 e RF-17: novo comparativo e alteração de preferências.

Considere também os critérios de aceitação e as regras de negócio associados.

Examine especialmente as lacunas já identificadas na documentação, incluindo as relacionadas à validação de entradas, preferências vazias e atualização de perfil.

**Importante:** uma inconsistência entre requisito e implementação é um possível defeito. Não altere a expectativa de um teste apenas para reproduzir o comportamento atual da aplicação.

Separe requisitos confirmados, comportamentos planejados e decisões ainda pendentes.

## 7. Experimento com dois tipos de prompt

O trabalho deverá utilizar duas estratégias complementares.

### Prompt A — Cenários funcionais de integração

Objetivo: gerar testes de integração para os principais fluxos de utilização do aplicativo.

Utilize inicialmente uma estratégia zero-shot.

Oriente a LLM a produzir testes para situações como:

1. Primeiro acesso, sem perfil salvo.
2. Direcionamento ao onboarding.
3. Configuração de renda e preferências.
4. Persistência e recuperação do perfil.
5. Acesso à calculadora utilizando informações persistidas.
6. Entrada de uma compra válida.
7. Propagação dos parâmetros entre as telas.
8. Cálculo correto do equivalente em horas trabalhadas.
9. Geração de comparações baseadas nas preferências.
10. Apresentação dos resultados.
11. Retorno à calculadora para um novo comparativo.
12. Preservação das informações da sessão.

Os casos devem verificar interações reais entre módulos.

Solicite que cada teste possua objetivo, pré-condições, componentes envolvidos, ações, resultados esperados e relação com os requisitos.

### Prompt B — Falhas de integração, casos negativos e limites

Objetivo: gerar testes orientados à identificação de problemas nas fronteiras entre componentes.

Utilize uma estratégia few-shot, apresentando exemplos de falhas reais e comportamentos esperados documentados.

Considere:

1. Perfil inexistente.
2. Dados persistidos inválidos ou corrompidos.
3. Falhas de leitura e gravação no AsyncStorage.
4. Renda mensal vazia, negativa, zero ou inválida.
5. Valor de compra inválido.
6. Diferentes representações de números decimais.
7. Parâmetros de navegação ausentes ou inconsistentes.
8. Preferências vazias.
9. Preferências duplicadas ou desconhecidas.
10. Divergências entre os dados persistidos e os parâmetros de navegação.
11. Falhas de cálculo e apresentação de mensagens ao usuário.
12. Retorno à calculadora após uma falha.
13. Alteração de preferências e reutilização posterior.
14. Limites e regras de fallback das comparações.

Inclua casos capazes de revelar defeitos na integração, não apenas nas funções puras do core.

Não presuma que todo comportamento listado já esteja implementado corretamente.

## 8. Geração e refinamento dos prompts

Cada estratégia deverá possuir:

- Uma versão inicial (V1).
- Uma execução real com a LLM.
- Uma análise da saída.
- Uma versão refinada (V2).
- Uma nova execução.
- Uma comparação dos resultados.

Preserve os prompts integralmente.

Na primeira versão, forneça contexto suficiente para realizar a tarefa, mas sem antecipar todas as correções que serão identificadas posteriormente.

Analise os problemas encontrados antes de produzir a segunda versão.

Os refinamentos deverão responder a problemas observados, como:

- Testes unitários gerados incorretamente como testes de integração.
- Mock excessivo de componentes internos.
- Dependências incompatíveis com React Native ou Expo.
- Imports incorretos.
- Assertions genéricas.
- Testes que verificam apenas chamadas, sem validar seus efeitos.
- Suposições que contradizem os requisitos.
- Testes redundantes.
- Ausência de critérios de aceitação.

Não fabrique artificialmente dificuldades ou melhorias apenas para preencher a documentação.

### Execução real da LLM

Registre como os prompts foram utilizados.

Inclua, quando disponível:

- Nome e versão do modelo.
- Data.
- Prompt exato.
- Contexto fornecido.
- Resposta original.
- Alterações humanas ou automáticas posteriores.

Se não houver acesso a uma API externa, utilize a LLM efetivamente disponível e documente honestamente o procedimento.

Não afirme ter realizado chamadas independentes a modelos se elas não ocorreram.

## 9. Implementação dos testes de integração

Preserve os testes unitários existentes.

Avalie a utilização das ferramentas já adotadas no projeto antes de adicionar dependências.

Dê preferência a Vitest quando tecnicamente adequado.

Para testar componentes React Native, avalie ferramentas de renderização e interação compatíveis com as versões atuais de React Native e Expo.

Verifique a necessidade de ampliar a configuração do Vitest para reconhecer arquivos `.test.tsx`, pois a configuração atual contempla arquivos `.test.ts`.

Utilize simulações apenas nas fronteiras que exigirem isolamento:

- API nativa do AsyncStorage.
- Mecanismos de navegação.
- Recursos específicos do dispositivo.
- Outras dependências externas ao conjunto integrado sob teste.

Não simule as próprias regras de negócio ou os componentes cuja integração se pretende validar.

Sempre que possível:

- Execute componentes reais em conjunto.
- Utilize armazenamento isolado por teste.
- Valide os dados persistidos.
- Verifique os parâmetros de navegação.
- Execute as funções reais do core.
- Verifique os resultados observáveis.

Se algum teste utilizar simulação de roteamento ou de armazenamento, documente claramente a fronteira verificada.

Diferencie testes de integração de módulos, testes de componentes e testes end-to-end. Não classifique uma simulação parcial como execução completa em dispositivo.

Os testes devem ser determinísticos, independentes da ordem de execução e reproduzíveis.

## 10. Avaliação dos resultados

Compare os resultados de:

- Prompt A — V1.
- Prompt A — V2.
- Prompt B — V1.
- Prompt B — V2.
- Suíte combinada.

Registre:

| Métrica | Objetivo |
|---|---|
| Testes gerados | Quantidade de casos produzidos. |
| Testes únicos | Diversidade efetiva. |
| Testes compiláveis | Correção técnica inicial. |
| Testes executáveis | Viabilidade. |
| Testes aprovados | Resultado da execução. |
| Falhas encontradas | Identificação de defeitos ou incompatibilidades. |
| Requisitos cobertos | Rastreabilidade funcional. |
| Cobertura de código | Partes efetivamente exercitadas. |
| Ajustes realizados | Impacto da engenharia de prompts. |

Colete cobertura com ferramentas compatíveis com a stack, quando viável.

Não invente resultados.

Não utilize pontuações subjetivas, como “95% de qualidade”, sem metodologia objetiva.

Não interprete automaticamente toda falha como defeito da aplicação: determine se ela foi causada pelo produto, pelo teste ou pelo ambiente.

Também não considere que todos os testes aprovados significam ausência de defeitos.

## 11. Tratamento dos defeitos identificados

Caso os testes revelem problemas reais:

1. Documente o requisito afetado.
2. Registre a entrada utilizada.
3. Descreva o resultado esperado.
4. Registre o resultado observado.
5. Preserve a evidência.
6. Classifique o problema.
7. Identifique sua causa provável.

Não modifique requisitos nem enfraqueça assertions para obter testes verdes.

Se uma correção de produção for necessária, faça-a separadamente da geração inicial dos testes, mantendo rastreabilidade entre defeito, correção e nova execução.

Evite mudanças funcionais amplas sem relação com a atividade.

## 12. Organização da documentação

Adicione os artefatos acadêmicos dentro do repositório existente.

Sugestão:

```text
docs/
  academic/
    unidade-3-testes-integracao/
      README.md
      metodologia.md
      prompts/
        prompt-a-v1.md
        prompt-a-v2.md
        prompt-b-v1.md
        prompt-b-v2.md
      resultados/
        execucoes.md
        comparativo.md
        defeitos-identificados.md
      respostas-llm/
        prompt-a-v1.md
        prompt-a-v2.md
        prompt-b-v1.md
        prompt-b-v2.md
      resposta-forum.md
```

Ajuste a organização se houver uma convenção melhor já estabelecida.

Mantenha os testes automatizados próximos dos módulos correspondentes ou em um diretório específico de integração, conforme a configuração escolhida.

Não duplique documentação existente desnecessariamente.

Atualize:

- `docs/testing.md`, para registrar os novos testes.
- `docs/ai-usage.md`, para documentar a utilização de IA na atividade.
- `README.md`, com referência sucinta à nova etapa acadêmica.

Preserve o histórico acadêmico e a documentação das atividades anteriores.

## 13. Git e GitHub

Trabalhe exclusivamente no repositório:

https://github.com/hlfreinoso/Quanto-Custa-na-Vida-Real

Antes de modificar arquivos, verifique se há alterações não commitadas ou trabalho existente que precisa ser preservado.

Utilize uma branch específica, preferencialmente:

`test/genai-integration-unit3`

Realize commits pequenos, relacionados às etapas da atividade.

Mantenha o padrão de mensagens utilizado pelo projeto.

Ao finalizar:

1. Execute a suíte existente.
2. Execute os novos testes.
3. Execute a verificação de tipos.
4. Verifique possíveis regressões.
5. Revise o diff.
6. Confirme que a documentação apresenta dados reais.
7. Publique a branch caso haja autorização e acesso.
8. Prepare um Pull Request para integração à branch principal.

Não faça merge sem minha aprovação.

Não crie outro repositório.

## 14. Resposta para o fórum acadêmico

Prepare uma mensagem final em português brasileiro, pronta para publicação no fórum da professora Mariana.

Ela deverá apresentar:

1. Nome e contexto do projeto.
2. Link do repositório.
3. Cenário de integração utilizado.
4. Primeiro prompt e sua finalidade.
5. Segundo prompt e sua finalidade.
6. Resultados das execuções.
7. Influência de cada prompt na qualidade e diversidade dos testes.
8. Ajustes realizados.
9. Principais conclusões e limitações.

O texto deve demonstrar conhecimento de Engenharia de Software e dos conteúdos da Unidade III.

Evite linguagem promocional, exageros ou conclusões que não estejam sustentadas pelos experimentos.

Deixe a mensagem pronta para minha revisão, mas não publique automaticamente no AVA.

## 15. Critérios de conclusão

A tarefa somente poderá ser considerada concluída quando:

- [ ] O repositório existente tiver sido analisado.
- [ ] Os testes anteriores tiverem sido preservados.
- [ ] O cenário de integração real tiver sido identificado.
- [ ] Dois tipos de prompt tiverem sido definidos.
- [ ] Os prompts tiverem sido executados com uma LLM.
- [ ] As versões originais e refinadas estiverem documentadas.
- [ ] Os casos gerados estiverem registrados.
- [ ] Os testes de integração tiverem sido implementados.
- [ ] Os testes tiverem sido executados.
- [ ] Os defeitos e falhas tiverem sido analisados.
- [ ] Os resultados tiverem sido comparados.
- [ ] A documentação estiver completa.
- [ ] O projeto continuar funcionando.
- [ ] As alterações estiverem organizadas no GitHub, quando autorizado.
- [ ] A resposta final para o fórum estiver pronta.

## 16. Instrução final

Execute esta atividade como uma continuação natural do projeto acadêmico **Quanto Custa na Vida Real**.

Não construa uma solução paralela.

Não introduza funcionalidades artificiais para justificar os testes.

Não substitua a arquitetura existente.

A prioridade é utilizar os módulos reais do aplicativo para demonstrar, com evidências objetivas, como a Inteligência Artificial Generativa pode auxiliar na criação e no refinamento de testes de integração.

**Inicie pela análise do repositório, estabeleça a linha de base dos testes existentes e avance até a implementação, experimentação, comparação e documentação completa.**

Entregue ao final um resumo das alterações, os resultados verificados, os arquivos modificados, o Pull Request quando disponível e a resposta acadêmica pronta para revisão.