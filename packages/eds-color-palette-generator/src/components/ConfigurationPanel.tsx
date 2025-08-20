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
  mean: number
  stdDev: number
  colors: ColorDefinition[]
  colorFormat: ColorFormat
  onConfigUpload: (config: ConfigFile) => void
  onResetConfiguration: () => void
}

export const ConfigurationPanel = ({
  lightModeValues,
  darkModeValues,
  mean,
  stdDev,
  colors,
  colorFormat,
  onConfigUpload,
  onResetConfiguration,
}: ConfigurationPanelProps) => {
  return (
    <div className="p-6 my-6 border border-neutral-subtle rounded-lg">
      <h3 className="mb-4 font-medium">Configuration</h3>
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() =>
            downloadConfiguration(
              lightModeValues,
              darkModeValues,
              mean,
              stdDev,
              colors,
            )
          }
          className="px-4 py-2 text-sm bg-neutral-medium-default hover:bg-neutral-medium-hover border-none rounded cursor-pointer"
        >
          Download Configuration
        </button>

        <label className="inline-block px-4 py-2 text-sm bg-neutral-medium-default hover:bg-neutral-medium-hover rounded cursor-pointer">
          <span>Upload Configuration</span>
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
                  const config = JSON.parse(content)

                  // Validate config format
                  if (
                    !config.lightModeValues ||
                    !config.darkModeValues ||
                    typeof config.mean !== 'number' ||
                    typeof config.stdDev !== 'number'
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
          onClick={onResetConfiguration}
          className="px-4 py-2 text-sm bg-danger-medium-default hover:bg-danger-medium-hover border-none rounded cursor-pointer"
        >
          Reset Configuration
        </button>
        <button
          onClick={() =>
            downloadColorTokens(
              colors,
              lightModeValues,
              darkModeValues,
              mean,
              stdDev,
              colorFormat,
            )
          }
          className="px-4 py-2 bg-neutral-medium-default hover:bg-neutral-medium-hover rounded border-none text-sm cursor-pointer"
        >
          Download Colour Tokens (W3C Format)
        </button>

        <button
          onClick={() =>
            downloadDesignSystemCSS(colors, mean, stdDev, colorFormat)
          }
          className="px-4 py-2 bg-neutral-medium-default hover:bg-neutral-medium-hover rounded border-none text-sm cursor-pointer"
        >
          Download CSS variables
        </button>
      </div>
    </div>
  )
}
