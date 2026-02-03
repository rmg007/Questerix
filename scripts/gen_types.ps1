$ErrorActionPreference = "Stop"

# Use stored credentials
$dbPassword = "QpJIzi2r6vaoghG5"
$projectRef = "qvslbiceoonrgjxzkotb"
$dbUrl = "postgresql://postgres:${dbPassword}@db.${projectRef}.supabase.co:5432/postgres"

Write-Host "Generating TypeScript types from DB..." -ForegroundColor Cyan

# Fallback to npx
$cmd = "npx -y supabase"

# Run command
$cmdArgs = "gen types typescript --db-url ""$dbUrl"""
$outputFile = "../admin-panel/src/lib/database.types.ts"

Write-Host "Running: $cmd $cmdArgs > $outputFile" -ForegroundColor Cyan
Set-Location "scripts"
Invoke-Expression "$cmd $cmdArgs > $outputFile"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Types generated successfully at $outputFile" -ForegroundColor Green
} else {
    Write-Host "Type generation failed." -ForegroundColor Red
    exit $LASTEXITCODE
}
