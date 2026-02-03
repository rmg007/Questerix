---
description: Define problem statement and acceptance criteria
---

# /intake - Problem Definition

**Purpose**: Clearly define the problem before any implementation.

---

## Instructions

When processing an `/intake` request, deliver the following:

### 1. Problem Statement (2-4 sentences)
- What is broken or missing?
- Who is affected?
- What is the business impact?

### 2. Acceptance Criteria (5-10 bullet points, TESTABLE)
- Each criterion must be verifiable with a command or observable behavior
- Use format: "WHEN [action] THEN [expected result]"
- Include edge cases

### 3. Out of Scope (bullets)
- What this task will NOT address
- Future enhancements deferred
- Related issues to track separately

### 4. Dependencies and Risks (bullets)
- External dependencies (APIs, credentials, user input)
- Technical risks (migrations, breaking changes)
- Blocking issues

### 5. Proposed Test Coverage
- Unit tests needed
- Widget tests (if Flutter)
- E2E tests (if user-facing)
- Integration tests (if API/DB changes)

---

## Output Format

```markdown
## Problem Statement
[2-4 sentences describing the problem]

## Acceptance Criteria
- [ ] WHEN [action] THEN [expected result]
- [ ] WHEN [action] THEN [expected result]
- [ ] WHEN [edge case] THEN [expected behavior]

## Out of Scope
- [Item not addressed]
- [Future enhancement]

## Dependencies & Risks
- DEPENDS: [External dependency]
- RISK: [Technical risk]

## Test Plan
- Unit: [What to test]
- Widget: [What to test]
- E2E: [What to test]

## Task Classification
- Complexity: [trivial / standard / complex]
- Workflow: [implement→verify / intake→plan→implement→verify→docs→pr]
```

---

## Classification Guide

| Complexity | Examples | Workflow |
|------------|----------|----------|
| **Trivial** | Typo fix, config change, version bump | `/implement` → `/verify` |
| **Standard** | Bug fix, small feature, refactor | `/intake` → `/implement` → `/verify` → `/pr` |
| **Complex** | New system, migration, security change | Full workflow with `/plan` approval |

---

**DO NOT PROPOSE IMPLEMENTATION YET.**

**Next step**: If complex, use `/plan`. If standard/trivial, proceed to `/implement`.
