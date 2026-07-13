'use client'

import { useRef } from 'react'

type SimpleColorPickerProps = {
  value: string
  onChange: (hex: string) => void
}

export function SimpleColorPicker({ value, onChange }: SimpleColorPickerProps) {
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
        className="w-[80px] px-2 py-1 text-sm font-mono rounded-md border border-neutral-subtle bg-default"
      />
      <button
        type="button"
        onClick={() => nativeRef.current?.click()}
        className="cursor-pointer rounded-md border border-neutral-subtle p-0 relative overflow-hidden shrink-0"
        style={{
          width: '28px',
          height: '28px',
          backgroundColor: displayValue,
        }}
        title="Pick color"
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
