import React from 'react'
import { formatColorsAsTokens } from '../utils/tokenFormatter'
import { generateColorScale } from '../utils/color'

type ColorDefinition = {
  name: string
  hue: string
}

type TokenDownloaderProps = {
  customLightModeValues: number[]
  customDarkModeValues: number[]
  mean: number
  stdDev: number
  onConfigUpload?: (config: ConfigFile) => void
  colors?: ColorDefinition[]
}

type ConfigFile = {
  lightModeValues: number[]
  darkModeValues: number[]
  mean: number
  stdDev: number
  colors?: ColorDefinition[]
}

const TokenDownloader: React.FC<TokenDownloaderProps> = ({
  customLightModeValues,
  customDarkModeValues,
  mean,
  stdDev,
  onConfigUpload = () => {},
  colors = [
    { name: 'accent', hue: '#007079' },
    { name: 'neutral', hue: '#4A4A4A' },
    { name: 'success', hue: '#3FA13D' },
    { name: 'info', hue: '#0084C4' },
    { name: 'warning', hue: '#E57E00' },
    { name: 'danger', hue: '#E20337' },
  ],
}) => {
  const generateColors = () => {
    // Generate light mode colors with specific structure for the tokenFormatter
    const lightColors = {
      accent: generateColorScale(
        colors.find((c) => c.name === 'accent')?.hue || '#007079',
        customLightModeValues,
        mean,
        stdDev,
        'light',
      ),
      neutral: generateColorScale(
        colors.find((c) => c.name === 'neutral')?.hue || '#4A4A4A',
        customLightModeValues,
        mean,
        stdDev,
        'light',
      ),
      success: generateColorScale(
        colors.find((c) => c.name === 'success')?.hue || '#3FA13D',
        customLightModeValues,
        mean,
        stdDev,
        'light',
      ),
      info: generateColorScale(
        colors.find((c) => c.name === 'info')?.hue || '#0084C4',
        customLightModeValues,
        mean,
        stdDev,
        'light',
      ),
      warning: generateColorScale(
        colors.find((c) => c.name === 'warning')?.hue || '#E57E00',
        customLightModeValues,
        mean,
        stdDev,
        'light',
      ),
      danger: generateColorScale(
        colors.find((c) => c.name === 'danger')?.hue || '#E20337',
        customLightModeValues,
        mean,
        stdDev,
        'light',
      ),
    }

    // Generate dark mode colors
    const darkColors = {
      accentDark: generateColorScale(
        colors.find((c) => c.name === 'accent')?.hue || '#007079',
        customDarkModeValues,
        mean,
        stdDev,
        'dark',
      ),
      neutralDark: generateColorScale(
        colors.find((c) => c.name === 'neutral')?.hue || '#435460',
        customDarkModeValues,
        mean,
        stdDev,
        'dark',
      ),
      successDark: generateColorScale(
        colors.find((c) => c.name === 'success')?.hue || '#3FA13D',
        customDarkModeValues,
        mean,
        stdDev,
        'dark',
      ),
      infoDark: generateColorScale(
        colors.find((c) => c.name === 'info')?.hue || '#0084C4',
        customDarkModeValues,
        mean,
        stdDev,
        'dark',
      ),
      warningDark: generateColorScale(
        colors.find((c) => c.name === 'warning')?.hue || '#E57E00',
        customDarkModeValues,
        mean,
        stdDev,
        'dark',
      ),
      dangerDark: generateColorScale(
        colors.find((c) => c.name === 'danger')?.hue || '#E20337',
        customDarkModeValues,
        mean,
        stdDev,
        'dark',
      ),
    }

    return { lightColors, darkColors }
  } // Download color tokens in W3C format
  const handleDownload = () => {
    const { lightColors, darkColors } = generateColors()

    // Format colors as tokens
    const tokenData = formatColorsAsTokens(lightColors, darkColors)

    const blob = new Blob([tokenData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'color-tokens.json'
    document.body.appendChild(a)
    a.click()

    // Clean up
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 0)
  }

  // Download configuration file
  const handleDownloadConfig = () => {
    const config: ConfigFile = {
      lightModeValues: customLightModeValues,
      darkModeValues: customDarkModeValues,
      mean,
      stdDev,
      colors,
    }

    const configData = JSON.stringify(config, null, 2)
    const blob = new Blob([configData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'color-palette-config.json'
    document.body.appendChild(a)
    a.click()

    // Clean up
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 0)
  } // Upload and process configuration file
  const handleConfigUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    const reader = new FileReader()

    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const content = e.target?.result as string
        const config = JSON.parse(content) as ConfigFile

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

        // Send configuration back to parent component
        onConfigUpload({
          ...config,
          // Include colors if they exist in the config
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
  }

  return (
    <div className="token-downloader flex flex-col items-center gap-4 my-8">
      <div className="flex flex-row gap-4">
        <button
          onClick={handleDownload}
          className="px-6 py-3 bg-[#007079] text-white rounded border-none text-base cursor-pointer"
        >
          Download Color Tokens (W3C Format)
        </button>
        <button
          onClick={handleDownloadConfig}
          className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded border-none text-base cursor-pointer"
        >
          Download Configuration
        </button>
      </div>

      <div className="mt-4">
        <label className="flex flex-col items-center px-4 py-3 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600">
          <span className="mb-2">Upload Configuration</span>
          <input
            type="file"
            className="hidden"
            accept=".json"
            onChange={handleConfigUpload}
          />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Select JSON configuration file
          </span>
        </label>
      </div>
    </div>
  )
}

export default TokenDownloader
