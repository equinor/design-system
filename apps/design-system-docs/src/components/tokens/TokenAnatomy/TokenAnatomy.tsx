import React, { Children, isValidElement, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import type { BindableProperty, Bindings, TokenMode } from './bindings'
import {
  DEFAULT_EDGE,
  DOT_TINT,
  boundProperties,
  cssName,
  cssVar,
  impliedStyle,
} from './bindings'
import { DOT, FIRST_X, LABEL_X, LIFT, Leader, ROW, STAGGER } from './Leader'
import { SpacingContent, SpacingOverlay } from './SpacingOverlay'
import { isMeasured, useAnchors } from './useAnchors'
import { useResolvedValues } from './useResolvedValues'

/**
 * A rendered specimen with leader lines out to the tokens that produce it.
 *
 * The worked examples used to be a table of part names beside a code block, which told you which
 * token to use but never showed you what it did. This points at the thing itself.
 *
 * The specimen is rendered **from** the same bindings that draw the leaders. Before, an example
 * named its tokens twice, once in the annotation list and once in a hand-written specimen, and
 * nothing tied the two together, so a diagram could quietly describe something the element was no
 * longer doing. One declaration removes that possibility.
 *
 * The connectors are positioned relative to the **specimen's own box**, not to a fixed slot. Each
 * dot sits on the thing its token paints: the glyphs for a text colour, the fill for a background,
 * the ring for an outline, the strip for a gap. Those positions depend on layout, so they are read
 * back after it and the leader stays hidden until then. Two kinds are known without measuring and
 * show in the server-rendered output as well: a border, which is the edge itself, and a spacing
 * strip, which is sized by its own token. The distance out to each label row is a function of the
 * row index, so the rows never need measuring.
 *
 * Every binding names an existing token. `check:colour-docs` verifies them, so a renamed token
 * fails the build rather than quietly labelling a diagram with something that no longer exists.
 */

export type TokenAnatomyProps = {
  /** Default 'colour'. Spacing mode adds the region overlay. */
  mode?: TokenMode
  /** What is being shown, e.g. "Primary button" */
  caption?: string
  /** The tokens this specimen is built from. */
  bindings: Bindings
  /** Unannotated chrome only. A binding always wins for its own property. */
  style?: CSSProperties
  /** Cap on the specimen width. */
  maxWidth?: number
  /** The specimen's content. */
  children: ReactNode
}

type Row = {
  prop: BindableProperty
  token: string
  label?: string
  isTop: boolean
}

/**
 * MDX parses the text inside a JSX block as Markdown, so `Label` on its own line arrives as
 * `<p>Label</p>`, and the theme gives paragraphs a margin the specimen must not have. Paragraphs
 * are unwrapped and whitespace-only strings dropped, so the specimen holds only what was written.
 */
function unwrapParagraphs(children: ReactNode): ReactNode[] {
  return Children.toArray(children).flatMap((child) => {
    if (isValidElement<{ children?: ReactNode }>(child) && child.type === 'p') {
      return unwrapParagraphs(child.props.children)
    }
    if (typeof child === 'string' && child.trim() === '') return []
    return [child]
  })
}

/**
 * Wide enough that the longest label row does not need the scrollbar. A monospace character at
 * 12px is a little over 7px wide, and the label and value segments follow the token name.
 */
function figureWidth(rows: Row[]): number {
  const longest = rows.reduce(
    (widest, row) =>
      Math.max(widest, cssName(row.token).length + (row.label?.length ?? 0)),
    36,
  )
  return Math.round(LABEL_X + 16 + (longest + 24) * 7.3)
}

export function TokenAnatomy({
  mode = 'colour',
  caption,
  bindings,
  style,
  maxWidth = 240,
  children,
}: TokenAnatomyProps) {
  const specimenRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLSpanElement>(null)
  const gapStripRef = useRef<HTMLSpanElement>(null)

  const props = boundProperties(bindings)
  const content = unwrapParagraphs(children)
  const gapToken = mode === 'spacing' ? bindings.gap?.token : undefined
  const resolved = useResolvedValues(specimenRef, bindings)

  const rows: Row[] = props.map((prop) => {
    const binding = bindings[prop]
    return {
      prop,
      token: binding?.token ?? '',
      label: binding?.label,
      isTop: (binding?.edge ?? DEFAULT_EDGE[prop]) === 'top',
    }
  })

  const anchors = useAnchors(specimenRef, contentRef, gapStripRef, rows, mode)

  const top = rows.filter((row) => row.isTop)
  const bottom = rows.filter((row) => !row.isTop)

  // Room for the leaders, which are drawn outside the specimen's box.
  const above = top.length ? LIFT + (top.length - 1) * ROW + 16 : 0
  const below = bottom.length ? LIFT + (bottom.length - 1) * ROW + 16 : 0

  const implied = props.reduce<CSSProperties>(
    (merged, prop) => ({ ...merged, ...impliedStyle(prop) }),
    {},
  )
  const bound = props.reduce<CSSProperties>(
    (merged, prop) => ({
      ...merged,
      [prop]: cssVar(bindings[prop]?.token ?? ''),
    }),
    {},
  )

  const specimenStyle: CSSProperties = {
    boxSizing: 'border-box',
    font: 'inherit',
    display: 'inline-block',
    maxWidth,
    ...implied,
    ...style,
    ...bound,
    // Forced last: every leader is positioned against this box.
    position: 'relative',
  }

  const renderLeader = (row: Row, index: number, count: number) => {
    const depth = LIFT + (row.isTop ? count - 1 - index : index) * ROW
    const value = resolved[row.prop]

    // A measured anchor puts the dot on the thing itself. Until it exists the leader is hidden.
    const anchor = anchors[row.prop]
    const hidden = isMeasured(mode, row.prop) && !anchor
    let x: number | string = anchor?.x ?? FIRST_X + index * STAGGER
    let dotInset: number | string = anchor?.inset ?? 0
    let dotColor: string | undefined

    // A spacing dot sits inside its strip, positioned by the strip's own token, and takes its tint.
    if (mode === 'spacing') {
      const length = cssVar(row.token)
      if (row.prop === 'paddingBlock') {
        dotInset = `calc(${length} / 2)`
        dotColor = DOT_TINT.paddingBlock
      } else if (row.prop === 'paddingInline') {
        const block = bindings.paddingBlock
          ? cssVar(bindings.paddingBlock.token)
          : '0px'
        x = `calc(${length} / 2)`
        dotInset = `calc(${block} + ${DOT}px)`
        dotColor = DOT_TINT.paddingInline
      } else if (row.prop === 'borderRadius') {
        x = `calc(${length} / 2)`
        dotColor = DOT_TINT.borderRadius
      } else if (row.prop === 'gap') {
        dotColor = DOT_TINT.gap
      }
    }

    return (
      <Leader
        key={row.prop}
        property={row.prop}
        token={row.token}
        label={row.label}
        value={value}
        x={x}
        depth={depth}
        isTop={row.isTop}
        dotInset={dotInset}
        dotColor={dotColor}
        hidden={hidden}
      />
    )
  }

  return (
    <figure
      className="token-anatomy"
      data-mode={mode}
      style={{ margin: '1.5rem 0', overflowX: 'auto', padding: '0.5rem' }}
    >
      <div
        className="token-anatomy__frame"
        style={{
          paddingTop: above,
          paddingBottom: below,
          minWidth: figureWidth(rows),
        }}
      >
        <div
          ref={specimenRef}
          className="token-anatomy__specimen"
          style={specimenStyle}
        >
          {/* `display: contents` gives the anchors something to measure without adding a box. */}
          <span
            ref={contentRef}
            className="token-anatomy__content"
            style={{ display: 'contents' }}
          >
            <SpacingContent gapToken={gapToken} stripRef={gapStripRef}>
              {content}
            </SpacingContent>
          </span>
          {mode === 'spacing' ? <SpacingOverlay bindings={bindings} /> : null}
          {top.map((row, index) => renderLeader(row, index, top.length))}
          {bottom.map((row, index) => renderLeader(row, index, bottom.length))}
        </div>
      </div>
      {caption ? (
        <figcaption
          className="token-anatomy__caption"
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
