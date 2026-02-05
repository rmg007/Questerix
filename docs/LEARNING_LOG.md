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
