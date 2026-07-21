import { contrast } from '@/utils/color'
import { CATEGORY_GROUPS } from '@/config/categories'
import type { SortOrder, StepData } from '@/utils/contrastPageData'
import { ContrastCell } from './ContrastCell'
import { CopyButton } from './CopyButton'

export function SinglePaletteView({
  displayData,
  mode,
}: {
  displayData: StepData[]
  mode: SortOrder
}) {
  return (
    <>
      {/* ---- Category legend + palette strip (shared 15-col grid) ---- */}
      <div
        className="mb-8"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(15, 1fr)',
          gap: '2px',
        }}
      >
        {mode === 'semantic' &&
          CATEGORY_GROUPS.map((group) => (
            <div
              key={group.label}
              className="text-center"
              style={{
                gridColumn: `span ${group.span}`,
                paddingBottom: '6px',
              }}
            >
              <span style={{ fontSize: '12px', color: '#6b7280' }}>
                {group.label}
              </span>
              <div
                style={{
                  height: '1px',
                  background: '#d1d5db',
                  marginTop: '4px',
                }}
              />
            </div>
          ))}

        {displayData.map((s, i) => {
          const labelColor =
            parseFloat(
              String(
                contrast({
                  foreground: '#ffffff',
                  background: s.hex,
                  algorithm: 'WCAG21',
                  silent: true,
                }),
              ),
            ) >= 3
              ? '#fff'
              : '#000'
          return (
            <div
              key={`strip-${s.step}`}
              className="flex flex-col items-center justify-end cursor-default"
              style={{
                height: '72px',
                backgroundColor: s.hex,
                paddingBottom: '4px',
                borderRadius:
                  i === 0
                    ? '12px 0 0 12px'
                    : i === displayData.length - 1
                      ? '0 12px 12px 0'
                      : undefined,
              }}
              title={`${s.step}${s.role ? `. ${s.role}` : ''}: ${s.hex}`}
            >
              <span
                className="font-bold"
                style={{ fontSize: '11px', color: labelColor, opacity: 0.9 }}
              >
                {s.step}
              </span>
            </div>
          )
        })}
      </div>

      {/* ---- Step detail cards ---- */}
      <div className="flex flex-col" style={{ gap: '12px' }}>
        {displayData.map((s) => {
          const labelColor = s.recommended.color

          return (
            <div
              key={s.step}
              className="rounded-xl overflow-hidden group"
              style={{
                border: '1px solid #e5e7eb',
                background: '#fff',
              }}
            >
              <div
                className="flex items-center justify-between"
                style={{
                  backgroundColor: s.hex,
                  color: labelColor,
                  padding: '12px 20px',
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base font-bold">{s.step}</span>
                  {s.role && (
                    <span style={{ fontSize: '13px', opacity: 0.85 }}>
                      {s.role}
                    </span>
                  )}
                  <span
                    style={{
                      fontFamily: 'var(--font-geist-mono, monospace)',
                      fontSize: '12px',
                      opacity: 0.65,
                    }}
                  >
                    {s.hex}
                  </span>
                  <CopyButton text={s.hex} />
                </div>
              </div>

              <div
                className="grid grid-cols-2"
                style={{ padding: '16px 20px', gap: '16px' }}
              >
                <ContrastCell
                  data={s.recommended}
                  fgColor={s.recommended.color}
                  bgColor={s.hex}
                  label={s.recommended.label}
                />
                <ContrastCell
                  data={s.paletteText}
                  fgColor={s.paletteText.color}
                  bgColor={s.hex}
                  label={s.paletteText.label}
                />
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
