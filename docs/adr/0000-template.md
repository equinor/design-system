# [Short title of the decision]

<!--
  Title should be short and descriptive, e.g.:
  - "Use vanilla CSS for EDS 2.0 components"
  - "Adopt conventional commits"
-->

- **Status:** Proposed | Accepted | Rejected | Deprecated | Superseded by [ADR-NNNN]
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

  NOTE: Pros/Cons here are about each option IN THEORY - the arguments
  for and against choosing this option. This helps evaluate the options.
-->

### Option 1: [Name]

[Brief description of this option]

**Pros:**

- [Advantage]
- [Another advantage]

**Cons:**

- [Disadvantage]
- [Another disadvantage]

### Option 2: [Name]

[Brief description of this option]

**Pros:**

- [Advantage]

**Cons:**

- [Disadvantage]

### Option 3: [Name]

[Brief description of this option]

**Pros:**

- [Advantage]

**Cons:**

- [Disadvantage]

## Decision

<!--
  State clearly what was decided and WHY.
  Reference the decision drivers - explain how the chosen option
  best satisfies them.

  Example: "We will use vanilla CSS with CSS custom properties because it
  satisfies our SSR requirement (no runtime), keeps bundle size minimal,
  and the team is already familiar with CSS."
-->

### Consequences

<!--
  What happens as a result of this decision? This is different from Pros/Cons:
  - Pros/Cons = theoretical arguments BEFORE deciding
  - Consequences = practical implications AFTER deciding

  Think about:
  - What does the team need to do differently?
  - What new skills or tools are needed?
  - What becomes easier or harder?
  - What technical debt or migration effort is created?

  Example consequences:
  - Good: "We no longer need to configure SSR for styled-components"
  - Bad: "Consumers must migrate their styled-components overrides to CSS"
-->

- Good, because [positive consequence]
- Good, because [another positive consequence]
- Bad, because [negative consequence or trade-off]
- Bad, because [another negative consequence]

### Confirmation

<!--
  Optional: How will you verify this decision is followed?

  Examples:
  - "Code reviews check that new components use vanilla CSS"
  - "ESLint rule warns if styled-components is imported in /next"
  - "CI validates all CSS files use design tokens"
-->

## Related

<!--
  Optional: Link to related resources.
  - Other ADRs this builds on or supersedes
  - GitHub issues or discussions
  - External documentation or articles
-->

- [Related ADR or resource]
