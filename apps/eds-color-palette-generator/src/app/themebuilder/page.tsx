'use client'

import { Suspense, useState, useMemo, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { generateColorScale, parseColorToHex } from '@/utils/color'
import { useColorScheme } from '@/context/ColorSchemeContext'
import {
  lightnessValuesInLightMode,
  darknessValuesInDarkMode,
} from '@/config/config'
import { paletteConfig } from '@/config/palette'
import { deserializeState, updateURL } from '@/utils/urlState'
import type { PaletteInput } from '@/utils/urlState'
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

  // Reset contrast index if palette list shrinks
  useEffect(() => {
    if (contrastPaletteIndex >= palettes.length) {
      setContrastPaletteIndex(0)
    }
  }, [palettes.length, contrastPaletteIndex])

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
        // Simple hex color
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

  return (
    <div className="min-h-screen" style={{ color: 'inherit' }}>
      <ThemeBuilderHeader activeTab={activeTab} onTabChange={setActiveTab} />

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
              activePaletteIndex={contrastPaletteIndex}
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
