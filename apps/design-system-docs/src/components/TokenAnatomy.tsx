import React from 'react'

/**
 * A rendered specimen with leader lines out to the tokens that produce it.
 *
 * The worked examples used to be a table of part names beside a code block, which told you which
 * token to use but never showed you what it did. This points at the thing itself.
 *
 * The connectors are positioned relative to the **specimen's own box**, not to a fixed slot, so a
 * dot always sits exactly on the element's edge whatever its height. Only the vertical distance out
 * to each label depends on fixed numbers, and that is a function of the annotation's row index
 * rather than of anything that needs measuring. So it is correct during server rendering too.
 *
 * Every annotation names a real token. `check:colour-docs` verifies them, so a renamed token fails
 * the build rather than quietly labelling a diagram with something that no longer exists.
 */

export type Annotation = {
  /** Dotted token name. Rendered as the CSS custom property, which is what you would type. */
  token: string
  /** Which edge of the specimen the line leaves from */
  edge: 'top' | 'bottom'
  /** What this token colours, if the name alone is not obvious */
  label?: string
}

/** Vertical distance between one annotation row and the next */
const ROW = 30
/** How far the first row sits from the specimen edge */
const LIFT = 22
/** Where the label column starts, measured from the specimen's left edge */
const LABEL_X = 200
/** Horizontal distance between connectors leaving the same edge */
const STAGGER = 22
/** Where the first connector meets the edge */
const FIRST_X = 26

const DOT = 9
const LINE = 'var(--ifm-color-emphasis-400)'

const cssName = (token: string) => `--eds-${token.replaceAll('.', '-')}`

/** One L-shaped leader, anchored to the specimen edge it leaves from. */
function Leader({
  annotation,
  index,
  count,
}: {
  annotation: Annotation
  index: number
  count: number
}) {
  const isTop = annotation.edge === 'top'
  const x = FIRST_X + index * STAGGER
  // Rows fan outwards: for the top edge the last annotation sits highest.
  const depth = LIFT + (isTop ? count - 1 - index : index) * ROW
  const edge = isTop ? { bottom: '100%' } : { top: '100%' }

  return (
    <>
      {/* vertical, from the edge out to the row */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          ...edge,
          left: x,
          height: depth,
          borderLeft: `1.5px solid ${LINE}`,
        }}
      />
      {/* horizontal, along the row to the label */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          ...(isTop
            ? { bottom: `calc(100% + ${depth}px)` }
            : { top: `calc(100% + ${depth}px)` }),
          left: x,
          width: LABEL_X - x - 12,
          borderTop: `1.5px solid ${LINE}`,
        }}
      />
      {/* the dot, sitting on the edge itself */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          ...(isTop ? { top: -DOT / 2 } : { bottom: -DOT / 2 }),
          left: x - DOT / 2,
          width: DOT,
          height: DOT,
          borderRadius: '50%',
          background: 'var(--ifm-color-emphasis-500)',
        }}
      />
      {/* the label */}
      <span
        style={{
          position: 'absolute',
          ...(isTop
            ? { bottom: `calc(100% + ${depth - 10}px)` }
            : { top: `calc(100% + ${depth - 10}px)` }),
          left: LABEL_X,
          fontFamily: 'var(--ifm-font-family-monospace)',
          fontSize: 12,
          lineHeight: '20px',
          whiteSpace: 'nowrap',
        }}
      >
        {cssName(annotation.token)}
        {annotation.label ? (
          <span
            style={{
              fontFamily: 'var(--ifm-font-family-base)',
              color: 'var(--ifm-color-emphasis-700)',
              marginLeft: '0.5rem',
            }}
          >
            {annotation.label}
          </span>
        ) : null}
      </span>
    </>
  )
}

