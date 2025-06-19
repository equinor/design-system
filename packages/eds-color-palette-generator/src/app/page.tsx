'use client'

import { generateColorScale } from '../utils/color'
import { useState } from 'react'
import { ColorScale } from '@/components/ColorScale'
import { lightnessValuesInDarkMode, lightnessValuesInLightMode } from '@/config'
import { useColorScheme } from '@/context/ColorSchemeContext'
import { HeaderPanel } from '@/components/HeaderPanel'
import { ColorManagement } from '@/components/ColorManagement'
import { GaussianParametersPanel } from '@/components/GaussianParametersPanel'
import { DisplayOptionsPanel } from '@/components/DisplayOptionsPanel'
import { ConfigurationPanel } from '@/components/ConfigurationPanel'
import { LightnessValueInputs } from '@/components/LightnessValueInputs'
import { ColorScalesHeader } from '@/components/ColorScalesHeader'
import { ColorDefinition, ConfigFile, ContrastMethod } from '@/types'

export default function App() {
  const [mean, setMean] = useState(0.6)
  const [stdDev, setStdDev] = useState(2)
  const { colorScheme } = useColorScheme()
  const [showContrast, setShowContrast] = useState(false)
  const [showLightnessInputs, setShowLightnessInputs] = useState(false)
  const [showConfigPanel, setShowConfigPanel] = useState(false)
  const [contrastMethod, setContrastMethod] = useState<ContrastMethod>('APCA')

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
  const handleConfigUpload = (config: ConfigFile) => {
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
      className="text-black bg-white dark:text-white dark:bg-black p-6"
    >
      <HeaderPanel
        showConfigPanel={showConfigPanel}
        setShowConfigPanel={setShowConfigPanel}
      />

      {/* Config Panel */}
      {showConfigPanel && (
        <div className="max-w-3xl p-6 mx-auto mb-12 ">
          {/* Color management component */}
          <ColorManagement colors={colors} setColors={setColors} />
          {/* Configuration Import/Export Section */}
          <ConfigurationPanel
            customLightModeValues={customLightModeValues}
            customDarkModeValues={customDarkModeValues}
            mean={mean}
            stdDev={stdDev}
            colors={colors}
            onConfigUpload={handleConfigUpload}
          />

          <div className="grid gap-6 mb-8 md:grid-cols-2">
            <GaussianParametersPanel
              mean={mean}
              stdDev={stdDev}
              setMean={setMean}
              setStdDev={setStdDev}
            />

            <DisplayOptionsPanel
              showContrast={showContrast}
              showLightnessInputs={showLightnessInputs}
              contrastMethod={contrastMethod}
              setShowContrast={setShowContrast}
              setShowLightnessInputs={setShowLightnessInputs}
              setContrastMethod={setContrastMethod}
              resetLightnessValues={resetLightnessValues}
            />
          </div>
        </div>
      )}

      <div className="sticky top-0 z-10 bg-white dark:bg-black p-1">
        <ColorScalesHeader />

        {/* Add lightness value inputs - conditionally rendered based on showLightnessInputs */}
        {showLightnessInputs && (
          <LightnessValueInputs
            colorScheme={colorScheme}
            customLightModeValues={customLightModeValues}
            customDarkModeValues={customDarkModeValues}
            updateLightnessValue={updateLightnessValue}
          />
        )}
      </div>

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

      <section className="mb-12">
        <p className="mb-4">
          The generator is using a gaussian function to calculate chroma based
          on a predefined lightness for each step. We provide sensible defaults
          to mean and standard deviation, but also let you customize it to get
          the optimal result for you. We set mean to 0.6 as the initial value
          because we want to move the center of chroma in the gaussian curve a
          bit to the right so that we get more chroma on the right half.
        </p>
        <p>
          You can customize the lightness value for each step in the scale using
          the input fields above each column. The values range from 0 to 1.
        </p>
        <p>
          You can now also add, edit, and remove colors from the palette using
          the color management section in the configuration panel.
        </p>
      </section>
    </div>
  )
}
