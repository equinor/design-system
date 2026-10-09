# Building EDS Mobile Components

This is the canonical reference for building a component in `packages/eds-mobile-components`. The `/new-component` command in Claude Code, the `new-component` prompt in Copilot and the `eds-component` agent in OpenCode read it when the platform is mobile. The web equivalent is [`BUILDING_EDS_2_COMPONENTS.md`](./BUILDING_EDS_2_COMPONENTS.md).

`Badge` is the reference example: `packages/eds-mobile-components/src/components/Badge/`. Read it before writing a component. Package setup, theming and the build are in the package's [`CLAUDE.md`](../../packages/eds-mobile-components/CLAUDE.md).

## Before you start

1. **Look up the design in Figma.** A component has one design for both platforms. Run the Figma MCP tools per [`AGENTS.md`](../../AGENTS.md) § Figma MCP workflow, with the variable definitions for each state. If the component exists on web, its `.figma.tsx` holds the Figma URL.
2. **Check the web API.** If the component exists on web, read its props and sub-components in [`AI-COMPONENT-INDEX.md`](../AI-COMPONENT-INDEX.md) or the web Storybook, and mirror them where it makes sense for React Native. Mobile APIs follow the newest web generation, see [ADR-0021](../adr/0021-align-mobile-apis-with-eds-2-next.md).
3. **Check [`MOBILE_COMPONENT_SCOPE.md`](../MOBILE_COMPONENT_SCOPE.md).** The component may already be excluded or renamed.
4. **Check what exists** in `packages/eds-mobile-components/src/components/`. Build from existing components such as `Typography`, `Icon` and `Button` instead of recreating them. If a component of the same name already exists, as with the components still excluded from `tsconfig.json`, use its code as a reference for behaviour only and rebuild it from the Figma design. Check what uses it, for example `Cell` uses `Switch`, so those components keep working.

## Files

```
YourComponent/
  index.ts
  YourComponent.tsx
  YourComponent.types.ts      # props and value types
  YourComponent.test.tsx
  YourComponent.stories.tsx   # example code for the docs, never rendered
  YourComponent.docs.md       # hand-written part of the docs page
```

Each new component gets its own folder, named after the component. Export the component and its props type from `index.ts`.

## Styling

Use tokens for every colour, size, space and text style, usually through the `Typography` component for text. Define styles with `EDSStyleSheet.create` at module level and resolve them with `useStyles` inside the component, so the component follows the colour scheme and the density with no extra code. Use `useToken()` only when you need a raw token value that is not a style, such as an icon colour or an animation value. Never hardcode a hex value or a number that a token covers.

```tsx
const styles = useStyles(badgeThemeStyles, { tone, emphasis, variant })

return (
  <View {...rest} style={[styles.container, rest.style]}>
    <Typography size="sm" numberOfLines={1} style={styles.label}>
      {children}
    </Typography>
  </View>
)

const badgeThemeStyles = EDSStyleSheet.create(
  (token, { tone }: { tone: BadgeTone }) => ({
    // Every value comes from `token`. See Badge.tsx for the current token names.
    container: { backgroundColor: token.group.name },
    label: { color: token.group.name },
  }),
)
```

- **Merge the caller's `style`** after the component's own, as above, so it never replaces them.
- **A press is the Figma hover state.** Mobile has no hover, so use the hover background as the pressed state.
- **Use `Pressable`, not `PressableHighlight`.** The design shows no grey overlay on press.
- **Keep touch targets at least 44 by 44 points.** This is set in code and is not a token.
- **Pass `ref` as a prop**, typed as `ref?: Ref<View>` or the element it targets.

## Props

Give every prop a JSDoc description, and a `@default` tag where it has a default. Describe each value of a fixed-value type in the JSDoc of that type. The docs generator fails on a prop without a description and reads the rest for the page. See [`STORYBOOK_DOC_STYLE.md`](./STORYBOOK_DOC_STYLE.md).

## Tests

Put the test next to the component and render through `test-utils`, which wraps the component in `EDSProvider`. `Badge.test.tsx` shows the shape: it checks that the component renders, that each variant changes the style it should, and that a caller-supplied `style` is merged and not replaced. Cover accessibility basics such as roles, labels and states.

## Wiring

1. If the component was excluded as unmigrated, remove it from the exclusion lists in `tsconfig.json`, `eslint.config.js` and `jest.config.cjs`.
2. Export the component from `packages/eds-mobile-components/src/index.ts`.
3. Add a demo screen at `apps/mobile-storybook/app/(tabs)/components/yourcomponent.tsx`, named after the lowercased folder, and one entry in `componentRegistry` in `apps/mobile-storybook/lib/registry.ts`. CI runs `pnpm run check-screens:mobile` and fails if an exported component has neither.
4. Write the docs: the stories file and `YourComponent.docs.md`, then run `pnpm run generate:component-docs YourComponent`. The generator needs a web component of the same name, because mobile-only components are not supported yet. The rules are in [`STORYBOOK_DOC_STYLE.md`](./STORYBOOK_DOC_STYLE.md).

## Log what you find

Gaps that are out of scope for the change, such as a state the Figma design omits or a missing web parity, go on the findings tracking issue. See the package's [`CLAUDE.md`](../../packages/eds-mobile-components/CLAUDE.md) § Logging Migration Findings.

## Checks before you finish

```bash
pnpm --filter @equinor/eds-mobile-components run lint
pnpm --filter @equinor/eds-mobile-components run types
pnpm --filter @equinor/eds-mobile-components run test
pnpm run check-screens:mobile
pnpm run generate:component-docs --check
```

## Anti-patterns checklist

- Hardcoded colours, sizes or spacing where a token exists
- A component that only looks right in one colour scheme or density
- `PressableHighlight`, or a touch target under 44 by 44 points
- Replacing the caller's `style` instead of merging it
- Editing an old component in place instead of rebuilding it from the Figma design, which leaves old hardcoded values behind
- A new export with no demo screen or registry entry
- A hand-written `docs/YourComponent.mdx`, which the generator would overwrite

## Implementation Status Report

After creating the files, output a short `## Implementation notes` section as described in [`BUILDING_EDS_2_COMPONENTS.md`](./BUILDING_EDS_2_COMPONENTS.md#implementation-status-report).
