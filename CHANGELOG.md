# Changelog

## Unreleased

- Rollcage v0.6.0 pinned (commit 73151de). Pieces 02 and 04 now call Rollcage's actions instead of cloning it or inlining gitleaks.

- Rollcage v0.4.0 pinned (commit e311c8e). Piece 07 CI failure triage added as a weekly read-only workflow.
- `main` is protected: six required checks, one code-owner review, linear history.

## 0.1.0 (2026-11-25)

First release.

- Orders service (`GET /healthz`, `GET /hello`, `POST /orders`, `GET /orders/:id`) with validation and tests.
- Rollcage v0.3.0 wired in: PR risk gate (01), secrets guard (04), SBOM and CVE triage (05), policy gates (06), agent policy with `protected_paths` (02), weekly DORA metrics (03) and a manual provenance workflow (10).
- README rewritten as an adoption guide, plus corrected branch-protection settings.
