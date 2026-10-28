# Expose EDS to AI agents through a CLI first

- **Status:** Accepted
- **Date:** 2026-10-21
- **Decision makers:** Frida Erdal (Tech Lead), EDS Core Team
- **Scope:** Web, Mobile

## Context

AI coding agents (Claude Code, Copilot, Cursor, OpenCode) are now a common way to build with EDS. Today the only structured EDS context they get is the instruction files in this repository: `AGENTS.md`, the harness rules and skills, the package `instructions/` and the generated `documentation/AI-COMPONENT-INDEX.md`. Those only reach agents working inside this repository. A team building a product with EDS gets none of it, and their agent falls back on what it learnt in training, which is mostly the current stable API.

EDS has two component libraries for products: `@equinor/eds-core-react` for the web and `@equinor/eds-mobile-components` for React Native. Both have the same need.

On the web it matters more now, because the beta components in `/next` (`@equinor/eds-core-react@beta`) will replace the current library when they are stable. Every web consumer will have to migrate. During the beta the published package contains both the current components and `/next`, but [ADR-0025](0025-batch-graduation-with-release-candidate.md) removes the EDS 1 components at `3.0.0-rc.1`, and most teams will migrate after `3.0.0`. A team still on 2.x has no 3.x package installed at all. An agent that knows what replaces what, and can recognise unmigrated code, can do much of that migration work.

