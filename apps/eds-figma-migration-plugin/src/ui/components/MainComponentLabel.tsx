import type { ReactNode } from 'react'

type MainComponentLabelProps = {
  /** “Main component” when left out */
  children?: ReactNode
}

/**
 * Marks a main component, or a place inside one, in the purple Figma uses
 * for components, with a four-diamond glyph like Figma's component icon.
 * The colour is --main-component-colour in ui.css.
 */
export function MainComponentLabel({
  children = 'Main component',
}: MainComponentLabelProps) {
  return (
    <span className="main-component-label">
      <svg
        className="main-component-glyph"
        viewBox="0 0 12 12"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M6 0.5 8 2.5 6 4.5 4 2.5ZM2.5 4 4.5 6 2.5 8 0.5 6ZM9.5 4 11.5 6 9.5 8 7.5 6ZM6 7.5 8 9.5 6 11.5 4 9.5Z" />
      </svg>
      {children}
    </span>
  )
}

/**
 * A place inside a main component: “Inside” as plain text, and the
 * component's name in the purple label, so the label reads as the name.
 */
export function InsideMainComponent({ name }: { name: string }) {
  return (
    <span className="inside-main-component">
      <span className="kind-label">Inside</span>
      <MainComponentLabel>{name}</MainComponentLabel>
    </span>
  )
}
