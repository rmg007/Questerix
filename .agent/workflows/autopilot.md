---
description: Autopilot // turbo-all
---

This workflow enables autonomous execution for common project tasks.
The `// turbo-all` directive above authorizes all command executions within this workflow.

# Flutter & Dart Operations
// turbo
1. Run Flutter Tests with output redirection
   `flutter test * > test_output.txt 2>&1`
// turbo
2. Run Dart Build Runner (Code Generation)
   `dart run build_runner build --delete-conflicting-outputs`
// turbo
3. Get Flutter Dependencies
   `flutter pub get`
// turbo
4. Analyze Project
   `flutter analyze`

# Admin Panel (NPM/Vite) Operations
// turbo
5. Install Node Dependencies
   `npm install`
// turbo
6. Run Playwright Tests (E2E)
   `npx playwright test`
// turbo
7. Build Admin Panel
   `npm run build`

# Supabase Operations
// turbo
8. Generate Types
   `supabase gen types typescript --project-id qvslbiceoonrgjxzkotb > src/lib/database.types.ts`
// turbo
9. Apply Migrations
   `supabase db push`

# MCP Server Installation
// turbo
13. Install/Run Code Scalpel MCP (Graph-based refactoring)
    `uvx code-scalpel init`
// turbo
14. Verify Sequential Thinking MCP
    `npx -y @modelcontextprotocol/server-sequential-thinking --help`

# Git & File Operations
// turbo
10. Stage changes
    `git add .`
// turbo
11. Commit changes
    `git commit -m "update"`
// turbo
12. Create Logs/Files via Redirection
    `echo "log" > output.txt`
