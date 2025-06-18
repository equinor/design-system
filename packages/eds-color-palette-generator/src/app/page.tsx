'use client'

import { generateColorScale } from '../utils/color'
import { useState } from 'react'
import TokenDownloader from '@/components/TokenDownloader'
import { ColorScale } from '@/components/ColorScale'
import { lightnessValuesInDarkMode, lightnessValuesInLightMode } from '@/config'
import { useColorScheme } from '@/context/ColorSchemeContext'
import { ThemeToggle } from '@/components/ThemeToggle'

// Define a type for color objects
type ColorDefinition = {
  name: string
  hue: string
}

export default function App() {
  const [mean, setMean] = useState(0.6)
  const [stdDev, setStdDev] = useState(2)
  const { colorScheme } = useColorScheme()
  const [showContrast, setShowContrast] = useState(false)
  const [showLightnessInputs, setShowLightnessInputs] = useState(false)
  const [showConfigPanel, setShowConfigPanel] = useState(false)
  const [contrastMethod, setContrastMethod] = useState<'WCAG21' | 'APCA'>(
    'APCA',
  )

  // Add state for custom lightness values
  const [customLightModeValues, setCustomLightModeValues] = useState<number[]>(
    lightnessValuesInLightMode,
  )
  const [customDarkModeValues, setCustomDarkModeValues] = useState<number[]>(
    lightnessValuesInDarkMode,
  )

  // Define colors in an array for easier management
  const [colors, setColors] = useState<ColorDefinition[]>([
    { name: 'accent', hue: '#007079' },
    { name: 'neutral', hue: '#4A4A4A' },
    { name: 'success', hue: '#3FA13D' },
    { name: 'info', hue: '#0084C4' },
    { name: 'warning', hue: '#E57E00' },
    { name: 'danger', hue: '#E20337' },
  ])

  // Function to add a new color
  const addColor = (newColor: ColorDefinition) => {
    setColors([...colors, newColor])
  }

  // Function to remove a color
  const removeColor = (colorName: string) => {
    setColors(colors.filter((color) => color.name !== colorName))
  }

  // Function to update a color's hue
  const updateColorHue = (colorName: string, newHue: string) => {
    setColors(
      colors.map((color) =>
        color.name === colorName ? { ...color, hue: newHue } : color,
      ),
    )
  }

  // Update a specific lightness value
  const updateLightnessValue = (index: number, value: number) => {
    if (colorScheme === 'light') {
      const newValues = [...customLightModeValues]
      newValues[index] = value
      setCustomLightModeValues(newValues)
    } else {
      const newValues = [...customDarkModeValues]
      newValues[index] = value
      setCustomDarkModeValues(newValues)
    }
  }

  // Reset lightness values to defaults
  const resetLightnessValues = () => {
    setCustomLightModeValues(lightnessValuesInLightMode)
    setCustomDarkModeValues(lightnessValuesInDarkMode)
  }

  // Handle configuration upload
  const handleConfigUpload = (config: {
    lightModeValues: number[]
    darkModeValues: number[]
    mean: number
    stdDev: number
    colors?: ColorDefinition[]
  }) => {
    setCustomLightModeValues(config.lightModeValues)
    setCustomDarkModeValues(config.darkModeValues)
    setMean(config.mean)
    setStdDev(config.stdDev)
    if (config.colors) {
      setColors(config.colors)
    }
  }

  // Generate color scales for each color
  const colorScales = colors.map((color) => ({
    ...color,
    scale: generateColorScale(
      color.hue,
      colorScheme === 'light' ? customLightModeValues : customDarkModeValues,
      mean,
      stdDev,
      colorScheme,
    ),
  }))

  return (
    <div
      data-theme={colorScheme}
      className="min-h-screen text-black bg-white App dark:text-white dark:bg-black"
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl text-black dark:text-white">
          Accessible UI Color Palette
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowConfigPanel(!showConfigPanel)}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200 transition-colors dark:bg-gray-800 dark:hover:bg-gray-700"
            title="Edit configuration"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span>Edit config</span>
          </button>
          <ThemeToggle />
        </div>
      </div>

      {showConfigPanel && (
        <div className="max-w-3xl p-6 mx-auto mb-12 ">
          {/* Color management UI with CSS Grid */}
          <div className="max-w-3xl p-6 mx-auto mb-12">
            {/* Header Row */}
            <div className="grid grid-cols-[1fr_1fr_auto] gap-4 mb-2 px-2 border-b border-gray-200 dark:border-gray-800 pb-2 font-medium">
              <div className="text-left">Name</div>
              <div className="text-left">Colour</div>
              <div className="text-right">Action</div>
            </div>

            {/* Color Rows */}
            <div className="space-y-2">
              {colors.map((color) => (
                <div
                  key={color.name}
                  className="grid grid-cols-[1fr_1fr_auto] gap-4 items-center p-2 border-b border-gray-200 dark:border-gray-800"
                >
                  {/* Name Field */}
                  <div>
                    <input
                      type="text"
                      className="w-full p-2 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
                      value={color.name}
                      onChange={(e) => {
                        const updatedColors = colors.map((c) =>
                          c === color ? { ...c, name: e.target.value } : c,
                        )
                        setColors(updatedColors)
                      }}
                    />
                  </div>

                  {/* Color Picker */}
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      className="w-8 h-8 cursor-pointer border border-gray-300 dark:border-gray-700 rounded"
                      value={color.hue}
                      onChange={(e) =>
                        updateColorHue(color.name, e.target.value)
                      }
                    />
                  </div>

                  {/* Actions */}
                  <div className="text-right">
                    <button
                      className="px-3 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-700"
                      onClick={() => removeColor(color.name)}
                      disabled={colors.length <= 1}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Color Button */}
            <div className="text-left mt-4">
              <button
                className="px-4 py-2 text-sm text-white bg-green-500 rounded hover:bg-green-700"
                onClick={() => {
                  // Generate a random color in hex format
                  const randomColor =
                    '#' +
                    Math.floor(Math.random() * 16777215)
                      .toString(16)
                      .padStart(6, '0')
                  addColor({
                    name: `Color ${colors.length + 1}`,
                    hue: randomColor,
                  })
                }}
              >
                Add New Color
              </button>
            </div>
          </div>
          <div className="grid gap-6 mb-8 md:grid-cols-2">
            <fieldset className="p-6 space-y-4 border border-gray-200 rounded-lg dark:border-gray-800">
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

            <fieldset className="p-6 space-y-4 border border-gray-200 rounded-lg dark:border-gray-800">
              <legend className="mb-2 font-medium">Display Options</legend>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showContrast}
                    onChange={(e) => setShowContrast(e.target.checked)}
                    className="accent-current"
                  />
                  <span>Show contrast information</span>
                </label>

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

              {showContrast && (
                <div className="mt-3 pl-6">
                  <p className="mb-2 text-sm">Contrast calculation method:</p>
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
              <div className="mt-4">
                <button
                  onClick={resetLightnessValues}
                  className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded"
                >
                  Reset lightness values
                </button>
              </div>
            </fieldset>
          </div>
        </div>
      )}
      <div className="sticky top-0 z-10 bg-white dark:bg-black">
        <div className="grid gap-3 mb-2 grid-cols-14">
          <div className="col-span-2 border-b border-gray-300 dark:border-gray-800">
            background
          </div>
          <div className="col-span-3 pb-2 border-b border-gray-300 dark:border-gray-800">
            surface
          </div>
          <div className="col-span-3 border-b border-gray-300 dark:border-gray-800">
            border
          </div>
          <div className="col-span-3 border-b border-gray-300 dark:border-gray-800">
            text
          </div>
          <div className="col-span-3 border-b border-gray-300 dark:border-gray-800">
            base
          </div>
        </div>

        <div className={`grid grid-cols-14 gap-3 mb-4 `}>
          {Array.from({ length: 14 }).map((_, index) => (
            <div key={index} className="flex items-center justify-center">
              {index + 1}
            </div>
          ))}
        </div>
      </div>
      {/* Add lightness value inputs - conditionally rendered based on showLightnessInputs */}
      {showLightnessInputs && (
        <div className="grid grid-cols-14 gap-3 mb-2">
          {(colorScheme === 'light'
            ? customLightModeValues
            : customDarkModeValues
          ).map((value, index) => (
            <div
              key={`lightness-${index}`}
              className="flex flex-col items-center"
            >
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={value}
                onChange={(e) =>
                  updateLightnessValue(index, Number(e.target.value))
                }
                className="w-full text-center text-xs p-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
                style={{ maxWidth: '90%' }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Render color scales dynamically */}
      {colorScales.map((colorData) => (
        <ColorScale
          key={colorData.name}
          colors={colorData.scale}
          showContrast={showContrast}
          contrastMethod={contrastMethod}
          colorName={colorData.name}
        />
      ))}

      <TokenDownloader
        customLightModeValues={customLightModeValues}
        customDarkModeValues={customDarkModeValues}
        mean={mean}
        stdDev={stdDev}
        onConfigUpload={handleConfigUpload}
        colors={colors}
      />
      <section style={{ maxWidth: '500px', margin: '0 auto 48px' }}>
        <p>
          The generator is using a gaussian function to calculate chroma based
          on a predefined lightness for each step. We provide sensible defaults
          to mean and standard deviation, but also let you customize it to get
          the optimal result for you.
        </p>
        <p>
          We set mean to 0.6 as the initial value because we want to move the
          center of chroma in the gaussian curve a bit to the right so that we
          get more chroma on the right half.
        </p>
        <p>
          You can customize the lightness value for each step in the scale using
          the input fields above each column. The values range from 0 to 1
        </p>
        <p>
          You can now also add, edit, and remove colors from the palette using
          the color management section.
        </p>
      </section>
    </div>
  )
}
