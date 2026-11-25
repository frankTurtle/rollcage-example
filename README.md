# rollcage-example

[![ci](https://github.com/frankTurtle/rollcage-example/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/frankTurtle/rollcage-example/actions/workflows/ci.yml)

A small working service with [Rollcage](https://github.com/frankTurtle/rollcage) wired in, so you can
see what the library does on a real repo and copy it into yours.

Rollcage is a set of guardrails for AI-assisted delivery: PR risk scoring, rules for coding agents,
secret scanning, vulnerability and policy checks, signed releases and DORA metrics. The pieces are
independent. This repo wires the ones that run on a pull request, plus agent rules and metrics.

Starting a brand new service instead? Rollcage's piece 12 scaffold generates a repo with pieces 01,
04, 05, 06 and 10 already wired:
`pnpm --filter @adl/golden-path-template scaffold <dir> --name <n> --owner <o>` in the Rollcage repo.

Adding Rollcage to an existing repo? From its root, on a new branch, run `npx rollcage-init`
(add `--dry-run` to preview). It writes workflows like the ones here, pinned to a commit SHA.
See [rollcage-init on npm](https://www.npmjs.com/package/rollcage-init).

## See it work

1. Fork this repo and enable Actions on the fork (forks start with workflows off).
2. In your fork, change one line in `src/greeting.ts` and open a pull request against your fork's `main`.
3. Watch the checks run and read the comment the risk gate posts.

## Use Rollcage in your own repo

Start with the first two rows: your build plus the PR risk gate in `observe` mode. Add the rest as you go.
Copy the files, then edit what is marked.

| Copy this                                                       | Piece                    | What you see on a PR                                                                                                                                                                   | Edit                                                                                                                            |
| --------------------------------------------------------------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `.github/workflows/ci.yml`, `build-test.yml`                    | Your build               | `ci.yml` calls every other workflow                                                                                                                                                    | `build-test.yml`: your install, test and build commands                                                                         |
| `.github/workflows/gate-pr-risk.yml`, `risk-gate.yml`           | 01 PR risk gate          | One comment with a risk level and what the PR still needs. Workflow, infrastructure and secrets-config changes score high.                                                             | `risk-gate.yml`: start in `observe`, move to `enforce`. All options: `pieces/01-pr-risk-gate/risk-gate.example.yml` in Rollcage |
| `.github/workflows/secrets-scan.yml`, `.pre-commit-config.yaml` | 04 Secrets guard         | A failed check if a secret is in the PR's commits. Locally, a refused commit.                                                                                                          | Organizations need a `GITLEAKS_LICENSE` secret                                                                                  |
| `.github/workflows/sbom-vuln.yml`                               | 05 SBOM and CVE triage   | A prioritized vulnerability list. Fails only for critical findings that are known-exploited or likely to be.                                                                           | `fail-on`, `epss-threshold`, a waivers file                                                                                     |
| `.github/workflows/policy-gates.yml`                            | 06 Policy gates          | A failed check naming the violated control, for example an action not pinned to a SHA                                                                                                  | Terraform rules need a plan JSON; only workflow rules run here                                                                  |
| `policy/`, `.claude/`, `.github/workflows/agent-policy.yml`     | 02 Agent policy          | A failed check if the policy file or guardrails are removed. Locally, coding agents are blocked from reading secrets, force-pushing, writing outside the repo and editing these files. | `policy/`: owner and review cycle. `.claude/agent-policy.yml`: `allowed_hosts`, keep `protected_paths`                          |
| `.github/workflows/ci-triage.yml`                               | 07 CI failure triage     | A weekly report in the job summary classifying failed runs (regression, flaky, infrastructure, dependency)                                                                             | `days`: how far back to read                                                                                                    |
| `.github/workflows/dora-weekly.yml`, `dora.yml`                 | 03 DORA metrics          | A weekly report of the five delivery metrics, once there are a few weeks of history                                                                                                    | `compare-at`: the date your team started using AI tools                                                                         |
| `.github/workflows/provenance.yml`                              | 10 Provenance (optional) | Run by hand: builds a tarball, signs it and verifies it                                                                                                                                | Not run in this repo; see Limits                                                                                                |

Also copy `.github/CODEOWNERS` (set your own team) and `docs/branch-protection.md`.

### Pin a Rollcage version

Every workflow calls `frankTurtle/rollcage` at a full commit SHA, with the tag in a comment. The ones here
are `v0.4.0`. Copied workflows are already pinned, so there is nothing to change on day one. Policy gates
reject any `uses:` that is not a full SHA. To upgrade, resolve a new tag and replace the SHA everywhere:

```bash
git ls-remote https://github.com/frankTurtle/rollcage 'refs/tags/v0.4.0^{}'
```

### Settings

- **Secrets:** none for a personal repo. No Anthropic key is needed: the risk gate uses its deterministic rules only.
- **Branch protection:** after your first PR has run, make the checks required with `docs/branch-protection.md`. Otherwise a red check is only advice.

## Limits

- The agent hooks cover Claude Code. Other tools are covered by the policy text only.
- Model-written text is advisory everywhere. Pass or fail comes from deterministic rules.
- `provenance.yml` has not been run in this repo. Signing writes a public Sigstore entry naming your repository.
- Pieces 07, 08, 09, 11, 13 and 14 are not wired here. See the guide.
- Compliance control mappings in the pieces are illustrative, not attestations.

## Run the sample app

The app is a dependency-free orders service: `GET /healthz`, `GET /hello`, `POST /orders`, `GET /orders/:id`.
`infra/main.tf` is an S3 bucket module for piece 06 to check once you add a Terraform plan step.

```bash
pnpm install
pnpm check:all   # lint, format, typecheck, tests with coverage
pnpm build && node dist/main.js
```

## Where to go next

- [Adopting Rollcage in a real project](https://github.com/frankTurtle/rollcage/blob/develop/docs/adopting.md): the order to turn pieces on, with a check at each step.
- [Rollcage](https://github.com/frankTurtle/rollcage): each piece's README, demos and metrics.
