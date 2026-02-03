---
description: List all available workflows and their purposes
---

# /help - Workflow Reference Guide

**Purpose**: Quick reference for all available slash commands.

---

## 📋 Available Workflows

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/help` | Show this reference guide | When you forget what commands exist |
| `/intake` | Define problem + acceptance criteria | Start of any non-trivial task |
| `/plan` | Create implementation plan + test plan | Before complex work |
| `/implement` | Execute code changes with evidence | The work phase |
| `/verify` | Run tests + lint + analyze | **Required before any commit** |
| `/docs` | Update documentation (lean) | Only if something changed |
| `/pr` | Generate PR description + rollback plan | Before creating a pull request |
| `/postmortem` | Learn from bugs + add regression tests | After any bug fix |
| `/blocked` | Report blockers + partial progress | When stuck waiting for input |
| `/resume` | Continue work from previous session | Start of new session |

---

## 🔄 Typical Workflow Patterns

### Simple Bug Fix
```
/implement → /verify → /pr
```

### Standard Feature
```
/intake → /plan → /implement → /verify → /docs → /pr
```

### Complex Feature (New System)
```
/intake → /plan → [approval] → /implement → /verify → /docs → /pr
```

### After Bug Fix
```
/postmortem (add regression test + lesson learned)
```

### New Session (Continuing Work)
```
/resume → (continue from last state)
```

---

## ⚡ Turbo Mode Workflows

These workflows have `// turbo-all` enabled for autonomous execution:

- `/implement` - Auto-runs file operations
- `/verify` - Auto-runs test/lint/build commands
- `/docs` - Auto-runs file updates
- `/postmortem` - Auto-runs test additions
- `/resume` - Auto-runs continuation

---

## 🛑 Stop Points (Gates)

These require explicit evidence before proceeding:

| Gate | What Must Be Proven |
|------|---------------------|
| `/verify` | All tests pass, lint clean, build succeeds |
| `/intake` | Acceptance criteria are testable |
| `/plan` | Plan is approved before implementation |

---

## 📜 The Evidence Contract

**Every workflow completion MUST include:**

1. **Files Changed**: Exact paths with 1-line description
2. **Commands Executed**: Exact command + result summary
3. **Tests**: New/updated test paths + what they prove
4. **Gaps**: What is NOT done (be explicit)
5. **Risks**: What could break

**If AI cannot run a command:**
- Say "I CANNOT RUN THIS"
- Provide the exact command for user to run
- Request output before proceeding

---

## 📁 Existing Workflows (Legacy)

| Command | Purpose |
|---------|---------|
| `/autopilot` | Full autonomous execution mode (turbo-all) |
| `/test` | Enterprise QA suite (7 phases) |
| `/default` | Fallback autonomous mode |

---

## 📚 Documentation Hierarchy

| Document | Location | Purpose |
|----------|----------|---------|
| Agent Contract | `AGENTS.md` | Master execution rules |
| How to Run | `docs/DEVELOPMENT.md` | Local dev setup |
| Deployment | `docs/DEPLOYMENT_PIPELINE.md` | Deploy to production |
| AI Instructions | `AI_CODING_INSTRUCTIONS.md` | Conventions |
| Workflows | `.agent/workflows/*.md` | This folder |

---

**Type any `/command` to run that workflow.**
