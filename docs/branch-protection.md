# Branch protection

Rollcage's checks only bind once branch protection requires them. Until then a red check is advice.
Do this after the first pull request has run, so you can pick the exact check names.

Require these on `main` (Settings, Branches, or a ruleset):

- A pull request before merging, with review from Code Owners (`.github/CODEOWNERS`)
- These status checks, from `.github/workflows/rollcage.yml` (they show as `<job> / <job>`):

- `risk-gate`
- `agent-policy`
- `secrets`
- `sbom`
- `policy`

- Dismiss stale approvals, no force pushes, no deletions

A single-maintainer repo cannot meet "one approving review" on its own pull requests. Add a second
reviewer or lower the count, and accept the weaker control.
