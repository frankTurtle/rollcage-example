# AI Coding Agent Policy

Vendor-neutral: it applies to Claude Code, GitHub
Copilot, Cursor and any similar tool that reads code, runs commands or edits files for a developer.

- Owner: `frankTurtle`
- Effective: `2026-11-25`
- Review cycle: every `6` months

## 1. Accountability

A human owns every change an agent produces. The person who opens or merges the pull request is
accountable for it as if they had written it. Agent output is a draft until a human has reviewed it.

## 2. What an agent may do on its own

- Read and search source files in the repository.
- Edit files inside the repository working tree.
- Run the project's tests, linters, type checks and builds.
- Create local branches and commits (never on a protected branch).
- Fetch documentation from the allowed hosts: `see `.claude/agent-policy.yml``.

## 3. What needs a human to approve first

- Pushing to a remote, opening a pull request, or merging.
- Adding or upgrading a dependency.
- Changes to authentication, IAM or infrastructure code, database migrations, CI workflows or
  secrets-adjacent configuration. These are high-risk: they need tests and a second human reviewer.
- Installing tools, running unfamiliar network tools, or deleting files not part of the task.

## 4. What an agent must never do

- Read, print, copy or transmit secrets or credentials: `.env` files, private keys, tokens,
  cloud credentials, password files.
- Force-push, or rewrite history on a shared branch.
- Write outside the repository working tree (except ``/tmp``).
- Contact hosts that are not on the allowed list.
- Turn off, edit or bypass these guardrails, the hooks that enforce them, or the audit log. The
  hook settings, the policy config and the hook's source are protected paths: only a human edits
  them, and the hook blocks an agent's write, edit, redirect, `sed -i`, `tee`, `cp`, `mv` or `rm`
  aimed at them (`see `.claude/agent-policy.yml``).
- Approve or merge its own work.

## 5. Data

Do not put customer data, production data, personal data or secrets into a prompt. Use synthetic
or anonymized data. If an agent surfaces a secret, treat it as leaked: rotate it and tell
`SECURITY.md`.

## 6. Logging

Every tool call an agent makes is recorded in an append-only audit log: time, session, tool,
the decision (allowed or blocked), and a hash of the input. The log does not store file contents
or command text. Keep logs for `6` days. Logs are reviewed `weekly` by `the repository owner`.

## 7. Review

Agent-assisted changes get the same review as any other change. High-risk changes (section 3)
need tests and two human approvals. Mark agent-assisted commits with a `Co-authored-by` trailer
or the label `ai-assisted`.

## 8. Exceptions

An exception is written down, names an approver, and has an end date. Record it in `docs/policy-exceptions.md`.

## 9. Enforcement

Where a tool supports it, these rules are enforced by configuration and hooks, not by trust.
See `pieces/02-agent-policy/README.md` for the clause-by-clause mapping. For tools without hooks,
use that vendor's admin controls and review the audit evidence they provide.
