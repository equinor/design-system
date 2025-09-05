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
    // Use functional update to avoid stale state when multiple edits occur quickly
    setColors((prev) =>
      prev.map((color, i) => (i === index ? { ...color, name: newName } : color)),
    )
  }

  const updateColorHex = (index: number, newHex: string) => {
    // Use functional update to avoid stale state when multiple edits occur quickly
    setColors((prev) =>
      prev.map((color, i) => (i === index ? { ...color, hex: newHex } : color)),
    )
  }

  const removeColor = (index: number) => {
    // Functional update for consistency and to avoid state races
    setColors((prev) => prev.filter((_, i) => i !== index))
  }

  const addColor = (newColor: ColorDefinition) => {
    // Functional update for consistency and to avoid state races
    setColors((prev) => [...prev, newColor])
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

  // Efficiently memoize computed scales by hex-only dependencies
  const hexKey = useMemo(() => colors.map((c) => c.hex).join('|'), [colors])
  const lightScalesMemo = useMemo(
    () =>
      colors.map((c) =>
        generateColorScale(
          c.hex,
          lightModeValues,
          meanLight,
          stdDevLight,
          colorFormat,
        ),
      ),
    // Only recompute when hexes or generation inputs change (not when names change)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hexKey, lightModeValues, meanLight, stdDevLight, colorFormat],
  )
  const darkScalesMemo = useMemo(
    () =>
      colors.map((c) =>
        generateColorScale(
          c.hex,
          darkModeValues,
          meanDark,
          stdDevDark,
          colorFormat,
        ),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hexKey, darkModeValues, meanDark, stdDevDark, colorFormat],
  )

  // Combine fast: map names to memoized scales without recomputing heavy work on name edits
  const lightColorScales = useMemo(
    () => colors.map((c, i) => ({ ...c, scale: lightScalesMemo[i] })),
    [colors, lightScalesMemo],
  )
  const darkColorScales = useMemo(
    () => colors.map((c, i) => ({ ...c, scale: darkScalesMemo[i] })),
    [colors, darkScalesMemo],
  )

  // Select the appropriate scales based on current color scheme
  const currentColorScales =
    colorScheme === 'light' ? lightColorScales : darkColorScales
  const currentScalesOnly =
    colorScheme === 'light' ? lightScalesMemo : darkScalesMemo

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
    // Only depend on scales (colors), not names or other metadata
    const payload = currentScalesOnly.map((scale) => ({ scale }))
    return computeContrastSummary({
      colorScales: payload,
      contrastMethod,
      enabled: showContrast,
    })
  }, [currentScalesOnly, contrastMethod, showContrast, isClient])

  return (
    <div className="min-h-screen bg-canvas text-default">
      <header className="mx-auto max-w-7xl px-6 py-8">
        <HeaderPanel
          showConfigPanel={showConfigPanel}
          setShowConfigPanel={setShowConfigPanel}
        />
      </header>

      <main className="py-6">
        {/* Config Panel */}
        {showConfigPanel && (
          <section className="mb-8">
            <div
              id="display-options-panel"
              className="mx-auto max-w-7xl p-6 rounded-xl"
            >
              <div className="bg-surface px-4 py-6 rounded-xl">
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

                {showGaussianParameters && (
                  <div className="mt-6">
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
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Full-width sticky subheader after display options */}
        <div className="sticky top-0 z-30 bg-canvas/80 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-6 py-2">
            <ColorScalesHeader />
            {showLightnessInputs && (
              <LightnessValueInputs
                colorScheme={colorScheme}
                lightModeValues={lightModeValues}
                darkModeValues={darkModeValues}
                updateLightnessValue={updateLightnessValue}
              />
            )}
          </div>
        </div>

        {/* Render color scales dynamically */}
        <section className="mt-6 space-y-6 mx-auto max-w-7xl px-6">
          {currentColorScales.map((colorData, index) => (
            <div
              key={`scale-wrap-${index}`}
              className="rounded-xl bg-surface p-4"
            >
              <ColorScale
                colors={colorData.scale}
                showContrast={showContrast}
                contrastMethod={contrastMethod}
                colorName={colorData.name}
                baseHex={colors[index]?.hex}
                onRename={(name) => updateColorName(index, name)}
                onChangeHex={(hex) => updateColorHex(index, hex)}
                onRemove={() => removeColor(index)}
              />
            </div>
          ))}
        </section>

        {/* Add new color button */}
        <div className="my-8 mx-auto max-w-7xl px-6">
          <button
            type="button"
            onClick={() => addColor({ name: 'New colour', hex: '#888888' })}
            className="px-4 py-2 text-sm border border-neutral-medium hover:bg-neutral-fill-muted-hover active:bg-neutral-fill-muted-active rounded-md cursor-pointer"
          >
            Add colour
          </button>
        </div>
      </main>

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
        {isClient && isConfigDirty && (
          <button
            type="button"
            onClick={resetConfiguration}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs bg-danger-fill-muted-default hover:bg-danger-fill-muted-hover border-none rounded-md"
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
