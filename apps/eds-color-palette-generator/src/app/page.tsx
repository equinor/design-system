'use client'

import { generateColorScale } from '../utils/color'
import { useState, useEffect, useMemo } from 'react'
import { useIsMounted } from '@equinor/eds-utils'
import { ColorScale } from '@/components/ColorScale'
import { useColorScheme } from '@/context/ColorSchemeContext'
import { HeaderPanel } from '@/components/HeaderPanel'
import { GaussianParametersPanel } from '@/components/GaussianParametersPanel'
import { DisplayOptionsPanel } from '@/components/DisplayOptionsPanel'
import { LightnessValueInputs } from '@/components/LightnessValueInputs'
import { ColorScalesHeader } from '@/components/ColorScalesHeader'
import { StepConfigPanel } from '@/components/StepConfigPanel'
import {
  ColorDefinition,
  ColorAnchor,
  ConfigFile,
  ContrastMethod,
  ColorFormat,
} from '@/types'
import { StepDefinition } from '@/config/types'
import { colorsEqual } from '@/utils/compare'
import { localStorageUtils } from '@/utils/localStorage'
import { paletteConfig as config } from '@/config/palette'
import { PALETTE_STEPS } from '@/config/config'
import {
  insertStepAt,
  removeStepAt,
  updateStepAt,
  stepsFromLightness,
  isValidStepArray,
  areStepsEqual,
  NewStepInput,
} from '@/utils/stepConfig'
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
  const [showStepConfig, setShowStepConfig] = useState(() =>
    localStorageUtils.getShowStepConfig(false),
  )
  const [showConfigPanel, setShowConfigPanel] = useState(false) // Don't persist this one
  const [contrastMethod, setContrastMethod] = useState<ContrastMethod>(() =>
    localStorageUtils.getContrastMethod('APCA'),
  )
  const [colorFormat, setColorFormat] = useState<ColorFormat>(() =>
    localStorageUtils.getColorFormat('OKLCH'),
  )

  // The ordered scale steps are the source of truth for both structure
  // (name, group, role) and per-step lightness. Light/dark arrays are derived.
  const [steps, setSteps] = useState<StepDefinition[]>(() =>
    localStorageUtils.getSteps(PALETTE_STEPS),
  )

  // Define colors in an array for easier management
  const [colors, setColors] = useState<ColorDefinition[]>(() =>
    localStorageUtils.getColors(config.colors),
  )

  // Lightness arrays derived from the steps, fed to the generator.
  const lightModeValues = useMemo(
    () => steps.map((s) => s.lightValue),
    [steps],
  )
  const darkModeValues = useMemo(() => steps.map((s) => s.darkValue), [steps])

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
    localStorageUtils.setShowStepConfig(showStepConfig)
  }, [showStepConfig])

  useEffect(() => {
    localStorageUtils.setContrastMethod(contrastMethod)
  }, [contrastMethod])

  useEffect(() => {
    localStorageUtils.setColorFormat(colorFormat)
  }, [colorFormat])

  useEffect(() => {
    localStorageUtils.setSteps(steps)
  }, [steps])

  useEffect(() => {
    localStorageUtils.setColors(colors)
  }, [colors])

  const updateColorName = (index: number, newName: string) => {
    // Use functional update to avoid stale state when multiple edits occur quickly
    setColors((prev) =>
      prev.map((color, i) =>
        i === index ? { ...color, name: newName } : color,
      ),
    )
  }

  const updateColorValue = (index: number, newValue: string) => {
    // Use functional update to avoid stale state when multiple edits occur quickly
    setColors((prev) =>
      prev.map((color, i) =>
        i === index ? { ...color, value: newValue } : color,
      ),
    )
  }

  const updateColorAnchors = (index: number, newAnchors: ColorAnchor[]) => {
    // Update the anchors for a color
    setColors((prev) =>
      prev.map((color, i) => {
        if (i === index) {
          // Intentionally remove the legacy 'value' field when migrating to anchors
          // to prevent ambiguity between single-color and multi-anchor formats
          return { name: color.name, anchors: newAnchors }
        }
        return color
      }),
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

  // Update a specific lightness value for the current color scheme
  const updateLightnessValue = (index: number, value: number) => {
    const field = colorScheme === 'light' ? 'lightValue' : 'darkValue'
    setSteps((prev) => updateStepAt(prev, index, { [field]: value }))
  }

  // Step structure editing (insert between, remove, rename, reassign group)
  const insertStep = (index: number, input: NewStepInput = {}) => {
    setSteps((prev) => insertStepAt(prev, index, input))
  }
  const removeStep = (index: number) => {
    setSteps((prev) => removeStepAt(prev, index))
  }
  const updateStepName = (index: number, name: string) => {
    setSteps((prev) => updateStepAt(prev, index, { name }))
  }
  const updateStepGroup = (index: number, groupId: string) => {
    setSteps((prev) => updateStepAt(prev, index, { groupId }))
  }
  const setStepLightness = (
    index: number,
    mode: 'light' | 'dark',
    value: number,
  ) => {
    const field = mode === 'light' ? 'lightValue' : 'darkValue'
    setSteps((prev) => updateStepAt(prev, index, { [field]: value }))
  }

  // Reset only configuration settings (colors, Gaussian parameters, steps)
  const resetConfiguration = () => {
    // Clear only configuration-related localStorage items
    localStorageUtils.clearConfiguration()

    // Reset only configuration state to defaults
    setMeanLight(config.meanLight)
    setStdDevLight(config.stdDevLight)
    setMeanDark(config.meanDark)
    setStdDevDark(config.stdDevDark)
    setSteps(PALETTE_STEPS)
    setColors(config.colors)
  }

  // Handle configuration upload
  const handleConfigUpload = (cfg: ConfigFile) => {
    // Prefer full step definitions; fall back to legacy positional lightness.
    if (isValidStepArray(cfg.steps)) {
      setSteps(cfg.steps)
    } else {
      setSteps(
        stepsFromLightness(
          PALETTE_STEPS,
          cfg.lightModeValues,
          cfg.darkModeValues,
        ),
      )
    }
    setMeanLight(cfg.meanLight)
    setStdDevLight(cfg.stdDevLight)
    setMeanDark(cfg.meanDark)
    setStdDevDark(cfg.stdDevDark)
    if (cfg.colors) {
      setColors(cfg.colors)
    }
  }

  // Efficiently memoize computed scales by value-only dependencies
  // Support both legacy single value and new anchor format
  const valueKey = useMemo(
    () =>
      colors
        .map((c) => {
          if ('anchors' in c) {
            return c.anchors.map((a) => `${a.step}:${a.value}`).join(',')
          }
          return c.value
        })
        .join('|'),
    [colors],
  )
  const lightScalesMemo = useMemo(
    () =>
      colors.map((c) => {
        // Use anchors if available, otherwise use single value
        const colorInput = 'anchors' in c ? c.anchors : c.value
        return generateColorScale(
          colorInput,
          lightModeValues,
          meanLight,
          stdDevLight,
          colorFormat,
        )
      }),
    // Only recompute when color values or generation inputs change (not when names change)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [valueKey, lightModeValues, meanLight, stdDevLight, colorFormat],
  )
  const darkScalesMemo = useMemo(
    () =>
      colors.map((c) => {
        // Use anchors if available, otherwise use single value
        const colorInput = 'anchors' in c ? c.anchors : c.value
        return generateColorScale(
          colorInput,
          darkModeValues,
          meanDark,
          stdDevDark,
          colorFormat,
        )
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [valueKey, darkModeValues, meanDark, stdDevDark, colorFormat],
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
  const isMounted = useIsMounted()

  // Determine if configuration differs from defaults (mean, stdDev, steps, colors)
  const isConfigDirty = useMemo(() => {
    return (
      meanLight !== config.meanLight ||
      stdDevLight !== config.stdDevLight ||
      meanDark !== config.meanDark ||
      stdDevDark !== config.stdDevDark ||
      !areStepsEqual(steps, PALETTE_STEPS) ||
      !colorsEqual(colors, config.colors)
    )
  }, [meanLight, stdDevLight, meanDark, stdDevDark, steps, colors])

  const contrastSummary = useMemo(() => {
    if (!isMounted || !showContrast) {
      return { passed: 0, total: 0, percentage: 0 }
    }
    // Only depend on scales (colors), not names or other metadata
    const payload = currentScalesOnly.map((scale) => ({ scale }))
    return computeContrastSummary({
      colorScales: payload,
      contrastMethod,
      enabled: showContrast,
      steps,
    })
  }, [currentScalesOnly, contrastMethod, showContrast, isMounted, steps])

  return (
    <div className="min-h-screen bg-canvas text-default">
      <header className="mx-auto max-w-7xl px-6 py-8 print-hide">
        <HeaderPanel
          showConfigPanel={showConfigPanel}
          setShowConfigPanel={setShowConfigPanel}
        />
      </header>

      <main className="py-6">
        {/* Config Panel */}
        {showConfigPanel && (
          <section className="mb-8 print:mb-0">
            <div
              id="display-options-panel"
              className="mx-auto max-w-7xl p-6 rounded-xl"
            >
              <div className="bg-surface px-4 py-6 rounded-xl print-hide">
                <DisplayOptionsPanel
                  showContrast={showContrast}
                  showLightnessInputs={showLightnessInputs}
                  showGaussianParameters={showGaussianParameters}
                  showStepConfig={showStepConfig}
                  contrastMethod={contrastMethod}
                  colorFormat={colorFormat}
                  setShowContrast={setShowContrast}
                  setShowLightnessInputs={setShowLightnessInputs}
                  setShowGaussianParameters={setShowGaussianParameters}
                  setShowStepConfig={setShowStepConfig}
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

                {showStepConfig && (
                  <div className="mt-6">
                    <StepConfigPanel
                      steps={steps}
                      colorScheme={colorScheme}
                      onInsertStep={insertStep}
                      onRemoveStep={removeStep}
                      onRenameStep={updateStepName}
                      onChangeStepGroup={updateStepGroup}
                      onChangeStepLightness={setStepLightness}
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Full-width sticky subheader after display options */}
        <div className="sticky top-0 z-30 bg-canvas/80 backdrop-blur-md print-hide">
          <div className="mx-auto max-w-7xl px-6 py-2">
            {/* Depends on persisted step count, so render only after mount to
                avoid an SSR/client hydration mismatch (server has defaults). */}
            {isMounted && <ColorScalesHeader steps={steps} />}
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
        {isMounted && (
          <>
            <section className="mt-6 space-y-6 mx-auto max-w-7xl px-6">
              {currentColorScales.map((colorData, index) => {
                const color = colors[index]
                return (
                  <div
                    key={`scale-wrap-${index}`}
                    className="rounded-xl bg-surface p-4 print:p-0 print:bg-transparent"
                  >
                    <ColorScale
                      colors={colorData.scale}
                      steps={steps}
                      showContrast={showContrast}
                      contrastMethod={contrastMethod}
                      colorName={colorData.name}
                      baseColor={'value' in color ? color.value : undefined}
                      anchors={'anchors' in color ? color.anchors : undefined}
                      testId={`color-scale-${index}`}
                      onRename={(name) => updateColorName(index, name)}
                      onChangeValue={(value: string) =>
                        updateColorValue(index, value)
                      }
                      onChangeAnchors={(anchors) =>
                        updateColorAnchors(index, anchors)
                      }
                      onRemove={() => removeColor(index)}
                    />
                  </div>
                )
              })}
            </section>

            {/* Add new color button */}
            <div className="my-8 mx-auto max-w-7xl px-6 print-hide">
              <button
                type="button"
                onClick={() =>
                  addColor({ name: 'New colour', value: '#888888' })
                }
                className="px-4 py-2 text-sm border border-neutral-medium hover:bg-neutral-fill-muted-hover active:bg-neutral-fill-muted-active rounded-md cursor-pointer"
                data-testid="add-color-button"
              >
                Add colour
              </button>
            </div>
          </>
        )}
      </main>

      <div className="fixed bottom-4 right-4 z-30 flex items-center gap-3 print-hide">
        <QuickActionsPopover
          lightModeValues={lightModeValues}
          darkModeValues={darkModeValues}
          steps={steps}
          meanLight={meanLight}
          stdDevLight={stdDevLight}
          meanDark={meanDark}
          stdDevDark={stdDevDark}
          colors={colors}
          colorFormat={colorFormat}
          setColorFormat={setColorFormat}
          onConfigUpload={handleConfigUpload}
        />

        {isMounted && showContrast && contrastSummary.total > 0 && (
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
        {isMounted && isConfigDirty && (
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
