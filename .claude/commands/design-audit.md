# Design System Audit

Audit UI screenshots against the EDS design system and produce a structured Markdown report covering component patterns, variant gaps, and design recommendations.

## Input

$ARGUMENTS

## Task

Take the screenshots attached above (and any extra context provided) and run a complete design audit following the EDS 2.0 methodology. Produce a single Markdown report saved to the location below.

If fewer than 3 screenshots are provided, run a screen-level audit (lighter, focused on the visible patterns). If 3+ screenshots are provided, run a multi-screen audit with inventory, pattern analysis, and variant gap detection.

## File Location

Audit reports: `apps/design-system-docs/audits/{YYYY-MM-DD}-{scope}.md`

Example: `apps/design-system-docs/audits/2026-05-22-card-deep-audit.md`

If the `audits/` folder does not exist, create it. The `{scope}` segment should be short and descriptive: `card-deep-audit`, `acquire-app-audit`, `multi-app-overview`, etc.

## Rules

- **Only describe what is visible in the screenshots** - do not invent components, patterns, or instance counts.
- **Always include ASCII anatomy diagrams** for each identified pattern - they are the most important deliverable per pattern.
- **Count instances exactly** - report what is visible. Append `+` only when more instances are likely on unanalysed screens.
- **Use British English** throughout (colour, behaviour, summarise, centre, organisation).
- **Never use em dashes (—)**. Use hyphens with spaces ( - ) or en dashes (–) instead.
- **Tag every finding with severity** (P0 / P1 / P2 / P3) - never leave a finding untagged.
- **Recommend existing primitives over new components** when patterns overlap (e.g. an "alert card" pattern should use Banner, not Card).
- **Never invent severity** - apply the rubric below; do not soften or harden findings based on tone.

## Severity Rubric

Every finding, gap and recommendation carries a severity tag.

- **P0 Critical**: Blocks production, no workaround. Triggers: component missing AND used in 50+ instances, OR variant gap forcing every consuming app to build custom, OR accessibility violation.
- **P1 High**: Major gap, inconsistent workarounds across apps. Triggers: 10–50 instances OR gap appears across 3+ applications OR pattern in 30%+ of screens with inconsistent implementations.
- **P2 Medium**: Affects multiple screens, acceptable workarounds exist. Triggers: 3–10 instances OR appears in 1–2 applications.
- **P3 Low**: Edge cases, single-app patterns, easy workarounds. Triggers: 1–2 instances OR single application OR genuinely app-specific use case.

Severity emojis: P0 red circle, P1 yellow circle, P2 green circle, P3 white circle.

## Component Categories

Use these eight categories when inventorying. Always assign each observed component to one category.

- **Form Inputs**: Text Input, Text Field, Text Area, Search, Select, Autocomplete, Combo Box, Checkbox, Radio, Switch, Slider, Date Picker
- **Buttons and Actions**: Button, Icon Button, Button Group, Split Button, FAB
- **Data Display**: Table, Data Grid, List, List Item, Card, Chip, Badge, Avatar, Tooltip
- **Navigation**: Navigation Bar, Sidebar, Breadcrumb, Tabs, Link, Menu, Pagination, Stepper
- **Feedback and Messaging**: Banner, Snackbar, Dialog, Alert, Popover, Progress Bar, Spinner, Skeleton, Empty State
- **Layout and Structure**: Divider, Accordion, Container, Grid, Stack, Spacer, Section
- **Date and Time**: Date Picker, Time Picker, Date Range Picker
- **Surfaces**: Side Panel, Drawer, Bottom Sheet, Popover, Sheet

Use the canonical name from this list, not the consumer's casual name (e.g. "Dropdown" gets recorded as **Select**).

## Usage Frequency Buckets

When reporting screen coverage, use these buckets.

- **Very High**: 75%+ of screens
- **High**: 50 to 75%
- **Medium**: 20 to 50%
- **Low**: 5 to 20%
- **Very Low**: under 5%

## Composition Patterns to Always Check

Page-level compositions are recurring layouts made *of* components - they are not components themselves, so the inventory phase will miss them unless you check for them explicitly. Always scan every screen for the following compositions, regardless of how few times they appear. Each one found counts as a pattern in its own right.

