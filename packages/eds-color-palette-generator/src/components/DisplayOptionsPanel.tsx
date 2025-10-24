import React from 'react'
import { ContrastMethod, ColorFormat } from '@/types'

type DisplayOptionsPanelProps = {
  showContrast: boolean
  showLightnessInputs: boolean
  showGaussianParameters: boolean
  contrastMethod: ContrastMethod
  colorFormat: ColorFormat
  setShowContrast: React.Dispatch<React.SetStateAction<boolean>>
  setShowLightnessInputs: React.Dispatch<React.SetStateAction<boolean>>
  setShowGaussianParameters: React.Dispatch<React.SetStateAction<boolean>>
  setContrastMethod: React.Dispatch<React.SetStateAction<ContrastMethod>>
  setColorFormat: React.Dispatch<React.SetStateAction<ColorFormat>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const DisplayOptionsPanel = ({
  showContrast,
  showLightnessInputs,
  showGaussianParameters,
  contrastMethod,
  colorFormat,
  setShowContrast,
  setShowLightnessInputs,
  setShowGaussianParameters,
  setContrastMethod,
  setColorFormat,
}: DisplayOptionsPanelProps) => {
  // mark intentionally unused props as used for linting
  void colorFormat
  void setColorFormat
  return (
    <fieldset className="p-4 space-y-4">
      <legend className="mb-2 font-medium">Display</legend>

      {/* Colour output format moved to QuickActionsPopover */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showLightnessInputs}
            onChange={(e) => setShowLightnessInputs(e.target.checked)}
            className="accent-current"
          />
          <span>Lightness value inputs</span>
        </label>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={showContrast}
          onChange={(e) => setShowContrast(e.target.checked)}
          className="accent-current"
        />
        <span>Contrast score</span>
      </label>
      {showContrast && (
        <div className="pl-6 mt-3">
          <p className="mb-2 text-sm">Algorithm</p>
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
        <span>Gaussian parameters</span>
      </label>
    </fieldset>
  )
}
