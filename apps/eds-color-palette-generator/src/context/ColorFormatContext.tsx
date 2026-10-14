'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import type { ColorFormat } from '@/types'
import { parseColorToHex, toCssColor, toOklchString } from '@/utils/color'
import { localStorageUtils } from '@/utils/localStorage'

type ColorFormatContextType = {
  /** How colour values are shown: OKLCH (canonical, ADR 0016 D9) or HEX */
  format: ColorFormat
  setFormat: (format: ColorFormat) => void
  /** A colour in the chosen format. OKLCH text is shown as written. */
  formatColour: (colour: string) => string
}

const ColorFormatContext = createContext<ColorFormatContextType | undefined>(
  undefined,
)

/** A colour as text in `format`; OKLCH text that is already OKLCH is kept. */
export function colourInFormat(colour: string, format: ColorFormat): string {
  const css = toCssColor(colour)
  if (format === 'HEX') {
    const hex = parseColorToHex(css)
    if (!hex) return css
    // Always six digits: #fff → #ffffff
    return hex.length === 4 ? hex.replace(/[0-9a-f]/gi, (d) => d + d) : hex
  }
  return css.startsWith('oklch(') ? css : (toOklchString(css) ?? css)
}

/** The colour display format for one page, remembered across visits. */
export function ColorFormatProvider({ children }: { children: ReactNode }) {
  // OKLCH on the server and the first render, so hydration matches; the
  // saved choice is applied after mount.
  const [format, setFormatState] = useState<ColorFormat>('OKLCH')

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only sync with the saved choice after hydration
    setFormatState(localStorageUtils.getColorFormat('OKLCH'))
  }, [])

  const setFormat = useCallback((next: ColorFormat) => {
    localStorageUtils.setColorFormat(next)
    setFormatState(next)
  }, [])

  const value = useMemo(
    () => ({
      format,
      setFormat,
      formatColour: (colour: string) => colourInFormat(colour, format),
    }),
    [format, setFormat],
  )

  return (
    <ColorFormatContext.Provider value={value}>
      {children}
    </ColorFormatContext.Provider>
  )
}

export function useColorFormat(): ColorFormatContextType {
  const context = useContext(ColorFormatContext)
  if (!context) {
    throw new Error('useColorFormat must be used within a ColorFormatProvider')
  }
  return context
}
