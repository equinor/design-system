/*
 * The EDS Tab from the Core Components Figma file (node 4240:243515,
 * "Composition=Simple"), used by the AppHeader navigation: a 2px bottom
 * border, no corner radius, 12/8px padding and ui/md text. Inactive tabs use
 * the neutral muted border and primary text, the
 * active tab the accent emphasis border and accent text. Hover and focus add
 * the muted fill (accent for the active tab) and focus a 1px focus ring.
 *
 * Figma binds the active label to `text/accent` (#20474b), a variable Tokens
 * Studio no longer has. It resolves to accent step 12, which is
 * `text.on-muted.accent` in Tokens Studio, hence `text-accent-on-muted`.
 */

export const TAB_BASE =
  'inline-flex items-center justify-center gap-[var(--eds-spacing-3xs)] whitespace-nowrap cursor-pointer rounded-none border-b-2 border-solid px-[var(--eds-spacing-md)] py-[var(--eds-spacing-sm)] font-sans text-base font-normal no-underline transition-colors duration-150 focus-visible:relative focus-visible:z-10 focus-visible:outline-1 disabled:cursor-not-allowed disabled:text-disabled'

export const TAB_INACTIVE =
  'border-interactive-neutral-muted text-primary hover:bg-neutral-muted-hover focus-visible:bg-neutral-muted-hover'

export const TAB_ACTIVE =
  'border-interactive-accent-emphasis text-accent-on-muted hover:border-interactive-accent-emphasis-hover hover:bg-accent-muted-hover focus-visible:border-interactive-accent-emphasis-hover focus-visible:bg-accent-muted-hover'

/** Classes for one tab. */
export function tabClassName(active: boolean): string {
  return `${TAB_BASE} ${active ? TAB_ACTIVE : TAB_INACTIVE}`
}
