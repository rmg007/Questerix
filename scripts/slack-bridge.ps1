# Slack Command Bridge for Antigravity
# Monitors #dev-questerix channel for @agent commands and executes them

param(
    [int]$PollIntervalSeconds = 5,
    [switch]$Debug
)

# Configuration
$SLACK_BOT_TOKEN = $env:SLACK_BOT_TOKEN
$SLACK_CHANNEL = "C0ADBB25JGZ"  # #dev-questerix channel ID
$PROJECT_ROOT = "C:\Users\mhali\OneDrive\Desktop\Important Projects\Questerix"
$STATE_FILE = "$PROJECT_ROOT\.slack-bridge-state.json"

# Validate environment
if (-not $SLACK_BOT_TOKEN) {
    Write-Error "[ERROR] SLACK_BOT_TOKEN environment variable not set!"
    exit 1
}

Write-Host "[BRIDGE] Slack Command Bridge Started" -ForegroundColor Green
Write-Host "[CONFIG] Channel: #dev-questerix" -ForegroundColor Cyan
Write-Host "[CONFIG] Poll Interval: $PollIntervalSeconds seconds" -ForegroundColor Cyan
Write-Host "[CONFIG] Trigger: @agent <command>" -ForegroundColor Cyan
Write-Host ""

# Load last processed message timestamp
$lastTimestamp = "0"
if (Test-Path $STATE_FILE) {
    $state = Get-Content $STATE_FILE | ConvertFrom-Json
    $lastTimestamp = $state.lastTimestamp
    if ($Debug) { Write-Host "[DEBUG] Loaded state: lastTimestamp=$lastTimestamp" -ForegroundColor Gray }
}

function Save-State {
    param([string]$timestamp)
    @{ lastTimestamp = $timestamp } | ConvertTo-Json | Set-Content $STATE_FILE
}

function Get-SlackMessages {
    param([string]$since)
    
    $uri = "https://slack.com/api/conversations.history?channel=$SLACK_CHANNEL&oldest=$since&limit=10"
    $headers = @{
        "Authorization" = "Bearer $SLACK_BOT_TOKEN"
        "Content-Type" = "application/json"
    }
    
    try {
        $response = Invoke-RestMethod -Uri $uri -Headers $headers -Method Get
        if ($response.ok) {
            return $response.messages
        } else {
            Write-Warning "[WARN] Slack API error: $($response.error)"
            return @()
        }
    } catch {
        Write-Warning "[WARN] Failed to fetch messages: $_"
        return @()
    }
}

function Send-SlackMessage {
    param(
        [string]$text,
        [string]$threadTs = $null
    )
    
    $body = @{
        channel = $SLACK_CHANNEL
        text = $text
    }
    
    if ($threadTs) {
        $body.thread_ts = $threadTs
    }
    
    $headers = @{
        "Authorization" = "Bearer $SLACK_BOT_TOKEN"
        "Content-Type" = "application/json"
    }
    
    try {
        $response = Invoke-RestMethod -Uri "https://slack.com/api/chat.postMessage" -Method Post -Headers $headers -Body ($body | ConvertTo-Json)
        return $response.ok
    } catch {
        Write-Warning "[WARN] Failed to send message: $_"
        return $false
    }
}

function Execute-Command {
    param(
        [string]$command,
        [string]$threadTs
    )
    
    Write-Host "[EXEC] Executing: $command" -ForegroundColor Yellow
    
    $startTime = Get-Date
    
    try {
        # Execute command and capture output
        $output = & powershell.exe -NoProfile -Command "Set-Location '$PROJECT_ROOT'; $command 2>&1" | Out-String
        $exitCode = $LASTEXITCODE
        $duration = ((Get-Date) - $startTime).TotalSeconds
        
        # Format response
        if ($exitCode -eq 0 -or $null -eq $exitCode) {
            $lines = ($output -split "`n").Count
            
            if ($lines -le 20) {
                # Short output - post inline
                $message = "[SUCCESS] Command completed: ``$command```n``````n$output``````nDuration: $([math]::Round($duration, 1))s"
                Send-SlackMessage -text $message -threadTs $threadTs | Out-Null
            } else {
                # Long output - post summary
                $preview = ($output -split "`n" | Select-Object -First 15) -join "`n"
                $message = "[SUCCESS] Command completed: ``$command```n``````n$preview`n... ($lines total lines)``````nDuration: $([math]::Round($duration, 1))s"
                Send-SlackMessage -text $message -threadTs $threadTs | Out-Null
            }
        } else {
            # Command failed
            $message = "[FAILED] Command failed: ``$command```n``````n$output``````nExit code: $exitCode`nDuration: $([math]::Round($duration, 1))s"
            Send-SlackMessage -text $message -threadTs $threadTs | Out-Null
        }
        
        Write-Host "[DONE] Command executed in $([math]::Round($duration, 1))s" -ForegroundColor Green
        
    } catch {
        Write-Host "[ERROR] Execution error: $_" -ForegroundColor Red
        $message = "[ERROR] Execution error: ``$command```n``````n$_``````"
        Send-SlackMessage -text $message -threadTs $threadTs | Out-Null
    }
}

# Main loop
Write-Host "[READY] Listening for commands..." -ForegroundColor Green
Write-Host ""

while ($true) {
    try {
        # Fetch new messages
        $messages = Get-SlackMessages -since $lastTimestamp
        
        if ($messages.Count -gt 0) {
            # Process messages in chronological order (oldest first)
            $messages = $messages | Sort-Object -Property ts
            
            foreach ($msg in $messages) {
                # Update timestamp
                $lastTimestamp = $msg.ts
                Save-State -timestamp $lastTimestamp
                
                # Check if message starts with @agent
                $text = $msg.text
                if ($text -match '^\s*@agent\s+(.+)$') {
                    $command = $Matches[1].Trim()
                    
                    Write-Host "[COMMAND] New command from Slack: $command" -ForegroundColor Cyan
                    
                    # Execute command
                    Execute-Command -command $command -threadTs $msg.ts
                }
            }
        }
        
        # Wait before next poll
        Start-Sleep -Seconds $PollIntervalSeconds
        
    } catch {
        Write-Warning "[WARN] Error in main loop: $_"
        Start-Sleep -Seconds $PollIntervalSeconds
    }
}
