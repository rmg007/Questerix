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

## 2026-02-04: Phase 11 Certification - Hardcoded Credentials Anti-Pattern

- **Root Cause**: Database password hardcoded directly in `scripts/direct_apply.js` (Line 5)
- **Discovery**: Found during `/certify` Phase 3 (Security Audit)
- **Severity**: CRITICAL - Password exposed in Git history and source code
- **Lesson**: ALL credentials must be externalized to environment variables, even in utility scripts
- **Prevention**: 
  - Updated `direct_apply.js` to use `process.env.DB_PASSWORD` with validation
  - Installed `dotenv` package for .env file support
  - Added error message guiding users to set credentials properly
- **Why Missed in /process**: Script was created in previous session without security review
- **Regression Test**: Manual verification that script fails without env var set

---

## 2026-02-04: Phase 11 Certification - CLI Argument Ignored

- **Root Cause**: `scripts/direct_apply.js` had hardcoded migration filename, ignoring command-line argument
- **Discovery**: Found during `/certify` Phase 1 (Database Audit) when wrong migration was applied
- **Impact**: HIGH - Script appeared to work but always applied the same migration regardless of input
- **Lesson**: Utility scripts accepting arguments MUST actually use those arguments
- **Prevention**: Refactored to use `process.argv[2]` with proper validation and path resolution
- **Why Missed in /process**: Script was tested with the hardcoded file, which succeeded by coincidence
- **Testing Gap**: No verification that different inputs produced different outputs

---

<! -- Add new lessons above this line -->
