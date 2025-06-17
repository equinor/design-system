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
    // Create objects with the required structure for formatColorsAsTokens
    const lightColors: {
      accent: string[];
      neutral: string[];
      success: string[];
      info: string[];
      warning: string[];
      danger: string[];
      [key: string]: string[];
    } = {
      accent: [],
      neutral: [],
      success: [],
      info: [],
      warning: [],
      danger: [],
    };
    
    const darkColors: {
      accentDark: string[];
      neutralDark: string[];
      successDark: string[];
      infoDark: string[];
      warningDark: string[];
      dangerDark: string[];
      [key: string]: string[];
    } = {
      accentDark: [],
      neutralDark: [],
      successDark: [],
      infoDark: [],
      warningDark: [],
      dangerDark: [],
    };

    // Add any custom colors from our array to these objects
    colors.forEach((colorDef) => {
      try {
        // For standard colors that match the expected keys, update directly
        if (lightColors[colorDef.name] !== undefined) {
          lightColors[colorDef.name] = generateColorScale(
            colorDef.hue,
            customLightModeValues,
            mean,
            stdDev,
            'light'
          );
          
          // The dark mode version appends "Dark" to the name
          const darkKey = `${colorDef.name}Dark`;
          if (darkColors[darkKey] !== undefined) {
            darkColors[darkKey] = generateColorScale(
              colorDef.hue,
              customDarkModeValues,
              mean,
              stdDev,
              'dark'
            );
          }
        } else {
          // For custom colors not in the standard keys, add them anyway
          // (these won't be used by formatColorsAsTokens but will be in the configuration)
          lightColors[colorDef.name] = generateColorScale(
            colorDef.hue,
            customLightModeValues,
            mean,
            stdDev,
            'light'
          );
          darkColors[`${colorDef.name}Dark`] = generateColorScale(
            colorDef.hue,
            customDarkModeValues,
            mean,
            stdDev,
            'dark'
          );
        }
      } catch (error) {
        console.error(`Error generating colors for ${colorDef.name}:`, error);
        // Add fallback in case of error
        const fallbackLight = Array(customLightModeValues.length + 3).fill('#808080');
        const fallbackDark = Array(customDarkModeValues.length + 3).fill('#303030');
        
        if (lightColors[colorDef.name] !== undefined) {
          lightColors[colorDef.name] = fallbackLight;
          darkColors[`${colorDef.name}Dark`] = fallbackDark;
        }
      }
    });
    
    // Ensure we have all the required colors with fallbacks if any are missing
    const defaultHue = '#808080';
    const requiredColors = ['accent', 'neutral', 'success', 'info', 'warning', 'danger'];
    
    requiredColors.forEach(color => {
      if (!lightColors[color] || lightColors[color].length === 0) {
        console.warn(`Missing required color: ${color}, using fallback`);
        lightColors[color] = generateColorScale(
          defaultHue,
          customLightModeValues,
          mean,
          stdDev,
          'light'
        );
      }
      
      const darkKey = `${color}Dark`;
      if (!darkColors[darkKey] || darkColors[darkKey].length === 0) {
        console.warn(`Missing required dark color: ${darkKey}, using fallback`);
        darkColors[darkKey] = generateColorScale(
          defaultHue,
          customDarkModeValues,
          mean,
          stdDev,
          'dark'
        );
      }
    });

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
