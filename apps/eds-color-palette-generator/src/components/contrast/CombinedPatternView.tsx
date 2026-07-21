import { getApcaFontBreakdown } from '@/utils/palette'
import { Badge } from '@/components/shared/Badge'
import type { PatternGroup } from '@/utils/contrastPageData'

export function CombinedPatternView({
  patternGroups,
}: {
  patternGroups: PatternGroup[]
}) {
  return (
    <div className="flex flex-col" style={{ gap: '32px' }}>
      {patternGroups.map((group) => (
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
            {group.pairings.map((p, i) => {
              const lc = parseFloat(p.contrast.apca)
              const fontBreakdown = getApcaFontBreakdown(lc)

              return (
                <div
                  key={`${group.title}-${i}`}
                  className="rounded-xl overflow-hidden"
                  style={{
                    border: '1px solid #e5e7eb',
                    background: '#fff',
                  }}
                >
                  {/* State label */}
                  <div
                    style={{
                      padding: '6px 12px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#6b7280',
                      borderBottom: '1px solid #f3f4f6',
                    }}
                  >
                    {p.state}
                  </div>

                  {/* Visual preview — adapts to pairing type */}
                  <div
                    style={{
                      backgroundColor: p.bg.hex,
                      padding: p.type === 'border' ? '16px 20px' : '16px 12px',
                    }}
                  >
                    {p.type === 'border' ? (
                      /* Border: show an input-like box */
                      <div
                        style={{
                          border: `2px solid ${p.fg.hex}`,
                          borderRadius: '8px',
                          padding: '10px 12px',
                          fontSize: '13px',
                          color: '#9ca3af',
                          backgroundColor: p.bg.hex,
                        }}
                      >
                        Placeholder
                      </div>
                    ) : p.type === 'fill' ? (
                      /* Fill: show a filled rectangle on the canvas */
                      <div
                        style={{
                          backgroundColor: p.fg.hex,
                          borderRadius: '8px',
                          height: '44px',
                        }}
                      />
                    ) : (
                      /* Text: show Aa */
                      <div className="text-center">
                        <span
                          style={{
                            fontSize: '24px',
                            fontWeight: 700,
                            fontFamily: 'Georgia, serif',
                            color: p.fg.hex,
                          }}
                        >
                          Aa
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div
                    style={{
                      padding: '10px 12px',
                      fontSize: '10px',
                      color: '#6b7280',
                    }}
                  >
                    {/* Variable labels */}
                    <div style={{ marginBottom: '6px', lineHeight: 1.5 }}>
                      <div>
                        fg:{' '}
                        <strong style={{ color: '#111' }}>{p.fg.label}</strong>
                      </div>
                      <div>
                        bg:{' '}
                        <strong style={{ color: '#111' }}>{p.bg.label}</strong>
                      </div>
                    </div>

                    {/* WCAG */}
                    <div
                      className="flex items-center gap-1 flex-wrap"
                      style={{ marginBottom: '4px' }}
                    >
                      <span
                        className="font-semibold"
                        style={{
                          fontFamily: 'var(--font-geist-mono, monospace)',
                          fontSize: '12px',
                          color: '#111',
                        }}
                      >
                        {p.contrast.wcag}:1
                      </span>
                      <Badge pass={p.contrast.aa} label="AA" />
                      <Badge pass={p.contrast.aaa} label="AAA" />
                    </div>

                    {/* APCA */}
                    <div
                      className="flex items-center gap-1"
                      style={{ marginBottom: '4px' }}
                    >
                      <span style={{ color: '#9ca3af' }}>APCA</span>
                      <span
                        className="font-semibold"
                        style={{
                          fontFamily: 'var(--font-geist-mono, monospace)',
                          fontSize: '12px',
                          color: '#111',
                        }}
                      >
                        Lc&nbsp;{p.contrast.apca}
                      </span>
                    </div>

                    {/* Font sizes */}
                    <div className="flex flex-wrap gap-1">
                      {fontBreakdown.map(({ size, minWeightName }) => (
                        <span
                          key={size}
                          className="inline-flex items-center rounded font-medium"
                          style={{
                            padding: '1px 4px',
                            fontSize: '9px',
                            lineHeight: '14px',
                            fontFamily: 'var(--font-geist-mono, monospace)',
                            backgroundColor: minWeightName ? '#dbeafe' : '#f3f4f6',
                            color: minWeightName ? '#1e40af' : '#c0c0c0',
                            textDecoration: minWeightName ? 'none' : 'line-through',
                          }}
                        >
                          {size}px{minWeightName ? ` ${minWeightName}` : ''}
                        </span>
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