The spike in [#4730](https://github.com/equinor/design-system/issues/4730) compared the options. EDS users are both developers and designers. Developers mostly work with agents that run in a terminal. Designers work in Figma, which has no terminal. AI tools there can reach EDS through an MCP server added as a custom connector, or through a Make kit with the component package and guidelines ([Figma: Make kits](https://help.figma.com/hc/en-us/articles/39241689698839)), which EDS tried in [#4317](https://github.com/equinor/design-system/issues/4317). How many designers use AI tools in Figma today is not known yet.

## Decision Drivers

- Must reach agents in consumers' own repositories, not only in this one
- Must reach both web and mobile consumers
- Must cover the design tokens as well as the components
- Must help web consumers migrate from the current components to `@equinor/eds-core-react@beta`
- Answers must match the EDS version the consumer has installed
- Low cost to build and maintain for a small team
- Should be usable in CI, to check that a codebase follows EDS
- Must work the same in every harness the team supports (Claude Code, Copilot, OpenCode)
- Must not rule out an MCP server later, for tools without a terminal

## Options Considered

### Option 1: Keep instruction files only

Continue with `AGENTS.md`, rules, skills and the generated component index.

**Pros:**

- Already exists, no new package

**Cons:**

- Only reaches agents working in this repository
- Agents load whole files, which costs more tokens than a targeted answer
- Cannot run in a consumer's CI

### Option 2: MCP server first

Build an EDS MCP server that exposes component, token and guideline lookups as tools.

**Pros:**

- Reaches chat assistants that support MCP, which cannot run a command
- Could reach Figma Make through a custom connector, but only if the server is hosted on a public HTTPS address and Equinor allows custom connectors. Make does not support local or stdio servers ([Figma: custom MCP connectors](https://help.figma.com/hc/en-us/articles/38147204302743)). Not tested for EDS
- Works in terminal agents too

**Cons:**

- Needs hosting, or a local server process per user
- Cannot run in CI, which only runs commands
- Harder to test without an agent
- The main use case for designers, prototyping, may not pay off: prototyping tools tend to imitate components instead of using them, even with a well-documented MCP

### Option 3: CLI first (chosen)

Build an EDS CLI that agents call as a command, for example to search components, show a component's props or find the beta replacement for a current component.

**Pros:**

- No server to deploy or host
- Anyone can test it in a terminal, without an agent
- Short answers to targeted commands use few tokens
- The same commands can run in CI
- Every harness can run a command, so it keeps harness parity at no extra cost

**Cons:**

- Does not reach tools without a terminal

### Option 4: CLI and MCP server at the same time

Build both now, on one data source.

**Pros:**

- Reaches developers and designers from the start

**Cons:**

- Twice the surface to build, test and release before we know whether designers need the MCP
- Delays the CLI, which the migration needs early

## Decision

We will build a CLI first. It covers the beta components in `/next` (`@equinor/eds-core-react@beta`), `@equinor/eds-mobile-components` and the design tokens in `@equinor/eds-tokens`. Which platform the MVP starts with is left to [#4736](https://github.com/equinor/design-system/issues/4736).

**Package.** The CLI lives in this monorepo and is published as its own package (working name `@equinor/eds-cli`). A separate package can be released on its own and keeps CLI dependencies out of the component library.

**Data source.** The CLI does not carry its own copy of the EDS data. Machine-readable data is generated from the component source, the same way as the component index and the Storybook docs pages, and ships with each component package, web and mobile. Platform differences live in the data each package ships, not in the CLI. The CLI reads the data from whichever package the consumer has installed. Its answers therefore always match the installed version, and the CLI does not need a release for every component release. The format and location of the data are left to the MVP ([#4736](https://github.com/equinor/design-system/issues/4736)).

**Tokens.** `@equinor/eds-tokens` needs no new content to be in scope. The reference generators in `apps/design-system-docs/scripts/` already read the token files to build the colour, spacing and typography tables, and can emit the same tables as data; the usage guidance in the package's `instructions/` is already markdown. A check of whether a token name is valid reads the names from the installed CSS bundle. The DTCG files are not public API and are not the source.

**Migration (web).** From `3.0.0-rc.1` the installed package no longer contains the EDS 1 components ([ADR-0025](0025-batch-graduation-with-release-candidate.md)), and the import line is the same before and after migration, so the CLI can neither read the mapping out of the installed package nor spot unmigrated code by its imports. The mapping from current to beta components, with the prop changes and token renames, is therefore generated while both generations are in this repository, before the release candidate, and the CLI carries it. This is a deliberate exception to the data source above: 2.x is frozen, so the mapping does not change after `3.0.0`, and carrying it means the CLI also works for a team that has not upgraded yet. The CLI recognises unmigrated code by its usage, such as `variant="contained"`, not by the import path. What the mapping contains changes one component at a time and is maintained with the components, not in this record; it builds on the breaking changes page ([#5387](https://github.com/equinor/design-system/issues/5387)) and the migration guide ([#5389](https://github.com/equinor/design-system/issues/5389)).

**MCP later.** Choosing a CLI now does not mean we will not need an MCP server. Whether designers need one is assessed in [#4731](https://github.com/equinor/design-system/issues/4731). If we build it, it reads the same data as the CLI, so the two never give different answers.

This satisfies the drivers: the CLI reaches web and mobile consumers' repositories, covers components and tokens, supports the web migration, matches the installed version, is cheap to build, runs in CI and every harness, and the shared data source keeps the MCP option open.

### Consequences

- Good, because consumers' agents get EDS context in their own repositories for the first time.
- Good, because the migration to `@equinor/eds-core-react@beta` gets tool support from the start.
- Good, because answers follow the installed version without a CLI release per component release.
- Good, because web and mobile consumers use the same CLI.
- Good, because the same CLI can power design system checks in CI.
- Good, because token answers reuse generators that already exist, so tokens cost little to add.
- Bad, because the CLI is only as good as the source data. On the web, every prop in `/next` except `children` has JSDoc, but of the 23 exported components only Icon has a component-level description, and the rest need writing.
- Bad, because both component packages get generated data to keep in their published contents.
- Bad, because the migration mapping is the one piece of data the CLI carries itself, and it has to be generated before the release candidate removes the EDS 1 components.
- Bad, because a new package needs its own release setup.
- Bad, because designers working with AI in Figma get nothing from this until the MCP need is assessed.

### Confirmation

- The MVP decides how the generated data and the CLI are tested in CI.

## Related

- [#5145](https://github.com/equinor/design-system/issues/5145): epic for AI-assisted EDS integration
- [#4730](https://github.com/equinor/design-system/issues/4730): the spike and its [research notes](https://github.com/equinor/design-system/issues/4730#issuecomment-6313993183)
- [#4736](https://github.com/equinor/design-system/issues/4736): CLI MVP
- [#4731](https://github.com/equinor/design-system/issues/4731): assess MCP need for designers
- [ADR-0021: Mobile component APIs target the newest EDS web generation, not stable](0021-align-mobile-apis-with-eds-2-next.md)
- [ADR-0012: Pin beta release lines to a fixed 3.0.0-beta.N series](0012-pinned-prerelease-versioning-for-beta-lines.md)
- [ADR-0025: Graduate EDS 2.0 as one batch, through a release candidate](0025-batch-graduation-with-release-candidate.md)
- [Atlassian Design System: develop with AI](https://atlassian.design/get-started/develop/with-ai): prior art with a CLI and an MCP server on one content model
