# rollcage-example

A small orders service that adopts [Rollcage](https://github.com/frankTurtle/rollcage) the way a real
team would. It is the worked example for the guide at `docs/adopting.md` in the Rollcage repo.

The app is a dependency-free TypeScript HTTP service (`GET /healthz`, `GET /hello`,
`POST /orders`, `GET /orders/:id`) with a Terraform module for its S3 bucket. It is deliberately small. The point is
the wiring around it.

## What is wired in

| Phase | Piece                  | Where to look                                                                                                          |
| ----- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| 0     | 02 agent policy        | `policy/`, `.claude/settings.json`, `.claude/agent-policy.yml`, `.claude/hooks/`, `.github/workflows/agent-policy.yml` |
| 0     | 04 secrets guard       | `.pre-commit-config.yaml`, `.github/workflows/secrets-scan.yml`                                                        |
| 1     | 01 PR risk gate        | `risk-gate.yml`, `.github/workflows/gate-pr-risk.yml`                                                                  |
| 1     | 05 SBOM and CVE triage | `.github/workflows/sbom-vuln.yml`                                                                                      |
| 1     | 06 policy gates        | `infra/main.tf`, `.github/workflows/policy-gates.yml`                                                                  |
| 2     | 10 provenance          | `.github/workflows/provenance.yml`                                                                                     |
| 3     | 03 DORA metrics        | `dora.yml`, `.github/workflows/dora-weekly.yml`                                                                        |

Pieces 07, 08, 09, 11, 13 and 14 are described in the guide and not wired
here yet.

## Run it

```bash
pnpm install
pnpm check:all   # lint, format, typecheck, tests with coverage
pnpm build && node dist/main.js
curl -s -XPOST localhost:3000/orders -d '{"sku":"ABC-1","quantity":2,"cents":500}'
```

The workflows call Rollcage at a pinned commit from `develop` for now, because `protected_paths` is not in a tag yet. Repin to a release tag or commit SHA once `v0.3.0` exists.
