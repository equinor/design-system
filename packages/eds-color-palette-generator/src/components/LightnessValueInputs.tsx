import React from 'react'

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
  const values = colorScheme === 'light' ? lightModeValues : darkModeValues

  return (
    <div className="grid grid-cols-15 gap-3 mb-2">
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
            className="w-full text-center text-xs p-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
            style={{ maxWidth: '90%' }}
          />
        </div>
      ))}
    </div>
  )
}
