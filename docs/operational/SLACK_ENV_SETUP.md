# Slack MCP Server Configuration

## Environment Variables

The Slack MCP server requires the following environment variables to be set:

### SLACK_BOT_TOKEN
Your Slack Bot User OAuth Token. This starts with `xoxb-`.

**How to get it:**
1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Select your app (e.g., "Questerix Ops")
3. Navigate to "OAuth & Permissions"
4. Copy the "Bot User OAuth Token"

**Format**: `xoxb-XXXXXXXXXX-XXXXXXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXX`

### SLACK_TEAM_ID
Your Slack Team (Workspace) ID.

**How to get it:**
1. In Slack, click on your workspace name in the top left
2. Select "Settings & administration" → "Workspace settings"
3. Look at the URL: `https://app.slack.com/client/TXXXXXXXXXX/...`
4. The `TXXXXXXXXXX` part is your Team ID

**Format**: `TXXXXXXXXXX` (or with channel ID: `TXXXXXXXXXX/DXXXXXXXXXX`)

## Setting Up Environment Variables

### Windows (PowerShell)
```powershell
# Set for current session
$env:SLACK_BOT_TOKEN = "xoxb-your-token-here"
$env:SLACK_TEAM_ID = "T09457454JW/D0ADBB25JGZ"

# Set permanently (User level)
[System.Environment]::SetEnvironmentVariable('SLACK_BOT_TOKEN', 'xoxb-your-token-here', 'User')
[System.Environment]::SetEnvironmentVariable('SLACK_TEAM_ID', 'T09457454JW/D0ADBB25JGZ', 'User')
```

### macOS/Linux (Bash)
```bash
# Add to ~/.bashrc or ~/.zshrc
export SLACK_BOT_TOKEN="xoxb-your-token-here"
export SLACK_TEAM_ID="T09457454JW/D0ADBB25JGZ"

# Then reload your shell
source ~/.bashrc
```

### Using .env file (Alternative)
Create a `.env` file in your project root (DO NOT COMMIT THIS):

```env
SLACK_BOT_TOKEN=xoxb-your-token-here
SLACK_TEAM_ID=T09457454JW/D0ADBB25JGZ
```

Add to `.gitignore`:
```
.env
```

## Security Notes

⚠️ **NEVER commit tokens to Git**
- Always use environment variables
- Keep tokens in `.env` files that are git-ignored
- Use placeholders like `${SLACK_BOT_TOKEN}` in config files

🔒 **Token Security**
- Treat bot tokens like passwords
- Rotate tokens if exposed
- Use the minimum required OAuth scopes

## Verification

To verify your environment variables are set:

**Windows:**
```powershell
echo $env:SLACK_BOT_TOKEN
echo $env:SLACK_TEAM_ID
```

**macOS/Linux:**
```bash
echo $SLACK_BOT_TOKEN
echo $SLACK_TEAM_ID
```

## Your Token Information

⚠️ **For security reasons, actual token values are NOT stored in this repository.**

To get your specific tokens:
1. **Bot Token**: Go to [api.slack.com/apps](https://api.slack.com/apps) → Your App → OAuth & Permissions
2. **Team ID**: Check your Slack workspace URL or settings

**Example format:**
```
SLACK_BOT_TOKEN=xoxb-XXXXXXXXXX-XXXXXXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXX
SLACK_TEAM_ID=TXXXXXXXXXX/DXXXXXXXXXX
```

If you're setting this up for the first time, create a local `.env.slack.local` file (git-ignored) with your actual tokens.

**⚠️ Important**: Set these as environment variables before starting Antigravity.

## Troubleshooting

### "Token not found" error
- Verify environment variables are set (see Verification section above)
- Restart your terminal/IDE after setting variables

### "Invalid authentication" error
- Check token validity at [api.slack.com/apps](https://api.slack.com/apps)
- Verify bot has required scopes: `channels:history`, `chat:write`, `files:write`
- Ensure bot is invited to `#dev-questerix` channel

### MCP server not starting
- Check that `npx` is available in your PATH
- Verify network connectivity
- Review MCP server logs

## References
- [Slack API Documentation](https://api.slack.com/docs)
- [MCP Server Configuration](https://modelcontextprotocol.io/docs/servers)
- [Slack MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/slack)
