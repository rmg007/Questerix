---
description: Update documentation minimally - lean docs philosophy
---

// turbo-all

# /docs - Documentation Update

**Purpose**: Update documentation minimally and remove duplication.

---

## Lean Docs Principle

> **If a doc does not change behavior or prevent a recurring mistake, delete it or fold it into an existing doc.**

### Rules
1. **Prefer updating existing docs** over creating new ones
2. **Consolidate duplicates** aggressively
3. **Keep it short** — docs should be scannable
4. **Cross-link** instead of duplicating

---

## Documentation Hierarchy (Single Source of Truth)

| Category | Location | When to Update |
|----------|----------|----------------|
| Agent Execution Contract | `AGENTS.md` | New patterns, rules, or phases |
| How to Run Locally | `docs/DEVELOPMENT.md` | New commands, setup steps |
| Deployment | `docs/DEPLOYMENT_PIPELINE.md` | Deploy process changes |
| CI Contract | `docs/CI_CONTRACT.md` | CI gate changes |
| AI Conventions | `AI_CODING_INSTRUCTIONS.md` | New conventions |
| Workflows | `.agent/workflows/*.md` | New workflows |
| Stable Architecture | `Questerix-Docs-Backup/` | Major architectural decisions |

---

## Instructions

// turbo
1. **Review what changed** in the implementation
2. **Check if any docs are affected**
3. **Update ONLY the docs that need it**
4. **Consolidate any duplicates found**

---

## Output Format

```markdown
## Documentation Updates

### Updated Files
| File | Change |
|------|--------|
| `docs/DEVELOPMENT.md` | Added section on X |
| `AI_CODING_INSTRUCTIONS.md` | Updated convention for Y |

### Removed/Consolidated
| Removed | Merged Into |
|---------|-------------|
| `OLD_DOC.md` | `docs/DEVELOPMENT.md` |

### No Update Needed
- [Reason why no docs need updating, if applicable]
```

---

## Common Scenarios

### Adding a New Command
Update: `docs/DEVELOPMENT.md` (add to Quickstart or relevant section)

### Changing CI Behavior
Update: `docs/CI_CONTRACT.md`

### New Workflow
Create: `.agent/workflows/[name].md`
Update: `.agent/workflows/help.md` (add to registry)

### Architectural Decision
Update: `Questerix-Docs-Backup/` (external repo)

### Bug Fix
Usually: **No doc update needed** (just add regression test)

---

## Anti-Patterns (Don't Do This)

❌ Creating a new doc for every feature  
❌ Duplicating information across multiple files  
❌ Writing long prose when bullets suffice  
❌ Documenting obvious things  
❌ Creating docs that will never be read again  

---

## Next Step

After docs are updated (or confirmed not needed), run `/pr` to generate the PR package.
