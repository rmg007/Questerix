---
description: Independent post-implementation audit and certification
---

// turbo-all

# 🛡️ /certify - Final Quality Certification

> **⚡ Superpower Fallback**: If commands need approval, use `/sp` - I output JSON, you paste into `tasks.json`, watcher runs it.

**Purpose**: Act as an independent "Inspector" after `/process` completes. Verify all work with fresh eyes, assuming the code is guilty until proven innocent.

**When to Use**: After `/process` Phase 5 completes (before deployment).

---

## 🎯 Certification Principles

1. **Zero Trust**: Don't trust previous reports—verify everything independently
2. **Evidence Required**: Every check must produce concrete proof (screenshots, logs, test output)
3. **Edge Case Focus**: Actively try to break things
4. **Fix or Document**: For every issue found, either fix it or justify why it's acceptable

---

## 🗄️ Phase 1: Database Integrity Audit
**Estimated Time**: 5-7 minutes  
**Applies If**: Database changes were made in `/process`

### Checklist

- [ ] **Schema Reality Check**
  - Run: `supabase db pull` or equivalent
  - **Proof**: Compare output with migrations that were applied
  - Verify: All tables, columns, and constraints exist as planned

- [ ] **RLS Live Test** (Critical for Multi-Tenant)
  - Create TWO test user sessions with different `app_id` values
  - Attempt to query data from the wrong tenant
  - **Proof**: SQL query results showing isolation works
  - Verify: Cross-tenant data leakage is impossible

- [ ] **Type Synchronization Verify**
  - **TypeScript**: Check `admin-panel/src/types/database.types.ts` matches schema
  - **Dart**: Check `questerix_domain` or `student-app` models match schema
  - **Proof**: File timestamps and `git diff` output

- [ ] **Constraint Stress Test**
  - Try inserting: `NULL` where NOT NULL, duplicate where UNIQUE, invalid foreign keys
  - **Proof**: Error messages confirming constraints work

**Exit Gate**: All checks pass OR issues documented in Fix Log.

---

## 🔍 Phase 2: Code Quality Audit
**Estimated Time**: 8-10 minutes  
**Applies If**: Code was modified in `/process`

### Checklist

- [ ] **Spaghetti Detector**
  - Search for: Deep nesting (>3 levels), giant functions (>50 lines in Flutter, >40 in React)
  - Command: `grep -r "if.*if.*if.*if" lib/ src/` (or equivalent AST search)
  - **Proof**: List of problematic files OR "None found"

- [ ] **DRY Violations**
  - Look for duplicated logic (same function signature in 2+ files)
  - **Proof**: File paths with suspicious similarity OR "None found"

- [ ] **Import Hygiene**
  - Run: `flutter analyze` or `npm run lint`
  - Check for: Circular dependencies, unused imports
  - **Proof**: Command output showing zero warnings

- [ ] **Design Pattern Compliance**
  - Re-read Phase 1 plan: What patterns were promised?
  - Verify: Repository pattern used, Bloc/Provider correctly structured, etc.
  - **Proof**: File structure screenshot or tree output

**Exit Gate**: Code quality meets standards OR refactoring plan created.

---

## 🛡️ Phase 3: Security & Multi-Tenant Audit
**Estimated Time**: 6-8 minutes  
**Applies If**: Security-sensitive features were added

### Checklist

- [ ] **RLS Policy Coverage**
  - Query: `SELECT tablename FROM pg_policies` to list all policies
  - Verify: Every table with `app_id` has RLS policy
  - **Proof**: SQL query results

- [ ] **Session Isolation Test**
  - Log in as User A (tenant 1) and User B (tenant 2)
  - Verify: Each sees only their own data
  - **Proof**: Screenshots or API response logs

- [ ] **API Key Exposure Check**
  - Run: `grep -r "supabase" . --include="*.dart" --include="*.ts" --include="*.tsx"`
  - Verify: No hardcoded anon keys or URLs outside `env.dart`/`env.ts`
  - **Proof**: Command output showing safe usage

- [ ] **Input Validation Check**
  - Identify user input fields (forms, API endpoints)
  - Verify: Validation exists (Zod schemas, Dart validators)
  - **Proof**: Code snippets showing validation logic

- [ ] **Vulnerability Taxonomy Audit**
  - Read: `knowledge/questerix_governance/artifacts/security/vulnerability_taxonomy.md`
  - For each OPEN VUL-XXX pattern relevant to changed files:
    - Run the detection method from the taxonomy
    - If pattern found → Mark as FAIL with evidence
    - If pattern not found → Mark as PASS
  - **Proof**: Results for each checked VUL-XXX pattern
  - Update taxonomy: If fix verified, mark pattern as ✅ RESOLVED with commit hash

**Exit Gate**: Security posture verified OR vulnerabilities documented.

---

## 🧪 Phase 4: Test Coverage Audit
**Estimated Time**: 10-15 minutes  
**Applies Always**

### Checklist

