<#
.SYNOPSIS
    Questerix Unified Deployment Orchestrator
.DESCRIPTION
    Single-command deployment pipeline for all Questerix applications:
    - Landing Pages (Static HTML/CSS)
    - Admin Panel (React + Vite)
    - Student App (Flutter Web)
.PARAMETER Env
    Environment to deploy to: 'production' or 'staging'
.PARAMETER SkipBuild
    Skip the build phase (useful for re-deploying existing builds)
.PARAMETER DryRun
    Validate everything but don't actually deploy
.EXAMPLE
    ./orchestrator.ps1
    ./orchestrator.ps1 -Env staging
    ./orchestrator.ps1 -DryRun
    ./orchestrator.ps1 -SkipBuild
#>

param(
    [ValidateSet('production', 'staging')]
    [string]$Env = 'production',
    
    [switch]$SkipBuild,
    
    [switch]$DryRun
)

# =============================================================================
# CONFIGURATION
# =============================================================================
$ErrorActionPreference = 'Stop'
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$LogFile = Join-Path $ScriptDir "deploy-$(Get-Date -Format 'yyyyMMdd-HHmmss').log"

# =============================================================================
# LOGGING FUNCTIONS
# =============================================================================
function Write-Log {
    param([string]$Level, [string]$Message)
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    $logMessage = "$timestamp [$Level] $Message"
    Add-Content -Path $LogFile -Value $logMessage
    
    switch ($Level) {
        'INFO'    { Write-Host $logMessage -ForegroundColor Cyan }
        'SUCCESS' { Write-Host $logMessage -ForegroundColor Green }
        'WARN'    { Write-Host $logMessage -ForegroundColor Yellow }
        'ERROR'   { Write-Host $logMessage -ForegroundColor Red }
        default   { Write-Host $logMessage }
    }
}

function Write-Info    { param([string]$Msg) Write-Log 'INFO' $Msg }
function Write-Success { param([string]$Msg) Write-Log 'SUCCESS' $Msg }
function Write-Warn    { param([string]$Msg) Write-Log 'WARN' $Msg }
function Write-Err     { param([string]$Msg) Write-Log 'ERROR' $Msg }

function Write-Phase {
    param([string]$Name)
    Write-Host ""
    Write-Info "═══════════════════════════════════════════════════════"
    Write-Info $Name
    Write-Info "═══════════════════════════════════════════════════════"
}

# =============================================================================
# PHASE 1: VALIDATION
# =============================================================================
function Invoke-PhaseValidation {
    Write-Phase "PHASE 1: VALIDATION"
    
    # Check required tools
    $requiredTools = @('node', 'npm', 'flutter', 'wrangler')
    foreach ($tool in $requiredTools) {
        if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) {
            Write-Err "Required tool not found: $tool"
            exit 1
        }
    }
    Write-Success "All required tools available"
    
    # Check secrets file
    $secretsPath = Join-Path $ScriptDir '.secrets'
    if (-not (Test-Path $secretsPath)) {
        Write-Err ".secrets file not found. Copy .secrets.template to .secrets and fill in values."
        exit 1
    }
    
    # Verify .secrets is in .gitignore
    $gitignorePath = Join-Path $ScriptDir '.gitignore'
    if (Test-Path $gitignorePath) {
        $gitignoreContent = Get-Content $gitignorePath -Raw
        if ($gitignoreContent -notmatch '\.secrets') {
            Write-Err ".secrets is NOT in .gitignore! This is a security risk. Aborting."
            exit 1
        }
    }
    Write-Success ".secrets file found and is in .gitignore"
    
    # Load secrets into environment
    Get-Content $secretsPath | ForEach-Object {
        if ($_ -match '^([A-Z_]+)=(.*)$') {
            $key = $Matches[1]
            $value = $Matches[2]
            if ($value -and $value.Trim()) {
                Set-Item -Path "Env:$key" -Value $value.Trim()
            }
        }
    }
    
    if (-not $env:CLOUDFLARE_API_TOKEN) {
        Write-Err "CLOUDFLARE_API_TOKEN not set in .secrets"
        exit 1
    }
    Write-Success "Secrets loaded into environment"
    
    # Determine config file
    $script:ConfigFile = Join-Path $ScriptDir 'master-config.json'
    if ($Env -eq 'staging') {
        $script:ConfigFile = Join-Path $ScriptDir 'master-config.staging.json'
    }
    
    if (-not (Test-Path $script:ConfigFile)) {
        Write-Err "Config file not found: $($script:ConfigFile)"
        exit 1
    }
    
    # Validate JSON syntax
    try {
        $script:Config = Get-Content $script:ConfigFile -Raw | ConvertFrom-Json
    } catch {
        Write-Err "Invalid JSON in $($script:ConfigFile): $_"
        exit 1
    }
    Write-Success "Configuration validated: $($script:ConfigFile)"
    
    $script:DeployVersion = $script:Config.version
    Write-Info "Deployment version: $($script:DeployVersion)"
    Write-Info "Environment: $Env"
}

# =============================================================================
# PHASE 2: ENVIRONMENT GENERATION
# =============================================================================
function Invoke-PhaseGenerateEnv {
    Write-Phase "PHASE 2: ENVIRONMENT GENERATION"
    
    & (Join-Path $ScriptDir 'scripts\deploy\generate-env.ps1') -ConfigFile $script:ConfigFile
    
    Write-Success "Environment files generated"
}

