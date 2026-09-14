import React from 'react'

/**
 * The data-visualisation palette, painted.
 *
 * Categorical, sequential and diverging ramps read very differently, and the difference is the whole
 * reason there are three of them. Listing the names does not show it.
 */

const CATEGORIES = Array.from({ length: 10 }, (_, i) => i + 1)
const CAT_STEPS = Array.from({ length: 5 }, (_, i) => i + 1)
const SEQ = Array.from({ length: 7 }, (_, i) => i + 1)
const DIV = Array.from({ length: 9 }, (_, i) => i + 1)

const label: React.CSSProperties = {
  fontFamily: 'var(--ifm-font-family-monospace)',
  fontSize: '0.6875rem',
  color: 'var(--ifm-color-emphasis-700)',
}

function Swatch({ token, height = '2rem' }: { token: string; height?: string }) {
  return (
    <span
      title={token}
      style={{
        background: `var(--eds-${token.replaceAll('.', '-')})`,
        height,
        borderRadius: '3px',
        border: '1px solid var(--ifm-color-emphasis-200)',
        display: 'block',
      }}
    />
  )
}

function Ramp({ title, note, tokens }: { title: string; note: string; tokens: string[] }) {
  return (
    <section style={{ margin: '1.5rem 0' }}>
      <strong style={{ display: 'block' }}>{title}</strong>
      <p style={{ ...label, margin: '0.125rem 0 0.5rem' }}>{note}</p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${tokens.length}, minmax(0, 1fr))`,
          gap: '0.25rem',
        }}
      >
        {tokens.map((t) => (
          <Swatch key={t} token={t} />
        ))}
      </div>
    </section>
  )
}

export function DataVizPalette() {
  return (
    <div style={{ margin: '1.5rem 0' }}>
      <section style={{ margin: '1.5rem 0' }}>
        <strong style={{ display: 'block' }}>Categorical</strong>
        <p style={{ ...label, margin: '0.125rem 0 0.5rem' }}>
          Ten hues, five steps each. Use the hues to separate series; use the steps within one hue
          when a single series needs shading.
        </p>
        <div style={{ display: 'grid', gap: '0.25rem' }}>
          {CAT_STEPS.map((step) => (
            <div
              key={step}
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${CATEGORIES.length}, minmax(0, 1fr))`,
                gap: '0.25rem',
              }}
            >
              {CATEGORIES.map((cat) => (
                <Swatch
                  key={cat}
                  token={`data-visualization.cat.${cat}.${step}`}
                  height="1.5rem"
                />
              ))}
            </div>
          ))}
        </div>
      </section>

      <Ramp
        title="Sequential"
        note="For magnitude, where one end means more than the other."
        tokens={SEQ.map((n) => `data-visualization.seq.${n}`)}
      />

      <Ramp
        title="Diverging"
        note="For values either side of a midpoint, such as above and below a target."
        tokens={DIV.map((n) => `data-visualization.div.${n}`)}
      />
    </div>
  )
}

export default DataVizPalette
