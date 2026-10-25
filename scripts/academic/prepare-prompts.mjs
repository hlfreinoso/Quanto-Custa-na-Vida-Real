import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root=process.cwd();
const academic=path.join(root,'docs/academic/unidade-3-testes-integracao');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const files=[
  'apps/mobile/src/screens/home/HomeScreen.tsx',
  'apps/mobile/src/screens/onboarding/ComparisonPreferencesScreen.tsx',
  'apps/mobile/src/screens/calculator/CalculatorScreen.tsx',
  'apps/mobile/src/screens/result/ResultScreen.tsx',
  'apps/mobile/src/storage/InitialProfileStorage.ts',
  'packages/core/src/comparisons/calculateComparisonResults.ts',
  'packages/core/src/comparisons/defaultComparisonPreferences.ts',
  'tests/integration/flow-harness.tsx',
  'tests/integration/boundaries.ts',
];
const context=files.map(p=>`\nFILE ${p}\n${read(p).split('const styles = StyleSheet.create')[0]}`).join('\n');
const common=`Você gera testes para uma atividade acadêmica UFG num repositório REAL existente.
Não use ferramentas, não leia outros arquivos, não execute comandos e não delegue.
Retorne somente JSON válido com duas propriedades: cases (array de metadados) e source (string com um arquivo TSX executável completo, sem fences).
Cada case: id, title, objective, preconditions, components, actions, expected, requirements, status. Campos de listas são arrays de strings; status='confirmed' para testes executáveis de contrato. Descreva relação RF/RN/CA e fronteiras reais/simuladas.
Use Vitest 4.1.5, React 19.1, React Testing Library 16.3.3. Arquivo será salvo em apps/mobile/src/integration/SUITE.integration.test.tsx.
Importe o harness por '../../../../tests/integration/flow-harness'. Imports de core: '@vale-o-pix/core'. Storage real por '../storage/InitialProfileStorage'. Vitest possui describe,it,expect,vi,beforeEach,afterEach.
Não crie mocks de telas, storage do aplicativo ou core. Os adapters AsyncStorage e Expo Router já estão configurados. Renderiza telas reais usando React Native Web + jsdom: NÃO chamar de E2E em dispositivo.
Use describe('SUITE',...). Cada it/it.each deve ter ID iniciado por 'SUITE-' correspondente ao metadado.
O setup limpa storage/rotas, restaura spies e controla Math.random=0.25 a cada teste. renderFlow monta o fluxo real através de um adaptador de rotas. React Testing Library faz cleanup após cada caso.
Não use sleeps, snapshots grandes ou assertions genéricas. Verifique efeitos persistidos, parâmetros, UI e cálculos por expectativas independentes do core quando possível.
Use await atRoute(...) depois de ações que navegam assincronamente. Pressables sem role podem ser acionados por await press(texto exato); textos de resultados via screen.getByText(/regex/) ou getByRole('alert'). Para preferências, press('Café'), press('Netflix'), etc.
Não invente funções no harness: sua API integral está abaixo. Os registros em routes incluem renderFlow inicial method=replace: não presuma lista inicialmente vazia. nativeStorage.getItem/setItem são vi.fn e nativeData é um Map<string,string> do adapter nativo.
Renda e preço no perfil/rotas são STRINGS. Jornada atual=176h, renda '1760' dá valor-hora 10; compra '60' equivale a 6 horas, apresentada como '6,00 horas do seu trabalho'. Esta é informação contratual de formatação, não um teste pronto.

ORÁCULOS E PENDÊNCIAS:
Requisitos confirmados regem as expectativas, mesmo quando o código estiver errado. CA-02.3/RF-08 exige bloquear renda vazia/não positiva/não numérica no onboarding; implementação é parcial e um teste pode revelar defeito. CA-03.3 pode rejeitar valor inválido na entrada OU na tela Result, conforme especificação atual; não obrigue tela Calculator se o requisito não fixar isso. Deve haver mensagem e nenhum número inválido.
LAC-02: formato monetário alternativo não foi decidido. Use pt-BR para testes confirmados; não imponha suporte a ponto decimal internacional nem adivinhe como interpretar ambiguidades.
LAC-03: fallback específico da lista vazia pendente; asserte apenas que fluxo aceita zero preferências, retorna até quatro comparações válidas e distintas, sem impor IDs fixos ou ordem aleatória exata.
LAC-04/CA-06.2: pré-preenchimento na edição depende de confirmação. Pode testar acesso, salvar alteração e reutilização, mas não tratar pré-preenchimento como contrato aprovado.
LAC-11: recuperação/aviso no Home após storage falhar ou JSON corromper não foi definido. Pode testar rejeição propagada no storage real e integrá-la com dados de entrada/controlador de teste, mas não invente mensagem/fallback e não cause rejection não tratada via clique no Home. Registre lacunas pendentes na análise em vez de inventar testes verdes.
Nenhuma parte deve chamar APIs pagas/externas durante os testes.

REQUISITOS ORIGINAIS:
${read('docs/requisitos-e-especificacao.md')}

FONTES E API DO HARNESS (código atual, não definição de comportamento esperado):
${context}

TAREFA ESPECÍFICA:
`;
fs.mkdirSync(path.join(academic,'prompts'),{recursive:true});
fs.mkdirSync(path.join(academic,'respostas-llm'),{recursive:true});
function write(suite,instruction){
 const p=path.join(academic,'prompts',`prompt-${suite}.md`);
 if(fs.existsSync(p)) throw new Error(`Preserve archived prompt: ${p}`);
 fs.writeFileSync(p,common.replaceAll('SUITE',suite.toUpperCase())+instruction+'\n');
}
write('a-v1',`Estratégia zero-shot funcional, SEM exemplos de teste prontos. Gere 6 métodos it/it.each de integração. Priorize primeiro acesso, perfil/renda/preferências persistidos, retorno com perfil salvo, compra válida, propagação de parâmetros, core real, UI do resultado e novo comparativo. Cada teste independente. Retorne casos e código sem alterar produção.`);
write('b-v1',`Estratégia few-shot negativa/resiliência. Gere 8 métodos it/it.each para fronteiras relevantes, documentando componentes envolvidos. Exemplos de cenários derivados da especificação (não código):
1. Perfil válido e compra vazia: permanecer na Calculator com mensagem 'Informe o valor da compra.' e sem navegação para Result (CA-03.2).
2. selectedComparisonIds='coffee,coffee,desconhecido': usar core real, não duplicar café nem gerar comparação para desconhecido, completar fallback e respeitar limite 4 (RN-11/12/14).
3. Renda '0' no onboarding: não persistir, não ir à Calculator e informar erro (CA-02.3), mesmo que implementação atual não o faça.
Explore casos negativos e limites além dos exemplos, respeitando as pendências documentadas. Não simule as regras que pretende testar. Preserve possíveis testes que revelem defeitos reais.`);
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
fs.writeFileSync(path.join(academic,'referencia-fontes.json'),JSON.stringify({commit:'fe3103d9d9946b3a449469e5bf675b038ce6e3ed',production: Object.fromEntries(files.filter(p=>p.startsWith('apps/')||p.startsWith('packages/')).map(p=>[p,sha(p)])),generated_at:new Date().toISOString()},null,2)+'\n');
console.log('Exact standalone V1 prompts and source reference hashes saved.');
