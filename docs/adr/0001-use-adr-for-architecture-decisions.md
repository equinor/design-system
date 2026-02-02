# Use ADR for Architecture Decisions

- **Status:** Accepted
- **Date:** 2026-02-02
- **Decision makers:** EDS Core Team

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

## Decision

We will use Architecture Decision Records (ADRs) to document significant architecture decisions in the Equinor Design System.

Each ADR will:

- Be stored in `docs/adr/` as a Markdown file
- Follow the MADR (Markdown Any Decision Records) format
- Be numbered sequentially (0001, 0002, etc.)
- Be immutable once accepted (new decisions supersede old ones rather than editing)

We will write an ADR when:

- Choosing a technology, framework, or library
- Making significant API design decisions
- Establishing patterns that affect multiple components
- Deciding on breaking changes
- Making security or accessibility architecture decisions

## Consequences

### Positive

- Architecture decisions are documented and discoverable
- New team members can understand historical context
- Decisions can be reviewed and evaluated over time
- Reduces repeated discussions about the same topics
- Creates accountability for significant decisions

### Negative

- Requires discipline to write ADRs consistently
- Adds overhead to the decision-making process
- ADRs may become outdated if not properly maintained

## Alternatives Considered

### Wiki or Confluence documentation

Wikis are often disconnected from the codebase, making it harder to keep documentation in sync. ADRs live with the code and follow the same review process.

### No formal documentation

Relying on institutional knowledge and code comments doesn't scale. Important context is lost when team members leave or forget discussions.

### Detailed design documents

Full design documents are heavyweight and often not written or maintained. ADRs are intentionally lightweight and focused on a single decision.

## Related

- [MADR - Markdown Any Decision Records](https://adr.github.io/madr/)
- [Michael Nygard's original ADR article](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
