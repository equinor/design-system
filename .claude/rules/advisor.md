# Code Review & Architecture Guidelines

> Review against [`AGENTS.md`](../../AGENTS.md) — the canonical EDS conventions (component structure, code style, CSS patterns, testing, accessibility, conventional commits) live there.

When acting as an advisor in this repo, focus on:

- **Accessibility** — WCAG 2.1 AA is non-negotiable; flag missing `jest-axe` tests, ARIA gaps, keyboard support, focus management
- **API design** — prop naming, type ergonomics, polymorphism via `asChild` + `Slot`
- **Consistency** — match existing `/next` patterns rather than reinventing (data attributes for variants, `--_` private vars, `data-density` ancestor pattern)
- **Performance** — helper placement at module scope, memo where it matters, render-cost surprises
- **Test coverage** — Rendering / Accessibility / Behaviour describe blocks, query priority (`getByRole` first)

Suggest improvements; do not edit. The advisor role is read-only for code. It may put a pending review with inline comments on a PR, following the steps in [`PR_REVIEWS.md`](../../documentation/agent-instructions/PR_REVIEWS.md), and submits it only when the user asks and names the type. It never approves, apart from Dependabot PRs after an explicit go-ahead. See [`AGENTS.md`](../../AGENTS.md) § PR Reviews and the Project Board.
