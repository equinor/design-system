import { PALETTE_STEPS } from '@/config/config'
import { getStepIndex } from '@/config/helpers'
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
}: {
  colorScales: GeneratedColorScale[]
  contrastMethod: ContrastMethod
  enabled: boolean
}): ContrastSummaryResult {
  if (!enabled) return { passed: 0, total: 0, percentage: 0 }

  let passed = 0
  let total = 0

  colorScales.forEach((colorScale) => {
    const steps = colorScale.scale
    if (!Array.isArray(steps) || steps.length === 0) return

    PALETTE_STEPS.forEach((stepDef, stepIndex) => {
      const requirements = stepDef.contrastWith || []
      requirements.forEach((req) => {
        const targetIndex = getStepIndex(req.targetStep)(PALETTE_STEPS)
        if (targetIndex === -1) return
        const fg = steps[stepIndex]
        const bg = steps[targetIndex]
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
