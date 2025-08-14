import React from 'react'
import { ColorDefinition, ConfigFile } from '@/types'
import {
  downloadColorTokens,
  downloadConfiguration,
} from '@/utils/configurationUtils'

type ConfigurationPanelProps = {
  lightModeValues: number[]
  darkModeValues: number[]
  mean: number
  stdDev: number
  colors: ColorDefinition[]
  onConfigUpload: (config: ConfigFile) => void
  onResetConfiguration: () => void
}

export const ConfigurationPanel = ({
  lightModeValues,
  darkModeValues,
  mean,
  stdDev,
  colors,
  onConfigUpload,
  onResetConfiguration,
}: ConfigurationPanelProps) => {
  return (
    <div className="p-6 my-6 border border-gray-200 rounded-lg dark:border-gray-800">
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
          className="px-4 py-2 text-sm text-black bg-gray-200 border-none rounded cursor-pointer dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Download Configuration
        </button>

        <label className="inline-block px-4 py-2 text-sm text-black bg-gray-200 rounded cursor-pointer dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600">
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
          onClick={() =>
            downloadColorTokens(
              colors,
              lightModeValues,
              darkModeValues,
              mean,
              stdDev,
            )
          }
          className="px-4 py-2 bg-[#007079] text-white rounded border-none text-sm cursor-pointer hover:bg-[#005f66]"
        >
          Download Colour Tokens (W3C Format)
        </button>

        <button
          onClick={onResetConfiguration}
          className="px-4 py-2 text-sm text-white bg-red-600 border-none rounded cursor-pointer hover:bg-red-700"
        >
          Reset Configuration
        </button>
      </div>
    </div>
  )
}
