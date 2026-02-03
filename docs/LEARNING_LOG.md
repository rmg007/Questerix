# Learning Log

Lessons learned from bugs, incidents, and development discoveries.

> **Purpose**: Capture one-line lessons to prevent recurring mistakes.
> **Rule**: If the same bug class happens twice, update a workflow or coding standard.

---

## Template

```markdown
## YYYY-MM-DD: [Title]
- **Root Cause**: [Brief description]
- **Lesson**: [What we learned]
- **Prevention**: [What we changed]
- **Regression Test**: `test/path/to/test.dart`
```

---

## 2026-02-03: Math7 → Questerix Renaming Complete

- **Context**: Complete rebranding from Math7 to Questerix across all applications
- **Changes**: Package rename (`math7_domain` → `questerix_domain`), app name updates, database name change, domain transition to `Farida.Questerix.com`
- **Breaking Change**: Database renamed from 'math7' to 'questerix' - existing users will need fresh database
- **Files Modified**: 50+ files across student-app, admin-panel, landing-pages, questerix_domain

---

## 2026-02-03: Pre-existing Test-Screen Mismatches Discovered

- **Root Cause**: Test files written for different screen implementations than what exists
- **Lesson**: Test files MUST be maintained in sync with screen implementations; when screens are refactored, tests must be updated in the same commit
- **Prevention**: Fixed Flutter API usage (TextField vs TextFormField for obscureText, getSemanticsData().actions for checking actions)
- **Regression Tests Fixed**: 
  - `test/features/auth/screens/login_screen_test.dart`
  - `test/features/auth/screens/welcome_screen_test.dart`
  - `test/features/onboarding/screens/onboarding_screen_test.dart`

---

## 2026-02-03: Workflow System Established

- **Context**: Established Trust & Verify workflow system
- **Lesson**: AI agents need explicit evidence requirements to prevent "hallucinated completion"
- **Prevention**: All workflows now require file paths, commands executed, and test results
- **Reference**: `.agent/workflows/*.md`

---

<!-- Add new lessons above this line -->
