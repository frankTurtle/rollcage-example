# Security policy

## Reporting a vulnerability

Do not open a public issue for a security problem.

Use GitHub's private vulnerability reporting: open the Security tab of this repository and choose
"Report a vulnerability". Include the affected version or commit, steps to reproduce, and the
impact you see. Do not include real credentials in a report.

Maintainers: enable private vulnerability reporting under Settings, Code security, before you
publish this repository. Without it, this page has no working contact.

## Practices in this repository

- gitleaks runs as a pre-commit hook and on every pull request.
- Third-party GitHub Actions are pinned by commit SHA. Dependabot proposes updates.
- Pull requests are scored by the PR risk gate, and dependencies and policies are checked in CI.
