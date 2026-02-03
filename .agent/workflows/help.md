# 🛠️ Questerix Workflow Guide

The Questerix project uses a consolidated **Unified Lifecycle** to ensure high-velocity, high-quality autonomous development.

---

## 🚀 Primary Command

### `/process` - Unified Development Lifecycle
**Use this for 99% of tasks.** It guides you through:
1.  **Planning** (Interactive Strategy, No Coding)
2.  **Implementation** (Recursive Fix Loop)
3.  **Testing** (Automation QA Loop)
4.  **Finalization** (Learning, Docs, Git Push)
5.  **Deployment** (Optional User-Triggered Release)

---

## 🛠️ Utility Workflows

### `/certify` - Independent Quality Audit
Run this AFTER `/process` completes to verify everything with fresh eyes. Acts as an independent inspector that re-checks database, code quality, security, tests, performance, and UX. Produces a certification report.

### `/continue` - Agent Handoff
Use when switching AI agents mid-task. Loads TASK_STATE.json, validates current state, and resumes from the correct phase autonomously.

### `/resume` - Session Resumption
Use when starting a new session (same agent). Detects uncommitted work, session files, and git status to continue where you left off.

### `/autopilot` - Full Autonomous Execution
Enables the AI to run commands and solve complex multi-step problems without constant prompting.

### `/blocked` - Blockers & Partial Progress
Use this to report what is stopping you and what has been achieved so far.

### `/help` - Show this guide
List available workflows and their purposes.

---

## 🎯 Workflow Selection Guide

| Scenario | Use This Workflow |
|----------|-------------------|
| Starting a new feature/task | `/process` |
| Switching to a different AI agent mid-task | `/continue` |
| Resuming after sleep/restart (same agent) | `/resume` |
| Verifying completed work (final check) | `/certify` |
| Stuck on a blocker | `/blocked` |
| General autonomous mode | `/autopilot` |

---

## 📜 Execution Philosophy

- **Plan First**: We never write code until we agree on the "Perfect Plan."
- **Evidence Contract**: Every implementation must provide proof of correctness.
- **Lean Docs**: Documentation must be reproducible and concise.
- **Recursive Fix**: We find and fix our own hallucinations before the User does.
