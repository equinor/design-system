'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { contrast } from '@/utils/color'
import { STEP_ROLES } from '@/utils/palette'
import { STEP_TOKENS, TOKEN_CATEGORY_GROUPS } from '@/config/categories'

type GeneratedPalette = {
  name: string
  steps: string[]
}

type TokenMatrixProps = {
  palettes: GeneratedPalette[]
}

function getTextColor(bgHex: string): string {
  const whiteContrast = parseFloat(
    String(
      contrast({
        foreground: '#ffffff',
        background: bgHex,
        algorithm: 'WCAG21',
        silent: true,
      }),
    ),
  )
  return whiteContrast >= 3 ? '#fff' : '#000'
}

export function TokenMatrix({ palettes }: TokenMatrixProps) {
  if (palettes.length === 0) return null

  return (
    <section className="rounded-xl overflow-hidden border border-neutral-subtle bg-default">
      <h2 className="font-semibold text-sm px-5 pt-4">Token Matrix</h2>

      <div className="px-5 pb-5 pt-3 overflow-x-auto">
        {/* Category group headers */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(100px, auto) repeat(15, minmax(58px, 1fr))',
            gap: '2px',
          }}
        >
          {/* Spacer for row label column */}
          <div />
          {TOKEN_CATEGORY_GROUPS.map((group) => (
            <div
              key={group.label}
              className="text-center text-subtle"
              style={{
                gridColumn: `span ${group.span}`,
                paddingBottom: '4px',
                fontSize: '10px',
                whiteSpace: 'nowrap',
              }}
            >
              {group.label}
              <div
                className="border-t border-neutral-subtle"
                style={{ marginTop: '2px' }}
              />
            </div>
          ))}

          {/* Token name + step number headers */}
          <div />
          {STEP_TOKENS.map((token, i) => (
            <div
              key={`${token.name}-${token.sub ?? ''}-${i}`}
              className="text-center text-subtle"
              style={{
                fontSize: '8px',
                lineHeight: 1.2,
                paddingBottom: '4px',
              }}
              title={`Step ${i + 1} · ${STEP_ROLES[i]}`}
            >
              <div style={{ fontWeight: 600 }}>{token.name}</div>
              {token.sub ? <div>{token.sub}</div> : null}
              <div style={{ opacity: 0.5 }}>{i + 1}</div>
            </div>
          ))}

          {/* Palette rows */}
          {palettes.map((palette) => (
            <PaletteRow key={palette.name} palette={palette} />
          ))}
        </div>
      </div>
    </section>
  )
}

function PaletteRow({ palette }: { palette: GeneratedPalette }) {
  const textColors = useMemo(
    () => palette.steps.map(getTextColor),
    [palette.steps],
  )
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Clear the pending "Copied!" reset timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleCopy = useCallback(async (hex: string, i: number) => {
    try {
      await navigator.clipboard.writeText(hex)
    } catch {
      // Clipboard unavailable (e.g. non-secure context) — nothing to show
      return
    }
    setCopiedIndex(i)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setCopiedIndex(null), 1200)
  }, [])

  return (
    <>
      <div
        className="flex items-center text-xs font-semibold"
        style={{ paddingRight: '8px', whiteSpace: 'nowrap' }}
      >
        {palette.name}
      </div>
      {palette.steps.map((hex, i) => {
        const isCopied = copiedIndex === i
        return (
          <button
            type="button"
            key={`${palette.name}-${i}`}
            onClick={() => handleCopy(hex, i)}
            className="flex items-center justify-center"
            style={{
              backgroundColor: hex,
              color: textColors[i],
              height: '44px',
              border: 'none',
              padding: '0 2px',
              appearance: 'none',
              borderRadius:
                i === 0
                  ? '8px 0 0 8px'
                  : i === palette.steps.length - 1
                    ? '0 8px 8px 0'
                    : undefined,
              fontSize: '9px',
              fontWeight: 600,
              fontVariantNumeric: 'tabular-nums',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
            title={`${i + 1}. ${STEP_ROLES[i]}: ${hex} — click to copy`}
            aria-label={`Copy ${palette.name} step ${i + 1} (${STEP_ROLES[i]}): ${hex}`}
          >
            {isCopied ? 'Copied!' : hex}
          </button>
        )
      })}
    </>
  )
}
