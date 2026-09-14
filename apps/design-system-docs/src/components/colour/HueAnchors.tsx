import React from 'react'
import { ANCHORS, SCHEMES } from './scaleSource'
import type { Scheme } from './scaleSource'

/**
 * The seven hue anchors, each painted across all 15 steps.
 *
 * This is the layer below the tones, and it is what makes the section's other two claims checkable
 * by eye. Reading down a column shows that every anchor takes the same lightness at the same step.
 * Reading across a row shows the chroma curve: muted at both ends, saturated through the middle.
 * Comparing rows shows that the curve is one shape scaled per hue rather than tuned per anchor, so
 * `red` is stronger than `north sea` at every step and `gray` has no chroma at all.
 *
 * The anchors are ordered by hue angle, which puts `blue` and `north sea` next to each other. They
 * are 2.3° apart, which is why `north sea` reads as a blue and why it can stand in for `gray` on a
 * dark page without the interface changing character.
 */

const STEPS = Array.from({ length: 15 }, (_, i) => i + 1)

/**
 * The two anchors that sit closest together in hue, and the gap between them.
 *
 * Derived rather than asserted: the caption makes a point of how small the gap is, and a hardcoded
 * figure there would be the one number on this page that could quietly stop being true.
 */
const NEIGHBOURS: [string, string, string] | null = (() => {
  const angled = ANCHORS.filter(
    (a): a is { name: string; angle: number } => a.angle !== null,
  )
  let closest: [string, string, number] | null = null
  for (let i = 1; i < angled.length; i += 1) {
    const gap = angled[i].angle - angled[i - 1].angle
    if (!closest || gap < closest[2]) {
      closest = [angled[i - 1].name, angled[i].name, gap]
    }
  }
  if (!closest) return null
  const label = (n: string) => n.replace('-', ' ')
  return [label(closest[0]), label(closest[1]), closest[2].toFixed(1)]
})()

function Grid({ scheme }: { scheme: Scheme }) {
  return (
    <div className="grid" data-color-scheme={scheme}>
      <span className="grid-title">{scheme}</span>

      <div className="rows">
        <span className="corner" />
        {STEPS.map((step) => (
          <span key={step} className="step-head">
            {step}
          </span>
        ))}

        {ANCHORS.map(({ name, angle }) => (
          <React.Fragment key={name}>
            <span className="hue-label">
              <b>{name.replace('-', ' ')}</b>
              <i>{angle === null ? 'no hue' : `${Math.round(angle)}°`}</i>
            </span>
            {STEPS.map((step) => (
              <span
                key={step}
                className="cell"
                style={{ background: `var(--eds-${scheme}-${name}-${step})` }}
                title={`${name.replace('-', ' ')} ${step}`}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export function HueAnchors() {
  return (
    <figure className="hue-anchors">
      {SCHEMES.map((scheme) => (
        <Grid key={scheme} scheme={scheme} />
      ))}

      <figcaption>
        All {ANCHORS.length} anchors, every step, ordered by hue angle — which
        is the same at every step and in both schemes, so it is listed once.
        Reading down a column shows every anchor taking the same lightness at
        that step. Reading across a row shows the chroma curve: muted at both
        ends, strongest through the middle. The curve is one shape scaled per
        anchor, so <code>red</code> is the most saturated at every step,{' '}
        <code>north sea</code> the least, and <code>gray</code> none at all.
        Steps 14 and 15 break the run because they are foregrounds meant to sit{' '}
        <em>on</em> a fill rather than positions along it.{' '}
        {NEIGHBOURS ? (
          <>
            <code>{NEIGHBOURS[0]}</code> and <code>{NEIGHBOURS[1]}</code> sit
            only {NEIGHBOURS[2]}° apart, which is why <code>north sea</code> can
            carry <code>neutral</code> on a dark page without the interface
            changing character.
          </>
        ) : null}
      </figcaption>
    </figure>
  )
}

export default HueAnchors
