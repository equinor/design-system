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
                      contrastMethod === 'APCA'
                        ? contrasts[i][colorPairIndex].contrastValue >=
                          colorPair.lc.value
                        : contrasts[i][colorPairIndex].contrastValue >=
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
                              `${contrasts[i][colorPairIndex].contrastValue} (${colorPair.lc.value})`}
                            {contrastMethod === 'WCAG21' &&
                              `${contrasts[i][colorPairIndex].contrastValue}:1 (${colorPair.wcag.value})`}
                          </strong>
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
  if (stepIndex >= 7 && stepIndex <= 10) {
    return colors[0] // background color
  }

  if (stepIndex === 11) {
    return 'black' // base color
  }

  if (stepIndex >= 12) {
    return colors[10] // contrast text
  }

  return colors[9] // default text
}
