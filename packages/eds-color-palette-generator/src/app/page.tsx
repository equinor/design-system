'use client'

import { generateColorScale } from '../utils/color'
import { useState, useEffect, useMemo } from 'react'
import { ColorScale } from '@/components/ColorScale'
import { useColorScheme } from '@/context/ColorSchemeContext'
import { HeaderPanel } from '@/components/HeaderPanel'
import { ColorManagement } from '@/components/ColorManagement'
import { GaussianParametersPanel } from '@/components/GaussianParametersPanel'
import { DisplayOptionsPanel } from '@/components/DisplayOptionsPanel'
import { ConfigurationPanel } from '@/components/ConfigurationPanel'
import { LightnessValueInputs } from '@/components/LightnessValueInputs'
import { ColorScalesHeader } from '@/components/ColorScalesHeader'
import {
  ColorDefinition,
  ConfigFile,
  ContrastMethod,
  ColorFormat,
} from '@/types'
import { localStorageUtils } from '@/utils/localStorage'
import config, {
  lightnessValuesInLightMode,
  darknessValuesInDarkMode,
} from '@/config/config'

export default function App() {
  // Initialize state with values from localStorage or defaults
  const [mean, setMean] = useState(() => localStorageUtils.getMean(config.mean))
  const [stdDev, setStdDev] = useState(() =>
    localStorageUtils.getStdDev(config.stdDev),
  )
  const { colorScheme } = useColorScheme()
  const [showContrast, setShowContrast] = useState(() =>
    localStorageUtils.getShowContrast(false),
  )
  const [showLightnessInputs, setShowLightnessInputs] = useState(() =>
    localStorageUtils.getShowLightnessInputs(false),
  )
  const [showGaussianParameters, setShowGaussianParameters] = useState(() =>
    localStorageUtils.getShowGaussianParameters(false),
  )
  const [showConfigPanel, setShowConfigPanel] = useState(false) // Don't persist this one
  const [contrastMethod, setContrastMethod] = useState<ContrastMethod>(() =>
    localStorageUtils.getContrastMethod('APCA'),
  )
  const [colorFormat, setColorFormat] = useState<ColorFormat>(() =>
    localStorageUtils.getColorFormat('OKLCH'),
  )

  // Add state for lightness values
  const [lightModeValues, setLightModeValues] = useState(() =>
    localStorageUtils.getLightModeValues(lightnessValuesInLightMode),
  )
  const [darkModeValues, setDarkModeValues] = useState(() =>
    localStorageUtils.getDarkModeValues(darknessValuesInDarkMode),
  )

  // Define colors in an array for easier management
  const [colors, setColors] = useState<ColorDefinition[]>(() =>
    localStorageUtils.getColors(config.colors),
  )

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorageUtils.setMean(mean)
  }, [mean])

  useEffect(() => {
    localStorageUtils.setStdDev(stdDev)
  }, [stdDev])

  useEffect(() => {
    localStorageUtils.setShowContrast(showContrast)
  }, [showContrast])

  useEffect(() => {
    localStorageUtils.setShowLightnessInputs(showLightnessInputs)
  }, [showLightnessInputs])

  useEffect(() => {
    localStorageUtils.setShowGaussianParameters(showGaussianParameters)
  }, [showGaussianParameters])

  useEffect(() => {
    localStorageUtils.setContrastMethod(contrastMethod)
  }, [contrastMethod])

  useEffect(() => {
    localStorageUtils.setColorFormat(colorFormat)
  }, [colorFormat])

  useEffect(() => {
    localStorageUtils.setLightModeValues(lightModeValues)
  }, [lightModeValues])

  useEffect(() => {
    localStorageUtils.setDarkModeValues(darkModeValues)
  }, [darkModeValues])

  useEffect(() => {
    localStorageUtils.setColors(colors)
  }, [colors])

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

  // Reset only configuration settings (colors, Gaussian parameters, lightness values)
  const resetConfiguration = () => {
    // Clear only configuration-related localStorage items
    localStorageUtils.clearConfiguration()

    // Reset only configuration state to defaults
    setMean(config.mean)
    setStdDev(config.stdDev)
    setLightModeValues(lightnessValuesInLightMode)
    setDarkModeValues(darknessValuesInDarkMode)
    setColors(config.colors)
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

  // Generate memoized color scales for light and dark modes separately
  const lightColorScales = useMemo(
    () =>
      colors.map((color) => ({
        ...color,
        scale: generateColorScale(
          color.hex,
          lightModeValues,
          mean,
          stdDev,
          colorFormat,
        ),
      })),
    [colors, lightModeValues, mean, stdDev, colorFormat],
  )

  const darkColorScales = useMemo(
    () =>
      colors.map((color) => ({
        ...color,
        scale: generateColorScale(
          color.hex,
          darkModeValues,
          mean,
          stdDev,
          colorFormat,
        ),
      })),
    [colors, darkModeValues, mean, stdDev, colorFormat],
  )

  // Select the appropriate scales based on current color scheme
  const currentColorScales =
    colorScheme === 'light' ? lightColorScales : darkColorScales

  return (
    <div
      data-theme={colorScheme}
      className="p-6 text-black bg-white dark:text-white dark:bg-black"
    >
      <HeaderPanel
        showConfigPanel={showConfigPanel}
        setShowConfigPanel={setShowConfigPanel}
      />

      {/* Config Panel */}
      {showConfigPanel && (
        <div className="max-w-3xl p-6 mx-auto mb-12 ">
          {/* Display Options Panel */}
          <DisplayOptionsPanel
            showContrast={showContrast}
            showLightnessInputs={showLightnessInputs}
            showGaussianParameters={showGaussianParameters}
            contrastMethod={contrastMethod}
            colorFormat={colorFormat}
            setShowContrast={setShowContrast}
            setShowLightnessInputs={setShowLightnessInputs}
            setShowGaussianParameters={setShowGaussianParameters}
            setContrastMethod={setContrastMethod}
            setColorFormat={setColorFormat}
          />

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
            onResetConfiguration={resetConfiguration}
          />

          {/* Gaussian Parameters Panel - conditionally rendered */}
          {showGaussianParameters && (
            <GaussianParametersPanel
              mean={mean}
              stdDev={stdDev}
              setMean={setMean}
              setStdDev={setStdDev}
            />
          )}
        </div>
      )}

      <div className="sticky top-0 z-10 p-1 bg-white dark:bg-black">
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
      {currentColorScales.map((colorData) => (
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
