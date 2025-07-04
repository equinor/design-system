'use client'

import { generateColorScale } from '../utils/color'
import { useState } from 'react'
import { ColorScale } from '@/components/ColorScale'
import { useColorScheme } from '@/context/ColorSchemeContext'
import { HeaderPanel } from '@/components/HeaderPanel'
import { ColorManagement } from '@/components/ColorManagement'
import { GaussianParametersPanel } from '@/components/GaussianParametersPanel'
import { DisplayOptionsPanel } from '@/components/DisplayOptionsPanel'
import { ConfigurationPanel } from '@/components/ConfigurationPanel'
import { LightnessValueInputs } from '@/components/LightnessValueInputs'
import { ColorScalesHeader } from '@/components/ColorScalesHeader'
import { ColorDefinition, ConfigFile, ContrastMethod } from '@/types'
import config from '@/config/config.json'

export default function App() {
  const [mean, setMean] = useState(config.mean)
  const [stdDev, setStdDev] = useState(config.stdDev)
  const { colorScheme } = useColorScheme()
  const [showContrast, setShowContrast] = useState(false)
  const [showLightnessInputs, setShowLightnessInputs] = useState(false)
  const [showConfigPanel, setShowConfigPanel] = useState(false)
  const [contrastMethod, setContrastMethod] = useState<ContrastMethod>('APCA')

  // Add state for lightness values
  const [lightModeValues, setLightModeValues] = useState<number[]>(
    config.lightModeValues,
  )
  const [darkModeValues, setDarkModeValues] = useState<number[]>(
    config.darkModeValues,
  )

  // Define colors in an array for easier management
  const [colors, setColors] = useState<ColorDefinition[]>(config.colors)

  const updateColorName = (index: number, newName: string) => {
    setColors(
      colors.map((color, i) =>
        i === index ? { ...color, name: newName } : color,
      ),
    )
  }

  const updateColorHex = (index: number, newHex: string) => {
    setColors(
      colors.map((color, i) =>
        i === index ? { ...color, hex: newHex } : color,
      ),
    )
  }

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index))
  }

  const addColor = (newColor: ColorDefinition) => {
    setColors([...colors, newColor])
  }

  // Update a specific lightness value
  const updateLightnessValue = (index: number, value: number) => {
    if (colorScheme === 'light') {
      const newValues = [...lightModeValues]
      newValues[index] = value
      setLightModeValues(newValues)
    } else {
      const newValues = [...darkModeValues]
      newValues[index] = value
      setDarkModeValues(newValues)
    }
  }

  // Reset lightness values to defaults
  const resetLightnessValues = () => {
    setLightModeValues(config.lightModeValues)
    setDarkModeValues(config.darkModeValues)
  }

  // Handle configuration upload
  const handleConfigUpload = (config: ConfigFile) => {
    setLightModeValues(config.lightModeValues)
    setDarkModeValues(config.darkModeValues)
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
      color.hex,
      colorScheme === 'light' ? lightModeValues : darkModeValues,
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
          <ColorManagement
            colors={colors}
            onUpdateColorName={updateColorName}
            onUpdateColorHex={updateColorHex}
            onRemoveColor={removeColor}
            onAddColor={addColor}
          />
          {/* Configuration Import/Export Section */}
          <ConfigurationPanel
            lightModeValues={lightModeValues}
            darkModeValues={darkModeValues}
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
            lightModeValues={lightModeValues}
            darkModeValues={darkModeValues}
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
