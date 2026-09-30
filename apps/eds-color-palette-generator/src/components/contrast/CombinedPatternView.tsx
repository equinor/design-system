import { getApcaFontBreakdown } from '@/utils/palette'
import { Badge } from '@/components/shared/Badge'
import type { PatternGroup } from '@/utils/contrastPageData'
import { FontSizeChip } from './FontSizeChip'

export function CombinedPatternView({
  patternGroups,
}: {
  patternGroups: PatternGroup[]
}) {
  return (
    <div className="flex flex-col gap-8">
      {patternGroups.map((group) => (
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
            {group.pairings.map((p, i) => {
              const lc = parseFloat(p.contrast.apca)
              const fontBreakdown = getApcaFontBreakdown(lc)

              return (
                <div
                  key={`${group.title}-${i}`}
                  className="overflow-hidden rounded border border-muted bg-surface"
                >
                  {/* State label */}
                  <div className="border-b border-muted px-3 py-1.5 text-sm font-medium text-secondary">
                    {p.state}
                  </div>

                  {/* Visual preview in the pairing's own colours */}
                  <div
                    className={p.type === 'border' ? 'px-5 py-4' : 'px-3 py-4'}
                    style={{ backgroundColor: p.bg.hex }}
                  >
                    {p.type === 'border' ? (
                      /* Border: show an input-like box */
                      <div
                        className="rounded px-3 py-2.5 text-base text-tertiary"
                        style={{
                          border: `2px solid ${p.fg.hex}`,
                          backgroundColor: p.bg.hex,
                        }}
                      >
                        Placeholder
                      </div>
                    ) : p.type === 'fill' ? (
                      /* Fill: show a filled rectangle on the canvas */
                      <div
                        className="h-11 rounded"
                        style={{ backgroundColor: p.fg.hex }}
                      />
                    ) : (
                      /* Text: show Aa */
                      <div className="text-center">
                        <span
                          className="text-2xl font-bold"
                          style={{ color: p.fg.hex }}
                        >
                          Aa
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="px-3 py-2.5 text-xs text-secondary">
                    {/* Variable labels */}
                    <div className="mb-1.5 leading-normal">
                      <div>
                        fg:{' '}
                        <strong className="font-medium text-primary">
                          {p.fg.label}
                        </strong>
                      </div>
                      <div>
                        bg:{' '}
                        <strong className="font-medium text-primary">
                          {p.bg.label}
                        </strong>
                      </div>
                    </div>

                    {/* WCAG */}
                    <div className="mb-1 flex flex-wrap items-center gap-1">
                      <span className="font-mono text-sm font-medium text-primary">
                        {p.contrast.wcag}:1
                      </span>
                      <Badge pass={p.contrast.aa} label="AA" />
                      <Badge pass={p.contrast.aaa} label="AAA" />
                    </div>

                    {/* APCA */}
                    <div className="mb-1 flex items-center gap-1">
                      <span className="text-tertiary">APCA</span>
                      <span className="font-mono text-sm font-medium text-primary">
                        Lc&nbsp;{p.contrast.apca}
                      </span>
                    </div>

                    {/* Font sizes */}
                    <div className="flex flex-wrap gap-1">
                      {fontBreakdown.map(({ size, minWeightName }) => (
                        <FontSizeChip
                          key={size}
                          size={size}
                          minWeightName={minWeightName}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
