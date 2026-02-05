---
description: AI generates tasks.json, ops_runner.py executes them automatically
---

# Superpower Mode Workflow

This workflow enables **fully autonomous execution** by having the AI agent write task manifests that are automatically executed by a background watcher.

## Prerequisites

1. **Install watchdog**:
   ```bash
   pip install watchdog
   ```

2. **Start the watcher** (in a separate terminal):
   ```bash
   python ops_runner.py --watch .
   ```

## How It Works

```
┌─────────────────┐     writes      ┌──────────────┐     watches     ┌──────────────┐
│   AI Agent      │ ───────────────▶│ tasks.json   │◀────────────────│ ops_runner.py│
│ (Claude/Gemini) │                 │              │                 │ (background) │
└─────────────────┘                 └──────────────┘                 └──────────────┘
                                           │                               │
                                           └───────────────────────────────┘
                                                    auto-executes
```

1. User starts `ops_runner.py --watch .` in a terminal
2. User tells the AI agent what to do
3. AI agent writes `tasks.json` with the commands
4. ops_runner.py detects the file and executes all commands automatically
5. No manual approval needed!

## Task Manifest Format

```json
[
  {
    "description": "Human-readable description",
    "command": "the shell command to run",
    "cwd": "optional working directory (null = current)"
  }
]
```

## Example Prompts to AI

Instead of asking the AI to "run" commands, ask it to "generate tasks.json":

### Example 1: Linting and Building
```
"Generate tasks.json to lint the admin panel, check TypeScript compilation, and run tests."
```

### Example 2: Deployment
```
"Generate tasks.json to build the student app for web and deploy to Cloudflare."
```

### Example 3: Database Operations
```
"Generate tasks.json to regenerate Supabase types and run the sync-registry script."
```

## AI Agent Instructions

When asked to "generate tasks.json" or use "superpower mode":

1. Write the `tasks.json` file to the project root
2. Include clear descriptions for each task
3. Use absolute paths for `cwd` when needed
4. Order tasks by dependency (earlier tasks run first)

## Safety Notes

- The watcher only executes `tasks.json` files (not arbitrary code)
- Commands are run with the privileges of the terminal user
- Review which directories you watch for security
