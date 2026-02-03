---
description: Execute implementation with evidence
---

// turbo-all

# /implement - Code Implementation

**Purpose**: Execute the approved plan with full autonomous execution.

---

## Instructions

// turbo
Use the approved plan and implement ONLY what is required.

### Rules
1. **Do NOT update documentation yet** — Use `/docs` after `/verify` passes
2. **Do NOT mark complete** until `/verify` gate passes
3. **Keep diffs tight** — Avoid drive-by refactors
4. **Provide evidence** for every change

---

## Evidence Requirement (Non-Negotiable)

The AI MUST provide for EVERY implementation:

| Evidence | Required |
|----------|----------|
| **Files Changed** | Exact paths with 1-line description each |
| **Commands Executed** | Exact command + stdout/stderr summary |
| **Deviations** | Any changes from the plan and WHY |
| **Gaps** | What is NOT done yet (be explicit) |

---

## Execution Pattern

// turbo
```powershell
# Flutter changes
flutter pub get
dart run build_runner build --delete-conflicting-outputs

# React changes
cd admin-panel && npm install

# File operations
# [Create/Modify files as needed]
```

---

## Output Format

```markdown
## Implementation Summary

### Files Changed
| File | Change |
|------|--------|
| `path/to/file.ts` | Added X component |
| `path/to/file.dart` | Modified Y method |
| `path/to/new_file.dart` | Created for Z |

### Commands Executed
| Command | Result |
|---------|--------|
| `flutter pub get` | ✅ SUCCESS |
| `npm install` | ✅ SUCCESS |

### Deviations from Plan
- [None]
- OR: [Description of what changed and why]

### Remaining Work
- [None — ready for /verify]
- OR: [What still needs to be done]

### Known Risks
- [Any risks introduced by this implementation]
```

---

## Next Step

**Run `/verify` to validate the implementation.**

Do NOT claim the task is complete until `/verify` passes.
