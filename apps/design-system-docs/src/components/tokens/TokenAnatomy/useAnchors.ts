import { useLayoutEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import type { BindableProperty, TokenMode } from './bindings'
import { DOT, FIRST_X, LABEL_X, STAGGER } from './Leader'

/**
 * Where a dot goes: its distance from the specimen's left edge, and how far in from the edge the
 * leader leaves. Negative inset is outside the box, which is where a focus ring sits.
 */
export type Anchor = { x: number; inset: number }
export type Anchors = Partial<Record<BindableProperty, Anchor>>

export type AnchorRow = { prop: BindableProperty; isTop: boolean }

/** Tokens that paint the glyphs, so their dot goes on the text. */
const ON_TEXT = new Set<BindableProperty>([
  'color',
  'fontFamily',
  'fontWeight',
  'fontSize',
])

/**
 * Whether this row's dot has to be measured. A border is the edge itself, and a spacing strip is
 * sized by its own token, so those are placed in CSS and are correct before any script runs.
 */
export function isMeasured(mode: TokenMode, prop: BindableProperty): boolean {
  if (mode === 'spacing') return prop === 'gap'
  return prop !== 'borderColor'
}

const px = (value: string) => parseFloat(value) || 0

/** The glyph boxes of every text node under `root`, first line first. */
function textRects(root: Node): DOMRect[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const rects: DOMRect[] = []
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.textContent?.trim()) continue
    const range = document.createRange()
    range.selectNodeContents(node)
    for (const rect of Array.from(range.getClientRects())) {
      if (rect.width > 0 && rect.height > 0) rects.push(rect)
    }
  }
  return rects.sort((a, b) => a.top - b.top || a.left - b.left)
}

/**
 * Puts each dot on the thing its token paints: the glyphs for a text colour or a font setting, the
 * fill for a background, the ring for an outline, the underline for a decoration, the line box for
 * a line-height, the strip for a gap.
 *
 * Those positions depend on layout, so they are read back after it in a layout effect and kept
 * current through a ResizeObserver and the web fonts arriving. Until a row has been measured its
 * leader is hidden, so the worst case is a missing leader rather than one pointing at the wrong
 * place.
 */
export function useAnchors(
  specimenRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
  gapStripRef: RefObject<HTMLElement | null>,
  rows: AnchorRow[],
  mode: TokenMode,
): Anchors {
  const [anchors, setAnchors] = useState<Anchors>({})

  // Read through a ref so the effect depends on what is bound rather than on array identity,
  // which changes on every render and would otherwise re-run the measurement in a loop.
  const latest = useRef(rows)
  latest.current = rows

  const key = `${mode}|${rows
    .map((row) => `${row.prop}:${row.isTop ? 't' : 'b'}`)
    .join('|')}`

  useLayoutEffect(() => {
    const specimen = specimenRef.current
    const content = contentRef.current
    if (!specimen || !content) return

    let previous = ''

    const measure = () => {
      const box = specimen.getBoundingClientRect()
      const computed = getComputedStyle(specimen)
      const rects = textRects(content)
      const first = rects[0]
      const textLeft = rects.length
        ? Math.min(...rects.map((r) => r.left)) - box.left
        : 0
      const textRight = rects.length
        ? Math.max(...rects.map((r) => r.right)) - box.left
        : box.width
      const contentTop = px(computed.borderTopWidth) + px(computed.paddingTop)
      const lineHeight =
        px(computed.lineHeight) || (first ? first.height * 1.2 : 0)

      // y is measured from the top of the box; a bottom leader wants the distance from the bottom.
      const anchor = (row: AnchorRow, x: number, y: number): Anchor => ({
        x: Math.round(x),
        inset: Math.round(row.isTop ? y : box.height - y),
      })

      // Dots on the text fan out along the first line, per edge, tighter when the word is short.
      const current = latest.current
      const onTextTotal = { top: 0, bottom: 0 }
      for (const row of current) {
        if (ON_TEXT.has(row.prop)) onTextTotal[row.isTop ? 'top' : 'bottom']++
      }
      const onText = { top: 0, bottom: 0 }
      // Everything else keeps the row-index stagger the CSS-anchored leaders use.
      const indexOnEdge = { top: 0, bottom: 0 }

      const next: Anchors = {}

      for (const row of current) {
        const edge = row.isTop ? 'top' : 'bottom'
        const index = indexOnEdge[edge]++
        if (!isMeasured(mode, row.prop)) continue
        const staggered = FIRST_X + index * STAGGER

        if (ON_TEXT.has(row.prop) && first) {
          const room = Math.max(0, textRight - textLeft - 12)
          const count = onTextTotal[edge]
          // Spread across the first line so three rings do not crowd one short word, but stop
          // short of the label column so the horizontal line keeps a positive length.
          const step = count > 1 ? Math.min(STAGGER * 2, room / (count - 1)) : 0
          const k = onText[edge]++
          next[row.prop] = anchor(
            row,
            Math.min(textLeft + 6 + k * step, LABEL_X - 30),
            first.top - box.top + first.height / 2,
          )
        } else if (row.prop === 'textDecorationColor' && first) {
          // The underline runs a little above the bottom of the glyph box.
          next[row.prop] = anchor(row, textLeft + 6, first.bottom - box.top - 2)
        } else if (row.prop === 'background') {
          // On the fill, in the corner the leader leaves from, clear of the text. Falls back to
          // the row's stagger when the inline padding is too thin to hold a dot.
          const padLeft = px(computed.paddingLeft)
          const x =
            padLeft >= DOT + 2
              ? px(computed.borderLeftWidth) + padLeft / 2
              : staggered
          next[row.prop] = anchor(
            row,
            x,
            row.isTop
              ? contentTop - px(computed.paddingTop) / 2
              : box.height - px(computed.paddingBottom) / 2,
          )
        } else if (row.prop === 'outlineColor') {
          // Outside the box, on the ring itself.
          const ring =
            px(computed.outlineOffset) + px(computed.outlineWidth) / 2
          next[row.prop] = anchor(
            row,
            staggered,
            row.isTop ? -ring : box.height + ring,
          )
        } else if (row.prop === 'lineHeight') {
          // The first line box: its top for a top leader, its bottom for a bottom one.
          next[row.prop] = anchor(
            row,
            staggered,
            row.isTop ? contentTop : contentTop + lineHeight,
          )
        } else if (row.prop === 'gap') {
          const strip = gapStripRef.current
          if (strip) {
            const rect = strip.getBoundingClientRect()
            next[row.prop] = anchor(
              row,
              rect.left - box.left + rect.width / 2,
              rect.top - box.top + rect.height / 2,
            )
          }
        }
      }

      const serialised = JSON.stringify(next)
      if (serialised === previous) return
      previous = serialised
      setAnchors(next)
    }

    measure()

    const resize = new ResizeObserver(measure)
    resize.observe(specimen)

    // Web fonts arriving change the glyph boxes without necessarily changing the specimen's size.
    let cancelled = false
    void document.fonts?.ready.then(() => {
      if (!cancelled) measure()
    })

    return () => {
      cancelled = true
      resize.disconnect()
    }
  }, [specimenRef, contentRef, gapStripRef, key, mode])

  return anchors
}
