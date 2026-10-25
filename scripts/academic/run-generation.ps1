param([Parameter(Mandatory)][ValidateSet('a-v1','a-v2','b-v1','b-v2')][string]$Suite,
      [string]$Output='.experiment-local/new-generations')
$ErrorActionPreference='Stop'
$taskRoot=Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
Push-Location $taskRoot
try {
    New-Item -ItemType Directory -Force $Output | Out-Null
    if(Test-Path "$Output/$Suite-response.json") { throw 'Choose a new output directory to preserve the previous response.' }
    Get-Content "docs/academic/unidade-3-testes-integracao/prompts/prompt-$Suite.md" -Raw | codex exec --ephemeral --json --sandbox read-only --skip-git-repo-check -o "$Output/$Suite-response.json" - 1> "$Output/$Suite-events.jsonl" 2> "$Output/$Suite-stderr.txt"
    if($LASTEXITCODE -ne 0) { throw 'LLM call failed; inspect the original output and preserve it.' }
} finally { Pop-Location }
