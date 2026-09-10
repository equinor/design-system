import React from 'react'

/**
 * Two small specimens for the Introduction.
 *
 * `StateLadder` shows that every state has its own named colour rather than an opacity trick.
 * `DefaultTwoWays` shows the one thing readers reliably trip on: `default` is a state on the
 * interactive side and a level on the non-interactive side. Both are easier to see than to read.
 */

const TONES = ['accent', 'neutral', 'info', 'success', 'warning', 'danger'] as const
const STATES = ['default', 'hover', 'pressed'] as const
const LEVELS = ['muted', 'default', 'emphasis'] as const

const label: React.CSSProperties = {
  fontFamily: 'var(--ifm-font-family-monospace)',
  fontSize: '0.6875rem',
  color: 'var(--ifm-color-emphasis-700)',
}

function Chip({ token, caption }: { token: string; caption: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <span
        title={token}
        style={{
          background: `var(--eds-${token.replaceAll('.', '-')})`,
          height: '2.75rem',
          borderRadius: '4px',
          border: '1px solid var(--ifm-color-emphasis-200)',
        }}
      />
      <span style={label}>{caption}</span>
    </div>
  )
}

/** default / hover / pressed, for every tone. */
export function StateLadder() {
  return (
    <div style={{ margin: '1.5rem 0', display: 'grid', gap: '1rem' }}>
      {TONES.map((tone) => (
        <div key={tone}>
          <span style={{ ...label, display: 'block', marginBottom: '0.375rem' }}>
            background.interactive.{tone}.emphasis.*
          </span>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: '0.5rem',
            }}
          >
            {STATES.map((state) => (
              <Chip
                key={state}
                token={`background.interactive.${tone}.emphasis.${state}`}
                caption={state}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/** The same word on both axes, side by side. */
export function DefaultTwoWays() {
  return (
    <div
      style={{
        margin: '1.5rem 0',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: '1.5rem',
      }}
    >
      <div>
        <strong style={{ display: 'block', marginBottom: '0.25rem' }}>
          Interactive: a state
        </strong>
        <span style={{ ...label, display: 'block', marginBottom: '0.5rem' }}>
          background.interactive.accent.emphasis.<b>&lt;state&gt;</b>
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
          {STATES.map((state) => (
            <Chip
              key={state}
              token={`background.interactive.accent.emphasis.${state}`}
              caption={state}
            />
          ))}
        </div>
      </div>

      <div>
        <strong style={{ display: 'block', marginBottom: '0.25rem' }}>
          Non-interactive: a level
        </strong>
        <span style={{ ...label, display: 'block', marginBottom: '0.5rem' }}>
          background.non-interactive.accent.<b>&lt;level&gt;</b>
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
          {LEVELS.map((level) => (
            <Chip
              key={level}
              token={`background.non-interactive.accent.${level}`}
              caption={level}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
