import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const suite=process.argv[2];
if(!['a-v1','a-v2','b-v1','b-v2'].includes(suite)) throw new Error('Specify suite');
const root=process.cwd();
const base='docs/academic/unidade-3-testes-integracao';
const raw=fs.readFileSync(path.join(root,`.experiment-local/${suite}-response.json`));
const data=JSON.parse(raw.toString('utf8').replace(/^\uFEFF/,''));
if(!Array.isArray(data.cases)||typeof data.source!=='string') throw new Error('Response schema mismatch; preserve raw and diagnose');
const target=`apps/mobile/src/integration/${suite}.integration.test.tsx`;
if(fs.existsSync(target)) throw new Error('Do not overwrite executed generated source');
fs.mkdirSync(path.dirname(target),{recursive:true});
fs.writeFileSync(target,data.source);
fs.mkdirSync(`${base}/respostas-llm`,{recursive:true});
fs.writeFileSync(`${base}/respostas-llm/${suite}.json`,raw);
fs.copyFileSync(`.experiment-local/${suite}-events.jsonl`,`${base}/respostas-llm/${suite}-events.jsonl`);
fs.writeFileSync(`${base}/respostas-llm/${suite}-cases.json`,JSON.stringify(data.cases,null,2)+'\n');
const events=fs.readFileSync(`.experiment-local/${suite}-events.jsonl`,'utf8').trim().split(/\r?\n/).map(line=>JSON.parse(line));
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const manifestPath=`${base}/geracoes.json`;
const manifest=fs.existsSync(manifestPath)?JSON.parse(fs.readFileSync(manifestPath,'utf8')):{};
manifest[suite]={model_configured:'gpt-6.1-sol',reasoning_effort_configured:'medium',provider:'OpenAI via Codex CLI',model_snapshot:'not exposed',temperature:'not exposed',cli:'0.164.0-alpha.11.1',session:events.find(e=>e.type==='thread.started')?.thread_id,usage:events.findLast(e=>e.type==='turn.completed')?.usage,
 date_utc:fs.statSync(`.experiment-local/${suite}-response.json`).mtime.toISOString(),prompt_sha256:sha(fs.readFileSync(`${base}/prompts/prompt-${suite}.md`)),response_sha256:sha(raw),source_sha256:sha(Buffer.from(data.source)),cases_metadata:data.cases.length,source:target,
 tool_events:events.filter(e=>e.type==='item.completed'&&e.item?.type!=='agent_message').map(e=>e.item.type),post_generation_edits:[]};
fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({suite,metadata:data.cases.map(c=>({id:c.id,title:c.title,requirements:c.requirements})),testDeclarations:(data.source.match(/\b(?:it|test)(?:\.each\([^]*?\))?\(/g)??[]).length},null,2));
