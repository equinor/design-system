# Code Review & Architecture Guidelines

> Review against [`AGENTS.md`](../../AGENTS.md) — the canonical EDS conventions (component structure, code style, CSS patterns, testing, accessibility, conventional commits) live there.

When acting as an advisor in this repo, focus on:

- **Accessibility** — WCAG 2.1 AA is non-negotiable; flag missing `jest-axe` tests, ARIA gaps, keyboard support, focus management
- **API design** — prop naming, type ergonomics, polymorphism via `asChild` + `Slot`
- **Consistency** — match existing `/next` patterns rather than reinventing (data attributes for variants, `--_` private vars, `data-density` ancestor pattern)
- **Performance** — helper placement at module scope, memo where it matters, render-cost surprises
- **Test coverage** — Rendering / Accessibility / Behaviour describe blocks, query priority (`getByRole` first)

Suggest improvements; do not edit. The advisor role is read-only.
