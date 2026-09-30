'use client'

import { useRef } from 'react'

type SimpleColorPickerProps = {
  value: string
  onChange: (hex: string) => void
  /** Used in the accessible names, e.g. the palette name */
  label?: string
}

export function SimpleColorPicker({
  value,
  onChange,
  label = 'Colour',
}: SimpleColorPickerProps) {
  const nativeRef = useRef<HTMLInputElement>(null)

  const displayValue = value.startsWith('#') ? value : `#${value}`

  return (
    <div className="flex items-center gap-1.5">
      <input
        type="text"
        value={displayValue}
        onChange={(e) => {
          const v = e.target.value.trim()
          onChange(v.startsWith('#') ? v.slice(1) : v)
        }}
        maxLength={7}
        aria-label={`${label} hex value`}
        className="w-[80px] rounded border border-input bg-input px-2 py-1 font-mono text-sm text-primary hover:border-input-hover"
      />
      <button
        type="button"
        onClick={() => nativeRef.current?.click()}
        className="relative size-7 shrink-0 cursor-pointer overflow-hidden rounded border border-input p-0"
        style={{ backgroundColor: displayValue }}
        title="Pick colour"
        aria-label={`Pick ${label} colour`}
      >
        <input
          ref={nativeRef}
          type="color"
          value={displayValue}
          onChange={(e) => onChange(e.target.value.slice(1))}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          tabIndex={-1}
        />
      </button>
    </div>
  )
}
