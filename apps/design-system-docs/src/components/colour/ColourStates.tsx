import type { CSSProperties } from 'react'

const SELECTABLE_TONES = ['neutral', 'accent'] as const
const STATES = ['default', 'hover', 'pressed'] as const
const BACKGROUND_LEVELS = ['muted', 'emphasis', 'selected'] as const
const BORDER_LEVELS = ['muted', 'emphasis'] as const
const NON_INTERACTIVE_LEVELS = ['muted', 'default', 'emphasis'] as const

type Tone = (typeof SELECTABLE_TONES)[number]
type State = (typeof STATES)[number]
type BackgroundLevel = (typeof BACKGROUND_LEVELS)[number]
type BorderLevel = (typeof BORDER_LEVELS)[number]
type Surface = 'background' | 'border'

const label: CSSProperties = {
  color: 'var(--ifm-color-emphasis-700)',
  fontFamily: 'var(--ifm-font-family-monospace)',
  fontSize: '0.75rem',
}

const visuallyHidden: CSSProperties = {
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: 1,
}

function cssVar(token: string): string {
  return `var(--eds-${token.replaceAll('.', '-')})`
}

function tokenName(
  surface: Surface,
  tone: Tone,
  level: BackgroundLevel | BorderLevel,
  state: State,
): string {
  return `${surface}.interactive.${tone}.${level}.${state}`
}

function StateSwatch({ surface, token }: { surface: Surface; token: string }) {
  const border =
    surface === 'border'
      ? `0.25rem solid ${cssVar(token)}`
      : '1px solid var(--ifm-color-emphasis-300)'

  return (
    <>
      <span
        aria-hidden="true"
        style={{
          background:
            surface === 'background'
              ? cssVar(token)
              : 'var(--eds-background-surface)',
          border,
          borderRadius: '4px',
          display: 'block',
          height: '3rem',
        }}
      />
      <span style={visuallyHidden}>{token}</span>
    </>
  )
}

