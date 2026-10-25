import fs from 'node:fs';
import crypto from 'node:crypto';
import ts from 'typescript';
const base='docs/academic/unidade-3-testes-integracao';
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
function assertionCalls(source){
 const tree=ts.createSourceFile('generated.tsx',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 const calls=[];
 function visit(node){
  if(ts.isCallExpression(node)&&/^expect(?:\.soft)?\(/.test(node.getText(tree)))calls.push(node.getText(tree));
  ts.forEachChild(node,visit);
 }
 visit(tree);return calls;
}
const generations=JSON.parse(fs.readFileSync(`${base}/geracoes.json`,'utf8'));
for(const [suite,g] of Object.entries(generations)){
 const raw=fs.readFileSync(`${base}/respostas-llm/${suite}.json`);
 const response=JSON.parse(raw.toString('utf8').replace(/^\uFEFF/,''));
 if(sha(raw)!==g.response_sha256)throw new Error(`${suite}: original response changed`);
 if(sha(fs.readFileSync(`${base}/prompts/prompt-${suite}.md`))!==g.prompt_sha256)throw new Error(`${suite}: exact prompt changed`);
 if(sha(Buffer.from(response.source))!==g.source_sha256)throw new Error(`${suite}: original generated source changed`);
 const executedHash=g.executed_source_sha256??g.source_sha256;
 if(sha(fs.readFileSync(g.source))!==executedHash)throw new Error(`${suite}: executed source changed without intervention record`);
 if(executedHash!==g.source_sha256&&!g.post_generation_edits.length)throw new Error(`${suite}: missing intervention record`);
 if(JSON.stringify(assertionCalls(response.source))!==JSON.stringify(assertionCalls(fs.readFileSync(g.source,'utf8'))))throw new Error(`${suite}: an assertion was changed`);
 if(g.tool_events.length)throw new Error(`${suite}: unexpected tool use, review experiment provenance`);
}
const evidence=`${base}/resultados/evidencias/manifest.json`;
if(fs.existsSync(evidence))for(const [relative,record] of Object.entries(JSON.parse(fs.readFileSync(evidence,'utf8')))){
 if(sha(fs.readFileSync(`${base}/resultados/evidencias/${relative}`))!==record.public_sha256)throw new Error(`Public report changed: ${relative}`);
}
console.log(`Exact prompts, responses and ${Object.keys(generations).length} generated sources verified; public reports unchanged.`);