- **Page header**: back button, optional divider, optional icon, title, optional trailing actions. Pattern: `← | [icon] Title ... [actions]`
- **Section header**: title, optional subtitle, optional trailing actions or count. Pattern: `Title (count) ... [view all →]`
- **Filter bar**: search input, filter chips, sort control, view toggle. Often horizontal across the top of a list or grid.
- **Action bar**: contextual actions that appear on selection (e.g. "3 selected | Edit | Delete | Move"). Often replaces the page header or section header when items are selected.
- **Toolbar**: grouped icon buttons, usually with dividers between groups (e.g. text editor toolbar, drawing tools).
- **Form footer**: divider above, cancel button (left or ghost), primary action (right). Sometimes includes a tertiary action.
- **Empty state**: icon or illustration, heading, supporting message, optional CTA.
- **Loading state**: spinner or skeleton, optional message, optional progress.
- **Error state**: icon, heading, supporting message, optional retry CTA.
- **Modal header**: title (left), close X (right), optional subtitle below.
- **Modal footer**: divider above, secondary action, primary action.
- **List item**: leading element (avatar, icon, checkbox), main content (title + supporting text), trailing meta or action.
- **Sidebar item**: icon, label, optional count or badge, optional active state.
- **Card header within Card**: title, optional metadata, optional trailing menu or actions.
- **Tab bar with trailing actions**: tabs (left), action buttons (right of the tab strip).
- **Breadcrumb header**: breadcrumb path, optional title below.

For each composition found, document it the same way you would document a component pattern: name, app, count, ASCII anatomy, slots used, severity if there are inconsistencies across screens. Add them to a dedicated **Composition Patterns** section in the report, separate from the component pattern analysis.

If a composition pattern repeats across 3+ screens with material differences (e.g. page header sometimes has divider, sometimes does not), flag each variation as a separate composition variant and tag with severity per the standard rubric.

## Audit Phases

Follow these phases in order. Do not skip phases even if a screen looks simple.

### Phase 0 - Composition Pattern Scan

Before counting components, scan every screen for the compositions listed above. Document each one found using the same anatomy format as component patterns. This phase is mandatory even if only one screen is provided. Compositions are easy to miss because they sit *between* the named components - explicitly looking for them prevents that.

### Phase 1 - Inventory

List every visible UI element across all screenshots. Group by component type. Count per screen and across the whole set. Output: a count table with component, total instances, screens using, and coverage percentage.

### Phase 2 - Pattern Identification

For each component appearing 5+ times OR on 20%+ of screens, identify the distinct patterns it takes. Two instances are the same pattern only if they share layout, content slots, and interaction behaviour.

For every pattern, document:

- Pattern name and host application
- Instance count and layout
- ASCII anatomy diagram (always include)
- Properties (border, background, radius, shadow, click behaviour, hover state)
- CSS characteristics (best-guess from screenshot)
- Content slots used (image, title, subtitle, body, chips, actions, footer, badge)

Sub-pattern threshold: only declare a new pattern when layout, interaction, or semantic visual treatment differs. Pure content differences (different text, different image) are NOT a new pattern.

### Phase 3 - Cross-Pattern Analysis

For each multi-pattern component, produce three matrices using the exact column headers below.

**Visual Properties Matrix**

| Pattern | Border | Background | Radius | Shadow | Hover | Click |

**Interactivity Matrix**

| Pattern | Clickable | Expandable | Draggable | Has Actions | Selectable |

**Content Slots Matrix**

| Pattern | Image | Title | Subtitle | Body | Chips | Actions | Footer | Badge |

### Phase 4 - Variant Gap Analysis

For each component:

1. List variants observed in production (visual, tonal, size, state, compositional, positional).
2. List variants documented in the design system (ask the user if unknown).
3. Compute the diff. Observed minus Documented equals Gaps. Documented minus Observed equals Unused variants.
4. Score each gap with the severity rubric.

### Phase 5 - Component Recommendation

For each multi-pattern component, write a recommendation section. Decision logic:

- **Compound component** (Card.Header, Card.Body) only when all patterns share a fixed layout contract. Use for Banner-style components.
- **Single component with free-form children** when patterns diverge on slot positions or which slots are present. Default for highly-varied components like Card.
- **Variants earn their place** only when 2+ patterns share a treatment that cannot be expressed via composition.
- **Density** is handled by ancestor `[data-density]` attribute, not by a `size` prop.

Always include a "What NOT to build into [Component]" section listing features that should be left to composition (expandable, draggable, actions menu, media slot, badge overlay).

### Phase 6 - Severity and Prioritisation

Tag every finding from phases 2 to 5 with P0 / P1 / P2 / P3.

### Phase 7 - Assemble Report

Use the Output Structure template below.

## Tone of Voice

Match the EDS documentation tone, but for an internal audit deliverable (designers and PMs are the audience, not external users).

- **Direct and decisive**: Take a position. "Card should NOT be a compound component because..." beats "It might be worth considering whether..."
- **Counts before judgments**: Never call something a gap without citing instance count and screen coverage.
- **Concise**: Designers scan audits - keep paragraphs short, lead with the finding.
- **Trust-building**: Show your work. If you guess a CSS value from a screenshot, mark it as "~16px" rather than claiming precision.

