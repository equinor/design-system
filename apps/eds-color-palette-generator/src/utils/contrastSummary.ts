import { getStepIndex } from '@/config/helpers'
import { StepDefinition } from '@/config/types'
import { contrast } from '@/utils/color'
import { ContrastMethod } from '@/types'

export interface GeneratedColorScale {
  scale: string[]
  [key: string]: unknown
}

export interface ContrastSummaryResult {
  passed: number
  total: number
  percentage: number
}

export function computeContrastSummary({
  colorScales,
  contrastMethod,
  enabled,
  steps: stepDefs,
}: {
  colorScales: GeneratedColorScale[]
  contrastMethod: ContrastMethod
  enabled: boolean
  /** Live step definitions; their contrastWith requirements drive the summary. */
  steps: StepDefinition[]
}): ContrastSummaryResult {
  if (!enabled) return { passed: 0, total: 0, percentage: 0 }

  let passed = 0
  let total = 0

  colorScales.forEach((colorScale) => {
    const scale = colorScale.scale
    if (!Array.isArray(scale) || scale.length === 0) return

    stepDefs.forEach((stepDef, stepIndex) => {
      const requirements = stepDef.contrastWith || []
      requirements.forEach((req) => {
        const targetIndex = getStepIndex(req.targetStep)(stepDefs)
        if (targetIndex === -1) return
        const fg = scale[stepIndex]
        const bg = scale[targetIndex]
        if (!fg || !bg) return
        const result = contrast({
          foreground: fg,
          background: bg,
          algorithm: contrastMethod,
        })
        const numeric = parseFloat(String(result))
        if (!isNaN(numeric)) {
          total += 1
          const threshold =
            contrastMethod === 'APCA' ? req.lc.value : req.wcag.value
          if (numeric >= threshold) passed += 1
        }
      })
    })
  })

  const percentage = total === 0 ? 0 : (passed / total) * 100
  return { passed, total, percentage }
}
