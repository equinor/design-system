import React from 'react'
import type { BindableProperty } from './bindings'
import { cssName } from './bindings'

/** Vertical distance between one leader row and the next */
export const ROW = 30
/** How far the first row sits from the specimen edge */
export const LIFT = 22
/** Where the label column starts, measured from the specimen's left edge */
export const LABEL_X = 200
/** Horizontal distance between connectors leaving the same edge */
export const STAGGER = 22
/** Where the first connector meets the edge */
export const FIRST_X = 26
/** Diameter of the dot */
export const DOT = 9

const LINE = 'var(--ifm-color-emphasis-400)'

/** Lengths arrive either as numbers of pixels or as a CSS length, so both are normalised here. */
const len = (value: number | string) =>
  typeof value === 'number' ? `${value}px` : value

export type LeaderProps = {
  /** The bound property this leader belongs to. Exposed as `data-property` on every part. */
  property: BindableProperty
  /** Dotted token name, shown as the custom property. */
  token: string
  /** What the token does here. */
  label?: string
  /** The resolved value, filled in after mount. */
  value?: string
  /** Where the connector meets the edge, from the specimen's left edge. */
  x: number | string
  /** Distance from the edge out to this row. */
  depth: number
  isTop: boolean
  /**
   * How far inside the specimen the dot sits, measured from the edge the leader leaves. Negative
   * puts it outside, which is where a focus ring is. The line always runs from the dot to the row.
   */
  dotInset?: number | string
  /** Overrides the dot colour, so a spacing dot can match the region it points at. */
  dotColor?: string
  /** For an anchor whose position has to be measured, until it has been. */
  hidden?: boolean
}

/** One L-shaped leader: a dot on the thing itself, a line out past the edge, a row to the label. */
export function Leader({
  property,
  token,
  label,
  value,
  x,
  depth,
  isTop,
  dotInset = 0,
  dotColor,
  hidden,
}: LeaderProps) {
  const dotColour = dotColor ?? 'var(--ifm-color-emphasis-600)'
  const visibility = hidden ? ('hidden' as const) : undefined
  const inset = len(dotInset)
  // The dot is `inset` in from the edge, so the line starts `inset` short of the edge and runs
  // that much further to reach the row.
  const lineStart = `calc(100% - ${inset})`
  const lineLength = `calc(${depth}px + ${inset})`
  const dotEdge = `calc(${inset} - ${DOT / 2}px)`

  return (
    <>
      {/* vertical, from the dot out to the row */}
      <span
        className="token-anatomy__leader-line"
        data-property={property}
        aria-hidden="true"
        style={{
          position: 'absolute',
          visibility,
          ...(isTop ? { bottom: lineStart } : { top: lineStart }),
          left: len(x),
          height: lineLength,
          borderLeft: `1.5px solid ${LINE}`,
        }}
      />
      {/* horizontal, along the row to the label */}
      <span
        className="token-anatomy__leader-row"
        data-property={property}
        aria-hidden="true"
        style={{
          position: 'absolute',
          visibility,
          ...(isTop
            ? { bottom: `calc(100% + ${depth}px)` }
            : { top: `calc(100% + ${depth}px)` }),
          left: len(x),
          width: `calc(${LABEL_X}px - ${len(x)} - 12px)`,
          borderTop: `1.5px solid ${LINE}`,
        }}
      />
      {/* the dot, on the thing the token paints */}
      <span
        className="token-anatomy__dot"
        data-property={property}
        aria-hidden="true"
        style={{
          position: 'absolute',
          visibility,
          ...(isTop ? { top: dotEdge } : { bottom: dotEdge }),
          left: `calc(${len(x)} - ${DOT / 2}px)`,
          width: DOT,
          height: DOT,
          borderRadius: '50%',
          boxSizing: 'border-box',
          background: dotColour,
          // A halo in the page colour, so the dot reads on a dark fill and over glyphs alike.
          boxShadow: '0 0 0 1.5px var(--ifm-background-color)',
        }}
      />
      {/* the label */}
      <span
        className="token-anatomy__label"
        data-property={property}
        style={{
          position: 'absolute',
          visibility,
          ...(isTop
            ? { bottom: `calc(100% + ${depth - 10}px)` }
            : { top: `calc(100% + ${depth - 10}px)` }),
          left: LABEL_X,
          fontFamily: 'var(--ifm-font-family-monospace)',
          fontSize: 12,
          lineHeight: '20px',
          whiteSpace: 'nowrap',
          // The label sits inside the specimen's box, so without this it would inherit the
          // specimen's own text colour, which on a filled button is white.
          color: 'var(--eds-text-primary)',
        }}
      >
        <span className="token-anatomy__label-name">{cssName(token)}</span>
        {label ? (
          <span
            className="token-anatomy__label-part"
            style={{
              fontFamily: 'var(--ifm-font-family-base)',
              color: 'var(--ifm-color-emphasis-700)',
              marginLeft: '0.5rem',
            }}
          >
            {label}
          </span>
        ) : null}
        {value ? (
          <span
            className="token-anatomy__label-value"
            style={{
              color: 'var(--ifm-color-emphasis-600)',
              marginLeft: '0.5rem',
            }}
          >
            {value}
          </span>
        ) : null}
      </span>
    </>
  )
}
