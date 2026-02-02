# [Short title of the decision]

<!--
  Title should be short and descriptive, e.g.:
  - "Use vanilla CSS for EDS 2.0 components"
  - "Adopt conventional commits"
-->

- **Status:** Proposed | Accepted | Deprecated | Superseded by [ADR-NNNN]
- **Date:** YYYY-MM-DD
- **Decision makers:** [List the people involved in making this decision]

## Context

<!--
  Describe the situation and why a decision is needed.
  - What problem are we trying to solve?
  - What triggered this discussion?
  - Include relevant background information.

  Example: "We need to choose a styling approach for EDS 2.0. The current
  styled-components solution causes SSR hydration issues in Next.js App Router
  and adds 12KB to the bundle."
-->

## Decision Drivers

<!--
  List the key requirements and constraints that influence the decision.
  These are the criteria you'll evaluate options against.

  Example:
  - Must support Server-Side Rendering without hydration issues
  - Should minimize bundle size (target: < 5KB)
  - Developers must be able to customize component styles
  - Team should be able to maintain it without deep CSS-in-JS expertise
-->

- [Driver 1]
- [Driver 2]
- [Driver 3]

## Options Considered

<!--
  List each realistic option with pros and cons.
  Be fair - every option has trade-offs.
-->

### Option 1: [Name]

[Brief description of this option]

- Good: [Advantage]
- Good: [Another advantage]
- Bad: [Disadvantage]
- Bad: [Another disadvantage]

### Option 2: [Name]

[Brief description of this option]

- Good: [Advantage]
- Bad: [Disadvantage]

### Option 3: [Name]

[Brief description of this option]

- Good: [Advantage]
- Bad: [Disadvantage]

## Decision

<!--
  State clearly what was decided and WHY.
  Reference the decision drivers - explain how the chosen option
  best satisfies them.

  Example: "We will use vanilla CSS with CSS custom properties because it
  satisfies our SSR requirement (no runtime), keeps bundle size minimal,
  and the team is already familiar with CSS."
-->

## Consequences

<!--
  What are the implications of this decision?
  Be honest about both benefits and costs.
-->

### Positive

- [Benefit 1]
- [Benefit 2]

### Negative

- [Cost or trade-off 1]
- [Cost or trade-off 2]

## Related

<!--
  Optional: Link to related resources.
  - Other ADRs this builds on or supersedes
  - GitHub issues or discussions
  - External documentation or articles
-->

- [Related ADR or resource]
