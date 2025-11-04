import React from 'react'

type GaussianParametersPanelProps = {
  meanLight: number
  stdDevLight: number
  setMeanLight: React.Dispatch<React.SetStateAction<number>>
  setStdDevLight: React.Dispatch<React.SetStateAction<number>>
  meanDark: number
  stdDevDark: number
  setMeanDark: React.Dispatch<React.SetStateAction<number>>
  setStdDevDark: React.Dispatch<React.SetStateAction<number>>
}

export const GaussianParametersPanel = ({
  meanLight,
  stdDevLight,
  setMeanLight,
  setStdDevLight,
  meanDark,
  stdDevDark,
  setMeanDark,
  setStdDevDark,
}: GaussianParametersPanelProps) => {
  return (
    <fieldset className="p-6 space-y-4 border border-neutral-subtle rounded-lg">
      <legend className="mb-2 font-medium">Gaussian Parameters</legend>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h5 className="mb-2 text-sm font-medium">Light mode</h5>
          <label className="block">
            <span className="block mb-1 text-sm">Mean (center)</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={meanLight}
              onChange={(e) => setMeanLight(Number(e.target.value))}
              className="w-full accent-current"
            />
            <span className="text-sm">{meanLight}</span>
          </label>
          <label className="block mt-3">
            <span className="block mb-1 text-sm">Standard deviation</span>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={stdDevLight}
              onChange={(e) => setStdDevLight(Number(e.target.value))}
              className="w-full accent-current"
            />
            <span className="text-sm">{stdDevLight}</span>
          </label>
        </div>
        <div>
          <h5 className="mb-2 text-sm font-medium">Dark mode</h5>
          <label className="block">
            <span className="block mb-1 text-sm">Mean (center)</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={meanDark}
              onChange={(e) => setMeanDark(Number(e.target.value))}
              className="w-full accent-current"
            />
            <span className="text-sm">{meanDark}</span>
          </label>
          <label className="block mt-3">
            <span className="block mb-1 text-sm">Standard deviation</span>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={stdDevDark}
              onChange={(e) => setStdDevDark(Number(e.target.value))}
              className="w-full accent-current"
            />
            <span className="text-sm">{stdDevDark}</span>
          </label>
        </div>
      </div>
    </fieldset>
  )
}
