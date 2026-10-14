import { stepLabel } from '@/config/config'
import type { TokenPalette } from '@/utils/palette'
import { EXAMPLE_GROUPS } from './exampleGroups'
import { PairingCard } from './PairingCard'

export function PredefinedGroups({ palette }: { palette: TokenPalette }) {
  return (
    <div className="flex flex-col gap-8">
      {EXAMPLE_GROUPS.map((group) => (
        <section key={group.title}>
          <h2 className="m-0 mb-1 text-header-md font-medium text-primary">
            {group.title}
          </h2>
          <p className="m-0 mb-4 text-sm text-secondary">{group.description}</p>

          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            }}
          >
            {group.pairings.map((p, i) => (
              <PairingCard
                key={`${group.title}-${i}`}
                fgRole={stepLabel(p.fg)}
                bgRole={stepLabel(p.bg)}
                fgHex={palette.steps[p.fg - 1]}
                bgHex={palette.steps[p.bg - 1]}
                type={p.type ?? 'text'}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
