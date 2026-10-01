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
import {
  cancelURLUpdate,
  deserializeState,
  updateURL,
  withPaletteIds,
} from '@/utils/urlState'
import type { PaletteInput, ThemeBuilderTab } from '@/utils/urlState'
import { check, download, link } from '@equinor/eds-icons'
import { AppHeader } from '@/components/shared/AppHeader'
import { Button } from '@/components/shared/Button'
import { Icon } from '@/components/shared/Icon'
import {
  SegmentedControl,
  TabPanel,
} from '@/components/shared/SegmentedControl'
import type { SegmentedOption } from '@/components/shared/SegmentedControl'
import { PaletteInputPanel } from '@/components/themebuilder/PaletteInputPanel'
import { TokenMatrix } from '@/components/themebuilder/TokenMatrix'
import { ContrastTable } from '@/components/themebuilder/ContrastTable'
import { ComponentPreviewPanel } from '@/components/themebuilder/ComponentPreviewPanel'
import { ContrastTestPanel } from '@/components/themebuilder/ContrastTestPanel'
import { ExportDialog } from '@/components/themebuilder/ExportDialog'

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

const TABS: SegmentedOption<ThemeBuilderTab>[] = [
  { value: 'system', label: 'Colour system' },
  { value: 'examples', label: 'Examples' },
  { value: 'contrast', label: 'Contrast' },
]

const TABS_ID = 'theme-builder'

const ADR_0016_URL =
  'https://github.com/equinor/design-system/blob/main/documentation/adr/0016-colour-approach-for-eds-2.md'

function ThemeBuilderContent() {
  const searchParams = useSearchParams()
  const { colorScheme } = useColorScheme()

  // Initialize state from URL or defaults
  const initialState = useMemo(() => {
    if (!searchParams) return {}
    return deserializeState(searchParams)
  }, [searchParams])

  const [palettes, setPalettes] = useState<PaletteInput[]>(() =>
    withPaletteIds(initialState.palettes ?? DEFAULT_PALETTES),
  )
  const [activeTab, setActiveTab] = useState<ThemeBuilderTab>(
    initialState.activeTab ?? 'system',
  )
  const [contrastPaletteIndex, setContrastPaletteIndex] = useState(0)
  const [copied, setCopied] = useState(false)

  // Sync state to URL
  useEffect(() => {
    updateURL({
      palettes,
      activeTab,
      mode: colorScheme,
    })
    // Drop a pending update if the page unmounts before the debounce fires.
    return cancelURLUpdate
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

  // The Config button opens the download dialog: palette config, design
  // tokens or CSS variables, or an uploaded config that replaces the palettes.
  const [exportOpen, setExportOpen] = useState(false)
  const handleImport = useCallback((imported: PaletteInput[]) => {
    setPalettes(withPaletteIds(imported))
  }, [])

  // Copy the current URL, which holds the palettes, tab and scheme
  const copyURL = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }, [])

  // The page is background.canvas; cards are background.surface, which is
  // lighter than the canvas in light and darker than it in dark (ADR 0016).
  return (
    <div className="min-h-screen bg-canvas text-primary">
      <ExportDialog
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        palettes={palettes}
        onImport={handleImport}
      />

      <AppHeader
        actions={
          <>
            <Button
              size="sm"
              onClick={() => setExportOpen(true)}
              aria-haspopup="dialog"
              title="Download or import a palette configuration"
            >
              <Icon data={download} size={16} />
              Config
            </Button>
            <Button size="sm" onClick={copyURL} title="Copy shareable URL">
              <Icon data={copied ? check : link} size={16} />
              {copied ? 'Copied' : 'Share'}
            </Button>
          </>
        }
      />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl">
            <h1 className="m-0 text-header-2xl font-medium">Theme Builder</h1>
            <p className="m-0 mt-2 text-sm text-secondary">
              Palettes here are proposals for checking ideas. Tokens Studio is
              the source of truth for EDS colour, and the defaults are its seven
              hue anchors (
              <a
                href={ADR_0016_URL}
                className="text-link underline hover:text-link-hover"
              >
                ADR 0016
              </a>
              ).
            </p>
          </div>

          <SegmentedControl
            mode="tabs"
            idPrefix={TABS_ID}
            aria-label="Theme Builder views"
            options={TABS}
            value={activeTab}
            onChange={setActiveTab}
          />
        </div>

        <TabPanel idPrefix={TABS_ID} value={activeTab}>
          {activeTab === 'system' ? (
            <div className="flex flex-col gap-6">
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
        </TabPanel>
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
