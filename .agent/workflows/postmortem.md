---
description: Learn from bugs and prevent recurrence
---

// turbo-all

# /postmortem - Bug Learning Loop

**Purpose**: Learn from bugs and update prevention measures.

---

## Instructions

For every bug fixed, complete this postmortem:

### 1. Root Cause Analysis (1-3 bullets)
- What was the actual cause?
- Why wasn't it caught earlier?
- What assumptions were wrong?

### 2. Regression Test
- Add a test that would have caught this bug
- Provide exact file path
- Describe what the test proves

### 3. Lesson Learned
- One-line summary for the learning log
- Add to `docs/LEARNING_LOG.md`

### 4. Process Improvement
- What gate would have caught this earlier?
- Should a workflow or test be updated?

---

## Mandatory Actions

// turbo
1. **Add regression test** (no exceptions)
2. **Update learning log** 
3. **If same bug class repeats twice** → Update workflow or coding standard

---

## Output Format

```markdown
## Postmortem: [Bug Title]

### Date
[YYYY-MM-DD]

### Root Cause
- [What went wrong]
- [Why it wasn't caught]
- [What assumption failed]

### Regression Test Added
- **File**: `test/regression/bug_[id]_test.dart`
- **Proves**: [What behavior this test verifies]
- **Command**: `flutter test test/regression/bug_[id]_test.dart`

### Lesson Learned
> [One-line summary that future developers should know]

Added to: `docs/LEARNING_LOG.md`

### Process Improvement
| What to Change | Where | Action |
|----------------|-------|--------|
| [Improvement] | [File/Workflow] | [Specific change] |

### Prevention
This bug could have been caught by:
- [ ] Better test coverage in [area]
- [ ] Lint rule for [pattern]
- [ ] Code review checklist item
```

---

## Learning Log Format

Create or append to `docs/LEARNING_LOG.md`:

```markdown
# Learning Log

Lessons learned from bugs and incidents.

---

## 2026-02-03: [Bug Title]
- **Root Cause**: [Brief description]
- **Lesson**: [What we learned]
- **Prevention**: [What we changed]
- **Regression Test**: `test/regression/bug_xxx_test.dart`
```

---

## Repeat Bug Rule

If the same CLASS of bug happens twice:

1. **First occurrence**: Add regression test + lesson
2. **Second occurrence**: MUST update one of:
   - Coding standard (in `AGENTS.md`)
   - Test matrix requirement
   - Workflow gate
   - Lint rule

---

## Examples

### Example 1: Missing Null Check
```markdown
## Postmortem: Crash on null user profile

### Root Cause
- API returned null profile for new users
- Frontend assumed profile always exists
- No null check in `ProfileWidget`

### Regression Test Added
- File: `test/regression/null_profile_crash_test.dart`
- Proves: Widget handles null profile gracefully

### Lesson Learned
> Always handle null cases for API responses, even when "should never happen"

### Process Improvement
- Add lint rule: `avoid_null_checks` → `always_use_null_safety`
```

### Example 2: Database Migration Order
```markdown
## Postmortem: Migration failed on production

### Root Cause
- Migration 005 depended on column from migration 006
- Migrations ran in wrong order
- Timestamp naming was incorrect

### Lesson Learned
> Always prefix migrations with full timestamp YYYYMMDDHHMMSS

### Process Improvement
- Update AGENTS.md with migration naming convention
```
