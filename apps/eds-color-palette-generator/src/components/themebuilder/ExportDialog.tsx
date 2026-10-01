'use client'

import { useId, useMemo, useRef, useState } from 'react'
import { cloud_upload } from '@equinor/eds-icons'
import { downloadText } from '@/utils/dataviz-export'
import {
  anchorProposals,
  palettesFile,
  palettesFromConfig,
  tokensStudioAnchorsFile,
} from '@/utils/paletteConfigFile'
import type { AnchorProposal, AnchorStatus } from '@/utils/paletteConfigFile'
import type { PaletteInput } from '@/utils/urlState'
import { Button } from '@/components/shared/Button'
import { Dialog } from '@/components/shared/Dialog'
import { Icon } from '@/components/shared/Icon'

type ExportKind = 'tokens-studio' | 'palettes'

const EXPORTS: { value: ExportKind; label: string; description: string }[] = [
  {
    value: 'tokens-studio',
    label: 'Tokens Studio anchors',
    description:
      'The anchors you changed or added, in OKLCH, in the format of the Tokens Studio set input/palette. Tokens Studio generates the 15 steps from them.',
  },
  {
    value: 'palettes',
    label: 'Palettes file',
    description:
      'Your palettes in OKLCH, to import here again later. The Share link holds the same palettes.',
  },
]

// Tokens Studio status roles: muted fill with on-muted text
const STATUS_TAG: Record<AnchorStatus, { label: string; tone: string }> = {
  changed: { label: 'Changed', tone: 'bg-info-muted text-info-on-muted' },
  new: { label: 'New hue', tone: 'bg-info-muted text-info-on-muted' },
  unchanged: {
    label: 'Same as Tokens Studio',
    tone: 'bg-neutral-muted text-secondary',
  },
  'several-anchors': {
    label: 'Several anchors',
    tone: 'bg-warning-muted text-warning-on-muted',
  },
}

const isProposed = (p: AnchorProposal) =>
  p.status === 'changed' || p.status === 'new'

type ExportDialogProps = {
  open: boolean
  onClose: () => void
  palettes: PaletteInput[]
  /** Replace the Theme Builder's palettes with the uploaded ones */
  onImport: (palettes: PaletteInput[]) => void
}

/**
 * Export the palettes as a proposal for Tokens Studio or as a palettes file,
 * or import a palettes file. Everything is OKLCH, the canonical form
 * (ADR 0016 D9).
 */
export function ExportDialog({
  open,
  onClose,
  palettes,
  onImport,
}: ExportDialogProps) {
  const [kind, setKind] = useState<ExportKind>('tokens-studio')
  const [importError, setImportError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const idPrefix = useId()

  const proposals = useMemo(() => anchorProposals(palettes), [palettes])
  const proposedCount = proposals.filter(isProposed).length
  const canDownload = kind === 'palettes' || proposedCount > 0

  const close = () => {
    setImportError(null)
    onClose()
  }

  const download = () => {
    const [filename, data] =
      kind === 'tokens-studio'
        ? ['tokens-studio-anchors.json', tokensStudioAnchorsFile(proposals)]
        : ['palettes.json', palettesFile(palettes)]
    downloadText(filename, JSON.stringify(data, null, 2), 'application/json')
    close()
  }

  const readUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      // Only the parsing is caught, so an error further on is not reported
      // as invalid JSON
      let data: unknown
      try {
        data = JSON.parse(String(reader.result))
      } catch {
        setImportError('The file is not valid JSON.')
        return
      }
      const imported = palettesFromConfig(data)
      if (!imported) {
        setImportError(
          'This file has no palettes. Choose a palettes file downloaded from this tool.',
        )
        return
      }
      onImport(imported)
      close()
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
          <Button variant="primary" onClick={download} disabled={!canDownload}>
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

      {kind === 'tokens-studio' && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-secondary">
            Compared with Tokens Studio
          </span>
          <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
            {proposals.map((p, i) => (
              <li key={`${p.key}-${i}`} className="flex flex-col gap-0.5">
                <span className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-medium text-primary">{p.name}</span>
                  <span
                    className={`inline-flex items-center rounded px-1.5 text-xs leading-[18px] font-medium ${STATUS_TAG[p.status].tone}`}
                  >
                    {STATUS_TAG[p.status].label}
                  </span>
                </span>
                {p.status === 'changed' && (
                  <span className="font-mono text-xs text-secondary">
                    {p.tokensStudioValue} → {p.value}
                  </span>
                )}
                {p.status === 'new' && (
                  <span className="font-mono text-xs text-secondary">
                    input.palette.{p.key}.anchor = {p.value}
                  </span>
                )}
                {p.status === 'several-anchors' && (
                  <span className="text-xs text-secondary">
                    Tokens Studio takes one anchor per hue, so this palette is
                    left out.
                  </span>
                )}
              </li>
            ))}
          </ul>
          {proposedCount === 0 && (
            <p className="m-0 text-sm text-tertiary">
              No anchor differs from Tokens Studio, so there is nothing to
              download.
            </p>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2 border-t border-muted pt-4">
        <span className="text-sm font-medium text-secondary">Import</span>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm" onClick={() => fileInputRef.current?.click()}>
            <Icon data={cloud_upload} size={16} />
            Upload palettes file
          </Button>
          <span className="text-sm text-tertiary">
            Replaces your palettes. Older palette configs work too.
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
