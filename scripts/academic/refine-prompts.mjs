import fs from 'node:fs';
const base='docs/academic/unidade-3-testes-integracao/prompts/';
function refine(group,request){
 const input=fs.readFileSync(`${base}prompt-${group}-v1.md`,'utf8');
 const context=input.slice(0,input.lastIndexOf('TAREFA ESPECÍFICA:')+'TAREFA ESPECÍFICA:'.length).replaceAll(`${group.toUpperCase()}-V1`,`${group.toUpperCase()}-V2`);
 const target=`${base}prompt-${group}-v2.md`;
 if(fs.existsSync(target)) throw new Error('Preserve refined prompt');
 fs.writeFileSync(target,context+'\n'+request+'\n');
}
refine('a',`REFINAMENTO ZERO-SHOT baseado na execução e inspeção reais de A V1:
V1 gerou 6 métodos/12 casos, compiláveis, 7 aprovados e 5 falhas: quatro rendas inválidas revelam CA-02.3 não implementado; um primeiro-acesso para cedo porque checkboxes web não expõem aria-checked. Não alterar produção nem enfraquecer essas expectativas. São dois defeitos candidatos, não supor que todos os casos falhos sejam bugs distintos.
Lacunas reais: RF-17 (salvar alteração e reutilizar perfil) não foi exercitado; caso A-V1-02 calcula a lista esperada por calculateComparisonResults, a própria função exercitada, reduzindo independência do oráculo; caso de primeiro acesso agrupa uma assertion secundária de ARIA que impede observar o restante do fluxo. Metadados de V1 não significam necessariamente verificação executada quando o caso aborta.
Gere uma suíte funcional completa de SEIS métodos it/it.each, preservando o foco de A: primeiro acesso, retorno com perfil salvo, preferências zero/alternância, compra válida pt-BR/nome opcional, novo comparativo e alteração de perfil reutilizada posteriormente pela Home. Pode agrupar sequências coerentes. Não incluir negativos apenas para aumentar contagem. Não incluir assertion ARIA como pré-condição de todo fluxo funcional: essa verificação terá caso próprio no prompt negativo. Essa separação não significa que o problema ARIA esteja resolvido.
Não derive resultados esperados chamando calculateComparisonResults ou outra função sob teste. Use aritmética independente e valores de referência documentados; pode ler catálogo para identificar rótulos sem recalcular pelo SUT. Confira armazenamento, parâmetros e UI final, IDs prioritários, ausência de duplicatas e limite quatro, sem impor ordem aleatória ou fallback específico da lista vazia.
Para editar preferências, teste acesso/salvar/reutilizar; NÃO exigir pré-preenchimento pendente de CA-06.2. Quando precisar simular reabertura da Home, cleanup/unmount do React NÃO limpa nativeData; renderFlow({pathname:'/'}), dentro do mesmo caso, reutiliza dados. Cada caso deve continuar independente dos demais.
Sem exemplos de teste prontos. Retorne metadados rastreáveis de cada caso e fonte TSX completa.`);
refine('b',`REFINAMENTO FEW-SHOT baseado na execução e inspeção reais de B V1:
V1 gerou 8 métodos/18 casos compiláveis; 13 aprovados e 5 falhas: quatro rendas inválidas avançam indevidamente à Calculator; um caso de fallback aborta porque falta aria-checked nos checkboxes web. Não corrigir aplicação nem remover assertions para esconder os defeitos.
Confirmação independente da segunda falha: o app tem alvo web documentado; RN Web 0.21.2 não mapeia accessibilityState.checked no createDOMProps; a API pública suporta aria-checked. O padrão W3C checkbox exige estado false/true. Isole essa semântica de seleção/desseleção num caso próprio para não impedir medir fallback e navegação. Não trata-se de afirmar que o mesmo problema foi reproduzido em Android/iOS.
Lacunas observadas: B V1 agrega corrupção/leitura/gravação num único método, não verifica navegação para novo comparativo após falha e não aborda parâmetros realmente ausentes (apenas strings inválidas); os metadados agregam linhas parametrizadas, tornando rastreabilidade ambígua. Refine com IDs únicos por linha de dados e descritivos com argumentos.
Mantenha OITO métodos it/it.each; cubra: compra vazia, valores inválidos e retorno após erro; renda inválida bloqueada no onboarding; Result com parâmetros ausentes/inconsistentes; IDs duplicados/desconhecidos + fallback e limite; seleção/desseleção e estado aria-checked; falhas de storage parametrizadas separadamente (JSON, leitura e gravação, sem clicar Home causando rejection não tratada); transição para Home após escrita bem-sucedida do perfil atualizado se houver espaço. Não impor políticas pendentes de LAC-02/03/04/11.
Exemplos derivados dos contratos e da inspeção (few-shot, sem código de teste pronto):
1. Perfil válido, compra vazia: continuar na Calculator com 'Informe o valor da compra.', sem Result (CA-03.2).
2. Preferências coffee,coffee,desconhecido: um café no resultado, nenhum ID desconhecido, fallback distinto, até quatro comparações (RN-11/12/14).
3. Renda '0' no onboarding: não gravar nem navegar, mostrar erro (CA-02.3); continuará falhando até correção separada.
4. Checkbox web Café: inicia aria-checked=false, clique muda para true, novo clique para false. Persistência confirma seleção final; não inventar status nativo de outro dispositivo.
Use oráculos independentes do core e assertions dos efeitos, sem simular funções do aplicativo. Retorne fonte completa e metadados por caso executável.`);
console.log('V2 prompts saved from measured V1 deficiencies; production sources unchanged.');
