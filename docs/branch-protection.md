# Branch protection setup

Branch protection is what makes the pipeline binding. Without it, a failing check is advice.
Apply these settings to `main` after the first pull request has run, because you need the exact
check names from that run.

## Settings

| Setting                                | Value                                      |
| -------------------------------------- | ------------------------------------------ |
| Require a pull request before merging  | on                                         |
| Required approving reviews             | 1 (raise it for high-risk repositories)    |
| Require review from Code Owners        | on (`.github/CODEOWNERS` names the owners) |
| Dismiss stale approvals on new commits | on                                         |
| Require status checks to pass          | on, and require branches to be up to date  |
| Required checks                        | the jobs listed below                      |
| Include administrators                 | on                                         |
| Allow force pushes and deletions       | off                                        |
| Require linear history                 | on                                         |

A single-maintainer repository cannot satisfy "one approving review" for its own pull requests.
Either add a second reviewer or lower the count and accept the weaker control.

## Required checks

These jobs run from `.github/workflows/ci.yml`:

- `build-test`
- `risk-gate`
- `secrets`
- `sbom`
- `policy`
- `provenance`

GitHub names the check after the caller job and the called job, for example
`build-test / build-test`. Verify before you apply: copy the exact names from the Checks tab of
the first pull request. A required check whose name does not match never reports, and the merge
button stays blocked.

## Apply with the GitHub CLI

This command changes the repository's settings. Read it, replace the check names with the exact
names you copied, and run it yourself. The scaffold does not run it.

```bash
gh api --method PUT repos/frankTurtle/rollcage-example/branches/main/protection --input - <<'JSON'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["build-test / build-test", "risk-gate / gate", "secrets / gitleaks"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "require_code_owner_reviews": true,
    "dismiss_stale_reviews": true
  },
  "restrictions": null,
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON
```

Add the `sbom`, `policy` and `provenance` check names to `contexts` once you have copied them.

## Also enable

- Private vulnerability reporting (Settings, Code security).
- Dependabot alerts and security updates.
- Secret scanning and push protection, if your plan includes them.
