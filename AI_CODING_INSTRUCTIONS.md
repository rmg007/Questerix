# AI Coding Instructions

This repository is contract-driven. Use the repo’s contracts (Makefile, CI workflows, validation scripts, migrations/RLS checks) as the primary source of truth for “how to work here.”

## Authority order (highest to lowest)

1. `AppShell/docs/AGENTS.md`
2. `AppShell/docs/SCHEMA.md` (explanatory reference; migrations are executable truth)
3. `PHASE_STATE.json`
4. `AppShell/docs/specs/*`
5. Everything else (README, ad-hoc notes)

If two sources conflict, follow the highest-ranked source.

## Repository contracts you must follow

### Run/test contract

- Use the `Makefile` targets whenever possible.
- Dev servers must bind to `0.0.0.0` (not `localhost`) to support remote dev environments.

### CI/validation contract

- CI gates are defined in:
  - `.github/workflows/ci.yml`
  - `.github/workflows/validate.yml`
- Phase validation scripts live in `scripts/validate-phase-*.sh|ps1`.
- `STRICT=1` is enforced in CI. Skips that are allowed locally become failures in CI.

### Database security contract

- Supabase is the backend.
- RBAC is enforced in the database via RLS/policies (not just UI).
- `supabase/scripts/verify_rls.sql` is the security verification harness.

## Locked technology decisions (do not change without explicit approval)

- **Student app**: Flutter.
- **State management (Flutter)**: Riverpod only.
- **Admin panel**: React + Vite + TypeScript.
- **Server state (React)**: `@tanstack/react-query` v5.
- **Backend**: Supabase.

## Key implementation conventions

- **Offline-first**: local writes first, then sync.
- **Soft delete + timestamps**: tables use `updated_at` and `deleted_at` for sync.
- **Student attempt submission**: use the `batch_submit_attempts` RPC (not direct REST writes to `attempts`).

## Safe change principles

- Prefer small, reviewable change sets.
- Do not introduce new libraries, patterns, or architecture unless the contracts/specs explicitly allow it.
- Do not weaken security or rely on UI-only checks for admin access.

## Where to look for “how to do X”

- Local development: `docs/DEVELOPMENT.md`
- CI expectations and Strict mode: `docs/CI_CONTRACT.md`
- Validation scripts: `scripts/validate-phase-*.sh` and `scripts/common.sh`
- Database schema and RLS: `supabase/migrations/*.sql` and `supabase/scripts/verify_rls.sql`
