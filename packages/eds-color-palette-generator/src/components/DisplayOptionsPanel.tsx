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
  return (
    <fieldset className="p-6 mb-4 space-y-4 border border-gray-200 rounded-lg dark:border-gray-800">
      <legend className="mb-2 font-medium">Options</legend>

      <div className="space-y-3">
        <p className="text-sm font-medium">Colour output format</p>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="colorFormat"
              value="OKLCH"
              checked={colorFormat === 'OKLCH'}
              onChange={() => setColorFormat('OKLCH')}
              className="accent-current"
            />
            <span>OKLCH</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="colorFormat"
              value="HEX"
              checked={colorFormat === 'HEX'}
              onChange={() => setColorFormat('HEX')}
              className="accent-current"
            />
            <span>HEX</span>
          </label>
        </div>
      </div>
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
