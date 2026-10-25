# Comparação dos prompts

[Resultados medidos](execucoes.md), [rastreabilidade](rastreabilidade.md) e [defeitos/intervenções](defeitos-identificados.md) são complementares.

| Aspecto | A: funcional/zero-shot | B: negativos/few-shot |
|---|---|---|
| Influência observada em V1 | produziu sequências completas, persistência e UI, mas também negativos por influência do contrato fornecido | exemplos direcionaram validação e fronteiras; gerou parâmetros inválidos e falhas do storage |
| Deficiência concreta | oráculo parcialmente derivado do SUT, RF-17 ausente, assertion de ARIA interrompe primeiro fluxo | três falhas de storage agregadas; sem retorno após falha nem parâmetros ausentes; ARIA mistura-se ao fallback |
| Refinamento V2 | foco funcional, editar/reutilizar perfil, aritmética independente e não bloquear todo fluxo por assertion secundária | IDs por linha, ampliar fronteiras ausentes/retorno, separar semântica de checkbox e falhas do storage |
| Efeito no mesmo produto original | 12 → 6 casos; statements 103/121 → 106/121; ramos 61/82 → 62/82 | 18 → 25 casos; statements 107/121 → 113/121; ramos 62/82 → 72/82 |
| Curadoria posterior | fontes executadas de A V1/V2 sem edição | B V1 sem edição; B V2 teve uma correção de Arrange, com assertions preservadas |

O A V2 passar em todos os casos no produto original não prova ausência de bugs: seu recorte funcional deixou as condições negativas que revelam D-01/D-02 para outras suítes. O B V2 obter oito falhas não representa oito defeitos: quatro entradas repetem D-01, um caso demonstra D-02 e três casos têm T-01 no teste. Após corrigir somente T-01, B V2 passou de 17/25 para 20/25 sem mudar o produto. Após os dois fixes no onboarding, os 61 casos passaram.

Há ganho de diversidade em edição/reutilização, parâmetros ausentes e retorno após erro. Há redundância deliberada entre suítes nas mesmas classes de renda, compra e preferências. Nenhum prompt é superior apenas por volume, taxa de aprovação ou cobertura. B V2 trouxe também um erro de preparação: maior abrangência exige revisão.

O experimento não separa causalmente objetivo funcional versus negativo, zero-shot versus few-shot e instruções de refinamento. Cada versão tem uma única geração e foi solicitada uma quantidade de métodos; o modelo pôde parametrizar. Não há repetição estatística, controle de seed, comparação de modelos, tempo humano medido ou custo monetário calculado. As diferenças são observações deste código e deste procedimento, não percentuais universais de produtividade.
