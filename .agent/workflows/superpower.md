---
description: AI generates tasks.json, ops_runner.py executes them automatically
---

# ⚡ Superpower Mode

**Problem**: AI agents require manual approval for every command, forcing you to stay at the laptop clicking "Run".

**Solution**: A file-watching task runner that auto-executes commands the AI writes.

---

## Quick Start

### 1. Start the Watcher
**Double-click** `START_WATCHER.bat` in the project root, OR run:
```powershell
python ops_runner.py --watch .
```

### 2. Tell the AI What to Do
Instead of "run X", say "**generate tasks.json** to do X":
```
"Generate tasks.json to lint the admin panel and run tests"
```

### 3. Watch It Execute
The watcher auto-detects `tasks.json` and runs every command immediately.

---

## Architecture

```
┌─────────────────┐     writes      ┌──────────────┐     watches     ┌──────────────┐
│   AI Agent      │ ───────────────▶│ tasks.json   │◀────────────────│ ops_runner.py│
│ (Claude/Gemini) │                 │              │                 │ (background) │
└─────────────────┘                 └──────────────┘                 └──────────────┘
                                           │                               │
                                           └───────────────────────────────┘
                                                    auto-executes
```

---

## Files

| File | Purpose |
|------|---------|
| `ops_runner.py` | Python watcher that monitors for `tasks.json` and executes commands |
| `START_WATCHER.bat` | Double-click launcher for Windows |
| `tasks.json` | The manifest file AI writes with commands to execute |
| `tasks.json.example` | Template showing the manifest format |

---

## Task Manifest Format

```json
[
  {
    "description": "Human-readable description of the task",
    "command": "the shell command to run",
    "cwd": "C:/absolute/path/to/working/directory"
  },
  {
    "description": "Another task",
    "command": "npm run build",
    "cwd": null
  }
]
```

| Field | Required | Description |
|-------|----------|-------------|
| `description` | Yes | Human-readable task name |
| `command` | Yes | Shell command to execute |
| `cwd` | No | Working directory (null = project root) |

---

## Example Prompts

| Goal | Prompt |
|------|--------|
| Lint & Test | "Generate tasks.json to lint admin-panel and run tests" |
| Build & Deploy | "Generate tasks.json to build student-app for web and deploy" |
| Database Ops | "Generate tasks.json to regenerate Supabase types" |
| Full CI | "Generate tasks.json for a complete CI run: lint, typecheck, test" |

---

## Command Reference

### Start Watch Mode
```powershell
python ops_runner.py --watch .
```
Watches current directory recursively for `tasks.json` files.

### Execute Single Manifest
```powershell
python ops_runner.py tasks.json
```
Runs a specific manifest file once.

### Watch Specific Directory
```powershell
python ops_runner.py --watch ./admin-panel
```

---

## Safety Notes

- Only `tasks.json` files trigger execution (not arbitrary code)
- Commands run with your terminal's privileges
- Review which directories you watch
- The watcher prints all commands before executing

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "watchdog not installed" | Run `pip install watchdog` |
| Tasks not executing | Ensure watcher is running and watching the right directory |
| Commands fail | Check `cwd` paths are absolute and exist |

---

## Dependencies

```bash
pip install watchdog
```
