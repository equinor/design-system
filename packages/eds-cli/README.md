# @equinor/eds-cli

Look up the Equinor Design System beta components and tokens installed in a project. It is written for AI coding agents, which can run a command in any harness, and works the same for people in a terminal.

The answers come from the packages the project has installed, so they match the versions it uses:

- components from `@equinor/eds-core-react@beta`, which ships the data in `build/agent/components.json`
- tokens from the beta CSS bundle in `@equinor/eds-tokens@beta`

The decision behind the CLI is [ADR-0030](https://github.com/equinor/design-system/blob/main/documentation/adr/0030-cli-first-for-ai-agents.md).

## Requirements

- Node 22 or later
- For components: an `@equinor/eds-core-react` beta that ships the component data, which is newer than `3.0.0-beta.4`. With an older beta, the component commands exit with an error that says so.
- For tokens: `@equinor/eds-tokens@beta`

## Limitations

- Web only for now. `@equinor/eds-mobile-components` is not covered yet.
- No help with migrating from the 2.x components yet.
- Some components have no description or usage guidance yet, so `eds show` gives the props and examples only.

## Installation

```sh
npm install --save-dev @equinor/eds-cli
```

Install it in the project rather than running `npx @equinor/eds-cli`: then `npx eds` starts the local copy at once, while `npx @equinor/eds-cli` without a local install can download the package again, which adds seconds to every lookup an agent makes.

## Usage

```sh
eds list                            # the components, with a one-line description
eds show Button                     # import line, props, examples and guidance
eds show TextField Checkbox Button  # several components in one call
eds show Button --section usage     # one section: props, examples, features, usage, accessibility, related, links
eds search date                     # components whose name, description or props match
eds tokens accent background        # semantic tokens whose name contains every word
eds tokens spacing --density compact --scheme dark
eds --version                       # versions of the CLI and the installed EDS packages
```

Every command prints JSON with `--json`. Text output ends with the command to run next (`→ eds show Button`), so an agent can follow up without rereading the help. `search` allows one typo in longer words and suggests close component names when nothing matches.

`eds tokens` lists the semantic tokens, the ones components and products should use, with their value for the colour scheme and density. `--all` adds the internal tokens (primitives, palettes, per-density values), which component CSS must not reference.

### Monorepos

The CLI reads the packages installed for the folder it runs in, or the nearest parent folder that has them. In a monorepo where EDS is installed in one app, run it from that app or point to it with `--cwd`:

```sh
eds show Button --cwd apps/web
```

`--data` and `--css` paths are relative to `--cwd`.

### JSON output and exit codes

| Command | `--json` prints |
|---|---|
| `list`, `search` | An array of `{ name, description, status }` |
| `show` | An array of components, also for a single name, with the import line, props, base types, sub-components, examples, guidance and links |
| `tokens` | An array of `{ name, value, resolved }`, where `value` is the value as written, such as `var(--eds-accent-9)`, and `resolved` follows every reference for the scheme and density |

The exit code is 0 on success and 1 on an error, such as a missing package or an unknown component. The error goes to stderr. The JSON shapes may still change while the CLI is at 0.x.

## Telling an agent about it

Add a line like this to the `AGENTS.md`, `CLAUDE.md` or Copilot instructions of your repository:

```md
This project uses the Equinor Design System beta. Before writing UI code, run `npx eds show <Component>...` for the import and props of the components you need (several at once), and `npx eds tokens <words>` for design tokens. Do not guess props or token names.
```

## Development

```sh
pnpm --filter @equinor/eds-cli build
pnpm --filter @equinor/eds-cli test
```

To try it against the monorepo's own data:

```sh
pnpm run generate:agent-data
node packages/eds-cli/dist/cli.js show Button --data packages/eds-core-react/build/agent/components.json
node packages/eds-cli/dist/cli.js tokens accent --css packages/eds-tokens/src/tokens/css/variables.css
```

The CLI has no runtime dependencies.

Releases are staged on npm, not published directly: after the release workflow has run, a maintainer with 2FA runs `npm stage list @equinor/eds-cli` and then `npm stage approve <stage-id>` to make the version public.
