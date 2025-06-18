'use client'
import { colorPairs } from '@/config'
import { checkContrast } from '@/utils/color'
import Color from 'colorjs.io'
import { useState, useEffect } from 'react'

type ColorScaleProps = {
  colors: string[]
  showContrast?: boolean
  contrastMethod?: 'WCAG21' | 'APCA'
  colorName?: string
}

// Type for color information in OKLCH format
type OklchInfo = {
  l: number // lightness
  c: number // chroma
  h: number // hue
  hex: string // original hex value
  index: number // color step index
}

// Function to determine text color for steps
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

// Convert hex color to OKLCH format
function getOklchInfo(hexColor: string, index: number): OklchInfo {
  try {
    const color = new Color(hexColor)
    const oklch = color.to('oklch')

    return {
      l: parseFloat(oklch.l.toFixed(3)),
      c: parseFloat(oklch.c.toFixed(3)),
      h: parseFloat(oklch.h.toFixed(1)),
      hex: hexColor,
      index: index,
    }
  } catch (error) {
    console.error(`Error converting color ${hexColor} to OKLCH:`, error)
    return {
      l: 0,
      c: 0,
      h: 0,
      hex: hexColor,
      index: index,
    }
  }
}

export function ColorScale({
  colors,
  showContrast = true,
  contrastMethod = 'WCAG21',
  colorName,
}: ColorScaleProps) {
  // State for popover - track which color is showing the popover
  const [activePopover, setActivePopover] = useState<number | null>(null)

  // Effect to handle clicking outside the popover and keyboard events
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close the popover when clicking outside
      if (activePopover !== null) {
        const target = event.target as HTMLElement
        if (!target.closest('.color-scale-item')) {
          setActivePopover(null)
        }
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Close popover when pressing Escape key
      if (event.key === 'Escape' && activePopover !== null) {
        setActivePopover(null)
      }
    }

    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    // Clean up event listeners
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [activePopover]) // Add dependency to ensure effect runs when activePopover changes

  const contrasts = colors.map((color: string, i: number) => {
    const indexOfBackgroundColorThatPairs = colorPairs[i]?.usedOnStep
    if (!indexOfBackgroundColorThatPairs) return null
    const contrastForAllBackgroundPairings = colorPairs[i]?.usedOnStep?.map(
      (colorPair) => {
        const contrastResult = checkContrast(
          color,
          colors[colorPair.stepIndex],
          contrastMethod,
        )
        return contrastResult
      },
    )
    return contrastForAllBackgroundPairings
  })

  return (
    <div className="mb-8">
      {colorName && (
        <h3
          style={{ color: colors[8] }}
          className={`text-left mb-2 font-medium text-lg`}
        >
          {colorName}
        </h3>
      )}
      <div className="grid gap-3 mb-4 grid-cols-14">
        {colors.map((color: string, i: number) => {
          const textColor = getTextColorForStep(colors, i + 1)
          const pairsWithSteps = colorPairs[i]?.usedOnStep
          const oklchInfo = getOklchInfo(color, i)
          const isPopoverActive = activePopover === i

          return (
            <div
              key={'color-step-' + i}
              className={`color-scale-item rounded-lg p-3 transition-transform hover:shadow-lg relative cursor-pointer ${
                !showContrast ? 'aspect-square' : 'min-h-[130px]'
              }`}
              style={{ backgroundColor: color, color: textColor }}
              onClick={() => setActivePopover(isPopoverActive ? null : i)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setActivePopover(isPopoverActive ? null : i)
                }
              }}
              tabIndex={0}
              role="button"
              aria-expanded={isPopoverActive}
              aria-label={`Color ${i + 1}: ${oklchInfo.hex}, Click for details`}
            >
              {/* Add step number label */}
              <span className="absolute top-1 left-2 text-xs font-semibold opacity-70">
                {i + 1}
              </span>

              {/* Color information popover */}
              {isPopoverActive && (
                <div
                  className="absolute z-10 p-3 rounded-md shadow-lg min-w-[180px] -translate-x-1/2 left-1/2 top-full mt-2"
                  style={{
                    backgroundColor:
                      i > colors.length / 2 ? colors[0] : colors[10],
                    color: i > colors.length / 2 ? textColor : colors[0],
                    border: `1px solid ${i > colors.length / 2 ? colors[5] : colors[7]}`,
                  }}
                  onClick={(e) => e.stopPropagation()}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={`color-details-heading-${i}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4
                      id={`color-details-heading-${i}`}
                      className="font-medium"
                    >
                      Color Details
                    </h4>
                    <button
                      className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-black/10 focus:outline-none focus:ring-2"
                      onClick={() => setActivePopover(null)}
                      aria-label="Close details"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Color sample */}
                  <div
                    className="w-full h-6 mb-2 rounded"
                    style={{ backgroundColor: oklchInfo.hex }}
                  ></div>

                  <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-xs items-center">
                    <span className="font-medium">HEX:</span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono">{oklchInfo.hex}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(oklchInfo.hex)
                          // Optional: Show a brief "copied" tooltip
                          alert('Color code copied to clipboard!')
                        }}
                        className="ml-1 p-1 hover:bg-black/10 rounded focus:outline-none focus:ring-1"
                        aria-label="Copy color code"
                        title="Copy to clipboard"
                      >
                        📋
                      </button>
                    </div>
                    <span className="font-medium">Lightness:</span>
                    <span className="font-mono">{oklchInfo.l}</span>
                    <span className="font-medium">Chroma:</span>
                    <span className="font-mono">{oklchInfo.c}</span>
                    <span className="font-medium">Hue:</span>
                    <span className="font-mono">{oklchInfo.h}°</span>
                  </div>
                </div>
              )}

              {/* Contrast info - keep original functionality */}
              {showContrast && (
                <div className="flex flex-col h-full pt-3">
                  <ul className="space-y-1 text-[11px]">
                    {pairsWithSteps?.map((colorPair, colorPairIndex) => {
                      const contrastArray = contrasts[i]
                      const contrastValue =
                        contrastArray && colorPairIndex < contrastArray.length
                          ? contrastArray[colorPairIndex]?.contrastValue
                          : undefined
                      let isContrastValid = false

                      if (contrastValue !== undefined) {
                        if (contrastMethod === 'APCA') {
                          isContrastValid =
                            parseFloat(String(contrastValue)) >=
                            colorPair.lc.value
                        } else {
                          isContrastValid =
                            parseFloat(String(contrastValue)) >=
                            colorPair.wcag.value
                        }
                      }

                      const scoreColor = isContrastValid
                        ? 'text-green-500'
                        : 'text-red-500'
                      return (
                        <li
                          key={`background-pairing-${colorPair.stepIndex}`}
                          className="flex items-center justify-between"
                        >
                          <span>#{colorPair.stepIndex + 1}</span>
                          <span>
                            <strong className={'font-mono ' + scoreColor}>
                              {contrastMethod === 'APCA' &&
                                contrastValue &&
                                `${contrastValue} (${colorPair.lc.value})`}
                              {contrastMethod === 'WCAG21' &&
                                contrastValue &&
                                `${contrastValue}:1 (${colorPair.wcag.value})`}
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
    </div>
  )
}
