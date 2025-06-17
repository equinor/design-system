'use client'

import { generateColorScale } from '../utils/color'
import { useState } from 'react'
import TokenDownloader from '@/components/TokenDownloader'
import { ColorScale } from '@/components/ColorScale'
import { lightnessValuesInDarkMode, lightnessValuesInLightMode } from '@/config'
import { useColorScheme } from '@/context/ColorSchemeContext'

// Define a type for color objects
type ColorDefinition = {
  name: string
  hue: string
  displayName?: string
}

export default function App() {
  const [mean, setMean] = useState(0.6)
  const [stdDev, setStdDev] = useState(2)
  const { colorScheme } = useColorScheme()
  const [showContrast, setShowContrast] = useState(false)
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
    { name: 'accent', hue: '#007079', displayName: 'Accent' },
    { name: 'neutral', hue: '#4A4A4A', displayName: 'Neutral' },
    { name: 'success', hue: '#3FA13D', displayName: 'Success' },
    { name: 'info', hue: '#0084C4', displayName: 'Info' },
    { name: 'warning', hue: '#E57E00', displayName: 'Warning' },
    { name: 'danger', hue: '#E20337', displayName: 'Danger' },
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
      <h1 className="mb-8 text-4xl text-black dark:text-white">
        Accessible UI Color Palette
      </h1>
      <div className="max-w-3xl p-6 mx-auto mb-12 ">
        <div className="grid gap-6 md:grid-cols-2">
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

      {/* Color management UI */}
      <div className="max-w-3xl p-6 mx-auto mb-12">
        <h2 className="mb-4 text-2xl font-medium">Manage Colors</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Hue</th>
                <th className="p-2 text-left">Preview</th>
                <th className="p-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {colors.map((color) => (
                <tr
                  key={color.name}
                  className="border-b border-gray-200 dark:border-gray-800"
                >
                  <td className="p-2">
                    <input
                      type="text"
                      className="w-full p-1 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
                      value={color.displayName || color.name}
                      onChange={(e) => {
                        const updatedColors = colors.map((c) =>
                          c.name === color.name
                            ? { ...c, displayName: e.target.value }
                            : c,
                        )
                        setColors(updatedColors)
                      }}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      className="w-full p-1 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
                      value={color.hue}
                      onChange={(e) =>
                        updateColorHue(color.name, e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2">
                    <div
                      className="w-8 h-8 rounded"
                      style={{ backgroundColor: color.hue }}
                    ></div>
                  </td>
                  <td className="p-2 text-right">
                    <button
                      className="px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-700"
                      onClick={() => removeColor(color.name)}
                      disabled={colors.length <= 1}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <button
            className="px-3 py-1 text-sm text-white bg-green-500 rounded hover:bg-green-700"
            onClick={() => {
              const newName = `color-${colors.length + 1}`
              addColor({
                name: newName,
                hue: '#3B82F6',
                displayName: `Color ${colors.length + 1}`,
              })
            }}
          >
            Add New Color
          </button>
        </div>
      </div>

      <div className="grid gap-3 mb-2 grid-cols-14">
        <div className="col-span-2 border-b border-gray-200 dark:border-gray-800">
          background (1-2)
        </div>
        <div className="col-span-3 pb-2 border-b border-gray-200 dark:border-gray-800">
          surface (3-5)
        </div>
        <div className="col-span-3 border-b border-gray-200 dark:border-gray-800">
          border (6-8)
        </div>
        <div className="col-span-3 border-b border-gray-200 dark:border-gray-800">
          text (9-11)
        </div>
        <div className="col-span-3 border-b border-gray-200 dark:border-gray-800">
          base (12-14)
        </div>
      </div>

      {/* Add lightness value inputs */}
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

      <div className={`grid grid-cols-14 gap-3 mb-4 sticky top-0 z-10 `}>
        {Array.from({ length: 14 }).map((_, index) => (
          <div key={index} className="flex items-center justify-center">
            {index + 1}
          </div>
        ))}
      </div>

      {/* Render color scales dynamically */}
      {colorScales.map((colorData) => (
        <ColorScale
          key={colorData.name}
          colors={colorData.scale}
          showContrast={showContrast}
          contrastMethod={contrastMethod}
          colorName={colorData.displayName || colorData.name}
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
          get more chroma on the right half
        </p>
        <p>
          You can customize the lightness value for each step in the scale using
          the input fields above each column. The values range from 0 to 1,
          where 0 is black and 1 is white.
        </p>
        <p>
          You can now also add, edit, and remove colors from the palette using
          the color management section.
        </p>
      </section>
    </div>
  )
}