## Formatting Conventions

### Tables

- Use consistent column widths with dashes.
- Left-align all columns.
- Include header separator row.

### Lists

- Use `-` for unordered lists.
- Use `1.` for ordered or numbered steps.
- Bold key terms: `**Term**: Description`.

### Dashes

Use standard hyphens or en dashes for separating clauses. Never use em dashes (—).

- "Card should use free-form children - the 12 patterns diverge too much for sub-components."

### Language

Use British English throughout (colour, behaviour, summarise, centre, organisation, prioritise).

### ASCII Anatomy

Use box-drawing characters (`┌ ─ ┐ │ └ ┘`). Annotate regions with `← description` aligned right. Use real screenshot text where readable, placeholder when not (e.g. `[App Icon]`, `[Image]`). Keep under 12 lines unless the pattern is genuinely large.

## Section Order

1. Frontmatter
2. Title + Executive Summary
3. Component Status Matrix
4. Production Usage Overview
5. Composition Patterns (page-level layouts found via Phase 0)
6. Pattern Analysis (per multi-pattern component)
7. Variant Gap Analysis
8. Visual Hierarchy Observations (per screen)
9. Prioritised Findings (grouped by severity)
10. Coverage Metrics
11. Recommendations (Immediate / Next / Following / Future)
12. Risk Assessment
13. Screens Analysed

## Output Structure

Use this template. Only include sections that have content from the input.

