import React from 'react'
import { ColorDefinition, ConfigFile } from '@/types'
import {
  downloadColorTokens,
  downloadConfiguration,
} from '@/utils/configurationUtils'

type ConfigurationPanelProps = {
  customLightModeValues: number[]
  customDarkModeValues: number[]
  mean: number
  stdDev: number
  colors: ColorDefinition[]
  onConfigUpload: (config: ConfigFile) => void
}

export const ConfigurationPanel = ({
  customLightModeValues,
  customDarkModeValues,
  mean,
  stdDev,
  colors,
  onConfigUpload,
}: ConfigurationPanelProps) => {
  return (
    <div className="my-6 p-6 border border-gray-200 rounded-lg dark:border-gray-800">
      <h3 className="mb-4 font-medium">Configuration</h3>
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() =>
            downloadConfiguration(
              customLightModeValues,
              customDarkModeValues,
              mean,
              stdDev,
              colors,
            )
          }
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded border-none text-sm cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Download Configuration
        </button>

        <label className="inline-block px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 text-sm">
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
              customLightModeValues,
              customDarkModeValues,
              mean,
              stdDev,
            )
          }
          className="px-4 py-2 bg-[#007079] text-white rounded border-none text-sm cursor-pointer hover:bg-[#005f66]"
        >
          Download Color Tokens (W3C Format)
        </button>
      </div>
    </div>
  )
}
