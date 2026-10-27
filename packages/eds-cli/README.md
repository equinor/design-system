# @equinor/eds-cli

Look up the Equinor Design System beta components and tokens installed in a project. It is written for AI coding agents, which can run a command in any harness, and works the same for people in a terminal.

The answers come from the packages the project has installed, so they match the versions it uses:

- components from `@equinor/eds-core-react@beta`, which ships the data in `build/agent/components.json`
- tokens from the beta CSS bundle in `@equinor/eds-tokens@beta`

The decision behind the CLI is [ADR-0030](https://github.com/equinor/design-system/blob/main/documentation/adr/0030-cli-first-for-ai-agents.md).

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

To try it against the monorepo's own data, build `@equinor/eds-core-react` first, then:

```sh
node packages/eds-cli/dist/cli.js show Button --data packages/eds-core-react/build/agent/components.json
node packages/eds-cli/dist/cli.js tokens accent --css packages/eds-tokens/src/tokens/css/variables.css
```

The CLI has no runtime dependencies.
