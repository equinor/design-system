import React from 'react'
import { useIsMounted } from '@equinor/eds-utils'

type LightnessValueInputsProps = {
  colorScheme: 'light' | 'dark'
  lightModeValues: number[]
  darkModeValues: number[]
  updateLightnessValue: (index: number, value: number) => void
}

export const LightnessValueInputs = ({
  colorScheme,
  lightModeValues,
  darkModeValues,
  updateLightnessValue,
}: LightnessValueInputsProps) => {
  const isMounted = useIsMounted()
  const values = colorScheme === 'light' ? lightModeValues : darkModeValues

  if (!isMounted) {
    return null
  }

  return (
    <div
      className="grid gap-3 mb-3 px-4"
      style={{
        gridTemplateColumns: `repeat(${values.length}, minmax(0, 1fr))`,
      }}
    >
      {values.map((value, index) => (
        <div key={`lightness-${index}`} className="flex flex-col items-center">
          <input
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={value}
            onChange={(e) =>
              updateLightnessValue(index, Number(e.target.value))
            }
            className="w-full p-1 text-xs text-center bg-input border border-input rounded"
            style={{ maxWidth: '90%' }}
            aria-label={`Lightness value ${index + 1}`}
            inputMode="decimal"
          />
        </div>
      ))}
    </div>
  )
}
