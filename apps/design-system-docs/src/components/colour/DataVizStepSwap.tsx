import React from 'react'

import './dataviz-step-swap.css'

/**
 * The five categorical steps, painted in light and in dark side by side.
 *
 * The point of the section is that a step number means "how far from the background", not "how
 * light". That is only obvious when both schemes are visible at once: step 1 is a pale tint in light
 * and a deep shade in dark, and in both it is the step that sits closest to the page. Each cell
 * shows all ten hues at that step, so the reader can see the rule holds for every hue, not just one.
 *
 * Each cell carries data-color-scheme and paints its own background.surface, so the swatches resolve
 * to that scheme's values and are seen against the surface they are made for (see HueAnchors for
 * why a dark swatch on a light page misleads).
 */

const HUES = Array.from({ length: 10 }, (_, i) => i + 1)

const STEPS: { step: number; meaning: string }[] = [
  { step: 1, meaning: 'Closest to the background. Barely stands out.' },
  { step: 2, meaning: 'Quiet.' },
  {
    step: 3,
    meaning: 'The base colour of each hue. The same in both schemes.',
  },
  { step: 4, meaning: 'Stronger.' },
  { step: 5, meaning: 'Furthest from the background. Stands out most.' },
]

function Cell({ scheme, step }: { scheme: 'light' | 'dark'; step: number }) {
  return (
    <td className="cell" data-color-scheme={scheme}>
      <span className="swatches">
        {HUES.map((hue) => (
          <span
            key={hue}
            className="swatch"
            style={{
              background: `var(--eds-data-visualization-cat-${hue}-${step})`,
            }}
            title={`data-visualization.cat.${hue}.${step}, ${scheme}`}
          />
        ))}
      </span>
    </td>
  )
}

export function DataVizStepSwap() {
  return (
    <div className="dataviz-step-swap">
      <table>
        <thead>
          <tr>
            <th scope="col">Step</th>
            <th scope="col">Light</th>
            <th scope="col">Dark</th>
            <th scope="col">What it means in both</th>
          </tr>
        </thead>
        <tbody>
          {STEPS.map(({ step, meaning }) => (
            <tr key={step} className={step === 3 ? 'base' : undefined}>
              <th scope="row">{step}</th>
              <Cell scheme="light" step={step} />
              <Cell scheme="dark" step={step} />
              <td className="meaning">{meaning}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="caption">
        Each cell shows the ten hues, <code>cat.1</code> to <code>cat.10</code>,
        at that step, on the surface of its own colour scheme.
      </p>
    </div>
  )
}

export default DataVizStepSwap
