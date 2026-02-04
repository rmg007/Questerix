# URGENT: Fix Slack Bot Permissions

## Problem
The Slack bot can send messages BUT cannot read messages from channels.

Error: `channel_not_found` when trying to read message history.

## Root Cause
Missing Bot Token Scopes in Slack App configuration.

---

## Fix Instructions

### Step 1: Add Missing Scopes

1. Go to https://api.slack.com/apps
2. Click on your app: **"Questerix Ops"**
3. Click **"OAuth & Permissions"** in left sidebar
4. Scroll to **"Scopes"** → **"Bot Token Scopes"**

5. **ADD these scopes** (if not already present):
   - ✅ `channels:history` - View messages in public channels
   - ✅ `channels:read` - View basic channel info
   - ✅ `chat:write` - Send messages (you already have this)
   - ✅ `files:write` - Upload files (you already have this)
   - ✅ `groups:history` - View messages in private channels
   - ✅ `groups:read` - View info about private channels
   - ✅ `im:history` - View messages in direct messages
   - ✅ `mpim:history` - View messages in group DMs

### Step 2: Reinstall the App

After adding scopes, Slack will show a yellow banner:

> "You've changed the scopes your app uses. Please reinstall your app for these changes to take effect."

Click **"reinstall your app"** button

### Step 3: Get the New Bot Token

After reinstalling:
1. The Bot User OAuth Token will be regenerated
2. Copy the NEW token (starts with `xoxb-`)
3. It might be the same, but verify it

### Step 4: Update Environment Variable

If the token changed:

```powershell
[System.Environment]::SetEnvironmentVariable('SLACK_BOT_TOKEN', 'NEW_TOKEN_HERE', 'User')
```

### Step 5: Find Correct Channel ID

Once the bot has permissions, find the channel ID:

**Method 1: From Slack**
1. Open Slack desktop/web
2. Go to `#dev-questerix` channel
3. Click channel name at top
4. Scroll down, click "More"
5. Look for "Channel ID" - copy it

**Method 2: Via Bot (after fixing scopes)**
```powershell
$token = $env:SLACK_BOT_TOKEN
$uri = "https://slack.com/api/conversations.list?types=public_channel,private_channel"
$response = Invoke-RestMethod -Uri $uri -Headers @{ "Authorization" = "Bearer $token" }
$response.channels | Where-Object { $_.name -eq "dev-questerix" }
```

### Step 6: Update Bridge Script

Edit `scripts/slack-bridge.ps1`:

Change line 11 from:
```powershell
$SLACK_CHANNEL = "C0ADBB25JGZ"  # Wrong ID
```

To:
```powershell
$SLACK_CHANNEL = "CORRECT_CHANNEL_ID_HERE"  # Replace with actual ID
```

### Step 7: Restart Bridge

```powershell
# Kill existing bridge
Get-Process powershell | Where-Object {$_.CommandLine -like "*slack-bridge*"} | Stop-Process

# Start fresh
Start-Process powershell -ArgumentList "-ExecutionPolicy Bypass -WindowStyle Hidden -File `"C:\Users\mhali\OneDrive\Desktop\Important Projects\Questerix\scripts\slack-bridge.ps1`""
```

---

## Verification

After fixing, test with this command:

```powershell
$token = $env:SLACK_BOT_TOKEN
$channel = "YOUR_CORRECT_CHANNEL_ID"
$uri = "https://slack.com/api/conversations.history?channel=$channel&limit=5"
$response = Invoke-RestMethod -Uri $uri -Headers @{ "Authorization" = "Bearer $token" }

if ($response.ok) {
    Write-Host "SUCCESS! Bot can read messages"
    Write-Host "Found $($response.messages.Count) messages"
} else {
    Write-Host "ERROR: $($response.error)"
}
```

---

## Quick Checklist

- [ ] Add `channels:history` scope
- [ ] Add `channels:read` scope
- [ ] Add `groups:history` scope (for private channels)
- [ ] Reinstall app to workspace
- [ ] Get correct channel ID for `#dev-questerix`
- [ ] Update bridge script with correct channel ID
- [ ] Restart bridge script
- [ ] Test: Send `@agent echo test` in Slack

---

## Expected Result

After fixing:
1. Bot can read messages from `#dev-questerix`
2. Bridge detects `@agent` commands within 5 seconds
3. Commands execute and results post back to Slack
4. You can control everything from your phone! 📱