- [ ] **Re-Run All Tests** (Don't trust previous reports)
  - Flutter: `flutter test`
  - Admin: `cd admin-panel && npm test`
  - **Proof**: Fresh terminal output with pass/fail counts

- [ ] **Edge Case Coverage**
  - Verify tests exist for: `null`, empty strings, network failure, permission denied
  - **Proof**: List of test file names that cover these scenarios

- [ ] **Test Quality Review**
  - Pick 3 random tests, read them
  - Verify: They assert meaningful behavior (not just "widget exists")
  - **Proof**: Code snippets of good assertions

- [ ] **Coverage Gaps**
  - Identify: Critical user paths without tests
  - **Proof**: List of untested features OR "Full coverage"

**Exit Gate**: Test suite confidence is high OR gaps documented.

---

## ⚡ Phase 5: Performance Audit
**Estimated Time**: 5-7 minutes  
**Applies If**: UI components or heavy logic were added

### Checklist

- [ ] **Bundle Size Check**
  - Run: `npm run build` for admin-panel
  - Check: `dist/` size compared to before
  - **Proof**: Bundle size metrics (acceptable if <500KB increase)

- [ ] **Re-Render Analysis** (React only)
  - Open DevTools → Profiler
  - Interact with modified components
  - **Proof**: Screenshot showing minimal re-renders

- [ ] **Load Time Measurement**
  - Use Lighthouse or Network tab
  - Verify: Initial load <3 seconds
  - **Proof**: Lighthouse score screenshot

- [ ] **Memory Leak Check**
  - Check: No unclosed streams (Flutter), no dangling listeners (React)
  - **Proof**: Code review showing proper cleanup in `dispose()`/`useEffect` cleanup

**Exit Gate**: Performance is acceptable OR optimization plan created.

---

## 🎨 Phase 6: Visual & UX Audit
**Estimated Time**: 8-10 minutes  
**Applies If**: UI was modified

### Checklist

- [ ] **Fresh Screenshots**
  - Use `browser_subagent` to capture ALL modified screens
  - Compare: Against design spec or previous version
  - **Proof**: Before/After screenshots

- [ ] **Accessibility Test**
  - Run screen reader on key interactions
  - Check: Contrast ratios (WCAG AA minimum: 4.5:1)
  - **Proof**: Accessibility audit report

- [ ] **Mobile Responsiveness**
  - Test at: 375px (mobile), 768px (tablet), 1920px (desktop)
  - **Proof**: Screenshots at each breakpoint

- [ ] **Error State Verification**
  - Trigger: Network errors, validation errors
  - Verify: User-friendly messages (not raw stack traces)
  - **Proof**: Screenshots of error states

**Exit Gate**: UX is premium OR design improvements documented.

---

## 📚 Phase 7: Documentation Audit
**Estimated Time**: 5-6 minutes  
**Applies Always**

### Checklist

- [ ] **Docs Match Code**
  - Read updated documentation
  - Verify: Code does what docs claim
  - **Proof**: Specific doc section vs code snippet comparison

- [ ] **Learning Log Updated**
  - Check: `docs/LEARNING_LOG.md` has new entries (if bugs were found)
  - **Proof**: Git diff showing additions

- [ ] **Code Comments**
  - Check: Complex logic has explanatory comments
  - **Proof**: List of well-commented sections

- [ ] **README Updated**
  - If APIs changed: README must reflect new endpoints/methods
  - **Proof**: Git diff of README OR "No changes needed"

**Exit Gate**: Documentation is complete and accurate.

---

## 🔥 Phase 8: Chaos Engineering (Break Everything)
**Estimated Time**: 5-8 minutes  
**Applies Always**

### Attack Scenarios

- [ ] **Network Chaos**
  - Simulate: Offline mode, slow 3G, intermittent connection
  - Verify: App shows loading states, doesn't crash
  - **Proof**: Screenshot of graceful handling

- [ ] **Rapid-Fire Clicks**
  - Spam: Submit buttons, navigation links
  - Verify: No duplicate submissions, no crashes
  - **Proof**: Network logs showing debouncing/throttling

- [ ] **Invalid Data Injection**
  - Try: SQL injection strings, XSS payloads in forms
  - Verify: Input is sanitized or rejected
  - **Proof**: Console logs showing safe handling

- [ ] **Permission Edge Cases**
  - Try: Accessing admin routes as regular user
  - Verify: Proper 403/redirect behavior
  - **Proof**: Network response codes

**Exit Gate**: App survives chaos OR critical bugs fixed.

---

## ✅ Final Certification

### Issue Log
| Issue | Severity | Status | Notes |
|-------|----------|--------|-------|
| [Description] | Critical/High/Low | Fixed/Documented | [Justification if documented] |

### Certification Decision

**Status**: [ ] CERTIFIED ✅  |  [ ] CONDITIONAL (with documented issues) ⚠️  |  [ ] FAILED ❌

**Summary**: Provide 2-3 sentence verdict on code quality, security, and readiness.

**Recommendation**: 
- If CERTIFIED → Proceed to deployment
- If CONDITIONAL → User decision required
- If FAILED → Return to `/process` Phase 3 for fixes

> **Documentation Rule**: If ANY issue was found and fixed during this audit, you **MUST** add an entry to `docs/LEARNING_LOG.md` describing the gap and how it was missed in `/process`.

---

## 📊 Evidence Archive

All proof items (screenshots, logs, test outputs) should be saved to `.agent/artifacts/certify_[TIMESTAMP]/` for future reference.
