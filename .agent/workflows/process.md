---
description: Unified Questerix Development Lifecycle
---

// turbo-all

# 🚀 /process - The Unified Questerix Lifecycle

This workflow governs the entire development cycle from idea to deployment. It enforces planning-first, recursive self-correction, rigorous testing, and reproducible documentation.

---

## 🛑 Phase 1: Planning & Strategy (Interactive)
**Goal**: Reach a 100% complete technical blueprint.
**Constraint**: **NO CODING ALLOWED.**

1.  **Explore**: Analyze the request, repository state, and edge cases.
2.  **Strategize**: Bounce ideas with the USER until the "Perfect Plan" is reached.
3.  **Architectural Lockdown**: Explicitly identify the Design Patterns (e.g., Repository, Bloc, Factory) and SOLID principles to be applied.
4.  **Structural Map**: Define the file structure and module boundaries to prevent spaghetti growth.
5.  **Impact Analysis**: Explicitly state the impact on existing systems (Database, API, UI).
6.  **Edge Case Audit**: Document at least 3 edge cases and how they are handled.
7.  **Output**: A structured Implementation Plan (Markdown).

**EXIT GATE**: USER gives explicit approval to proceed.

---

## 🏗️ Phase 2: Database & Schema Evolution
**Goal**: Secure, typed, and verified data foundation.

1.  **Migration Execution**: 
    *   Write and apply SQL migrations (`supabase db push` or equivalent).
    *   Ensure all constraints (Unique, Foreign Key, Check) match the plan.
2.  **RLS & Multi-Tenant Audit**:
    *   Implement/Update Row Level Security policies.
    *   **Verification**: Run SQL checks to ensure `app_id` isolation is enforced.
3.  **Type Synchronization**:
    *   **TypeScript**: Run `supabase gen types typescript` to update frontend interfaces.
    *   **Dart**: Update models/mappers in `questerix_domain` or `student-app` to match schema.
4.  **Seed Data Integrity**:
    *   Apply/Update `seed.sql` with realistic data.
    *   Verify that no constraint violations occur during ingestion.

**EXIT GATE**: Schema applied, RLS verified, and Types synchronized.

---

## 🛠️ Phase 3: Implementation & Quality Loop (Recursive)
**Goal**: Deliver clean, functional code that matches the plan.

1.  **Execute**: Implement the approved plan in small, logical chunks.
2.  **Dependency & Bundle Hygiene**:
    *   Evaluate if the logic can be written in vanilla code before adding a new package.
    *   If a new dependency is added, verify its size and impact on build time/bundle size.
3.  **Quality Enforcement**:
    *   **Separation of Concerns**: Keep business logic out of UI files.
    *   **DRY & SOLID**: Refactor redundant logic into shared utilities or base classes.
    *   **Readability**: Use descriptive naming and avoid deep nesting (>3 levels).
4.  **Devil's Advocate Stress Test**:
    *   Simulate low-connectivity/offline states.
    *   Test "Rapid-Fire" scenarios (hitting buttons multiple times quickly).
    *   Verify handling of "Unexpected Nulls" or "Empty Data States".
5.  **Self-Review**: After each chunk, run static analysis and "hallucination check."
6.  **Fix Loop**: If errors, inconsistencies, or "spaghetti smells" are found, fix them immediately.
7.  **Repeat**: Loop until all planned features are implemented and the Agent is 100% confident.

**EXIT GATE**: All code implemented, stress-tested, and refactored for quality.

---

## 🧪 Phase 4: Verification & Quality Audit
**Goal**: Zero-bug status, premium visual fidelity, and enterprise-grade safety.

1.  **Test Creation**: Write unit/integration/E2E tests as specified in the plan.
2.  **Multi-Tenant & Security Isolation**:
    *   **Data Leakage Check**: Verify that RLS policies explicitly filter data by `app_id` or `tenant_id`.
    *   **Session Isolation**: Test with different user sessions to ensure one tenant cannot see another's data.
3.  **Performance & Jank Audit**:
    *   Check for unnecessary re-renders (React) or frame drops (Flutter).
    *   Ensure expensive operations are run in background threads (Isolates/Workers).
    *   Verify virtualization/pagination for large lists.
4.  **QA Loop**: Run tests. If any fail, fix the code and re-run.
5.  **Visual Design Audit (If UI changed)**:
    *   **Visual Inspection**: Use `browser_subagent` to capture screenshots of all modified screens.
    *   **Premium Critique**: Review for "Wow" factor: check gradients, glassmorphism, spacing consistency, and modern typography.
    *   **UX Fidelity**: Verify smooth transitions, responsive layouts, and intuitive button placement.
    *   **Accessibility Check**: Ensure contrast ratios and screen reader labels meet standards.
6.  **Repeat**: Loop until **100% of tests pass**, **Visuals are Premium**, and **Performance is Smooth**.
7.  **Evidence**: Provide a summary of passed tests (pass/fail counts) and **attach visual proof** (screenshots).

**EXIT GATE**: 100% Test Success, Security Verified, and Visual Design Approved.

---

## 📝 Phase 5: Finalization (Learning & Docs)
**Goal**: Capture knowledge and update the Single Source of Truth.

1.  **Postmortem**: Complete the Bug Learning Loop for any issues caught during development.
    *   Update `docs/LEARNING_LOG.md`.
2.  **Documentation**: Update documentation in extreme detail.
    *   **Goal**: If this doc is given to another AI, they produce the exact same result.
    *   Follow the "Lean Docs" principle.
3.  **Git Push**: Stage, commit with a semantic message, and push to remote.

**EXIT GATE**: Registry/Docs updated and changes pushed.

---

## 🚀 Phase 6: Release (Deployment)
**Goal**: Secure and verified deployment.

1.  **Prompt**: Ask the USER: *"Would you like to deploy? If so, which application (Admin Panel / Student App / Landing Pages)?"*
2.  **Deploy**: Execute the specific deployment script for the chosen app.
3.  **Verify**: Perform a post-deployment smoke test.

**EXIT GATE**: Deployment successful or USER declined.
