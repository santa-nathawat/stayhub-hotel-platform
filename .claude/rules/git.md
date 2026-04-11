---
description: Git workflow and commit conventions
---

# Git Conventions

## Conventional Commits (MANDATORY)

Every commit MUST follow the Conventional Commits specification:

```
<type>(<scope>): <short description>

[optional body]
[optional footer]
```

### Types

| Type       | When to use                                          |
|------------|------------------------------------------------------|
| `feat`     | New feature or functionality                         |
| `fix`      | Bug fix                                              |
| `docs`     | Documentation changes (README, comments, CLAUDE.md)  |
| `style`    | Code style changes (formatting, semicolons, etc.)    |
| `refactor` | Code change that neither fixes a bug nor adds feature|
| `test`     | Adding or updating tests                             |
| `chore`    | Build config, dependencies, CI/CD, tooling           |
| `perf`     | Performance improvement                              |
| `ci`       | CI/CD pipeline changes                               |

### Scopes

Use the module/area being changed:

- `auth`, `hotel`, `booking`, `partner`, `user` — feature scopes
- `api`, `db`, `middleware` — backend infrastructure scopes
- `ui`, `layout`, `form` — frontend UI scopes
- `config`, `deps`, `docker` — tooling scopes

### Examples

```
feat(hotel): add search by destination with autocomplete
fix(booking): prevent double-booking on concurrent requests
docs(api): add JSDoc to booking service methods
refactor(auth): extract token refresh logic to separate service
test(hotel): add unit tests for availability calculator
chore(deps): update mongoose to v8.2
style(ui): fix inconsistent button padding across pages
```

## Commit Frequency

- Commit after every completed feature, fix, or meaningful change.
- One logical change per commit — don't bundle unrelated changes.
- If a feature is large, break it into atomic commits (e.g., model → service → controller → route → frontend).

## Branch Naming

```
<type>/<short-description>
```

Examples: `feat/hotel-search`, `fix/booking-date-validation`, `refactor/auth-middleware`

## Rules

- Never commit `.env`, `node_modules/`, or build output (`dist/`).
- Run lint before committing — no lint errors in commits.
- Write meaningful commit messages — future-you should understand WHY from the message.
- Squash WIP commits before merging to main.
