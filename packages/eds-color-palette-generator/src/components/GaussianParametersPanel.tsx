import React from 'react'

type GaussianParametersPanelProps = {
  mean: number
  stdDev: number
  setMean: React.Dispatch<React.SetStateAction<number>>
  setStdDev: React.Dispatch<React.SetStateAction<number>>
}

export const GaussianParametersPanel = ({
  mean,
  stdDev,
  setMean,
  setStdDev,
}: GaussianParametersPanelProps) => {
  return (
    <fieldset className="p-6 space-y-4 border border-neutral-subtle rounded-lg">
      <legend className="mb-2 font-medium">Gaussian Parameters</legend>
      <div className="space-y-4">
        <label className="block">
          <span className="block mb-1 text-sm">Mean (center)</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={mean}
            onChange={(e) => setMean(Number(e.target.value))}
            className="w-full accent-current"
          />
          <span className="text-sm">{mean}</span>
        </label>
        <label className="block">
          <span className="block mb-1 text-sm">Standard deviation</span>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={stdDev}
            onChange={(e) => setStdDev(Number(e.target.value))}
            className="w-full accent-current"
          />
          <span className="text-sm">{stdDev}</span>
        </label>
      </div>
    </fieldset>
  )
}
