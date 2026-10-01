'use client'

import { useId, useRef, useState } from 'react'
import { cloud_upload } from '@equinor/eds-icons'
import {
  darknessValuesInDarkMode,
  lightnessValuesInLightMode,
} from '@/config/config'
import { paletteConfig } from '@/config/palette-config'
import type { ColorFormat } from '@/types'
import {
  downloadColorTokens,
  downloadConfiguration,
  downloadDesignSystemCSS,
} from '@/utils/configurationUtils'
import type { PaletteInput } from '@/utils/urlState'
import { palettesFromConfig, palettesToColors } from '@/utils/paletteConfigFile'
import { Button } from '@/components/shared/Button'
import { Dialog } from '@/components/shared/Dialog'
import { Icon } from '@/components/shared/Icon'
import { SegmentedControl } from '@/components/shared/SegmentedControl'
import type { SegmentedOption } from '@/components/shared/SegmentedControl'

type ExportKind = 'config' | 'tokens' | 'css'

/** The export options from the archived generator's download popover. */
const EXPORTS: { value: ExportKind; label: string; description: string }[] = [
  {
    value: 'config',
    label: 'Palette config',
    description:
      'A JSON file with your palettes and the Tokens Studio lightness and chroma settings. Import it here again, or pass it to the generate-colors CLI.',
  },
  {
    value: 'tokens',
    label: 'Design tokens',
    description:
      'Two JSON files, light and dark, in the W3C design token format, with 15 steps per palette.',
  },
  {
    value: 'css',
    label: 'CSS variables',
    description:
      'One stylesheet with a custom property per step that switches between light and dark with light-dark().',
  },
]

const FORMAT_OPTIONS: SegmentedOption<ColorFormat>[] = [
  { value: 'OKLCH', label: 'OKLCH' },
  { value: 'HEX', label: 'HEX' },
]

type ExportDialogProps = {
  open: boolean
  onClose: () => void
  palettes: PaletteInput[]
  /** Replace the Theme Builder's palettes with the uploaded ones */
  onImport: (palettes: PaletteInput[]) => void
}

/**
 * Download the palettes as a palette config, design tokens or CSS
 * variables, in OKLCH or HEX, or import a palette config. The same options
 * as the archived generator's download popover.
 */
export function ExportDialog({
  open,
  onClose,
  palettes,
  onImport,
}: ExportDialogProps) {
  const [kind, setKind] = useState<ExportKind>('config')
  const [format, setFormat] = useState<ColorFormat>('OKLCH')
  const [importError, setImportError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const idPrefix = useId()

  const close = () => {
    setImportError(null)
    onClose()
  }

  const download = () => {
    const colors = palettesToColors(palettes)
    const { meanLight, stdDevLight, meanDark, stdDevDark } = paletteConfig
    if (kind === 'config') {
      downloadConfiguration(
        lightnessValuesInLightMode,
        darknessValuesInDarkMode,
        meanLight,
        stdDevLight,
        meanDark,
        stdDevDark,
        colors,
      )
    } else if (kind === 'tokens') {
      downloadColorTokens(
        colors,
        lightnessValuesInLightMode,
        darknessValuesInDarkMode,
        meanLight,
        stdDevLight,
        meanDark,
        stdDevDark,
        format,
      )
    } else {
      downloadDesignSystemCSS(
        colors,
        meanLight,
        stdDevLight,
        meanDark,
        stdDevDark,
        format,
      )
    }
    close()
  }

  const readUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const imported = palettesFromConfig(JSON.parse(String(reader.result)))
        if (!imported) {
          setImportError(
            'This file has no palettes. Choose a palette config downloaded from this tool.',
          )
          return
        }
        onImport(imported)
        close()
      } catch {
        setImportError('The file is not valid JSON.')
      }
    }
    reader.readAsText(file)
  }

  return (
    <Dialog
      open={open}
      onClose={close}
      title="Download"
      actions={
        <>
          <Button onClick={close}>Cancel</Button>
          <Button variant="primary" onClick={download}>
            Download
          </Button>
        </>
      }
    >
      <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
        <legend className="mb-2 p-0 text-sm font-medium text-secondary">
          Export
        </legend>
        {EXPORTS.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-start gap-3"
          >
            <input
              type="radio"
              name={`${idPrefix}-kind`}
              value={option.value}
              checked={kind === option.value}
              onChange={() => setKind(option.value)}
              className="mt-1 size-4 shrink-0 cursor-pointer"
            />
            <span className="flex flex-col">
              <span className="font-medium text-primary">{option.label}</span>
              <span className="text-sm text-secondary">
                {option.description}
              </span>
            </span>
          </label>
        ))}
      </fieldset>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-secondary">
          Colour format
        </span>
        <div className="flex flex-wrap items-center gap-3">
          <SegmentedControl
            mode="radio"
            aria-label="Colour format"
            size="sm"
            options={FORMAT_OPTIONS}
            value={format}
            onChange={setFormat}
            disabled={kind === 'config'}
          />
          {kind === 'config' && (
            <span className="text-sm text-tertiary">
              The palette config keeps the colours as you entered them.
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-muted pt-4">
        <span className="text-sm font-medium text-secondary">Import</span>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm" onClick={() => fileInputRef.current?.click()}>
            <Icon data={cloud_upload} size={16} />
            Upload config
          </Button>
          <span className="text-sm text-tertiary">
            Replaces your palettes. Lightness and chroma always come from Tokens
            Studio.
          </span>
        </div>
        {importError && (
          <p role="alert" className="m-0 text-sm text-danger">
            {importError}
          </p>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) readUpload(file)
            event.target.value = ''
          }}
        />
      </div>
    </Dialog>
  )
}
