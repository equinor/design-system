import { roleIndex, type TokenPalette } from '@/utils/palette'
import { EXAMPLE_GROUPS } from './exampleGroups'
import { PairingCard } from './PairingCard'

export function PredefinedGroups({ palette }: { palette: TokenPalette }) {
  return (
    <div className="flex flex-col" style={{ gap: '32px' }}>
      {EXAMPLE_GROUPS.map((group) => (
        <section key={group.title}>
          <h2
            className="font-bold"
            style={{ fontSize: '15px', margin: '0 0 4px' }}
          >
            {group.title}
          </h2>
          <p
            style={{
              fontSize: '12px',
              color: '#6b7280',
              margin: '0 0 16px',
            }}
          >
            {group.description}
          </p>

          <div
            className="grid"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '12px',
            }}
          >
            {group.pairings.map((p, i) => (
              <PairingCard
                key={`${group.title}-${i}`}
                fgRole={p.fg}
                bgRole={p.bg}
                fgHex={palette.steps[roleIndex(p.fg)]}
                bgHex={palette.steps[roleIndex(p.bg)]}
                type={p.type ?? 'text'}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
