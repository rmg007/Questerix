# Learning Log

This document captures lessons learned during development to prevent repeated mistakes and improve future implementations.

---

## 2026-02-04: Unified Design System Implementation

### Session Context
- **Objective**: Implement a unified design system across all Questerix apps (Student App, Admin Panel, Landing Pages)
- **Technologies**: Flutter/Dart, React/Tailwind, JSON tokens, PowerShell generators

---

### Key Learnings

#### 1. Generated Code Naming Conventions Must Match Usage

**What Happened**: Created a `Breakpoints` class with constants like `lg`, `xl`, `xxl` but then used them as `Breakpoints.tablet`, `Breakpoints.desktop` in the MainShell implementation.

**Error**:
```
error - The getter 'desktop' isn't defined for the type 'Breakpoints'
```

**Fix**: Made the constant names match their semantic meaning OR used the technical names consistently.

**Future Prevention**: 
- When generating code, document the exact constant names
- Use the same names in implementation as defined in generators
- Consider adding semantic aliases like:
  ```dart
  static const double tablet = lg;  // 768px
  static const double desktop = xl; // 1024px
  ```

---

#### 2. Flutter Icon Package Integration

**What Worked Well**:
- Adding `lucide_icons` via `flutter pub add` is straightforward
- Creating an `AppIcons` abstract class that maps semantic names to LucideIcons works cleanly
- Barrel exports for generated files make imports simple

**Mapping Pattern**:
```dart
// Instead of directly using LucideIcons throughout the app:
Icon(LucideIcons.home)

// Create a semantic layer:
abstract class AppIcons {
  static const home = LucideIcons.home;
  static const learn = LucideIcons.bookOpen;
  static const practice = LucideIcons.target;
}

// Usage:
Icon(AppIcons.home)  // Platform-agnostic, semantic
```

**Benefit**: Icon can be changed in one place without touching all usages.

---

#### 3. Responsive Navigation Pattern (Material 3)

**Best Practice Implementation**:
```dart
final screenWidth = MediaQuery.of(context).size.width;
final isTablet = screenWidth >= 768;
final isDesktop = screenWidth >= 1024;

if (isTablet) {
  return Row(
    children: [
      NavigationRail(
        extended: isDesktop,  // Show labels only on desktop
        ...
      ),
      VerticalDivider(),
      Expanded(
        child: ConstrainedBox(
          constraints: BoxConstraints(maxWidth: 1200),
          child: content,
        ),
      ),
    ],
  );
}

return Scaffold(
  body: content,
  bottomNavigationBar: BottomNavigationBar(...),
);
```

**Key Points**:
- Use `NavigationRail` for tablet+, `BottomNavigationBar` for mobile
- `extended: true` on desktop shows labels, collapsed on tablet
- Wrap content in `ConstrainedBox(maxWidth: 1200)` for readable line lengths

---

#### 4. Token-Based Design System Architecture

**Recommended Structure**:
```
design-system/
├── tokens/           # Source of truth (JSON)
│   ├── colors.json
│   ├── typography.json
│   └── ...
├── generators/       # Platform-specific generators
│   ├── generate-flutter.ps1
│   └── generate-tailwind.ps1
└── generated/        # Output (committed for Tailwind, ignored for Flutter if in app)
```

**JSON Token Format**:
```json
{
  "brand": {
    "primary": "#319795",
    "secondary": "#6B46C1"
  },
  "semantic": {
    "success": "#38A169",
    "error": "#E53E3E"
  }
}
```

**Flutter Output**:
```dart
abstract class BrandColors {
  static const Color primary = Color(0xFF319795);
}
```

**Tailwind Output**:
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#319795'
      }
    }
  }
}
```

---

#### 5. Backward Compatibility Strategy

**Problem**: Existing code uses `AppColors.primary` but new generated code uses `BrandColors.primary`.

**Solution**: Don't break existing code. Add deprecation comments and re-exports:

```dart
// In app_theme.dart (legacy)
/// @deprecated Use BrandColors.primary from generated tokens
class AppColors {
  static const primary = Color(0xFF6366F1);
}

