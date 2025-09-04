'use client'

import { generateColorScale } from '../utils/color'
import { useState, useEffect, useMemo } from 'react'
import { ColorScale } from '@/components/ColorScale'
import { useColorScheme } from '@/context/ColorSchemeContext'
import { HeaderPanel } from '@/components/HeaderPanel'
import { GaussianParametersPanel } from '@/components/GaussianParametersPanel'
import { DisplayOptionsPanel } from '@/components/DisplayOptionsPanel'
import { LightnessValueInputs } from '@/components/LightnessValueInputs'
import { ColorScalesHeader } from '@/components/ColorScalesHeader'
import {
  ColorDefinition,
  ConfigFile,
  ContrastMethod,
  ColorFormat,
} from '@/types'
import { arraysEqual, colorsEqual } from '@/utils/compare'
import { localStorageUtils } from '@/utils/localStorage'
import { paletteConfig as config } from '@/config/palette'
import {
  lightnessValuesInLightMode,
  darknessValuesInDarkMode,
} from '@/config/config'
import { computeContrastSummary } from '@/utils/contrastSummary'
import { QuickActionsPopover } from '@/components/QuickActionsPopover'
import { RotateCcw } from 'lucide-react'

export default function App() {
  // Initialize state with values from localStorage or defaults
  const [meanLight, setMeanLight] = useState(() =>
    localStorageUtils.getMeanLight(config.meanLight),
  )
  const [stdDevLight, setStdDevLight] = useState(() =>
    localStorageUtils.getStdDevLight(config.stdDevLight),
  )
  const [meanDark, setMeanDark] = useState(() =>
    localStorageUtils.getMeanDark(config.meanDark),
  )
  const [stdDevDark, setStdDevDark] = useState(() =>
    localStorageUtils.getStdDevDark(config.stdDevDark),
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
    localStorageUtils.setMeanLight(meanLight)
  }, [meanLight])

  useEffect(() => {
    localStorageUtils.setStdDevLight(stdDevLight)
  }, [stdDevLight])

  useEffect(() => {
    localStorageUtils.setMeanDark(meanDark)
  }, [meanDark])

  useEffect(() => {
    localStorageUtils.setStdDevDark(stdDevDark)
  }, [stdDevDark])

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
    setMeanLight(config.meanLight)
    setStdDevLight(config.stdDevLight)
    setMeanDark(config.meanDark)
    setStdDevDark(config.stdDevDark)
    setLightModeValues(lightnessValuesInLightMode)
    setDarkModeValues(darknessValuesInDarkMode)
    setColors(config.colors)
  }

  // Handle configuration upload
  const handleConfigUpload = (cfg: ConfigFile) => {
    setLightModeValues(cfg.lightModeValues)
    setDarkModeValues(cfg.darkModeValues)
    setMeanLight(cfg.meanLight)
    setStdDevLight(cfg.stdDevLight)
    setMeanDark(cfg.meanDark)
    setStdDevDark(cfg.stdDevDark)
    if (cfg.colors) {
      setColors(cfg.colors)
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
          meanLight,
          stdDevLight,
          colorFormat,
        ),
      })),
    [colors, lightModeValues, meanLight, stdDevLight, colorFormat],
  )

  const darkColorScales = useMemo(
    () =>
      colors.map((color) => ({
        ...color,
        scale: generateColorScale(
          color.hex,
          darkModeValues,
          meanDark,
          stdDevDark,
          colorFormat,
        ),
      })),
    [colors, darkModeValues, meanDark, stdDevDark, colorFormat],
  )

  // Select the appropriate scales based on current color scheme
  const currentColorScales =
    colorScheme === 'light' ? lightColorScales : darkColorScales

  // Client flag to avoid hydration mismatch
  const [isClient, setIsClient] = useState(false)
  useEffect(() => setIsClient(true), [])

  // Determine if configuration differs from defaults (mean, stdDev, light/dark values, colors)
  const isConfigDirty = useMemo(() => {
    return (
      meanLight !== config.meanLight ||
      stdDevLight !== config.stdDevLight ||
      meanDark !== config.meanDark ||
      stdDevDark !== config.stdDevDark ||
      !arraysEqual(lightModeValues, lightnessValuesInLightMode) ||
      !arraysEqual(darkModeValues, darknessValuesInDarkMode) ||
      !colorsEqual(colors, config.colors)
    )
  }, [
    meanLight,
    stdDevLight,
    meanDark,
    stdDevDark,
    lightModeValues,
    darkModeValues,
    colors,
  ])

  const contrastSummary = useMemo(() => {
    if (!isClient || !showContrast) {
      return { passed: 0, total: 0, percentage: 0 }
    }
    return computeContrastSummary({
      colorScales: currentColorScales,
      contrastMethod,
      enabled: showContrast,
    })
  }, [currentColorScales, contrastMethod, showContrast, isClient])

  return (
    <div className="p-6 ">
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

          {/* Color management moved inline to each color scale */}

          {/* Gaussian Parameters Panel - conditionally rendered */}
          {showGaussianParameters && (
            <GaussianParametersPanel
              meanLight={meanLight}
              stdDevLight={stdDevLight}
              setMeanLight={setMeanLight}
              setStdDevLight={setStdDevLight}
              meanDark={meanDark}
              stdDevDark={stdDevDark}
              setMeanDark={setMeanDark}
              setStdDevDark={setStdDevDark}
            />
          )}
        </div>
      )}

      <div className="sticky top-0 z-10 p-1 bg-default">
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
      {currentColorScales.map((colorData, index) => (
        <ColorScale
          key={index}
          colors={colorData.scale}
          showContrast={showContrast}
          contrastMethod={contrastMethod}
          colorName={colorData.name}
          baseHex={colors[index]?.hex}
          onRename={(name) => updateColorName(index, name)}
          onChangeHex={(hex) => updateColorHex(index, hex)}
          onRemove={() => removeColor(index)}
        />
      ))}

      {/* Add new color button */}
      <div className="my-6">
        <button
          type="button"
          onClick={() => addColor({ name: 'New colour', hex: '#888888' })}
          className="px-4 py-2 text-sm bg-neutral-medium-default hover:bg-neutral-medium-hover border-none rounded-md cursor-pointer"
        >
          Add colour
        </button>
      </div>

      <div className="fixed bottom-4 right-4 z-30 flex items-center gap-3">
        <QuickActionsPopover
          lightModeValues={lightModeValues}
          darkModeValues={darkModeValues}
          meanLight={meanLight}
          stdDevLight={stdDevLight}
          meanDark={meanDark}
          stdDevDark={stdDevDark}
          colors={colors}
          colorFormat={colorFormat}
          setColorFormat={setColorFormat}
          onConfigUpload={handleConfigUpload}
        />

        {isClient && showContrast && contrastSummary.total > 0 && (
          <>
            <div
              role="status"
              aria-live="polite"
              className="px-4 py-2 rounded-md shadow-md bg-elevated text-sm font-medium border border-neutral-subtle"
            >
              {`${contrastSummary.passed}/${contrastSummary.total} checks (${contrastSummary.percentage.toFixed(1)}%)`}
            </div>
          </>
        )}
        {isConfigDirty && (
          <button
            type="button"
            onClick={resetConfiguration}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs bg-danger-medium-default hover:bg-danger-medium-hover border-none rounded-md"
            aria-label="Reset configuration changes"
            title="Reset configuration changes"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  )
}
