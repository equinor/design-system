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
import { resolveToken, toneRamps } from '@/utils/semanticTokens'
import { deserializeState, updateURL } from '@/utils/urlState'
import type { PaletteInput, ThemeBuilderTab } from '@/utils/urlState'
import { downloadConfiguration } from '@/utils/configurationUtils'
import type { ColorDefinition } from '@/types'
import { ThemeBuilderHeader } from '@/components/themebuilder/ThemeBuilderHeader'
import { PaletteInputPanel } from '@/components/themebuilder/PaletteInputPanel'
import { TokenMatrix } from '@/components/themebuilder/TokenMatrix'
import { ContrastTable } from '@/components/themebuilder/ContrastTable'
import { ComponentPreviewPanel } from '@/components/themebuilder/ComponentPreviewPanel'
import { ContrastTestPanel } from '@/components/themebuilder/ContrastTestPanel'

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
  const [activeTab, setActiveTab] = useState<ThemeBuilderTab>(
    initialState.activeTab ?? 'system',
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
    colorScheme === 'light' ? paletteConfig.meanLight : paletteConfig.meanDark
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
        // Single colour: it supplies hue and chroma, and every step takes its
        // lightness from the Tokens Studio scale, as Tokens Studio does. The
        // input colour itself does not have to appear in the scale.
        const hex = p.baseColor.startsWith('#')
          ? p.baseColor
          : `#${p.baseColor}`
        steps = generateColorScale(hex, lightnessValues, mean, stdDev, 'HEX')
      }
      return { name: p.name, steps }
    })
  }, [palettes, lightnessValues, mean, stdDev])

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

  // Page background = background.canvas (neutral.1), resolved from the
  // Tokens Studio palettes. Content cards use background.surface
  // (neutral.15), which is lighter than the canvas in light and darker than
  // it in dark.
  const canvasBg = resolveToken(
    'background.canvas',
    toneRamps(colorScheme),
    colorScheme,
  )

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
        {activeTab === 'system' ? (
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
        ) : activeTab === 'contrast' ? (
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
