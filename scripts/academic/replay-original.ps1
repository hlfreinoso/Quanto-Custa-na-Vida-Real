param([string]$Name = ('replay-' + [guid]::NewGuid().ToString('N')),
      [string[]]$Suites = @('a-v1','a-v2','b-v1','b-v2','combined'))
$ErrorActionPreference='Stop'
$taskRoot=Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
if($Name -notmatch '^[a-zA-Z0-9-]+$') { throw 'Use a simple directory name.' }
$replayRoot=Join-Path $taskRoot ".experiment-local/$Name"
if(Test-Path $replayRoot) { throw 'Refusing to overwrite replay evidence.' }
New-Item -ItemType Directory -Path $replayRoot | Out-Null
$archive=Join-Path $replayRoot 'baseline.tar'
git -C $taskRoot archive --format=tar --output=$archive fe3103d9d9946b3a449469e5bf675b038ce6e3ed
if($LASTEXITCODE -ne 0) { throw 'Cannot archive baseline.' }
tar -xf $archive -C $replayRoot
if($LASTEXITCODE -ne 0) { throw 'Cannot extract baseline.' }
foreach($file in @('package.json','package-lock.json','vitest.config.mjs')) {
    Copy-Item -LiteralPath (Join-Path $taskRoot $file) -Destination (Join-Path $replayRoot $file)
}
Copy-Item -LiteralPath (Join-Path $taskRoot 'tests') -Destination (Join-Path $replayRoot 'tests') -Recurse
$destination=Join-Path $replayRoot 'apps/mobile/src/integration'
New-Item -ItemType Directory -Force $destination | Out-Null
foreach($suite in @('a-v1','a-v2','b-v1','b-v2')) {
    $response=Get-Content -LiteralPath (Join-Path $taskRoot "docs/academic/unidade-3-testes-integracao/respostas-llm/$suite.json") -Raw | ConvertFrom-Json
    [System.IO.File]::WriteAllText((Join-Path $destination "$suite.integration.test.tsx"),$response.source,[System.Text.UTF8Encoding]::new($false))
}
Push-Location $replayRoot
try {
    npm ci --no-audit --no-fund
    if($LASTEXITCODE -ne 0) { throw 'Replay dependency installation failed.' }
    node (Join-Path $taskRoot 'scripts/academic/evaluate.mjs') replay-before-fixes @Suites
    if($LASTEXITCODE -ne 0) { throw 'Replay infrastructure failed; inspect reports.' }
    Write-Output "Original sources and original LLM tests replayed in $replayRoot. Failures are expected; read each status.json."
} finally { Pop-Location }