# =============================================================================
# PHASE 3: PARALLEL BUILD
# =============================================================================
function Invoke-PhaseBuild {
    Write-Phase "PHASE 3: PARALLEL BUILD"
    
    if ($SkipBuild) {
        Write-Warn "Skipping build phase (--SkipBuild flag)"
        return
    }
    
    # Clean previous builds (immutable build principle)
    Write-Info "Cleaning previous build artifacts..."
    $adminDist = Join-Path $ScriptDir 'admin-panel\dist'
    $studentBuild = Join-Path $ScriptDir 'student-app\build\web'
    
    if (Test-Path $adminDist) { Remove-Item -Recurse -Force $adminDist }
    if (Test-Path $studentBuild) { Remove-Item -Recurse -Force $studentBuild }
    
    # Build in parallel using jobs
    Write-Info "Starting parallel builds..."
    
    $adminJob = Start-Job -ScriptBlock {
        param($Dir)
        Set-Location (Join-Path $Dir 'admin-panel')
        npm ci --silent 2>&1
        npm run build 2>&1
    } -ArgumentList $ScriptDir
    
    $studentJob = Start-Job -ScriptBlock {
        param($Dir, $DefinesFile)
        Set-Location (Join-Path $Dir 'student-app')
        $defines = Get-Content $DefinesFile -Raw
        flutter clean 2>&1
        flutter pub get 2>&1
        Invoke-Expression "flutter build web --release --web-renderer canvaskit $defines" 2>&1
    } -ArgumentList $ScriptDir, (Join-Path $ScriptDir '.flutter-defines.tmp')
    
    Write-Info "Waiting for parallel builds to complete..."
    
    # Wait for jobs and check results
    $adminResult = Receive-Job -Job $adminJob -Wait
    $studentResult = Receive-Job -Job $studentJob -Wait
    
    $adminSuccess = $adminJob.State -eq 'Completed'
    $studentSuccess = $studentJob.State -eq 'Completed'
    
    # Log output
    Add-Content -Path $LogFile -Value "=== Admin Panel Build Output ==="
    Add-Content -Path $LogFile -Value ($adminResult -join "`n")
    Add-Content -Path $LogFile -Value "=== Student App Build Output ==="
    Add-Content -Path $LogFile -Value ($studentResult -join "`n")
    
    Remove-Job -Job $adminJob, $studentJob
    
    # Verify build outputs exist
    if (-not (Test-Path $adminDist)) {
        Write-Err "Admin Panel build output not found. Check $LogFile for details."
        exit 1
    }
    
    if (-not (Test-Path $studentBuild)) {
        Write-Err "Student App build output not found. Check $LogFile for details."
        exit 1
    }
    
    Write-Success "All builds completed successfully"
}

# =============================================================================
# PHASE 4: DEPLOY
# =============================================================================
function Invoke-PhaseDeploy {
    Write-Phase "PHASE 4: PARALLEL DEPLOY TO CLOUDFLARE"
    
    $cfLanding = $script:Config.cloudflare.landing_project
    $cfAdmin = $script:Config.cloudflare.admin_project
    $cfStudent = $script:Config.cloudflare.student_project
    
    if ($DryRun) {
        Write-Warn "Dry run mode - skipping actual deployment"
        Write-Info "Would deploy:"
        Write-Info "  - Landing Pages -> $cfLanding"
        Write-Info "  - Admin Panel   -> $cfAdmin"
        Write-Info "  - Student App   -> $cfStudent"
        return
    }
    
    & (Join-Path $ScriptDir 'scripts\deploy\deploy-all.ps1') -ConfigFile $script:ConfigFile
    
    Write-Success "All applications deployed"
}

# =============================================================================
# PHASE 5: CLEANUP & REPORT
# =============================================================================
function Invoke-PhaseCleanup {
    Write-Phase "PHASE 5: CLEANUP & REPORT"
    
    # Remove generated env files (prevent stale config)
    $envLocal = Join-Path $ScriptDir 'admin-panel\.env.local'
    $envProd = Join-Path $ScriptDir 'admin-panel\.env.production.local'
    $flutterDefines = Join-Path $ScriptDir '.flutter-defines.tmp'
    
    if (Test-Path $envLocal) { Remove-Item -Force $envLocal }
    if (Test-Path $envProd) { Remove-Item -Force $envProd }
    if (Test-Path $flutterDefines) { Remove-Item -Force $flutterDefines }
    
    # Final report
    $cfLanding = $script:Config.cloudflare.landing_project
    $cfAdmin = $script:Config.cloudflare.admin_project
    $cfStudent = $script:Config.cloudflare.student_project
    
    Write-Host ""
    Write-Success "═══════════════════════════════════════════════════════"
    Write-Success "DEPLOYMENT COMPLETE"
    Write-Success "═══════════════════════════════════════════════════════"
    Write-Info "Version: $($script:DeployVersion)"
    Write-Info "Environment: $Env"
    Write-Host ""
    Write-Info "Live URLs:"
    Write-Info "  Landing:  https://$cfLanding.pages.dev"
    Write-Info "  Admin:    https://$cfAdmin.pages.dev"
    Write-Info "  Student:  https://$cfStudent.pages.dev"
    Write-Host ""
    Write-Info "Log file: $LogFile"
}

# =============================================================================
# MAIN EXECUTION
# =============================================================================
function Main {
    Write-Host ""
    Write-Info "🚀 QUESTERIX UNIFIED DEPLOYMENT PIPELINE"
    Write-Info "Started at: $(Get-Date)"
    Write-Host ""
    
    Invoke-PhaseValidation
    Invoke-PhaseGenerateEnv
    Invoke-PhaseBuild
    Invoke-PhaseDeploy
    Invoke-PhaseCleanup
}

# Run main function
Main
