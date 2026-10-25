import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const stage=process.argv[2]??'before-fixes';
const suites=process.argv.slice(3).length?process.argv.slice(3):['a-v1','a-v2','b-v1','b-v2','combined'];
const execute=(script,args)=>spawnSync(process.execPath,[script,...args],{encoding:'utf8',timeout:120000});
for(const suite of suites){
 const output=path.resolve(`.experiment-local/${stage}/${suite}`);
 if(fs.existsSync(`${output}/tests.json`)) throw new Error(`Preserve existing evidence ${output}`);
 fs.mkdirSync(output,{recursive:true});
 let typecheck;
 if(suite!=='combined'){
   const config=path.resolve(`.experiment-local/typecheck-${suite}.json`);
   fs.writeFileSync(config,JSON.stringify({extends:'../apps/mobile/tsconfig.json',compilerOptions:{noEmit:true},include:[`../apps/mobile/src/integration/${suite}.integration.test.tsx`,'../tests/integration/setup.ts']},null,2));
   typecheck=execute('node_modules/typescript/bin/tsc',['-p',config]);
   fs.writeFileSync(`${output}/typecheck.txt`,typecheck.stdout+typecheck.stderr);
 }
 const filter=suite==='combined'?['--project=integration','apps/mobile/src/integration']:['--project=integration',`apps/mobile/src/integration/${suite}.integration.test.tsx`];
 const run=execute('node_modules/vitest/vitest.mjs',['run',...filter,'--coverage',`--coverage.reportsDirectory=${output}/coverage`,'--coverage.reportOnFailure=true','--reporter=default','--reporter=json',`--outputFile=${output}/tests.json`]);
 fs.writeFileSync(`${output}/execution.txt`,run.stdout+run.stderr);
 fs.writeFileSync(`${output}/status.json`,JSON.stringify({stage,suite,typecheck_exit:typecheck?.status??null,test_exit:run.status,signal:run.signal,error:run.error?.message??null},null,2)+'\n');
 console.log(`${stage}/${suite}: typecheck=${typecheck?.status??'combined not checked here'} tests=${run.status}`);
 if(fs.existsSync(`${output}/tests.json`)){
   const report=JSON.parse(fs.readFileSync(`${output}/tests.json`,'utf8'));
   console.log(JSON.stringify({total:report.numTotalTests,passed:report.numPassedTests,failed:report.numFailedTests,failures:report.testResults.flatMap(s=>s.assertionResults.filter(t=>t.status==='failed').map(t=>({name:t.fullName,message:t.failureMessages[0]?.split('\n')[0]})))},null,2));
 }else console.log((run.stdout+run.stderr).slice(-4000));
}
