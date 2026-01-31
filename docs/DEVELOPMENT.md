# Development

This document explains how to set up and run the Math7 monorepo locally (Student App, Admin Panel, and Supabase).

## Repository layout

- `student-app/`: Flutter (tablet-first) student application (offline-first).
- `admin-panel/`: React + Vite + TypeScript admin dashboard.
- `supabase/`: Supabase project (migrations, seed, RLS verification scripts).
- `scripts/`: Phase validation scripts (cross-platform variants exist).

## Prerequisites

- **Node.js**: v18+ (CI uses Node 18).
- **Flutter**: 3.19.0+ (CI pins 3.19.0; local environments may use newer).
- **Docker**: required for local Supabase (`supabase start`) and Phase 1 validation.
- **Supabase CLI**: required for local DB workflows.
- **Android SDK**: only required for Android builds / Phase 4 strict validation.

## Environment files

- **Admin Panel**: copy `admin-panel/.env.example` to `admin-panel/.env`.
- **Student App**: copy `student-app/.env.example` to `student-app/.env`.

The `*.env.example` files in this repo are the canonical examples.

## Quickstart

Run `make help` to see the contract commands.

For the full local gate run (similar to CI), run:

- `make ci`

### Admin Panel

- Install dependencies:
  - `make web_setup`
- Run dev server (binds to `0.0.0.0:5173`):
  - `make web_dev`
- Lint / test / build:
  - `make web_lint`
  - `make web_test`
  - `make web_build`

### Student App (Flutter)

- Install dependencies:
  - `make flutter_setup`
- Run codegen (Drift/Riverpod/etc):
  - `make flutter_gen`
- Analyze / test:
  - `make flutter_analyze`
  - `make flutter_test`
- Smoke test on web (binds to `0.0.0.0:3000`):
  - `make flutter_run_web`

### Database (Supabase)

- Start/stop local Supabase stack:
  - `make db_start`
  - `make db_stop`
- Apply migrations:
  - `make db_migrate`
- Reset local DB (destructive):
  - `make db_reset`
- Verify RLS:
  - `make db_verify_rls`

## Phase validation scripts

Phase validations are implemented as scripts in `scripts/`.

- Bash:
  - `./scripts/validate-phase--1.sh`
  - `./scripts/validate-phase-0.sh`
  - `./scripts/validate-phase-1.sh`
  - `./scripts/validate-phase-2.sh`
  - `./scripts/validate-phase-3.sh`
  - `./scripts/validate-phase-4.sh`

On Windows, prefer the PowerShell equivalents (`scripts/validate-phase-*.ps1`) when available.

## Logs & artifacts

Validation runs write logs to:

- `artifacts/validation/phase-<N>.log`

## Troubleshooting

- **Low disk space**: validation scripts may skip/fail when Docker or Android build artifacts require more space.
- **Supabase start failures**: ensure Docker is running and has enough free disk.
- **Ports/hosts**: dev servers are expected to bind to `0.0.0.0` (not `localhost`) per the repo contract.