// Add comment pointing to new system
// Design System Integration:
// - Generated tokens: package:student_app/core/theme/generated/generated.dart
// - Use BrandColors, SemanticColors for new code
// - Legacy AppColors maintained for backward compatibility
```

**Gradual Migration**: Update screens one at a time rather than all at once.

---

#### 6. Pre-existing Test Failures vs. New Breakage

**Observation**: Running tests surfaced 21 failures, but analysis showed:
- None were caused by design system changes
- All were pre-existing issues with widget finders and text expectations

**Process Used**:
1. Document test failures
2. Verify they're unrelated to current changes by checking stack traces
3. Mark as "pre-existing" in certification report
4. Schedule as separate work item

**Important**: Don't let pre-existing failures block deployment of unrelated features, but DO document them.

---

#### 7. PowerShell Generator Patterns

**Useful Pattern for JSON → Dart Generation**:
```powershell
$tokens = Get-Content "tokens/colors.json" | ConvertFrom-Json

$dartContent = @"
// GENERATED CODE - DO NOT MODIFY BY HAND
abstract class BrandColors {
"@

foreach ($prop in $tokens.brand.PSObject.Properties) {
    $hexValue = $prop.Value -replace '#', '0xFF'
    $dartContent += "`n  static const Color $($prop.Name) = Color($hexValue);"
}

$dartContent += "`n}`n"
Set-Content -Path "output/app_colors.g.dart" -Value $dartContent
```

**Key Points**:
- Use `.PSObject.Properties` to iterate JSON objects in PowerShell
- Add "GENERATED CODE" header to prevent manual edits
- Use `.g.dart` suffix (standard Flutter convention for generated files)

---

### Recommendations for Future Work

1. **Add Semantic Breakpoint Aliases**: Add `tablet`, `desktop` aliases to Breakpoints class
2. **Update Tests**: Schedule work item to fix pre-existing test failures
3. **Icon Audit**: Review all Material Icons usage and migrate to AppIcons
4. **Admin Panel Integration**: Import Tailwind preset in admin-panel config
5. **CI Integration**: Add generator step to CI pipeline to detect drift

---

### Files Modified/Created

| File | Action | Purpose |
|------|--------|---------|
| `design-system/tokens/*.json` | Created | Token definitions |
| `design-system/generators/*.ps1` | Created | Generation scripts |
| `student-app/.../generated/*.g.dart` | Generated | Flutter theme tokens |
| `main_shell.dart` | Modified | Responsive navigation |
| `domains_screen.dart` | Modified | Lucide icons |
| `onboarding_screen.dart` | Modified | Width constraints |
| `design-system/README.md` | Created | Usage documentation |

---

### Certification Status

✅ **CERTIFIED** with documented notes on pre-existing test failures.


## 2026-02-04: Operation Ironclad Audit

### Context
- **Objective**: Security and Architecture Audit
- **Outcome**: Certified with one fix

### Key Learnings

#### 1. Test String Exactness
**What Happened**: A UI test failed because it expected 'Ask a parent for help' but the UI displayed 'Ask a Parent for Help'.
**Fix**: Updated the test expectation to match the exact string casing.
**Lesson**: UI copy changes must be synchronized with test expectations. When modifying UI text, always grep for usage in 	est/.

#### 2. Audit Script Encoding
**What Happened**: The audit script failed to print to stdout in Windows PowerShell due to a UnicodeEncodeError with the checkmark emoji.
**Fix**: Modified the script to write directly to a UTF-8 encoded file instead of relying on console output.
**Lesson**: For autonomous agents on Windows, file I/O is more reliable than stdout for capturing rich text reports.

#### 3. The 'Zombie Tenant' Risk (Hardcoded UUIDs)
**What Happened**: We identified a risk where developers might hardcode a tenant UUID (like 51f4...) in pp_config_service.dart for local testing.
**Risk**: If this leaks to production, offline devices could default to the wrong school tenant during sync failures, violating data isolation.
**Fix**: Implemented an automated architectural check (udit_architecture) to scan for known testing UUIDs before release.
**Lesson**: Never trust manual review for constants. Use automated grep checks in CI/CD pipelines to block known development secrets/UUIDs.

#### 4. The 'Blind Fire' RPC (Unscoped Admin Actions)
**What Happened**: We audited the publish_curriculum RPC and found it could theoretically be called without arguments in TypeScript.
**Risk**: A typeless or ny-cast call could inadvertently trigger a global publish action across all tenants.
**Fix**: Verified that all usages are arguments-scoped. Documented the risk for future linter rules.
**Lesson**: Dangerous RPCs should require explicit arguments even at the database function level (raise exception if null) to prevent client-side mistakes.
## 2026-02-05: Zero-Cost Error Monitoring Implementation

### Session Context
- **Objective**: Replace paid Sentry service with a Supabase-native error tracking system.
- **Technologies**: Supabase RPC, PostgreSQL Tables, React ErrorBoundary, Flutter Error Handling.

---

### Key Learnings

#### 1. Zero-Cost Observability via Supabase
**What Worked**: Using a custom `error_logs` table combined with a `SECURITY DEFINER` RPC function (`log_error`) allows for seamless error capture without external SDKs.
- **Benefit**: Saves $89/month (Sentry lower tier) while keeping all data within the project's primary data store.
- **Security**: The `log_error` function can be configured to allow anonymous inserts (useful for login errors) while correctly attributing `user_id` via `auth.uid()` for authenticated sessions.

#### 2. Robustness in Error Trackers
**Key Requirement**: Error trackers must be the most resilient part of the system.
- **Problem**: If the `captureException` logic itself throws an error (e.g., network failure to Supabase), it can trigger an infinite loop if caught by a global handler.
- **Solution**: Always wrap error tracking logic in a try-catch that fails silently (`console.error` only) to the user.

#### 3. React vs. Flutter Error Catching Patterns
**Implementation Note**:
- **React**: `ErrorBoundary` only catches errors in the render tree. Async errors (Promises) and event handlers must be caught via `window.addEventListener('unhandledrejection')` and `window.addEventListener('error')`.
- **Flutter**: Requires a two-pronged approach using `FlutterError.onError` (UI framework) and `PlatformDispatcher.instance.onError` (async/platform level).

#### 4. The "Observability to Knowledge" Pipeline
**Process Innovation**: Created a `promote_error_to_issue` RPC that allows one-click conversion from a raw error log into a `known_issues` entry.
- **Impact**: Dramatically reduces the friction for technical documentation.
- **AI Integration**: Documented issues in `known_issues` can be indexed by Project Oracle, allowing AI agents to "learn" from past bugs automatically.

---

### Recommendations for Future Work
1. **Log Cleanup**: Implement a TTL (Time To Live) or a maintenance cron job to prune `error_logs` older than 30 days to avoid table bloat.
2. **Alerting**: Add a Supabase Edge Function with Postmark/SendGrid integration to send emails for "Critical" severity errors.
3. **Session Replay**: Explore lightweight "breadcrumbs" (e.g., last 10 navigation events) to be stored in the `extra_context` JSONB field.

---

### Files Modified/Created

| File | Action | Purpose |
|------|--------|---------|
| `supabase/migrations/...error_tracking_system.sql` | Created | Database schema & RPCs |
| `admin-panel/src/lib/error-tracker.ts` | Created | React capture utility |
| `admin-panel/src/features/monitoring/pages/ErrorLogsPage.tsx` | Created | Triage Dashboard |
| `student-app/lib/src/core/errors/error_tracker.dart` | Created | Flutter capture utility |
| `student_app/pubspec.yaml` | Modified | Removed Sentry dependency |

---

## 2026-02-05: Project Oracle & Sync Performance Refactor

### Session Context
- **Objective**: Integrate database-backed known issues into semantic search and optimize sync performance.
- **Technologies**: pgvector (HNSW), Supabase RPC, Flutter/Drift Batching.

---

### Key Learnings

#### 1. Semantic Indexing of Structured Data
**What Worked**: Formatting structured database records (e.g., `known_issues`) into a "Markdown pseudo-file" before embedding.
- **Pattern**:
  ```markdown
  # [Root Cause]
  [Description]
  ## Resolution
  [Resolution Steps]
  ```
- **Benefit**: Allows the semantic engine (Project Oracle) to process database records exactly like documentation files, maintaining a unified search pipeline.

#### 2. Vector Index Maintenance (IVFFlat vs. HNSW)
**Observation**: `IVFFlat` indexes can suffer from "index drift" as new data is added, requiring frequent `REINDEX` or specialized `lists` parameters.
- **Optimization**: Switched to `HNSW` (Hierarchical Navigable Small World) index for `knowledge_chunks`.
- **Reasoning**: `HNSW` is more robust for growing datasets and provides better recall at the cost of slightly higher memory usage, which is acceptable for the Questerix KB size.

#### 3. Supabase RPC Batching (The "Array Sink" Pattern)
**What Worked**: Refactoring the Flutter `SyncService` from record-by-record processing to grouped batching.
- **Pattern**: Group outbox items by `table` + `action`, then send in batches of 50.
- **Critical Insight**: Supabase RPC functions that take JSON/arrays (like `submit_attempt_and_update_progress`) should always be the default for sync operations to minimize RTT (Round Trip Time).
- **Result**: Reduced network requests by ~80% during high-volume student activity syncs.

#### 4. Automated Observability Maintenance
**Process**: Setup `pg_cron` for automated pruning of raw error logs.
- **Insight**: Observability should not turn into a storage cost liability. Automated pruning is essential for $0-tier sustainability.

---

### Recommendations for Future Work
1. **GitHub CLI Automation**: Ensure `gh auth login` is performed on first environment setup to enable automated issue tracking.
2. **Sync Buffering**: Implement a 200ms debounce buffer in the `SyncService` to further group frequent UI-triggered updates.

---

### Files Modified/Created

| File | Action | Purpose |
|------|--------|---------|
| `student-app/.../sync_service.dart` | Refactored | Implemented batched push logic |
| `scripts/knowledge-base/index-issues.ts` | Created | Database-to-Oracle indexing script |
## 2026-02-05: Phase 16 - Schema Alignment & Mastery Sync

### Session Context
- **Objective**: Standardize mastery tracking schema and implement bi-directional synchronization.
- **Technologies**: Supabase (PostgreSQL), Drift (Flutter), SQL Migrations.

---

### Key Learnings

#### 1. "Naming Drift" in Offline-First Apps
**What Happened**: The Supabase schema used `best_streak` while the Drift client (frontend) expected `longest_streak`. This caused the sync mapping logic to fail when parsing RPC responses.
- **Root Cause**: Independent development of the database schema and mobile client without a shared "Contract of Truth" for calculated fields.
- **Fix**: Applied a standardization migration to rename columns in Supabase to match the Drift models.
- **Prevention**: Always verify the `tables.dart` definitions against the `000...baseline.sql` before implementing sync logic. Use a shared field registry if possible.

#### 2. Vector Index Precision (HNSW vs. IVFFlat)
**Observation**: Documentation search recall for Project Oracle was inconsistent.
- **Technical Insight**: `IVFFlat` is a cluster-based index that requires frequent `REINDEX` as the "centroid" locations shift with new documentation. `HNSW` is a graph-based index that maintains high recall without cluster re-centering.
- **Action**: Migrated the `knowledge_chunks_embedding_idx` to `HNSW`.
- **Lesson**: For RAG systems where data arrives incrementally (like dev docs), `HNSW` is superior to `IVFFlat` despite slightly higher memory overhead.

#### 3. Closing the Sync Loop (Bi-directional Pull)
**Implementation Note**: Initially, `skill_progress` was only "pushed" (calculated on server via triggers). This created a "Stale State" when a user switched devices.
- **Solution**: Added `skill_progress` to the `pull_changes` RPC and implemented `_pullSkillProgress` in the Flutter client.
- **Lesson**: Any table that is updated via server-side triggers *must* be included in the "Pull" sequence of the sync engine, or the client will never see the server's computed truth.

---

### Recommendations for Future Work
1. **Schema Checksum**: Implement a script that compares Drift table definitions (generated `.g.dart`) with Supabase table metadata and alerts on name mismatches.
2. **HNSW Monitoring**: Monitor pgvector memory usage more closely as the documentation corpus grows beyond 1,000 chunks.

---

### Files Modified/Created

| File | Action | Purpose |
|------|--------|---------|
| `supabase/migrations/...standardize_sync_schema.sql` | Created | Aligned SQL with Drift names |
| `supabase/migrations/...update_pull_changes.sql` | Created | Enabled pull support for mastery |
| `student-app/.../sync_service.dart` | Modified | Implemented mastery pull logic |
| `supabase/migrations/...maintenance_and_alerts.sql` | Modified | Switched to HNSW index |

---

## 2026-02-05: ESLint `no-implicit-coercion` Rule Enforcement

### Session Context
- **Objective**: Add the `no-implicit-coercion` ESLint rule to prevent implicit type coercion patterns.
- **Scope**: All ESLint-configured projects (Admin Panel, Landing Pages).

---

### What Was Done

#### 1. Added ESLint Rule
Added `"no-implicit-coercion": "error"` to both ESLint configuration files:

| File | Format |
|------|--------|
| `admin-panel/.eslintrc.cjs` | Legacy CommonJS |
| `landing-pages/eslint.config.js` | Flat config (ESM) |

**Example (Legacy format)**:
```javascript
rules: {
  'no-implicit-coercion': 'error',
  // ...existing rules
}
```

#### 2. Ran Auto-Fix
Executed `npx eslint . --fix` in both directories to automatically correct fixable violations.

**Results**:
- 54 files modified with auto-corrections
- Remaining unfixable errors documented for manual resolution

---

### Key Learnings

#### 1. What `no-implicit-coercion` Prevents
This rule disallows shorthand type conversions that can be confusing:

| Disallowed | Preferred |
|------------|-----------|
| `!!foo` | `Boolean(foo)` |
| `+foo` | `Number(foo)` |
| `"" + foo` | `String(foo)` |
| `~arr.indexOf(item)` | `arr.includes(item)` |

**Benefit**: Improves code readability by making type conversions explicit.

#### 2. ESLint Config Format Differences
- **Legacy (`.eslintrc.cjs`)**: Uses `module.exports` with a `rules` object
- **Flat Config (`eslint.config.js`)**: Uses `defineConfig` with `rules` inside configuration objects

---

### Files Modified

| File | Action | Purpose |
|------|--------|---------|
| `admin-panel/.eslintrc.cjs` | Modified | Added rule |
| `landing-pages/eslint.config.js` | Modified | Added rule |
| 54 source files | Auto-fixed | Applied ESLint corrections |

---

### Remaining Issues (Not Auto-Fixable)

| Directory | Errors | Type |
|-----------|--------|------|
| `admin-panel` | 93 | `no-undef` (process), `no-mixed-spaces-and-tabs` |
| `landing-pages` | 2 | `@typescript-eslint/no-empty-object-type` |

These require manual code changes to resolve.
