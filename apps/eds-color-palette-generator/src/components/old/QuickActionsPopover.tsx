'use client'

import React, { useEffect, useRef, useState } from 'react'
import { cloud_upload, code, download, file } from '@equinor/eds-icons'
import { ColorDefinition, ColorFormat, ConfigFile } from '@/types'
import {
  downloadColorTokens,
  downloadConfiguration,
  downloadDesignSystemCSS,
} from '@/utils/configurationUtils'
import { Button } from '@/components/shared/Button'
import { Icon } from '@/components/shared/Icon'
import { SegmentedControl } from '@/components/shared/SegmentedControl'
import type { SegmentedOption } from '@/components/shared/SegmentedControl'

const FORMAT_OPTIONS: SegmentedOption<ColorFormat>[] = [
  { value: 'OKLCH', label: 'OKLCH' },
  { value: 'HEX', label: 'HEX' },
]

const MENU_ITEM =
  'w-full flex items-center gap-2 px-3 py-2 text-left text-base text-primary hover:bg-neutral-muted active:bg-neutral-muted-hover rounded cursor-pointer'

const MENU_LABEL = 'px-3 py-2 text-sm text-secondary'

type Props = {
  lightModeValues: number[]
  darkModeValues: number[]
  meanLight: number
  stdDevLight: number
  meanDark: number
  stdDevDark: number
  colors: ColorDefinition[]
  colorFormat: ColorFormat
  setColorFormat: React.Dispatch<React.SetStateAction<ColorFormat>>
  onConfigUpload: (config: ConfigFile) => void
}

export function QuickActionsPopover(props: Props) {
  const {
    lightModeValues,
    darkModeValues,
    meanLight,
    stdDevLight,
    meanDark,
    stdDevDark,
    colors,
    colorFormat,
    setColorFormat,
    onConfigUpload,
  } = props

  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const firstActionRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) return
      if (!rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('click', onDocClick)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('click', onDocClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [])

  useEffect(() => {
    if (open) {
      // Move focus inside the popover
      setTimeout(() => firstActionRef.current?.focus(), 0)
    } else {
      // Restore focus to trigger when closing
      setTimeout(() => triggerRef.current?.focus(), 0)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <Button
        variant="primary"
        iconOnly
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="shadow-sm"
        title="Import / Export"
        aria-label="Import and export options"
        aria-controls="quick-actions-popover"
        ref={triggerRef}
      >
        <Icon data={download} size={18} />
      </Button>

      {open && (
        <div
          id="quick-actions-popover"
          className="absolute bottom-12 right-0 w-64 rounded border border-muted bg-floating text-primary shadow-lg py-4 px-2"
          role="region"
          aria-label="Quick actions"
        >
          <div className={MENU_LABEL}>Export</div>
          <button
            type="button"
            className={MENU_ITEM}
            onClick={() =>
              downloadConfiguration(
                lightModeValues,
                darkModeValues,
                meanLight,
                stdDevLight,
                meanDark,
                stdDevDark,
                colors,
              )
            }
          >
            <Icon data={code} size={16} />
            <span>Palette config</span>
          </button>
          <button
            type="button"
            className={MENU_ITEM}
            onClick={() =>
              downloadDesignSystemCSS(
                colors,
                meanLight,
                stdDevLight,
                meanDark,
                stdDevDark,
                colorFormat,
              )
            }
          >
            <Icon data={code} size={16} />
            <span>CSS variables</span>
          </button>
          <button
            type="button"
            className={MENU_ITEM}
            onClick={() =>
              downloadColorTokens(
                colors,
                lightModeValues,
                darkModeValues,
                meanLight,
                stdDevLight,
                meanDark,
                stdDevDark,
                colorFormat,
              )
            }
          >
            <Icon data={file} size={16} />
            <span>JSON config</span>
          </button>
          <div className={MENU_LABEL}>Import</div>
          <button
            ref={firstActionRef}
            type="button"
            className={MENU_ITEM}
            onClick={() => fileInputRef.current?.click()}
          >
            <Icon data={cloud_upload} size={16} />
            <span>Upload config</span>
          </button>
          <div className="h-px bg-neutral-muted my-1" />
          <div className={MENU_LABEL}>Format</div>
          <div className="px-2 pb-2">
            <SegmentedControl
              mode="radio"
              aria-label="Colour format"
              size="sm"
              options={FORMAT_OPTIONS}
              value={colorFormat}
              onChange={setColorFormat}
            />
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={(event) => {
          const files = event.target.files
          if (!files || files.length === 0) return
          const file = files[0]
          const reader = new FileReader()
          reader.onload = (e) => {
            try {
              let cfg = JSON.parse(String(e.target?.result))
              if (
                typeof cfg.mean === 'number' &&
                typeof cfg.stdDev === 'number' &&
                (cfg.meanLight === undefined ||
                  cfg.stdDevLight === undefined ||
                  cfg.meanDark === undefined ||
                  cfg.stdDevDark === undefined)
              ) {
                cfg = {
                  ...cfg,
                  meanLight: cfg.mean,
                  stdDevLight: cfg.stdDev,
                  meanDark: cfg.mean,
                  stdDevDark: cfg.stdDev,
                }
              }
              if (
                !cfg.lightModeValues ||
                !cfg.darkModeValues ||
                typeof cfg.meanLight !== 'number' ||
                typeof cfg.stdDevLight !== 'number' ||
                typeof cfg.meanDark !== 'number' ||
                typeof cfg.stdDevDark !== 'number'
              ) {
                alert('Invalid configuration file format')
                return
              }
              onConfigUpload({ ...cfg })
              setOpen(false)
            } catch (err) {
              console.error('Error parsing configuration file:', err)
              alert('Could not parse configuration file')
            } finally {
              if (event.target) (event.target as HTMLInputElement).value = ''
            }
          }
          reader.readAsText(file)
        }}
      />
    </div>
  )
}
