'use client'

import { Suspense, useState, useMemo, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { generateColorScale, parseColorToHex } from '@/utils/color'
import { useColorScheme } from '@/context/ColorSchemeContext'
import {
  lightnessValuesInLightMode,
  darknessValuesInDarkMode,
} from '@/config/config'
import { paletteConfig } from '@/config/palette-config'
import { getSemanticColors } from '@/config/semanticColors'
import { deserializeState, updateURL } from '@/utils/urlState'
import type { PaletteInput } from '@/utils/urlState'
import { downloadConfiguration } from '@/utils/configurationUtils'
import type { ColorDefinition } from '@/types'
import { ThemeBuilderHeader } from '@/components/themebuilder/ThemeBuilderHeader'
import { PaletteInputPanel } from '@/components/themebuilder/PaletteInputPanel'
import { TokenMatrix } from '@/components/themebuilder/TokenMatrix'
import { ContrastTable } from '@/components/themebuilder/ContrastTable'
import { ComponentPreviewPanel } from '@/components/themebuilder/ComponentPreviewPanel'
import { ContrastTestPanel } from '@/components/themebuilder/ContrastTestPanel'

type Tab = 'fargesystem' | 'eksempler' | 'kontrast'

/** Convert paletteConfig.colors to PaletteInput[] for defaults */
const DEFAULT_PALETTES: PaletteInput[] = (paletteConfig.colors ?? []).map(
  (color) => {
    if ('anchors' in color) {
      return {
        name: color.name,
        baseColor: '',
        anchors: color.anchors,
      }
    }
    // Single value color — store as baseColor
    const hex = parseColorToHex(color.value)
    return {
      name: color.name,
      baseColor: hex?.replace('#', '') ?? '808080',
    }
  },
)

function ThemeBuilderContent() {
  const searchParams = useSearchParams()
  const { colorScheme } = useColorScheme()

  // Initialize state from URL or defaults
  const initialState = useMemo(() => {
    if (!searchParams) return {}
    return deserializeState(searchParams)
  }, [searchParams])

  const [palettes, setPalettes] = useState<PaletteInput[]>(
    initialState.palettes ?? DEFAULT_PALETTES,
  )
  const [activeTab, setActiveTab] = useState<Tab>(
    initialState.activeTab ?? 'fargesystem',
  )
  const [contrastPaletteIndex, setContrastPaletteIndex] = useState(0)

  // Sync state to URL
  useEffect(() => {
    updateURL({
      palettes,
      activeTab,
      mode: colorScheme,
    })
  }, [palettes, activeTab, colorScheme])

  // Clamp during render if the palette list shrinks (avoids setState-in-effect)
  const safeContrastIndex =
    contrastPaletteIndex >= palettes.length ? 0 : contrastPaletteIndex

  const lightnessValues =
    colorScheme === 'light'
      ? lightnessValuesInLightMode
      : darknessValuesInDarkMode

  const mean =
    colorScheme === 'light'
      ? paletteConfig.meanLight
      : paletteConfig.meanDark
  const stdDev =
    colorScheme === 'light'
      ? paletteConfig.stdDevLight
      : paletteConfig.stdDevDark

  // Generate color scales — pass anchors when available
  const generatedPalettes = useMemo(() => {
    return palettes.map((p) => {
      let steps: string[]
      if (p.anchors && p.anchors.length > 0) {
        // Multi-anchor: pass ColorAnchor[] directly
        steps = generateColorScale(
          p.anchors,
          lightnessValues,
          mean,
          stdDev,
          'HEX',
        )
      } else {
        // Simple hex color. In light mode, step 9 is the dark emphasis fill, so
        // we pin the exact input color there — the brand color appears in the
        // scale. In dark mode the emphasis fill inverts to a light tint (Model 1
        // / canonical EDS: light fill + dark on-emphasis label), so we let step
        // 9 follow the dark lightness curve instead of pinning.
        const hex = p.baseColor.startsWith('#')
          ? p.baseColor
          : `#${p.baseColor}`
        steps =
          colorScheme === 'light'
            ? generateColorScale(
                [{ value: hex, step: 9 }],
                lightnessValues,
                mean,
                stdDev,
                'HEX',
              )
            : generateColorScale(hex, lightnessValues, mean, stdDev, 'HEX')
      }
      return { name: p.name, steps }
    })
  }, [palettes, lightnessValues, mean, stdDev, colorScheme])

  const handlePalettesChange = useCallback((next: PaletteInput[]) => {
    setPalettes(next)
  }, [])

  // Download the current palette configuration as JSON (color-palette-config.json).
  // Includes both light/dark lightness ramps + Gaussian params so the config can
  // be re-imported or fed to the CLI to regenerate the exact palette.
  const handleDownloadConfig = useCallback(() => {
    const colors: ColorDefinition[] = palettes.map((p) =>
      p.anchors && p.anchors.length > 0
        ? { name: p.name, anchors: p.anchors }
        : {
            name: p.name,
            value: p.baseColor.startsWith('#')
              ? p.baseColor
              : `#${p.baseColor}`,
          },
    )
    downloadConfiguration(
      lightnessValuesInLightMode,
      darknessValuesInDarkMode,
      paletteConfig.meanLight,
      paletteConfig.stdDevLight,
      paletteConfig.meanDark,
      paletteConfig.stdDevDark,
      colors,
    )
  }, [palettes])

  // Page background = the EDS neutral *canvas* (the "main application
  // background" per the EDS colour roles). Content cards sit on top using
  // *surface* ("placed on canvas to create depth"), so cards read as elevated
  // above the page in both modes — in dark that means #202223 cards lifting off
  // a #0b0b0b page, rather than near-black cards sinking into it.
  const canvasBg = getSemanticColors(colorScheme)['bg-neutral-canvas']

  return (
    <div
      className="min-h-screen"
      style={{ color: 'inherit', backgroundColor: canvasBg }}
    >
      <ThemeBuilderHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onDownloadConfig={handleDownloadConfig}
      />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'fargesystem' ? (
          <div className="flex flex-col" style={{ gap: '24px' }}>
            <PaletteInputPanel
              palettes={palettes}
              onChange={handlePalettesChange}
            />

            <TokenMatrix palettes={generatedPalettes} />

            <ContrastTable
              palettes={generatedPalettes}
              activePaletteIndex={safeContrastIndex}
              onActivePaletteChange={setContrastPaletteIndex}
            />
          </div>
        ) : activeTab === 'kontrast' ? (
          <ContrastTestPanel palettes={generatedPalettes} />
        ) : (
          <ComponentPreviewPanel palettes={generatedPalettes} />
        )}
      </main>
    </div>
  )
}

export default function ThemeBuilderPage() {
  return (
    <Suspense>
      <ThemeBuilderContent />
    </Suspense>
  )
}
