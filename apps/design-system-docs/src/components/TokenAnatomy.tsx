import React from 'react'

/**
 * A rendered specimen with leader lines out to the tokens that produce it.
 *
 * The worked examples used to be a table of part names beside a code block, which told you which
 * token to use but never showed you what it did. This points at the thing itself.
 *
 * Geometry is fixed rather than measured: the specimen sits in a slot of known size, so the leader
 * lines can be drawn without a layout pass. That keeps it correct during server rendering, where
 * there is nothing to measure.
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

const SPEC_W = 240
const SPEC_H = 76
const ROW = 32
const PAD_X = 8
const LABEL_X = SPEC_W + 56
const DOT_R = 5

const cssName = (token: string) => `--eds-${token.replaceAll('.', '-')}`

function Leader({
  x,
  from,
  to,
  labelY,
}: {
  x: number
  from: number
  to: number
  labelY: number
}) {
  return (
    <>
      <polyline
        points={`${x},${from} ${x},${to} ${LABEL_X - 10},${to}`}
        fill="none"
        stroke="var(--ifm-color-emphasis-500)"
        strokeWidth="1.5"
      />
      <circle cx={x} cy={from} r={DOT_R} fill="var(--ifm-color-emphasis-600)" />
      <circle cx={x} cy={labelY} r={0} />
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

  const specTop = top.length * ROW + 8
  const height = specTop + SPEC_H + bottom.length * ROW + 16
  const width = LABEL_X + 380

  return (
    <figure style={{ margin: '1.5rem 0', maxWidth: '100%', overflowX: 'auto' }}>
      <div style={{ position: 'relative', width, height, minWidth: width }}>
        {/* Leader lines sit underneath, so the specimen always wins on overlap. */}
        <svg
          width={width}
          height={height}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
          aria-hidden="true"
        >
          {top.map((a, i) => {
            const x = PAD_X + 26 + i * 24
            const y = (top.length - 1 - i) * ROW + 16
            return <Leader key={a.token} x={x} from={specTop} to={y} labelY={y} />
          })}
          {bottom.map((a, i) => {
            const x = PAD_X + 26 + i * 24
            const y = specTop + SPEC_H + i * ROW + 16
            return <Leader key={a.token} x={x} from={specTop + SPEC_H} to={y} labelY={y} />
          })}
        </svg>

        {/* The specimen */}
        <div
          style={{
            position: 'absolute',
            left: PAD_X,
            top: specTop,
            width: SPEC_W,
            height: SPEC_H,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          {children}
        </div>

        {/* Labels */}
        {[...top, ...bottom].map((a) => {
          const isTop = a.edge === 'top'
          const i = isTop ? top.indexOf(a) : bottom.indexOf(a)
          const y = isTop
            ? (top.length - 1 - i) * ROW + 16
            : specTop + SPEC_H + i * ROW + 16
          return (
            <div
              key={a.token}
              style={{
                position: 'absolute',
                left: LABEL_X,
                top: y - 10,
                fontFamily: 'var(--ifm-font-family-monospace)',
                fontSize: 12,
                lineHeight: '20px',
                whiteSpace: 'nowrap',
              }}
            >
              {cssName(a.token)}
              {a.label ? (
                <span
                  style={{
                    fontFamily: 'var(--ifm-font-family-base)',
                    color: 'var(--ifm-color-emphasis-700)',
                    marginLeft: '0.5rem',
                  }}
                >
                  {a.label}
                </span>
              ) : null}
            </div>
          )
        })}
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
        width: '100%',
      }}
    >
      Check the values before continuing.
    </div>
  )
}

export function LinkSpecimen() {
  return (
    <span style={{ fontSize: '0.9375rem' }}>
      Read the{' '}
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        style={{ color: v('text.interactive.link.default') }}
      >
        release notes
      </a>
    </span>
  )
}

export function FocusRingSpecimen() {
  return (
    <button
      type="button"
      style={{
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
