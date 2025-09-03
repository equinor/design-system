import React from 'react'
import { ColorDefinition, ConfigFile, ColorFormat } from '@/types'
import {
  downloadColorTokens,
  downloadConfiguration,
  downloadDesignSystemCSS,
} from '@/utils/configurationUtils'

type ConfigurationPanelProps = {
  lightModeValues: number[]
  darkModeValues: number[]
  meanLight: number
  stdDevLight: number
  meanDark: number
  stdDevDark: number
  colors: ColorDefinition[]
  colorFormat: ColorFormat
  onConfigUpload: (config: ConfigFile) => void
}

export const ConfigurationPanel = ({
  lightModeValues,
  darkModeValues,
  meanLight,
  stdDevLight,
  meanDark,
  stdDevDark,
  colors,
  colorFormat,
  onConfigUpload,
}: ConfigurationPanelProps) => {
  return (
    <div className="p-6 my-6 border border-neutral-subtle rounded-lg">
      <h3 className="mb-4 font-medium"></h3>
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() =>
            downloadConfiguration(
              lightModeValues,
              darkModeValues,
              meanLight,
              stdDevLight,
              meanDark,
              stdDevDark,
              colors,
            )
          }
          className="px-4 py-2 text-sm bg-neutral-medium-default hover:bg-neutral-medium-hover border-none rounded cursor-pointer"
        >
          Download configuration
        </button>

        <label className="inline-block px-4 py-2 text-sm bg-neutral-medium-default hover:bg-neutral-medium-hover rounded cursor-pointer">
          <span>Upload configuration</span>
          <input
            type="file"
            className="hidden"
            accept=".json"
            onChange={(event) => {
              const files = event.target.files
              if (!files || files.length === 0) return

              const file = files[0]
              const reader = new FileReader()

              reader.onload = (e) => {
                try {
                  const content = e.target?.result as string
                  let config = JSON.parse(content)
                  // Backwards compatibility: map legacy mean/stdDev to new fields
                  if (
                    typeof config.mean === 'number' &&
                    typeof config.stdDev === 'number' &&
                    (config.meanLight === undefined ||
                      config.stdDevLight === undefined ||
                      config.meanDark === undefined ||
                      config.stdDevDark === undefined)
                  ) {
                    config = {
                      ...config,
                      meanLight: config.mean,
                      stdDevLight: config.stdDev,
                      meanDark: config.mean,
                      stdDevDark: config.stdDev,
                    }
                  }

                  // Validate config format
                  if (
                    !config.lightModeValues ||
                    !config.darkModeValues ||
                    typeof config.meanLight !== 'number' ||
                    typeof config.stdDevLight !== 'number' ||
                    typeof config.meanDark !== 'number' ||
                    typeof config.stdDevDark !== 'number'
                  ) {
                    alert('Invalid configuration file format')
                    return
                  }

                  // Validate colors field
                  if (
                    !Array.isArray(config.colors) ||
                    !config.colors.every(
                      (color: ColorDefinition) =>
                        typeof color.name === 'string' &&
                        typeof color.hex === 'string',
                    )
                  ) {
                    alert('Invalid colors field in configuration file')
                    return
                  }
                  // Update with configuration
                  onConfigUpload({
                    ...config,
                    colors: config.colors || colors,
                  })
                } catch (error) {
                  console.error('Error parsing configuration file:', error)
                  alert('Could not parse configuration file')
                }
              }

              reader.readAsText(file)

              // Reset the input
              event.target.value = ''
            }}
          />
        </label>
        <button
          onClick={() =>
            downloadColorTokens(
              colors,
              lightModeValues,
              darkModeValues,
              meanLight,
              stdDevLight,
              meanDark,
              stdDevDark,
              colorFormat,
            )
          }
          className="px-4 py-2 bg-neutral-medium-default hover:bg-neutral-medium-hover rounded border-none text-sm cursor-pointer"
        >
          Download colour tokens (W3C Format)
        </button>

        <button
          onClick={() =>
            downloadDesignSystemCSS(
              colors,
              meanLight,
              stdDevLight,
              meanDark,
              stdDevDark,
              colorFormat,
            )
          }
          className="px-4 py-2 bg-neutral-medium-default hover:bg-neutral-medium-hover rounded border-none text-sm cursor-pointer"
        >
          Download CSS variables
        </button>
      </div>
    </div>
  )
}