export function TokenAnatomy({
  caption,
  annotations,
  children,
}: {
  /** What is being shown, e.g. "Primary button" */
  caption?: string
  annotations: Annotation[]
  /** The specimen itself */
  children: React.ReactNode
}) {
  const top = annotations.filter((a) => a.edge === 'top')
  const bottom = annotations.filter((a) => a.edge === 'bottom')

  // Room for the leaders, which are drawn outside the specimen's box.
  const above = top.length ? LIFT + (top.length - 1) * ROW + 16 : 0
  const below = bottom.length ? LIFT + (bottom.length - 1) * ROW + 16 : 0

  return (
    <figure style={{ margin: '1.5rem 0', overflowX: 'auto' }}>
      <div
        style={{
          paddingTop: above,
          paddingBottom: below,
          minWidth: LABEL_X + 360,
        }}
      >
        {/* The specimen is the coordinate system: every leader is positioned against its box. */}
        <div
          style={{
            position: 'relative',
            display: 'inline-block',
            maxWidth: 240,
          }}
        >
          {children}
          {top.map((a, i) => (
            <Leader key={a.token} annotation={a} index={i} count={top.length} />
          ))}
          {bottom.map((a, i) => (
            <Leader
              key={a.token}
              annotation={a}
              index={i}
              count={bottom.length}
            />
          ))}
        </div>
      </div>
      {caption ? (
        <figcaption
          style={{
            fontSize: '0.8125rem',
            color: 'var(--ifm-color-emphasis-700)',
            marginTop: '0.25rem',
          }}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}

/* ---------------------------------------------------------------------------------------------
 * Specimens. Each one is built only from the tokens its annotations name, so the diagram cannot
 * drift from the thing it describes.
 * ------------------------------------------------------------------------------------------- */

const v = (token: string) => `var(${cssName(token)})`

export function ButtonSpecimen({
  tone = 'accent',
  children = 'Label',
}: {
  tone?: string
  children?: React.ReactNode
}) {
  return (
    <button
      type="button"
      style={{
        display: 'block',
        background: v(`background.interactive.${tone}.emphasis.default`),
        color: v(`text.on-emphasis.${tone}`),
        border: 'none',
        borderRadius: 4,
        padding: '0.5rem 1.25rem',
        font: 'inherit',
        fontWeight: 500,
        cursor: 'default',
      }}
    >
      {children}
    </button>
  )
}

export function DisabledButtonSpecimen() {
  return (
    <button
      type="button"
      disabled
      style={{
        display: 'block',
        background: v('background.interactive.disabled'),
        color: v('text.interactive.disabled'),
        border: `1px solid ${v('border.interactive.disabled')}`,
        borderRadius: 4,
        padding: '0.5rem 1.25rem',
        font: 'inherit',
        fontWeight: 500,
      }}
    >
      Delete
    </button>
  )
}

export function BannerSpecimen({ tone = 'warning' }: { tone?: string }) {
  return (
    <div
      style={{
        background: v(`background.non-interactive.${tone}.muted`),
        border: `1px solid ${v(`border.non-interactive.${tone}.muted`)}`,
        color: v(`text.on-muted.${tone}`),
        borderRadius: 4,
        padding: '0.625rem 0.875rem',
        fontSize: '0.875rem',
        width: 240,
        boxSizing: 'border-box',
      }}
    >
      Check the values before continuing.
    </div>
  )
}

/**
 * Only the link, not a sentence around it.
 *
 * Leaders anchor to the specimen's box, so wrapping the link in running text put the dot under the
 * first word of the sentence rather than under the link. The context belongs in the caption.
 */
export function LinkSpecimen() {
  return (
    <a
      href="/#"
      style={{
        display: 'block',
        width: 'fit-content',
        fontSize: '0.9375rem',
        color: v('text.interactive.link.default'),
        pointerEvents: 'none',
      }}
    >
      Release notes
    </a>
  )
}

export function FocusRingSpecimen() {
  return (
    <button
      type="button"
      style={{
        display: 'block',
        background: v('background.interactive.accent.emphasis.default'),
        color: v('text.on-emphasis.accent'),
        border: 'none',
        borderRadius: 4,
        padding: '0.5rem 1.25rem',
        font: 'inherit',
        fontWeight: 500,
        outline: `2px solid ${v('border.interactive.focus')}`,
        outlineOffset: 2,
        cursor: 'default',
      }}
    >
      Label
    </button>
  )
}
