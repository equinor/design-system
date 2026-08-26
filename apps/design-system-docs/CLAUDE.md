# Claude Code — EDS Documentation Site

> The conventions for this app live in [`AGENTS.md`](./AGENTS.md) — directory
> map, the four-file global CSS architecture, the two token bundles (and their
> header-typography collision), the `--docs-font-*` typography scale, version
> scoping between the 2.0.0-beta docs and the frozen 1.1.0 archive, the shared
> MDX component registry, StoryCanvas portable stories, config aliases, and
> the verification workflow.
>
> Repo-wide conventions are in the root [`AGENTS.md`](../../AGENTS.md).

@./AGENTS.md

## Claude-Code-specific notes

- **All tokens derive ONLY from the semantic layer of the redefined
  (Tokens Studio) eds-tokens** — never primitives, palette steps, the
  density layer, or legacy `--eds-color-*` names. The two sanctioned bridge
  exceptions are documented in [`AGENTS.md`](./AGENTS.md) § Tokens.

- The viewport-overflow gate (`node scripts/check-viewport-overflow.mjs`)
  needs the dev server running on port 3000 — the user usually runs
  `pnpm start` themselves; ask before starting or restarting it.
- Webpack/config changes in `docusaurus.config.ts` require a dev-server
  restart; CSS and content hot-reload.
