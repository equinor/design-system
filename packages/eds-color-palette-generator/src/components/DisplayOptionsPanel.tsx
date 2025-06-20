import React from 'react'
import { ContrastMethod } from '@/types'

type DisplayOptionsPanelProps = {
  showContrast: boolean
  showLightnessInputs: boolean
  contrastMethod: ContrastMethod
  setShowContrast: React.Dispatch<React.SetStateAction<boolean>>
  setShowLightnessInputs: React.Dispatch<React.SetStateAction<boolean>>
  setContrastMethod: React.Dispatch<React.SetStateAction<ContrastMethod>>
  resetLightnessValues: () => void
}

export const DisplayOptionsPanel = ({
  showContrast,
  showLightnessInputs,
  contrastMethod,
  setShowContrast,
  setShowLightnessInputs,
  setContrastMethod,
  resetLightnessValues,
}: DisplayOptionsPanelProps) => {
  return (
    <fieldset className="p-6 space-y-4 border border-gray-200 rounded-lg dark:border-gray-800">
      <legend className="mb-2 font-medium">Display Options</legend>
      <div className="space-y-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showContrast}
            onChange={(e) => setShowContrast(e.target.checked)}
            className="accent-current"
          />
          <span>Show contrast information</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showLightnessInputs}
            onChange={(e) => setShowLightnessInputs(e.target.checked)}
            className="accent-current"
          />
          <span>Show lightness value inputs</span>
        </label>
      </div>

      {showContrast && (
        <div className="mt-3 pl-6">
          <p className="mb-2 text-sm">Contrast calculation method:</p>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="contrastMethod"
                value="WCAG21"
                checked={contrastMethod === 'WCAG21'}
                onChange={() => setContrastMethod('WCAG21')}
                className="accent-current"
              />
              <span>WCAG 2.1</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="contrastMethod"
                value="APCA"
                checked={contrastMethod === 'APCA'}
                onChange={() => setContrastMethod('APCA')}
                className="accent-current"
              />
              <span>APCA</span>
            </label>
          </div>
        </div>
      )}
      <div className="mt-4">
        <button
          onClick={resetLightnessValues}
          className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded"
        >
          Reset lightness values
        </button>
      </div>
    </fieldset>
  )
}
