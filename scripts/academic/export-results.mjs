import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root=process.cwd();
const base='docs/academic/unidade-3-testes-integracao';
const output=`${base}/resultados/evidencias`;
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const normalize=(text)=>text
 .replaceAll(root,'/workspace/Quanto-Custa-na-Vida-Real')
 .replaceAll(root.replaceAll('\\','/'),'/workspace/Quanto-Custa-na-Vida-Real')
 .replaceAll(encodeURI(root.replaceAll('\\','/')),'/workspace/Quanto-Custa-na-Vida-Real')
 .replaceAll(path.dirname(root),'/workspace')
 .replaceAll(path.dirname(root).replaceAll('\\','/'),'/workspace')
 .replaceAll(encodeURI(path.dirname(root).replaceAll('\\','/')),'/workspace')
 .replace(/\u001b\[[0-9;]*m/g,'')
 .replaceAll('\r\n','\n');
const manifest={};
function publish(input,relative){
 if(!fs.existsSync(input)) return;
 const raw=fs.readFileSync(input);
 function sanitize(value){
  if(typeof value==='string')return normalize(value);
  if(Array.isArray(value))return value.map(sanitize);
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,v])=>[normalize(key),sanitize(v)]));
  return value;
 }
 const text=input.endsWith('.json')?JSON.stringify(sanitize(JSON.parse(raw.toString('utf8'))),null,2)+'\n':normalize(raw.toString('utf8'));
 const target=path.join(output,relative);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,text);
 manifest[relative]={original_sha256:hash(raw),public_sha256:hash(Buffer.from(text)),transformation:'local-root replaced in keys/values, ANSI colors removed, LF normalized and JSON formatted; assertions and outcomes preserved'};
}
for(const name of ['tests.json','tests.txt','typecheck.txt']) publish(`.experiment-local/${name}`,`baseline/${name}`);
publish('.experiment-local/baseline-coverage/coverage-summary.json','baseline/coverage-summary.json');
const results={};
for(const stage of ['before-fixes','test-correction-only','after-fixes']){
 results[stage]={};
 for(const suite of ['a-v1','a-v2','b-v1','b-v2','combined']){
  const dir=`.experiment-local/${stage}/${suite}`;
  if(!fs.existsSync(`${dir}/tests.json`))continue;
  const report=JSON.parse(fs.readFileSync(`${dir}/tests.json`,'utf8'));
  const status=JSON.parse(fs.readFileSync(`${dir}/status.json`,'utf8'));
  const coverageFile=`${dir}/coverage/coverage-summary.json`;
  const coverage=fs.existsSync(coverageFile)?JSON.parse(fs.readFileSync(coverageFile,'utf8')).total:null;
  const cases=report.testResults.flatMap(testFile=>testFile.assertionResults.map(test=>({name:test.fullName,status:test.status})));
  results[stage][suite]={total:report.numTotalTests,passed:report.numPassedTests,failed:report.numFailedTests,pending:report.numPendingTests,unique_executor_names:new Set(cases.map(c=>c.name)).size,typecheck_exit:status.typecheck_exit,test_exit:status.test_exit,coverage,cases};
  for(const name of ['tests.json','execution.txt','status.json','typecheck.txt'])publish(`${dir}/${name}`,`${stage}/${suite}/${name}`);
  publish(coverageFile,`${stage}/${suite}/coverage-summary.json`);
  // LCOV and instrumented maps include source paths but contain useful raw evidence.
  publish(`${dir}/coverage/lcov.info`,`${stage}/${suite}/lcov.info`);
 }
}
for(const name of ['final-tests.json','final-tests.txt','final-typecheck.txt','web-export.txt'])publish(`.experiment-local/${name}`,`final/${name}`);
publish('.experiment-local/final-coverage/coverage-summary.json','final/coverage-summary.json');
for(const name of ['tests.json','status.json','execution.txt'])publish(`.experiment-local/replay-validation/.experiment-local/replay-before-fixes/combined/${name}`,`replay-original/${name}`);
fs.mkdirSync(output,{recursive:true});
fs.writeFileSync(`${output}/manifest.json`,JSON.stringify(manifest,null,2)+'\n');
fs.writeFileSync(`${base}/resultados/metricas.json`,JSON.stringify(results,null,2)+'\n');
console.log(Object.fromEntries(Object.entries(results).map(([stage,suites])=>[stage,Object.fromEntries(Object.entries(suites).map(([suite,r])=>[suite,{total:r.total,passed:r.passed,failed:r.failed,branches:r.coverage?.branches,lines:r.coverage?.lines}]))])));
