---
description: Create implementation plan with test strategy
---

# /plan - Implementation Planning

**Purpose**: Create a detailed, executable plan before coding.

---

## Instructions

Scan the repository structure and deliver:

### 1. Implementation Steps (ordered, numbered)
- Each step should be a single, reviewable change
- Estimate complexity per step: trivial / standard / complex
- Order by dependency (what must be done first)

### 2. Files to Change (exact paths)
- Group by: Create / Modify / Delete
- Include line-level context for modifications

### 3. Data/Model Changes (if any)
- Supabase migrations needed
- Drift schema changes (Flutter)
- TypeScript type changes (React)
- API contract changes

### 4. Test Plan
- Tests to add (exact file paths)
- Tests to update (exact file paths)
- What each test proves (1 sentence)

### 5. Rollback Strategy
- How to undo this change if it fails in production
- Feature flags (if applicable)
- Database rollback considerations

### 6. Verification Commands
- Commands to run locally before commit
- Commands CI will run

---

## Output Format

```markdown
## Implementation Plan

### Step 1: [Description]
- Complexity: [trivial/standard/complex]
- Files: [paths]
- Depends on: [nothing / step N]

### Step 2: [Description]
...

---

## Files to Change

### Create
- `path/to/new/file.ts` — [purpose]

### Modify
- `path/to/existing/file.ts` — [what changes]

### Delete
- `path/to/obsolete/file.ts` — [why]

---

## Data Changes
- Migration: `YYYYMMDD_description.sql` — [what it does]
- Drift: [schema changes]
- Types: [TypeScript changes]

---

## Test Plan

| Test File | Type | Proves |
|-----------|------|--------|
| `test/feature_test.dart` | Unit | [behavior] |
| `test/widget_test.dart` | Widget | [UI behavior] |
| `admin-panel/tests/e2e.spec.ts` | E2E | [user flow] |

---

## Rollback Strategy
- [How to undo if production breaks]
- [Feature flag: `FEATURE_X_ENABLED`]
- [DB: Migration is reversible / one-way]

---

## Verification Commands

### Local (before commit)
```bash
flutter analyze
flutter test
cd admin-panel && npm run lint && npm test && npm run build
```

### CI (automatic)
- `.github/workflows/ci.yml`
```

---

## Plan Approval

**STOP AFTER PLAN.**

Present this plan to the user and wait for one of:
- ✅ "Approved" → Proceed to `/implement`
- 🔄 "Revise [X]" → Update plan and re-present
- ❌ "Cancel" → Archive plan, do not implement
