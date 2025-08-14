import React from 'react'
import { ContrastMethod } from '@/types'

type DisplayOptionsPanelProps = {
  showContrast: boolean
  showLightnessInputs: boolean
  showGaussianParameters: boolean
  contrastMethod: ContrastMethod
  setShowContrast: React.Dispatch<React.SetStateAction<boolean>>
  setShowLightnessInputs: React.Dispatch<React.SetStateAction<boolean>>
  setShowGaussianParameters: React.Dispatch<React.SetStateAction<boolean>>
  setContrastMethod: React.Dispatch<React.SetStateAction<ContrastMethod>>
}

export const DisplayOptionsPanel = ({
  showContrast,
  showLightnessInputs,
  showGaussianParameters,
  contrastMethod,
  setShowContrast,
  setShowLightnessInputs,
  setShowGaussianParameters,
  setContrastMethod,
}: DisplayOptionsPanelProps) => {
  return (
    <fieldset className="p-6 mb-4 space-y-4 border border-gray-200 rounded-lg dark:border-gray-800">
      <legend className="mb-2 font-medium">Display Options</legend>
      <div className="space-y-3">
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

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={showContrast}
          onChange={(e) => setShowContrast(e.target.checked)}
          className="accent-current"
        />
        <span>Show contrast information</span>
      </label>
      {showContrast && (
        <div className="pl-6 mt-3">
          <p className="mb-2 text-sm">Contrast calculation method</p>
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
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={showGaussianParameters}
          onChange={(e) => setShowGaussianParameters(e.target.checked)}
          className="accent-current"
        />
        <span>Show Gaussian parameters</span>
      </label>
    </fieldset>
  )
}