```markdown
---
title: [Scope] Design Audit
date: [YYYY-MM-DD]
sidebar_position: [number if provided, otherwise omit]
---

# [Scope] Design Audit - [Month Year]

**Audit Date:** [YYYY-MM-DD]
**Scope:** [N screenshots] ([M unique screens]), [P applications]
**Method:** Screenshot analysis [+ optional: Figma inspection, Code verification]

## Executive Summary

[Two to three sentence overview of what was audited and the headline finding. End with key numbers: components built / designed / missing, coverage %, instances blocked.]

**Key Findings:**

- [Headline finding 1 with number]
- [Headline finding 2 with number]
- [Headline finding 3 with number]

**Focus Areas:**

1. [Top priority 1]
2. [Top priority 2]
3. [Top priority 3]

## Component Status Matrix

| Component | Figma Design | Code Built | Production Usage | Instances | Priority |
| --------- | ------------ | ---------- | ---------------- | --------- | -------- |
| [Name]    | Yes / No     | Yes / No   | Very High        | [N+]      | P0/P1/P2/P3 |

## Production Usage Overview

### Very High Usage (75%+ of screens)

- **[Component]** - [N+ instances], [X/Y screens] ([Z%])

### High Usage (50 to 75%)

- ...

### Medium Usage (20 to 50%)

- ...

### Low Usage (5 to 20%)

- ...

### Very Low Usage (under 5%)

- ...

## Composition Patterns

Page-level compositions found across the audited screens. These are not individual components but recurring layouts made of multiple components. Document each one even if it appears only once - composition patterns are foundational to consistency across an app.

### [Composition Name, e.g. Page Header]

**Found in:** [N screens across M apps]
**Used to:** [purpose, e.g. orient the user and provide back navigation]

**Anatomy:**

\`\`\`
┌───────────────────────────────────────────────┐
│ ← │ [icon] Title                  [actions]  │  ← Annotate each region
└───────────────────────────────────────────────┘
\`\`\`

**Composed of:** [list components used, e.g. Icon Button (back), Divider, Icon, text]

**Variations observed:**

- With icon, without divider (App A)
- Without icon, with divider (App B)
- With trailing action button (App C)

**Severity:** P1 / P2 / P3 if inconsistencies exist; omit if consistent across all screens.

## Pattern Analysis

### [Component Name]

**Total Instances:** [N+]
**Screens Using:** [X/Y] ([Z%])
**Distinct Patterns:** [N]

#### Pattern 1: [Pattern Name]

**App:** [Application]
**Count:** [N instances]
**Layout:** [Grid, list, row, column - with column count if relevant]

**Anatomy:**

\`\`\`
┌──────────────────────────────────┐
│ [ASCII layout]                   │  ← Annotate each region
│                                  │
│ [Real text content where         │
│  possible]                       │
└──────────────────────────────────┘
\`\`\`

**Properties:**

- Border: [1px solid grey / none / accent when selected]
- Background: [white / tinted / transparent]
- Border radius: [~Npx]
- Shadow: [subtle / none / heavy]
- Click behaviour: [navigate / expand / select / no action]
- Hover state: [observed / not observed / unknown]

**CSS Characteristics (best-guess from screenshot):**

- `border-radius`: ~Npx
- `padding`: ~Npx
- `gap` between elements: ~Npx
- `background`: [colour]

**Content Slots Used:** [list from: Image, Title, Subtitle, Body, Chips, Actions, Footer, Badge]

#### Cross-Pattern Analysis

**Visual Properties Matrix**

| Pattern   | Border | Background | Radius | Shadow | Hover | Click |
| --------- | ------ | ---------- | ------ | ------ | ----- | ----- |
| Pattern 1 | ...    | ...        | ...    | ...    | ...   | ...   |

**Interactivity Matrix**

| Pattern   | Clickable | Expandable | Draggable | Has Actions | Selectable |
| --------- | --------- | ---------- | --------- | ----------- | ---------- |
| Pattern 1 | ...       | ...        | ...       | ...         | ...        |

**Content Slots Matrix**

| Pattern   | Image | Title | Subtitle | Body | Chips | Actions | Footer | Badge |
| --------- | ----- | ----- | -------- | ---- | ----- | ------- | ------ | ----- |
| Pattern 1 | ...   | ...   | ...      | ...  | ...   | ...     | ...    | ...   |

#### Instance Count by App

| Application | Pattern(s) Used | Count |
| ----------- | --------------- | ----- |
| ...         | ...             | ...   |

#### Component Recommendation

**Why [chosen approach]**

[One paragraph explaining the decision, citing pattern count and divergence.]

**[Component] as a [framing]**

What all [N] patterns share is exactly [list of shared traits]. Everything else (images, titles, chips, charts, avatars, form fields) is consumer composition using existing EDS components.

- **No `[prop]`** - [reason]
- **No `[prop]`** - [reason]

**How the [N] patterns map**

| Pattern | Variant | Props | Consumer composition |
| ------- | ------- | ----- | -------------------- |
| ...     | ...     | ...   | ...                  |

**What NOT to build into [Component]**

- **[Feature]** - [reason / what to use instead]
- ...

**Scalability argument**

[Every feature added encodes layout assumptions. The N patterns already diverge on X, Y, Z. A surface primitive with minimal API covers all observed patterns and any future pattern.]

## Variant Gap Analysis

### [Component Name]

**Observed in production:** [list]
**Documented in design system:** [list]

**Gaps:**

- P0 [Variant] - [N instances across M apps]. [Why it matters.]
- P1 [Variant] - [N instances]. [Why.]
- P2 [Variant] - [N instances]. [Why.]

**Unused variants in design system:** [list, if any]

## Visual Hierarchy Observations

### [Screen Name / App]

- P0 Primary action competition - Two buttons of equal prominence in the header create unclear hierarchy.
- P1 Spacing inconsistency - Padding scale breaks in the sidebar region.
- P2 Type hierarchy - 6 distinct font sizes counted; recommend collapsing to 4.

## Prioritised Findings

### P0 Critical ([N] items)

1. **[Title]** - [N instances]. [Action recommended]. [Estimated effort].

### P1 High ([N] items)

1. **[Title]** - ...

### P2 Medium ([N] items)

1. **[Title]** - ...

### P3 Low ([N] items)

1. **[Title]** - ...

## Coverage Metrics

**Current Coverage:** [X/Y] components = [Z%]
**With Figma Designs Implemented:** [X/Y] = [Z%]

**Production Needs Coverage:**

- Current: ~[Z%] (based on usage frequency)
- If all Figma designs implemented: ~[Z%]
- Full coverage: ~[Z%] (including [missing components])

## Recommendations

### Immediate

1. ...

### Next

1. ...

### Following

1. ...

### Future

1. ...

## Risk Assessment

### High Risk (Blocks Production)

- **[Component]** - [N instances blocked / Why]

### Medium Risk (Workarounds Exist)

- ...

### No Risk (Complete)

- ...

### Low Risk

- ...

## Screens Analysed

### [Application Group]

1. [Screen name]
2. ...
```

## Success Criteria

- The report follows the section order exactly - no sections added or reordered.
- Phase 0 (Composition Pattern Scan) was performed before component inventory, and every composition found is documented with an ASCII anatomy diagram.
- Every pattern includes an ASCII anatomy diagram.
- Every finding is tagged with P0, P1, P2 or P3 using the rubric.
- Instance counts and screen coverage percentages cite what is visible in the screenshots - no fabricated numbers.
- British English used throughout.
- No em dashes anywhere in the output.
- Component recommendations take a position with justification, not hedged language.
- Patterns overlapping with existing EDS primitives (Banner, Chip, etc.) are redirected to the primitive, not given new variants.