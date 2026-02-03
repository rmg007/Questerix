---
description: Generate PR description with Definition of Done
---

# /pr - Pull Request Package

**Purpose**: Generate a complete PR description with Definition of Done checklist.

---

## Instructions

Generate the following PR package:

### 1. PR Title
- Format: `type: description`
- Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
- Example: `feat: add skill selection widget`

### 2. PR Description
- What changed (summary)
- Why (motivation, linked issue)
- How to test (commands)
- Screenshots/GIF (if UI change)

### 3. Definition of Done Checklist
- All items must be checked before merge

### 4. Rollback Plan
- How to undo if something breaks in production

### 5. Related Issues
- Links to issues this PR addresses

---

## Output Format

```markdown
## PR Title
`type: [description]`

---

## Description

### What Changed
[1-3 sentence summary of the changes]

### Why
[Motivation: what problem does this solve?]

### How to Test
```bash
# Commands to verify the change locally
flutter test
npm run build
```

### Screenshots
[If UI change, include before/after screenshots or GIF]

---

## Definition of Done

- [ ] Acceptance criteria met (from /intake)
- [ ] Tests added or explicitly justified
- [ ] All checks pass locally:
  - [ ] `flutter analyze` — no issues
  - [ ] `flutter test` — all pass
  - [ ] `npm run lint` — no errors
  - [ ] `npm run build` — success
- [ ] No new warnings introduced
- [ ] Docs updated only where needed
- [ ] Rollback plan stated below

---

## Rollback Plan

### If this breaks production:
1. [Immediate action — e.g., revert commit]
2. [Database rollback — if applicable]
3. [Feature flag — if applicable]

### Rollback command:
```bash
git revert [commit-sha]
```

---

## Related Issues
- Closes #[issue number]
- Related to #[issue number]

---

## Reviewer Notes
[Any context the reviewer should know]
```

---

## Template for GitHub

This can be placed in `.github/PULL_REQUEST_TEMPLATE.md` for automatic population:

```markdown
## Description

### What Changed

### Why

### How to Test

## Definition of Done

- [ ] Acceptance criteria met
- [ ] Tests added or justified
- [ ] `flutter analyze` passes
- [ ] `flutter test` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] Rollback plan stated

## Rollback Plan

## Related Issues
```

---

## Next Steps

After PR is created:
1. Request review (if team)
2. Wait for CI to pass
3. Merge when approved
4. If bug discovered later → `/postmortem`
