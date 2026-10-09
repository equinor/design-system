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
| `Tooltip` (next)        | Already wraps its child to attach trigger behaviour, with `cloneElement` rather than `Slot`                                                  |
| `Accordion.Item` (next) | Controlled and uncontrolled in one API: `defaultOpen`, `open` and `onOpenChange`                                                             |

[#5228] proposes a compound API for Dialog and is the immediate trigger for writing this down. The same decisions reach Menu and Popover, which are built at different times by different people, so they need an answer that outlives one pull request.

One property shapes everything below: a native `<dialog>` owns an open state of its own. The browser closes it on Escape without telling React. There are always two sources of truth, and the only question is who reconciles them.

[ADR-0004](./0004-component-conventions-for-eds-2.md) allows the compound pattern when a component is a container for consumer-defined content. Dialog meets that test, but `Trigger` and `Close` do not: they exist for behaviour and ARIA wiring rather than for content. This ADR therefore widens the criterion for overlay components, and that widening is part of what it asks the team to accept.

## Decision Drivers

- A consumer should be able to open an overlay without holding state, and should still be able to hold it when routing or a confirm-before-close flow needs it.
- The pattern has to fit both a native element that owns its state (`<dialog>`) and a popup positioned from JS (Menu, Popover).
- Whatever renders the trigger should own the trigger's ARIA, and for Menu and Popover the anchor wiring that [#5102] asks for.
- It has to sit inside [ADR-0004](./0004-component-conventions-for-eds-2.md), which allows the compound pattern for containers and asks for it to be justified per component, and leave [ADR-0005](./0005-use-aschild-slot-for-polymorphism.md), which defines `asChild`, as it is.
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

- Wiring the trigger stays the consumer's job, so the ARIA and the anchor ref are still theirs to get right, and nothing warns them when they forget
- Two APIs to document and keep consistent
- Does not help Menu, where the missing piece is a component that owns the anchoring
- Reads awkwardly in the places that are markup only, such as documentation examples and Code Connect snippets

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
- One more concept, `Popup` for the overlay surface itself, sitting next to the existing `Content` for the body text inside it
- The two sources of truth still have to be reconciled, now across two components
- The provider has to wrap both the trigger and the popup, so a trigger far from its overlay in the React tree means wrapping a large subtree

## Decision

Adopt **option 3** for overlay components in `/next`, with this contract.

### Why a trigger component rather than a hook

The choice between option 2 and option 3 is not symmetric. A hook can be added on top of a trigger component later, as a pure addition for the cases the component cannot reach. A trigger component added after a hook leaves two ways to do the same thing for good, and every documentation page and example then has to pick a side. Option 3 keeps the later decision open, option 2 closes it.

The case for the hook is that a trigger can live anywhere: in a toolbar above an overlay rendered at the bottom of the page, in a table row, in a menu item that unmounts the moment the dialog opens, in a command palette, or nowhere at all when the overlay opens from an effect after a network call. All of those are already served by `open` and `onOpenChange`, which this decision keeps. The controlled props are the escape hatch. What a hook adds beyond them is the ARIA wiring on a trigger that sits outside the provider, and for a modal dialog that is a small gain.

For Menu and Popover it is a larger gain in the opposite direction. Their trigger and popup are joined by CSS anchor positioning, which needs a generated `anchor-name` on one element and `position-anchor` on the other. That is not something a consumer should write by hand, and [#5102] says exactly that. A trigger far from its own menu is also close to meaningless, since a menu is anchored to whatever opened it. Where the component is most needed, the argument for the hook is weakest.

The libraries point the same way. Radix and Base UI ship a trigger component for every overlay, with no hook alongside it. React Aria is hook-first, and still ships `DialogTrigger` as a component on top of those hooks. Headless UI splits it: `MenuButton` and `PopoverButton` open their own popup, while its Dialog ships no trigger and stays controlled, which is where ours is today. The split falls where this decision already does, since a menu and a popover are anchored to whatever opened them and a modal dialog is not. The component is the default surface wherever it exists, and the hook, where it exists, sits underneath it.

This is not a choice between the two shapes, though. The trigger component is a thin layer over a trigger hook, so the hook gets built either way. What this decision settles is which of them is public: the component is the API, the hook is the implementation, and exporting the hook later costs a line and a documentation page rather than a redesign.

The hook stays honest in the meantime because it has an internal consumer. Autocomplete builds a combobox out of an `Input` and the internal `Menu`, generates its own anchor name (`Autocomplete.tsx:75`), and sets `aria-expanded` and `aria-controls` by hand. Its trigger is a text field, so it can never be a `Menu.Trigger`, and it is exactly the case a trigger hook exists for. Once the real Menu lands it should consume the hook rather than keep its own wiring.

One implementation consequence follows: the provider must render no DOM and memoise its context value, so that wrapping a large subtree stays free. [#5601] covers that.

**State.** Each overlay accepts `defaultOpen`, `open` and `onOpenChange`. When `open` is defined it decides every open, and every close the component is able to refuse. Internal state covers the rest. `onOpenChange` fires on every change the user or the browser starts, never as an echo of a prop update, so a consumer can observe without taking over and without loops. `Accordion.Item` already works this way and is the second consumer of the shared hook that implements it.

**One owner.** Every intent, from the trigger, the close button or the backdrop, calls `onOpenChange`. The effect inside `Popup` is the only code that calls `showModal()` or `close()`.

`<dialog>` is not the only element that closes itself. Menu, Popover and Tooltip will use the Popover API, where the browser light-dismisses and closes on Escape without asking React either, so this part of the contract covers both.

How far a component can go depends on which element it is, and the two are not equal. A dialog gets the `cancel` event, which is cancellable, so where a component must be able to refuse a close, as a non-dismissable dialog or an unsaved-changes prompt does, it prevents the default, reports the intent, and lets the element close only once state agrees. A popover has no equivalent: `beforetoggle` is cancellable when it opens but not when it closes, so light dismiss cannot be refused and a popover-backed overlay can only follow the element and report what happened.

Even for a dialog, refusing unconditionally would be wrong. If the state update fails or a consumer's handler stalls, the dialog can no longer be left by keyboard, which is a trap under WCAG 2.1.2. So the native close stays the default path, and intent first applies only where a refusal is both possible and wanted.

A close the browser has already carried out is final. The component reports it through `onOpenChange` and does not reopen the element to match the prop, even when a controlled consumer ignores the report.

Overlays also have to tolerate each other. A tooltip shown over an open menu must not dismiss it, which is what `popover="hint"` is for, so the popover type each overlay uses is part of this contract rather than a detail of each component.

The component also has to know why it is closing, since [#5461] treats Escape differently from a press on the backdrop. Whether that reaches the public callback is for [#5601].

**Refs.** The element ref lives in `Popup`, not in the context. One `Popup` per root.

**Trigger.** A trigger renders no element of its own. It takes exactly one child, merges the open behaviour, the ARIA and the ref into it, and leaves the look to the child:

```tsx
<Dialog.Trigger>
  <Button>Open dialog</Button>
</Dialog.Trigger>
```

`Dialog.Close` and its equivalents work the same way, so the two sides of the pattern match. The close button that `Dialog.Header` renders keeps rendering as it does today, since that one is ours rather than the consumer's, but its click goes through `onOpenChange` like every other intent instead of calling `close()` on the element.

The child has to forward its ref and spread the props it is given, which every EDS component already does. A string, a fragment or several children is an error rather than a silent no-op.

The child also has to be interactive. A wrapper makes `<Dialog.Trigger><div>Open</div></Dialog.Trigger>` easy to write, and it would produce a clickable element with no role, no keyboard support and nothing for a screen reader to announce, which a trigger that rendered its own `<button>` could never do. The component warns in development when the child is not a native interactive element, such as `button`, `a[href]` or `input`, and has no interactive `role`. It cannot see whether keyboard handling is attached, so the warning stays with what it can check.

This is the shape the styled design systems use. React Spectrum's `DialogTrigger` wraps an `ActionButton`, and Mantine's `Menu.Target` renders nothing and clones a single child with the same two requirements. MUI ships no trigger at all and leaves the consumer holding state, which is where our Dialog is today. Only the headless libraries, Radix and Base UI, render an element from the trigger itself, and they can because everything they render is unstyled.

Two things follow. `asChild` does not appear on a trigger, so [ADR-0005](./0005-use-aschild-slot-for-polymorphism.md) keeps its single meaning and is untouched by this decision. And a trigger that must not look like a button needs nothing special, since any child works.

**ARIA.** The trigger owns `aria-haspopup`, and for Menu and Popover the anchor wiring. It also tells the browser which element invoked the popup (`popovertarget`, or the `source` option on `showPopover()` where supported), so that two `auto` popovers that are not DOM descendants, such as a Menu opened from inside a Popover, do not close each other.

**Hooks.** Two of them, both internal to `/next`: one for controlled and uncontrolled state, shared with `Accordion.Item`, and one for the trigger, which the trigger component is built on and which Autocomplete should move onto when the real Menu lands. The trigger hook cannot assume a button or a click: Autocomplete's trigger is the text input itself, focus stays in it, and it opens on typing. Exporting either hook is additive, so it waits until a consumer has a case that neither the components nor the controlled props serve.

Implementation mechanics are deliberately not fixed here: the signatures of those hooks, how `cancel` is handled for a non-dismissable dialog ([#5461]), and how a `Popup` registers itself are for the first implementation ([#5601]) to settle.

### Consequences

- Good, because a consumer can open an overlay without holding state, while routing and confirm-before-close flows keep working through the controlled props
- Good, because the trigger's ARIA and the Menu anchoring become the component's responsibility, which is what [#5324] and [#5102] ask for
- Good, because the reconciliation between React state and the native element lives in one place per component instead of in every consumer
- Bad, because Dialog consumers on the beta line have to move their children inside `Dialog.Popup` and move `ref`, `scrim`, `className` and `aria-*` with them
- Bad, because a root that renders nothing is harder to recognise in React DevTools than one that renders its element
- Bad, because the work has to land before the release candidate, or wait for the next major

### Confirmation

New overlay components in `/next` follow this contract, and code review checks it. Dialog is the first implementation ([#5601]), followed by Menu ([#4437]) and Popover ([#5008]).

Tooltip is partly in scope. Its trigger follows the rule above, replacing the `cloneElement` it uses today, and it is covered by the clause on overlays tolerating each other. It does not take `open`, `defaultOpen` or `onOpenChange`, because a tooltip opens on hover and focus rather than on consumer intent. That change is for whenever Tooltip is next worked on, not a task of its own.

## Related

- [ADR-0004](./0004-component-conventions-for-eds-2.md): compound components for containers with consumer-defined content
- [ADR-0005](./0005-use-aschild-slot-for-polymorphism.md): `asChild` and `Slot`
- [ADR-0025](./0025-batch-graduation-with-release-candidate.md): the release candidate that closes the window for breaking changes
- [#5600]: the issue this ADR answers
- [#5228]: the Dialog proposal that prompted it

[#5102]: https://github.com/equinor/design-system/issues/5102
[#5228]: https://github.com/equinor/design-system/pull/5228
[#5324]: https://github.com/equinor/design-system/issues/5324
[#4437]: https://github.com/equinor/design-system/issues/4437
[#5008]: https://github.com/equinor/design-system/issues/5008
[#5461]: https://github.com/equinor/design-system/issues/5461
[#5600]: https://github.com/equinor/design-system/issues/5600
[#5601]: https://github.com/equinor/design-system/issues/5601
