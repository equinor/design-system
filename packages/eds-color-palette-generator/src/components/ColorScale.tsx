'use client'
import { colorPairs } from '@/config'
import { checkContrast } from '@/utils/color'

type ColorScaleProps = {
  colors: string[]
  showContrast?: boolean
  contrastMethod?: 'WCAG21' | 'APCA'
}

export function ColorScale({
  colors,
  showContrast = true,
  contrastMethod = 'WCAG21',
}: ColorScaleProps) {
  const contrasts = colors.map((color: string, i: number) => {
    const indexOfBackgroundColorThatPairs = colorPairs[i]?.usedOnStep
    if (!indexOfBackgroundColorThatPairs) return null
    const contrastForAllBackgroundPairings = colorPairs[i]?.usedOnStep?.map(
      (colorPair) => {
        return checkContrast(color, colors[colorPair.stepIndex], contrastMethod)
      },
    )
    return contrastForAllBackgroundPairings
  })

  return (
    <div className="grid gap-3 mb-8 grid-cols-14">
      {colors.map((color: any, i: number) => {
        const textColor = getTextColorForStep(colors, i + 1)

        const pairsWithSteps = colorPairs[i]?.usedOnStep

        return (
          <div
            key={'color-step-' + i}
            className={`rounded-lg p-3 transition-transform hover:scale-105 hover:shadow-lg ${
              !showContrast ? 'aspect-square' : 'min-h-[130px]'
            }`}
            style={{ backgroundColor: color, color: textColor }}
          >
            {showContrast && (
              <div className="flex flex-col h-full">
                <ul className="space-y-1 text-[11px]">
                  {pairsWithSteps?.map((colorPair, colorPairIndex) => {
                    const isContrastValid =
                      contrasts[i][colorPairIndex].contrastValue >=
                      colorPair.wcag.value
                    const scoreColor = isContrastValid
                      ? 'text-green-500'
                      : 'text-red-500'
                    return (
                      <li
                        key={`{background-pairing-${colorPair.stepIndex}`}
                        className="flex items-center justify-between"
                      >
                        <span>#{colorPair.stepIndex + 1}</span>
                        <span>
                          <strong className={'font-mono ' + scoreColor}>
                            {contrastMethod === 'APCA' &&
                              contrasts[i][colorPairIndex].contrastValue}
                            {contrastMethod === 'WCAG21' &&
                              `${contrasts[i][colorPairIndex].contrastValue}:1`}
                          </strong>
                          <span> ({colorPair.wcag.value})</span>
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
function getTextColorForStep(colors: string[], stepIndex: number): string {
  // Steps 1-6 use the text step 9 color.
  // Step 7-10 use the bg color
  // Step 11-12 use the contrast color #fff
  // Step 14 use the bg color

  if (stepIndex <= 6) {
    return colors[9]
  }
  if (stepIndex >= 7 && stepIndex <= 10) {
    return colors[0]
  }
  if (stepIndex >= 14) {
    return colors[0]
  }

  return '#fff'
}
