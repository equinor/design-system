'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Download, Upload, FileJson, FileCode } from 'lucide-react'
import { ColorDefinition, ColorFormat, ConfigFile } from '@/types'
import {
  downloadColorTokens,
  downloadConfiguration,
  downloadDesignSystemCSS,
} from '@/utils/configurationUtils'

type Props = {
  lightModeValues: number[]
  darkModeValues: number[]
  meanLight: number
  stdDevLight: number
  meanDark: number
  stdDevDark: number
  colors: ColorDefinition[]
  colorFormat: ColorFormat
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
    onConfigUpload,
  } = props

  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

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

  const triggerClass =
    'inline-flex items-center justify-center p-2 rounded-md bg-accent-medium-default hover:bg-accent-medium-hover transition-colors shadow-sm'

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={triggerClass}
        title="Import / Export"
      >
        <Download className="w-4 h-4" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute bottom-12 right-0 w-64 rounded-lg border border-neutral-subtle bg-elevated shadow-lg overflow-hidden"
        >
          <div className="px-3 py-2 text-sm text-subtle">Import</div>
          <button
            role="menuitem"
            className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-neutral-medium-hover"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4" />
            <span>Upload config</span>
          </button>
          <div className="h-px bg-neutral-subtle my-1" />
          <div className="px-3 py-2 text-sm text-subtle">Export</div>
          <button
            role="menuitem"
            className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-neutral-medium-hover"
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
            <Download className="w-4 h-4" />
            <span>Palette config</span>
          </button>
          <button
            role="menuitem"
            className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-neutral-medium-hover"
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
            <FileCode className="w-4 h-4" />
            <span>CSS variables</span>
          </button>
          <button
            role="menuitem"
            className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-neutral-medium-hover"
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
            <FileJson className="w-4 h-4" />
            <span>JSON config</span>
          </button>
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
