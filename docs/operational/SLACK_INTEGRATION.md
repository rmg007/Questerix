# Slack Mobile Command Bridge - Setup & Usage Guide

## 🎯 Overview

The Slack Mobile Command Bridge enables remote command execution for the Questerix project through Slack. This allows you to trigger builds, tests, deployments, and other development operations from anywhere using your mobile device or desktop Slack app.

---

## ✅ Setup Status

### Step 1: Slack Bot Configuration ✅ COMPLETE
- **Status**: ✅ Complete
- **Slack App**: `Questerix Ops`
- **Bot Token**: Configured in `.mcp_config.json`
- **Team ID**: `T09457454JW/D0ADBB25JGZ`
- **Channel**: `#dev-questerix`
- **Bot Scopes**:
  - `channels:history` - Read your commands
  - `chat:write` - Reply to messages
  - `files:write` - Upload log files/reports

### Step 2: MCP Configuration ✅ COMPLETE
- **Status**: ✅ Complete
- **File**: `.mcp_config.json`
- **Server**: `@modelcontextprotocol/server-slack`
- **Environment**:
  - `SLACK_BOT_TOKEN`: Configured
  - `SLACK_TEAM_ID`: Configured

### Step 3: Agent Governance ✅ COMPLETE
- **Status**: ✅ Complete
- **File**: `docs/strategy/AGENTS.md`
- **Protocol**: Mobile Command Bridge added
- **Trigger**: `/agent` prefix
- **Output**: Smart formatting (inline vs file attachment)
- **Security**: Token sanitization and command validation

---

## 📱 Usage

### Basic Command Format

```
/agent <command>
```

### Supported Commands

#### Flutter & Dart Operations
```
/agent flutter test
/agent flutter analyze
/agent flutter build web
/agent dart format .
/agent dart pub get
```

#### Admin Panel (NPM)
```
/agent npm run dev
/agent npm run build
/agent npm run lint
/agent npm test
```

#### Git Operations
```
/agent git status
/agent git log -n 5
/agent git diff --stat
/agent git branch
```

#### Database & Supabase
```
/agent supabase db push
/agent supabase gen types typescript
/agent make db_verify_rls
```

#### CI/CD & Validation
```
/agent make ci
/agent make web_test
/agent make flutter_test
```

---

## 🤖 How It Works

### 1. Message Detection
- Antigravity monitors `#dev-questerix` channel every 30 seconds
- Looks for messages starting with `/agent`
- Extracts the command from the message body

### 2. Command Execution
- Executes the command in the project root directory
- Captures stdout and stderr
- Times the execution duration

### 3. Response Formatting

**Short Output (≤20 lines)**:
```
✅ Command completed: `flutter test`

```
All tests passed!
Total: 42 tests
Duration: 5.2s
```

Duration: 5.2s
```

**Long Output (>20 lines)**:
- Attached as a text file to avoid cluttering the chat
- Filename format: `output_<timestamp>.txt`

**Errors**:
```
❌ Command failed: `npm run build`

```
Error: Module not found
Exit code: 1
```

Exit code: 1
```

---

## 🔒 Security Constraints

### Protected Commands
The agent will **refuse** to execute commands that:
- Modify `.git/config` or authentication files
- Expose secrets or tokens
- Delete critical directories
- Modify SSH keys or credentials

### Output Sanitization
Before posting to Slack, the agent will:
- Strip any lines containing `token`, `password`, `secret`, `key`
- Replace sensitive values with `[REDACTED]`
- Never expose connection strings or API keys

---

## 💡 Use Cases

### 1. Quick Status Checks
```
/agent git status
/agent make ci
```

### 2. Remote Testing
```
/agent flutter test
/agent npm test
```

### 3. Build Verification
```
/agent npm run build
/agent flutter build web
```

### 4. Database Operations
```
/agent supabase db push
/agent make db_verify_rls
```

### 5. Code Quality
```
/agent flutter analyze
/agent npm run lint
```

---

## 🚀 Next Steps

### Immediate Actions
1. **Test the Integration**:
   - Open Slack and go to `#dev-questerix`
   - Send: `/agent git status`
   - Verify Antigravity responds with the repository status

2. **Verify Bot Permissions**:
   - Ensure `@Questerix Ops` is visible in the channel
   - Check that it can read and post messages

### Optional Enhancements

#### 1. Scheduled Health Checks
Add a cron-like scheduler to run validation commands automatically:
```
Daily at 9 AM: /agent make ci
Weekly on Monday: /agent make db_verify_rls
```

#### 2. Deployment Triggers
Extend the protocol to support deployment workflows:
```
/agent deploy admin-panel staging
/agent deploy student-app production
```

#### 3. Status Dashboard
Create a Slack dashboard showing:
- Last 5 command executions
- CI/CD status
- Build health metrics

---

## 🐛 Troubleshooting

### Bot Not Responding
1. **Check MCP Server**:
   - Verify `.mcp_config.json` has correct tokens
   - Restart Antigravity to reload MCP configuration

2. **Verify Bot Invite**:
   - In Slack, type `/invite @Questerix Ops` in `#dev-questerix`

3. **Check Token Validity**:
   - Go to [api.slack.com/apps](https://api.slack.com/apps)
   - Verify the bot token is still active

### Commands Timing Out
- Increase `WaitMsBeforeAsync` in the command execution
- For long-running tasks, use background execution
- Consider adding a "Command started..." acknowledgment message

### Output Not Appearing
- Check Slack message limits (4000 characters)
- Verify file upload permissions
- Check workspace file size limits

---

## 📚 Related Documentation
- [Slack MCP Server Documentation](https://github.com/modelcontextprotocol/servers/tree/main/src/slack)
- [AGENTS.md](./AGENTS.md) - Full agent execution contract
- [Deployment Pipeline](./DEPLOYMENT.md) - CI/CD workflows

---

## 🎓 Advanced Patterns

### Chained Commands
```
/agent npm run build && npm run deploy
```

### Environment-Specific Operations
```
/agent ENVIRONMENT=staging npm run deploy
```

### Multi-Line Commands (use code blocks in Slack)
```
/agent flutter test --coverage && \
  flutter analyze && \
  dart format --set-exit-if-changed .
```

---

**Last Updated**: 2026-02-04  
**Status**: ✅ Operational  
**Version**: 1.0.0
