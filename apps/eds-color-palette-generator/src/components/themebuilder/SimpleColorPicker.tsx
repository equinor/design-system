'use client'

import { useRef, useState } from 'react'
import {
  isValidColorFormat,
  parseColorToHex,
  toCssColor,
  toOklchString,
} from '@/utils/color'

type SimpleColorPickerProps = {
  /** The colour, usually OKLCH; any CSS colour is accepted */
  value: string
  onChange: (colour: string) => void
  /** Used in the accessible names, e.g. the palette name */
  label?: string
}

/**
 * A palette's single colour, shown and edited in OKLCH (ADR 0016 D9). Any
 * CSS colour can be typed; the native picker works in hex, so its choice is
 * converted to OKLCH.
 */
export function SimpleColorPicker({
  value,
  onChange,
  label = 'Colour',
}: SimpleColorPickerProps) {
  const nativeRef = useRef<HTMLInputElement>(null)
  const css = toCssColor(value)
  // What the user is typing; only valid colours reach the palette.
  const [draft, setDraft] = useState<string | null>(null)
  const shown = draft ?? css
  const valid = isValidColorFormat(shown)

  return (
    <div className="flex items-center gap-1.5">
      <input
        type="text"
        value={shown}
        onChange={(e) => {
          const next = e.target.value
          setDraft(next)
          if (isValidColorFormat(next)) onChange(next.trim())
        }}
        onBlur={() => setDraft(null)}
        spellCheck={false}
        aria-label={`${label} colour value`}
        aria-invalid={!valid}
        className={[
          'w-[240px] rounded border bg-input px-2 py-1 font-mono text-sm text-primary',
          valid ? 'border-input hover:border-input-hover' : 'border-danger',
        ].join(' ')}
      />
      <button
        type="button"
        onClick={() => nativeRef.current?.click()}
        className="relative size-7 shrink-0 cursor-pointer overflow-hidden rounded border border-input p-0"
        style={{ backgroundColor: css }}
        title="Pick colour"
        aria-label={`Pick ${label} colour`}
      >
        <input
          ref={nativeRef}
          type="color"
          value={parseColorToHex(css) ?? '#808080'}
          onChange={(e) => {
            setDraft(null)
            onChange(toOklchString(e.target.value) ?? e.target.value)
          }}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          tabIndex={-1}
        />
      </button>
    </div>
  )
}
