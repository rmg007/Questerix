---
description: Enterprise Grade QA Suite (SDLC Best Practices) // turbo-all
---

This workflow implements a **comprehensive Quality Assurance strategy** designed to ensure zero-bug releases, pixel-perfect UI, and bulletproof logic.

---

# 🛡️ Phase 1: Code Hygiene (Fail Fast)
*Goal: Catch typos, style violations, and potential errors before running code.*

// turbo
1. Flutter Static Analysis (Strict)
   `flutter analyze`

// turbo
2. Dart Formatting Check
   `dart format --output=none --set-exit-if-changed .`

// turbo
3. Admin Panel Linting
   `cd admin-panel; npm run lint`

---

# 🧠 Phase 2: Logic & Unit Verification
*Goal: Ensure individual components (Repositories, Providers, Services) work in isolation.*

// turbo
4. Flutter Unit Tests (Business Logic)
   `flutter test`
   > Focus: Auth logic, Curriculum generation, Offline Sync state.

// turbo
5. Admin Panel Unit Tests
   `cd admin-panel; npm run test`
   > Focus: Form validation, Data transformation hooks.

---

# 🔗 Phase 3: Integration & Data Integrity
*Goal: Verify modules talk to each other correctly (Drift <-> Supabase).*

// turbo
6. Mobile Integration Tests (Offline/Online Sync)
   `flutter test integration_test/sync_test.dart`
   > *Note: If this file doesn't exist, I will create it to verify the critical "Offline First" architecture.*

---

# 🕵️ Phase 4: End-to-End (The User Journey)
*Goal: Simulate real user behavior on fast/stable platforms.*

// turbo
7. Admin Panel E2E (Playwright)
   `cd admin-panel; npx playwright test`
   > Scenarios: Teacher login, creating a Domain, assigning questions.

// turbo
8. Student App E2E (Windows Desktop - Fast)
   `flutter run -d windows -t integration_test/app_test.dart`
   > Why Windows? It implies the same Logic/UI rendering engine as Mobile but runs 10x faster for rapid iteration.

---

# 📱 Phase 5: Mobile Fidelity (Transitions & Animations)
*Goal: Verify "Feel", Touch targets, and Native transitions.*

// turbo
9. Launch Android Emulator (Background)
   `$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"; Start-Process -FilePath "$env:LOCALAPPDATA\Android\Sdk\emulator\emulator.exe" -ArgumentList "-avd Medium_Phone_API_36.1" -PassThru`

// turbo
10. Run on Android Emulator
    `flutter run -d emulator-5554`
    > *Action: I will launch the app so you (the Testing Lead) can manually verify animations and gestures.*

---

# 📦 Phase 6: Production Build Readiness
*Goal: Ensure the code compiles for distribution.*

// turbo
11. Verify Web Build (Student)
    `flutter build web --release`

// turbo
12. Verify Admin Build
    `cd admin-panel; npm run build`

---

# 🎨 Phase 7: UI/UX Audit
*Goal: Visual perfection.*

> **Manual Step:** Ask "Open the browser" to visually inspect the Admin Panel Dashboard. 
> **Manual Step:** Check the running Android Emulator for jank or layout overflows.
