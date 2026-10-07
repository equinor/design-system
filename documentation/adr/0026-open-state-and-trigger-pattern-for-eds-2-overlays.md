# Open-state and trigger pattern for EDS 2.0 overlay components

- **Status:** Accepted
- **Date:** 2026-10-06
- **Decision makers:** EDS Core Team (web)
- **Scope:** Web

## Context

Dialog, Menu and Popover all need a way for a consumer to open and close them. Each one answers it differently today, and two of the answers are open bug reports:

| Component               | Today                                                                                                                                        |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `Dialog` (next)         | Fully controlled. `open` and `onOpenChange` are both required, and the consumer builds and wires its own trigger                             |
| `Menu` (next)           | A bare `<ul>` with no open state, focus management, keyboard handling or positioning ([#5324]). Anchoring is wired by hand from JS ([#5102]) |
| `Popover`               | Not built for EDS 2.0 yet ([#5008])                                                                                                          |
| `Tooltip` (next)        | Clones its child with `cloneElement` to attach trigger behaviour                                                                             |
| `Accordion.Item` (next) | Controlled and uncontrolled in one API: `defaultOpen`, `open` and `onOpenChange`                                                             |

[#5228] proposes a compound API for Dialog and is the immediate trigger for writing this down. The same decisions reach Menu and Popover, which are built at different times by different people, so they need an answer that outlives one pull request.

One property shapes everything below: a native `<dialog>` owns an open state of its own. The browser closes it on Escape without telling React. There are always two sources of truth, and the only question is who reconciles them.

[ADR-0004](./0004-component-conventions-for-eds-2.md) allows the compound pattern when a component is a container for consumer-defined content. Dialog meets that test, but `Trigger` and `Close` do not: they exist for behaviour and ARIA wiring rather than for content. This ADR therefore widens the criterion for overlay components, and that widening is part of what it asks the team to accept.

## Decision Drivers

- A consumer should be able to open an overlay without holding state, and should still be able to hold it when routing or a confirm-before-close flow needs it.
- The pattern has to fit both a native element that owns its state (`<dialog>`) and a popup positioned from JS (Menu, Popover).
- Whatever renders the trigger should own the trigger's ARIA, and for Menu and Popover the anchor wiring that [#5102] asks for.
- It has to sit inside [ADR-0004](./0004-component-conventions-for-eds-2.md), which allows the compound pattern for containers and asks for it to be justified per component, and [ADR-0005](./0005-use-aschild-slot-for-polymorphism.md) for `asChild`.
- Breaking changes are free on the beta line until the release candidate ([ADR-0025](./0025-batch-graduation-with-release-candidate.md)), and expensive after it.

## Options Considered

### Option 1: Keep every overlay fully controlled

The consumer owns the open state and renders the trigger. This is Dialog today.

**Pros:**

- Simplest implementation, and the consumer always knows the current state
- No new concepts for consumers to learn
- No breaking change

**Cons:**

- Every use site repeats the same `useState` and two handlers
- Nothing inside the component can set `aria-haspopup` on the trigger or wire an anchor ref, so [#5102] and [#5324] stay open
- The native element still owns its own state, so the reconciliation problem has to be solved anyway, just without a single place to solve it in

### Option 2: Controlled, plus an imperative hook

Keep the current component shape and add `useDialog()`, which returns `open`, `setOpen` and props to spread on a trigger.

**Pros:**

- No breaking change, and the root keeps rendering the element
- Flexible for triggers that are not buttons
- One concept rather than three new sub-components

**Cons:**

- Wiring the trigger stays the consumer's job, so the ARIA and the anchor ref are still theirs to get right
- Two APIs to document and keep consistent
- Does not help Menu, where the missing piece is a component that owns the anchoring

### Option 3: Compound provider, with popup, trigger and close

The root becomes a context provider, the element moves into a `Popup` sub-component, and `Trigger` and `Close` drive the state. State is controlled or uncontrolled.

**Pros:**

- The trigger is ours, so it can own `aria-haspopup`, focus behaviour and the anchor ref
- The repeated `useState` disappears from consumer code
- The same shape serves Dialog, Menu and Popover, and matches Radix and Base UI, so it is familiar
- Controlled usage survives as an option rather than being replaced

**Cons:**

- Breaking for everyone using Dialog on the beta line
- The root renders no DOM of its own, which is surprising when debugging
- One more concept, `Popup`, sitting next to the existing `Content`
- The two sources of truth still have to be reconciled, now across two components

## Decision

Adopt **option 3** for overlay components in `/next`, with this contract.

**State.** Each overlay accepts `defaultOpen`, `open` and `onOpenChange`. The prop wins whenever it is defined, internal state covers the rest, and `onOpenChange` fires on every change so a consumer can observe without taking over. `Accordion.Item` already works this way and is the second consumer of the shared hook that implements it.

**One owner.** Every intent, from the trigger, the close button or the backdrop, calls `onOpenChange`. The effect inside `Popup` is the only code that calls `showModal()` or `close()`. The browser can still close a native dialog on Escape, so mapping the native `close` and `cancel` events back to state is part of the contract rather than an optimisation.

**Refs.** The element ref lives in `Popup`, not in the context. One `Popup` per root.

**`asChild`.** A trigger follows the rule `Button` and `Link` already use: the component's own `className` and `data-*` attributes pass through the `Slot` to the child, so the child keeps the design system styling.

**ARIA.** The trigger owns `aria-haspopup`, and for Menu and Popover the anchor wiring.

Implementation mechanics are deliberately not fixed here: the signature of the shared hook, how `cancel` is handled for a non-dismissable dialog ([#5461]), and how a `Popup` registers itself are for the first implementation ([#5601]) to settle.

### Open questions

Two points are unresolved, and the implementation should not treat either as decided:

1. What `asChild` means when the child is another EDS component. `<Dialog.Trigger asChild><Chip /></Dialog.Trigger>` would produce `class="eds-chip eds-button"` under the rule above. The rule works for raw elements such as `<a>` and `<button>`; for component children it needs an answer.
2. Whether the shared state hook is exported for consumers or stays internal to `/next`.

### Consequences

- Good, because a consumer can open an overlay without holding state, while routing and confirm-before-close flows keep working through the controlled props
- Good, because the trigger's ARIA and the Menu anchoring become the component's responsibility, which is what [#5324] and [#5102] ask for
- Good, because the reconciliation between React state and the native element lives in one place per component instead of in every consumer
- Bad, because Dialog consumers on the beta line have to move their children inside `Dialog.Popup` and move `ref`, `scrim`, `className` and `aria-*` with them
- Bad, because a root that renders nothing is harder to recognise in React DevTools than one that renders its element
- Bad, because the work has to land before the release candidate, or wait for the next major

### Confirmation

New overlay components in `/next` follow this contract, and code review checks it. Dialog is the first implementation ([#5601]), followed by Menu ([#4437]) and Popover ([#5008]).

## Related

- [ADR-0004](./0004-component-conventions-for-eds-2.md) — compound components for containers with consumer-defined content
- [ADR-0005](./0005-use-aschild-slot-for-polymorphism.md) — `asChild` and `Slot`
- [ADR-0025](./0025-batch-graduation-with-release-candidate.md) — the release candidate that closes the window for breaking changes
- [#5600] — the issue this ADR answers
- [#5228] — the Dialog proposal that prompted it

[#5102]: https://github.com/equinor/design-system/issues/5102
[#5228]: https://github.com/equinor/design-system/pull/5228
[#5324]: https://github.com/equinor/design-system/issues/5324
[#4437]: https://github.com/equinor/design-system/issues/4437
[#5008]: https://github.com/equinor/design-system/issues/5008
[#5461]: https://github.com/equinor/design-system/issues/5461
[#5600]: https://github.com/equinor/design-system/issues/5600
[#5601]: https://github.com/equinor/design-system/issues/5601
