---
description: Run verification suite with evidence - MANDATORY GATE
---

// turbo-all

# /verify - Verification Gate

**Purpose**: Prove the implementation works with executable evidence.

---

## ⚠️ THIS IS A STOP POINT

**Do not claim success without evidence.**
**Do not proceed to `/docs` or `/pr` until all verifications pass.**

---

## Required Verifications

### Flutter (if changed)

// turbo
```powershell
cd student-app
flutter analyze
flutter test
```

Expected output:
- `flutter analyze`: "No issues found!"
- `flutter test`: "All tests passed!"

### React/Admin Panel (if changed)

// turbo
```powershell
cd admin-panel
npm run lint
npm test
npm run build
```

Expected output:
- `npm run lint`: No errors
- `npm test`: All tests pass
- `npm run build`: Build successful

### Landing Pages (if changed)

// turbo
```powershell
cd landing-pages
npm run lint
npm run build
```

### E2E Tests (if UI changed)

// turbo
```powershell
cd admin-panel
npx playwright test
```

### Supabase (if schema changed)

// turbo
```powershell
# Dry run to check migration
supabase db push --dry-run
```

### TypeScript (strict check)

// turbo
```powershell
cd admin-panel
npx tsc --noEmit
```

---

## Evidence Requirement (Non-Negotiable)

For EACH command, provide:

1. **Exact command** executed
2. **Result**: ✅ PASS or ❌ FAIL
3. **Key output** (error messages, test counts, warnings)

### If You CANNOT Run a Command

```markdown
⚠️ I CANNOT RUN THIS COMMAND

Command: `[exact command]`
Reason: [why it cannot be run]

Please run this command and provide the output:
```bash
[exact command]
```
```

---

## Output Format

```markdown
## Verification Results

### Summary
| Area | Status |
|------|--------|
| Flutter | ✅ PASS |
| React | ✅ PASS |
| TypeScript | ✅ PASS |
| E2E | ⏭️ SKIPPED (no UI changes) |

### Command Results
| Command | Result | Notes |
|---------|--------|-------|
| `flutter analyze` | ✅ PASS | No issues found |
| `flutter test` | ✅ PASS | 42 tests, 0 failures |
| `npm run lint` | ✅ PASS | |
| `npm run build` | ✅ PASS | |
| `npx tsc --noEmit` | ✅ PASS | |

### Failures (if any)
[Describe any failures and how to fix them]

### Warnings
[List any new warnings introduced]

### Coverage Gaps
[Any areas not covered by tests]
```

---

## Decision Tree

```
ALL PASS? 
  └─ YES → Proceed to /docs (if needed) or /pr
  └─ NO  → FIX failures, then re-run /verify
```

---

## Next Steps

- **If all pass**: Run `/docs` (if changes need documentation) then `/pr`
- **If any fail**: Fix the issues and run `/verify` again
