# [Short title of the decision]

<!--
  Title should be short and descriptive, e.g.:
  - "Use vanilla CSS for EDS 2.0 components"
  - "Adopt conventional commits"

  NOTE: ADRs are public by default. Only use design-system-internal for
  decisions containing sensitive information.
-->

- **Status:** Proposed | Accepted | Rejected | Deprecated | Superseded by [ADR-NNNN]
- **Date:** YYYY-MM-DD
- **Decision makers:** [List the people involved in making this decision]
- **Scope:** Web | Mobile | Tokens | All

<!--
  Status: if a later ADR changes or reverses this decision, write a new,
  self-contained ADR (restate what's still true, plus what's new) and mark
  this line "Superseded by [ADR-NNNN](NNNN-slug.md)". The new ADR's own
  Related section links back: "Supersedes [ADR-NNNN](path)".

  Always supersede fully, never partially. A reader should get the complete
  current answer from one document, not by holding this one's still-valid
  parts and the new one's replacement in their head at once. ADR-0002's
  "Accepted (CSS naming convention superseded by [ADR-0006](path))" wording
  is a legacy pattern from before this rule — don't reproduce it.

  If part of what you're writing will keep changing one row at a time (an
  exception list, a migration log) — that isn't a decision, it's a
  registry. Move it to a separate, ordinarily maintained doc instead of
  putting it in this ADR (see ADR-0020 and ADR-0021, both restructured for
  exactly this).

  Accepted ADRs are immutable: only the Status line and a forward pointer
  change, never the recorded reasoning itself.

  Scope: which product surface this decision governs.
  - Web: eds-core-react (including /next)
  - Mobile: eds-mobile-components, apps/mobile-storybook
  - Tokens: eds-tokens / the Tokens Studio pipeline — consumed by both Web and Mobile
  - All: process/governance decisions not tied to one product surface (e.g. ADR-0001)
  Use a comma-separated combination when the decision genuinely spans more than
  one — e.g. one beta-versioning scheme adopted for both a web package and
  eds-tokens (ADR-0012), or a naming convention for the Figma component library
  both platforms design from (ADR-0015).
-->

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
