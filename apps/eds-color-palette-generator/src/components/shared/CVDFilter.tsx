import type { CSSProperties } from 'react'
import { CVD_MATRICES, type CVDType } from '@/utils/cvd'

/**
 * Renders the SVG <filter> definition for a colour-vision-deficiency
 * simulation. Pair with {@link cvdFilterStyle} to apply it to any preview
 * region — reusable beyond the data-colour chart (status previews, swatches).
 */
export function CVDFilter({ type }: { type: CVDType }) {
  if (type === 'none') return null
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
      <defs>
        <filter id={`cvd-${type}`}>
          <feColorMatrix type="matrix" values={CVD_MATRICES[type]} />
        </filter>
      </defs>
    </svg>
  )
}

/** The inline style that applies the matching CVD filter, or undefined. */
export function cvdFilterStyle(type: CVDType): CSSProperties | undefined {
  return type === 'none' ? undefined : { filter: `url(#cvd-${type})` }
}
