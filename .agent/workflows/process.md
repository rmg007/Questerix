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
3.  **Impact Analysis**: Explicitly state the impact on existing systems (Database, API, UI).
4.  **Edge Case Audit**: Document at least 3 edge cases and how they are handled.
5.  **Output**: A structured Implementation Plan (Markdown).

**EXIT GATE**: USER gives explicit approval to proceed.

---

## 🛠️ Phase 2: Implementation & Fix Loop (Recursive)
**Goal**: Deliver clean, functional code that matches the plan.

1.  **Execute**: Implement the approved plan in small, logical chunks.
2.  **Self-Review**: After each chunk, run static analysis and "hallucination check."
3.  **Fix Loop**: If errors or inconsistencies are found, fix them immediately.
4.  **Repeat**: Loop until all planned features are implemented and the Agent is 100% confident.

**EXIT GATE**: All code implemented and self-reviewed.

---

## 🧪 Phase 3: Verification & QA Loop (Testing)
**Goal**: Zero-bug status through rigorous automation.

1.  **Test Creation**: Write unit/integration/E2E tests as specified in the plan.
2.  **QA Loop**: Run tests. If any fail, fix the code and re-run.
3.  **Repeat**: Loop until **100% of tests pass**.
4.  **Evidence**: Provide a summary of passed tests (pass/fail counts).

**EXIT GATE**: 100% Test Success.

---

## 📝 Phase 4: Finalization (Learning & Docs)
**Goal**: Capture knowledge and update the Single Source of Truth.

1.  **Postmortem**: Complete the Bug Learning Loop for any issues caught during development.
    *   Update `docs/LEARNING_LOG.md`.
2.  **Documentation**: Update documentation in extreme detail.
    *   **Goal**: If this doc is given to another AI, they produce the exact same result.
    *   Follow the "Lean Docs" principle.
3.  **Git Push**: Stage, commit with a semantic message, and push to remote.

**EXIT GATE**: Registry/Docs updated and changes pushed.

---

## 🚀 Phase 5: Release (Deployment)
**Goal**: Secure and verified deployment.

1.  **Prompt**: Ask the USER: *"Would you like to deploy? If so, which application (Admin Panel / Student App / Landing Pages)?"*
2.  **Deploy**: Execute the specific deployment script for the chosen app.
3.  **Verify**: Perform a post-deployment smoke test.

**EXIT GATE**: Deployment successful or USER declined.
