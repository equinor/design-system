import { contrast } from '@/utils/color'
import {
  categoryLabel,
  stepCategoryRuns,
  stepLabel,
  stepRolesText,
} from '@/config/config'
import type { SortOrder, StepData } from '@/utils/contrastPageData'
import { ContrastCell } from './ContrastCell'
import { CopyButton } from './CopyButton'

// Grouped header runs, e.g. Background (1–3), Border (4), …
const CATEGORY_RUNS = stepCategoryRuns()

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
      <div className="mb-8 grid grid-cols-15 gap-0.5">
        {mode === 'semantic' &&
          CATEGORY_RUNS.map((run, i) => (
            <div
              key={`${run.category}-${i}`}
              className="pb-1.5 text-center"
              style={{ gridColumn: `span ${run.span}` }}
            >
              <span className="text-sm text-secondary">
                {categoryLabel(run.category)}
              </span>
              <div className="mt-1 border-t border-default" />
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
              className={[
                'flex h-18 cursor-default flex-col items-center justify-end pb-1',
                i === 0 ? 'rounded-l' : '',
                i === displayData.length - 1 ? 'rounded-r' : '',
              ].join(' ')}
              style={{ backgroundColor: s.hex }}
              title={`${stepLabel(s.step)}: ${s.hex}\n${stepRolesText(s.step)}`}
            >
              {/* Label colour picked for contrast with the swatch */}
              <span
                className="text-sm font-medium opacity-90"
                style={{ color: labelColor }}
              >
                {s.step}
              </span>
            </div>
          )
        })}
      </div>

      {/* ---- Step detail cards ---- */}
      <div className="flex flex-col gap-3">
        {displayData.map((s) => {
          const labelColor = s.recommended.color

          return (
            <div
              key={s.step}
              className="group overflow-hidden rounded border border-muted bg-surface"
            >
              {/* Header in the step's own colour */}
              <div
                className="flex items-center justify-between px-5 py-3"
                style={{ backgroundColor: s.hex, color: labelColor }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base font-medium">{s.step}</span>
                  {s.role && (
                    <span className="text-base opacity-85">{s.role}</span>
                  )}
                  <span className="font-mono text-sm opacity-65">{s.hex}</span>
                  <CopyButton text={s.hex} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 px-5 py-4">
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