function StateTable({
  surface,
  tone,
  levels,
}: {
  surface: Surface
  tone: Tone
  levels: readonly (BackgroundLevel | BorderLevel)[]
}) {
  return (
    <table
      style={{
        borderCollapse: 'separate',
        borderSpacing: '0.25rem',
        display: 'table',
        margin: 0,
        minWidth: 'min(100%, 26rem)',
        tableLayout: 'fixed',
        width: '100%',
      }}
    >
      <caption
        style={{
          captionSide: 'top',
          color: 'var(--ifm-font-color-base)',
          fontSize: '1rem',
          fontWeight: 700,
          padding: '0 0.5rem 0.25rem',
          textAlign: 'left',
        }}
      >
        {tone}
        <code
          style={{
            ...label,
            fontWeight: 400,
            marginLeft: '0.75rem',
          }}
        >
          {surface}.interactive.{tone}
        </code>
      </caption>
      <thead>
        <tr>
          <th
            aria-label="State"
            style={{ ...label, border: 0, padding: '0.25rem' }}
          />
          {levels.map((level) => (
            <th
              key={level}
              scope="col"
              style={{
                ...label,
                border: 0,
                padding: '0.25rem',
                textAlign: 'center',
              }}
            >
              {level}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {STATES.map((state) => (
          <tr key={state}>
            <th
              scope="row"
              style={{
                ...label,
                border: 0,
                padding: '0.25rem',
                textAlign: 'left',
                width: '5rem',
              }}
            >
              {state}
            </th>
            {levels.map((level) => {
              const token = tokenName(surface, tone, level, state)

              return (
                <td
                  key={level}
                  title={token}
                  style={{ border: 0, padding: '0.25rem' }}
                >
                  <StateSwatch surface={surface} token={token} />
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function StateMatrix({
  surface,
  levels,
}: {
  surface: Surface
  levels: readonly (BackgroundLevel | BorderLevel)[]
}) {
  return (
    <div style={{ display: 'grid', gap: '1.5rem', margin: '1.5rem 0' }}>
      {SELECTABLE_TONES.map((tone) => (
        <div key={tone} style={{ overflowX: 'auto' }}>
          <StateTable surface={surface} tone={tone} levels={levels} />
        </div>
      ))}
    </div>
  )
}

export function InteractiveBackgroundMatrix() {
  return <StateMatrix surface="background" levels={BACKGROUND_LEVELS} />
}

export function InteractiveBorderMatrix() {
  return <StateMatrix surface="border" levels={BORDER_LEVELS} />
}

function NonInteractiveLevels({ surface }: { surface: Surface }) {
  return (
    <div style={{ margin: '1.5rem 0', overflowX: 'auto' }}>
      <table
        style={{
          borderCollapse: 'separate',
          borderSpacing: '0.25rem',
          display: 'table',
          minWidth: 'min(100%, 26rem)',
          tableLayout: 'fixed',
          width: '100%',
        }}
      >
        <caption style={{ captionSide: 'top', textAlign: 'left' }}>
          <code>{surface}.non-interactive.&lt;tone&gt;.&lt;level&gt;</code>
        </caption>
        <thead>
          <tr>
            <th scope="col" style={{ ...label, border: 0, padding: '0.25rem' }}>
              tone
            </th>
            {NON_INTERACTIVE_LEVELS.map((level) => (
              <th
                key={level}
                scope="col"
                style={{
                  ...label,
                  border: 0,
                  padding: '0.25rem',
                  textAlign: 'center',
                }}
              >
                {level}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SELECTABLE_TONES.map((tone) => (
            <tr key={tone}>
              <th
                scope="row"
                style={{ ...label, border: 0, padding: '0.25rem' }}
              >
                {tone}
              </th>
              {NON_INTERACTIVE_LEVELS.map((level) => {
                const token = `${surface}.non-interactive.${tone}.${level}`

                return (
                  <td
                    key={level}
                    title={token}
                    style={{ border: 0, padding: '0.25rem' }}
                  >
                    <StateSwatch surface={surface} token={token} />
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function NonInteractiveBackgroundLevels() {
  return <NonInteractiveLevels surface="background" />
}

export function NonInteractiveBorderLevels() {
  return <NonInteractiveLevels surface="border" />
}

function Chip({ token, caption }: { token: string; caption: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <span
        aria-hidden="true"
        style={{
          background: cssVar(token),
          border: '1px solid var(--ifm-color-emphasis-300)',
          borderRadius: '4px',
          height: '2.75rem',
        }}
      />
      <span style={label}>{caption}</span>
      <span style={visuallyHidden}>{token}</span>
    </div>
  )
}

export function BehaviourComparison() {
  const examples = [
    {
      title: 'Actionable row',
      branch: 'interactive',
      fill: 'background.interactive.neutral.muted.default',
      states: 'hover and pressed values available',
    },
    {
      title: 'Static row',
      branch: 'non-interactive',
      fill: 'background.non-interactive.neutral.muted',
      states: 'no interaction states',
    },
  ] as const

  return (
    <div
      style={{
        display: 'grid',
        gap: '1rem',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 18rem), 1fr))',
        margin: '1.5rem 0',
      }}
    >
      {examples.map(({ title, branch, fill, states }) => (
        <div
          key={branch}
          style={{
            border: '1px solid var(--ifm-color-emphasis-300)',
            borderRadius: '6px',
            minWidth: 0,
            padding: '1rem',
          }}
        >
          <strong>{title}</strong>
          <div
            style={{
              background: cssVar(fill),
              borderRadius: '4px',
              color: cssVar('text.on-muted.neutral'),
              fontSize: '1rem',
              fontWeight: 700,
              margin: '0.75rem 0',
              padding: '0.75rem',
            }}
          >
            Neutral muted row
          </div>
          <code style={{ ...label, overflowWrap: 'anywhere' }}>{fill}</code>
          <p style={{ margin: '0.5rem 0 0' }}>{states}</p>
        </div>
      ))}
    </div>
  )
}

export function DefaultTwoWays() {
  return (
    <div
      style={{
        display: 'grid',
        gap: '1.5rem',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 18rem), 1fr))',
        margin: '1.5rem 0',
      }}
    >
      <div>
        <strong style={{ display: 'block', marginBottom: '0.25rem' }}>
          Interactive: a state
        </strong>
        <span
          style={{
            ...label,
            display: 'block',
            marginBottom: '0.5rem',
            overflowWrap: 'anywhere',
          }}
        >
          background.interactive.accent.emphasis.<b>&lt;state&gt;</b>
        </span>
        <div
          style={{
            display: 'grid',
            gap: '0.5rem',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          }}
        >
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
        <span
          style={{
            ...label,
            display: 'block',
            marginBottom: '0.5rem',
            overflowWrap: 'anywhere',
          }}
        >
          background.non-interactive.accent.<b>&lt;level&gt;</b>
        </span>
        <div
          style={{
            display: 'grid',
            gap: '0.5rem',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          }}
        >
          {NON_INTERACTIVE_LEVELS.map((level) => (
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
