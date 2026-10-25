import fs from 'node:fs';
const base='docs/academic/unidade-3-testes-integracao';
const metrics=JSON.parse(fs.readFileSync(`${base}/resultados/metricas.json`,'utf8'));
const fmt=n=>n.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
let md='# Execuções e métricas medidas\n\n';
md+='Referência original: fe3103d. Node 24.12.0/npm 11.7.0, React 19.1.0, React Native 0.81.5, Expo 54.0.34, RN Web 0.21.2, Vitest 4.1.5, TypeScript 6.0.3. Baseline: 31/31 testes originais aprovados em sete arquivos e typecheck aprovado. Nenhum teste anterior foi alterado.\n\n';
for(const [stage,title] of [['before-fixes','Comparação das saídas originais no mesmo produto'],['test-correction-only','Correção isolada da preparação B V2, produto ainda original'],['after-fixes','Reexecução após correções de produção']]){
 md+=`## ${title}\n\n| Suíte | Casos | Identidades únicas | Aprovados | Falhas | Typecheck | Instruções/statements | Ramos |\n|---|---:|---:|---:|---:|---|---:|---:|\n`;
 for(const [suite,r] of Object.entries(metrics[stage])){
  md+=`| ${suite} | ${r.total} | ${r.unique_executor_names} | ${r.passed} | ${r.failed} | ${r.typecheck_exit===null?'conjunto, validado também no typecheck geral':r.typecheck_exit===0?'aprovado':'falhou'} | ${r.coverage.statements.covered}/${r.coverage.statements.total} (${fmt(r.coverage.statements.pct)}%) | ${r.coverage.branches.covered}/${r.coverage.branches.total} (${fmt(r.coverage.branches.pct)}%) |\n`;
 }
 md+='\n';
}
const final=JSON.parse(fs.readFileSync('.experiment-local/final-tests.json','utf8'));
const coverage=JSON.parse(fs.readFileSync('.experiment-local/final-coverage/coverage-summary.json','utf8')).total;
md+=`## Suíte geral final\n\n**${final.numPassedTests}/${final.numTotalTests} aprovados**, zero ignorados: 31 originais + 61 gerados + um smoke de infraestrutura não gerado pela LLM. Instruções/statements ${coverage.statements.covered}/${coverage.statements.total} (${fmt(coverage.statements.pct)}%); ramos ${coverage.branches.covered}/${coverage.branches.total} (${fmt(coverage.branches.pct)}%); linhas ${coverage.lines.covered}/${coverage.lines.total} (${fmt(coverage.lines.pct)}%); funções ${coverage.functions.covered}/${coverage.functions.total} (${fmt(coverage.functions.pct)}%).\n\n`;
md+='Os 61 casos vêm de 28 métodos (6 A V1, 6 A V2, 8 B V1 e 8 B V2); parametrização expande para 12/6/18/25 casos. Quatro arquivos gerados passaram no typecheck original e foram executados; não se mediu compilação isolada de cada linha de dados. Três fontes executadas coincidem com o source da resposta; B V2 tem uma correção documentada de Arrange e nenhuma assertion alterada. O termo statements refere-se à instrumentação JS do V8, não a instruções de máquina.\n\n';
md+='Identidade única significa nome completo do caso no executor, não unicidade semântica. Há sobreposição de renda inválida, compra inválida, fallback e repetição entre suítes. A diversidade funcional e suas lacunas são descritas na matriz de rastreabilidade; não foi inventada uma contagem de deduplicação semântica perfeita nem nota percentual de qualidade.\n\n';
md+='A comparação de prompts usa a primeira tabela: fonte de produção idêntica. A terceira tabela tem outro produto (mais validação e semântica web), portanto seu denominador mudou; diferenças antes/depois não são efeito exclusivo dos prompts. A V2 muda o recorte para fluxos funcionais e tem menos casos negativos; todos passarem não significa que D-01/D-02 deixaram de existir no código original. B V2 amplia ramos, mas também trouxe T-01: mais casos não dispensam curadoria.\n\n';
md+='Cobertura filtrada para quatro telas, InitialProfileStorage e core; exclui testes, framework e dependências. Os totais por suíte incluem fontes não executadas dentro desse recorte. Baseline de cobertura foi coletada após instalar o suporte V8, ainda com os mesmos 31 testes e fontes fe3103d: 51/121 statements e 39/82 ramos. Não atribuir cobertura total do app, Expo Router real ou plataforma nativa a esse filtro.\n\n';
md+='Resultados JSON, logs, typecheck e LCOV em [evidencias](evidencias/). Caminho local substituído, cores ANSI removidas e LF normalizado; hashes originais/públicos em manifest.json. Conteúdo de assertions, resultados e tempos preservados. Respostas LLM originais não foram alteradas. Nenhum resultado do projeto experimental abandonado foi reutilizado.\n';
fs.writeFileSync(`${base}/resultados/execucoes.md`,md);
console.log('Measured report rendered.');
