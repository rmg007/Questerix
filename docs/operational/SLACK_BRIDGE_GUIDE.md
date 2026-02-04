# Slack Command Bridge - User Guide

## What Is This?

The Slack Command Bridge is a **PowerShell script** that enables you to control your development environment from Slack mobile app. It polls the `#dev-questerix` Slack channel for commands and executes them automatically.

---

## How It Works

1. **You send**: `@agent git status` in Slack
2. **Bridge receives**: Polls Slack every 5 seconds
3. **Command executes**: Runs `git status` in project directory
4. **Results posted**: Output appears in Slack thread

---

## Quick Start

### 1. Start the Bridge

**Option A: Run in Terminal** (for testing)
```powershell
cd "C:\Users\mhali\OneDrive\Desktop\Important Projects\Questerix"
.\scripts\slack-bridge.ps1
```

**Option B: Run in Background** (recommended)
```powershell
Start-Process powershell -ArgumentList "-ExecutionPolicy Bypass -WindowStyle Hidden -File `"C:\Users\mhali\OneDrive\Desktop\Important Projects\Questerix\scripts\slack-bridge.ps1`""
```

### 2. Send a Test Command

Open Slack → `#dev-questerix` → Send:
```
@agent echo Hello from Slack!
```

You should get a response within 5 seconds!

---

## Supported Commands

### Git Operations
```
@agent git status
@agent git log -n 5
@agent git diff
```

### Flutter/Dart
```
@agent flutter test
@agent dart analyze
@agent flutter pub get
```

### NPM (Admin Panel)
```
@agent npm run build
@agent npm test
@agent npm run lint
```

### Supabase
```
@agent supabase db push
@agent supabase gen types typescript --project-id PROJECT_ID > types.ts
```

### General Commands
```
@agent dir
@agent Get-Process | Where-Object {$_.ProcessName -like "*Code*"}
```

---

## Output Formatting

**Short output (≤20 lines)**: Posted inline in thread
**Long output (>20 lines)**: First 15 lines + summary

---

## Auto-Start on Windows Boot

### Method 1: Task Scheduler (Recommended)

1. Open Task Scheduler (`taskschd.msc`)
2. Create Task → General tab:
   - Name: `Slack Command Bridge`
   - Run whether user is logged on or not: ✓
   - Run with highest privileges: ✓

3. Triggers tab → New:
   - Begin the task: `At startup`
   - Delay task for: `30 seconds`

4. Actions tab → New:
   - Action: `Start a program`
   - Program: `powershell.exe`
   - Arguments:
     ```
     -ExecutionPolicy Bypass -WindowStyle Hidden -File "C:\Users\mhali\OneDrive\Desktop\Important Projects\Questerix\scripts\slack-bridge.ps1"
     ```

5. Conditions tab:
   - Uncheck "Start only if computer is on AC power"

6. Save and test

### Method 2: Startup Folder

Create a shortcut in:
```
C:\Users\mhali\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup
```

Target:
```
powershell.exe -ExecutionPolicy Bypass -WindowStyle Hidden -File "C:\Users\mhali\OneDrive\Desktop\Important Projects\Questerix\scripts\slack-bridge.ps1"
```

---

## Stopping the Bridge

### If running in visible terminal:
Press `Ctrl+C`

### If running in background:
```powershell
Get-Process powershell | Where-Object {$_.CommandLine -like "*slack-bridge*"} | Stop-Process
```

Or find and kill in Task Manager.

---

## Troubleshooting

### "No response in Slack"
1. Check if bridge is running:
   ```powershell
   Get-Process powershell | Where-Object {$_.CommandLine -like "*slack-bridge*"}
   ```
2. Check environment variables:
   ```powershell
   echo $env:SLACK_BOT_TOKEN
   ```
3. Restart the bridge

### "Permission denied" errors
Run PowerShell as Administrator

### "Command not found"
Bridge runs commands in project root. Use full paths if needed.

---

## Security Notes

⚠️ **Command Execution Risk**
- Anyone in `#dev-questerix` can execute commands
- Only invite trusted team members
- Bridge runs with YOUR user permissions

🔒 **Mitigation**:
- Keep channel private
- Review Slack audit logs regularly
- Add IP restrictions to bot token (Slack settings)

---

## Advanced Configuration

Edit `scripts/slack-bridge.ps1`:

```powershell
# Change poll interval (default: 5 seconds)
$PollIntervalSeconds = 10

# Change channel
$SLACK_CHANNEL = "CHANNEL_ID_HERE"
```

---

## Monitoring

### View Bridge Logs
If running in background, logs go to PowerShell transcripts (if enabled).

### Check Last Activity
```powershell
Get-Content "C:\Users\mhali\OneDrive\Desktop\Important Projects\Questerix\.slack-bridge-state.json"
```

Shows timestamp of last processed message.

---

## Mobile Usage from Phone

1. Open Slack mobile app
2. Navigate to `#dev-questerix`
3. Send `@agent <command>`
4. Get instant feedback!

**Perfect for**:
- Checking build status while away
- Running tests remotely
- Monitoring git status
- Triggering deployments

---

## Example Workflow

**Morning routine from your phone**:
```
@agent git status
@agent git pull
@agent flutter test
@agent npm run build
```

All from Slack while drinking coffee! ☕

---

## Technical Details

- **Language**: PowerShell
- **Polling**: Every 5 seconds
- **State Management**: JSON file tracks last message
- **Thread Support**: Responses posted in thread
- **Error Handling**: Failed commands reported to Slack
- **Project Root**: Commands executed in Questerix directory

---

## Next Steps

**After testing**, consider:
1. Set up Task Scheduler auto-start
2. Invite team members to channel
3. Create shortcuts for common commands
4. Monitor first week for any issues

---

## Support

If you encounter issues:
1. Check environment variables are set
2. Verify bot has channel permissions
3. Review PowerShell execution policy
4. Check Slack API status

**Working perfectly?** Now you have mobile DevOps! 🚀
