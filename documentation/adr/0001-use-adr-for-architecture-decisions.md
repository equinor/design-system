# Use ADR for Architecture Decisions

- **Status:** Accepted
- **Date:** 2026-02-02
- **Decision makers:** EDS Core Team
- **Scope:** All

## Context

Architecture decisions in software projects are often made but not documented. This leads to several problems:

- New team members don't understand why certain decisions were made
- The same discussions happen repeatedly because context is lost
- It's difficult to evaluate whether past decisions are still valid
- Knowledge leaves with team members who made the original decisions

We need a lightweight way to document significant architecture decisions that is:

- Easy to write and maintain
- Version controlled alongside our code
- Searchable and discoverable
- Not overly bureaucratic

## Decision Drivers

- Documentation should live close to the code
- Low barrier to write and maintain
- Should support review process (PR-based)
- Must be searchable and discoverable

## Options Considered

### Option 1: ADRs in the repository

Store Markdown-based Architecture Decision Records in `documentation/adr/`.

**Pros:**

- Version controlled with the code
- PR review process for changes
- Searchable via GitHub/IDE
- Lightweight, just Markdown files

**Cons:**

- Requires discipline to write consistently
- Another thing to maintain

### Option 2: Wiki or Confluence documentation

Use a separate wiki system to document decisions.

**Pros:**

- Rich editing features
- Easy to link between pages

**Cons:**

- Disconnected from codebase, harder to keep in sync
- No PR review process for changes
- Often becomes outdated

### Option 3: No formal documentation

Rely on institutional knowledge and code comments.

**Pros:**

- No overhead
- No additional process

**Cons:**

- Context is lost when team members leave
- Same discussions happen repeatedly
- New team members struggle to understand why decisions were made

### Option 4: Detailed design documents

Write comprehensive design documents for each decision.

**Pros:**

- Very thorough documentation

**Cons:**

- Heavyweight, often not written or maintained
- Overkill for most decisions

## Decision

We will use Architecture Decision Records (ADRs) to document significant architecture decisions in the Equinor Design System.

Each ADR will:

- Be stored in `documentation/adr/` as a Markdown file
- Follow the MADR (Markdown Any Decision Records) format
- Be numbered sequentially (0001, 0002, etc.)
- Keep its decision fixed once accepted (a changed decision gets a new ADR, see [Changing an accepted ADR](#changing-an-accepted-adr))

We will write an ADR when:

- Choosing a technology, framework, or library
- Making significant API design decisions
- Establishing patterns that affect multiple components
- Deciding on breaking changes
- Making security or accessibility architecture decisions

### Changing an accepted ADR

Git history keeps every earlier version of an ADR, so editing one does not lose the original reasoning. What matters is whether the decision itself has changed:

| Change           | Example                                                                                                              | What to do                                                               |
| ---------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Editorial        | Typos, broken links, moved file paths, clearer wording                                                               | Edit in place                                                            |
| Amendment        | A detail has changed, a consequence turned out wrong, an option was added; the decision and its reasoning still hold | Edit in place and add a dated entry under `## Amendments` linking the PR |
| Changed decision | The core choice is reversed, or its reasoning no longer holds                                                        | New ADR that supersedes the old one in full                              |

The boundary test: would someone who read the old version make a different architectural choice? If yes, write a new ADR.

### Public vs Internal ADRs

ADRs are public by default. Decisions about components, tokens, APIs, tooling, and processes all belong in this repository (`design-system`). Only ADRs containing sensitive information (security details, internal infrastructure specifics) should go in `design-system-internal`.

### Consequences

- Good, because architecture decisions are documented and discoverable
- Good, because new team members can understand historical context
- Good, because decisions can be reviewed and evaluated over time
- Good, because it reduces repeated discussions about the same topics
- Bad, because it requires discipline to write ADRs consistently
- Bad, because it adds some overhead to the decision-making process
- Bad, because ADRs may become outdated if not properly maintained

### Confirmation

- PR reviews will check that significant architecture decisions have an accompanying ADR
- The `documentation/adr/` folder is referenced in onboarding documentation

## Amendments

- 2026-10-21: Replaced "immutable once accepted" with editorial changes, amendments and changed decisions, so small corrections no longer need a new ADR ([#5707](https://github.com/equinor/design-system/pull/5707)).

## Related

- [MADR - Markdown Any Decision Records](https://adr.github.io/madr/)
- [Michael Nygard's original ADR article](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
