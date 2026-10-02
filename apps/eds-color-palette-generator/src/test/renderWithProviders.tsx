/**
 * Render helper for component tests. Not a test file itself: Vitest only
 * collects `*.test.*`. The jsdom stand-ins (dialog, matchMedia) are in
 * `setup.ts`.
 */
import { act, render } from '@testing-library/react'
import { useEffect } from 'react'
import type { ReactElement, ReactNode } from 'react'
import { ColorFormatProvider } from '@/context/ColorFormatContext'
import {
  ColorSchemeProvider,
  useColorScheme,
} from '@/context/ColorSchemeContext'
import { DensityProvider } from '@/context/DensityContext'
import type { Scheme } from '@/config/tokensStudio'

function Providers({ children }: { children: ReactNode }) {
  return (
    <ColorSchemeProvider>
      <DensityProvider>
        <ColorFormatProvider>{children}</ColorFormatProvider>
      </DensityProvider>
    </ColorSchemeProvider>
  )
}

type SchemeSetter = (scheme: Scheme) => void

/** Hands the context setter to the test, as the settings dialog would use it. */
function SchemeHandle({ onSetter }: { onSetter: (set: SchemeSetter) => void }) {
  const { setColorScheme } = useColorScheme()
  useEffect(() => {
    onSetter(setColorScheme)
  }, [onSetter, setColorScheme])
  return null
}

/**
 * Render inside the colour scheme, density and colour format providers.
 *
 * ColorSchemeProvider adopts the scheme the pre-paint script set on <html>,
 * so `scheme` is set there before the render. `setColorScheme` switches the
 * scheme afterwards through the context, the way the settings dialog does.
 */
export function renderWithProviders(
  ui: ReactElement,
  { scheme = 'light' }: { scheme?: Scheme } = {},
) {
  document.documentElement.setAttribute('data-color-scheme', scheme)
  let setScheme: SchemeSetter | undefined
  const onSetter = (set: SchemeSetter) => {
    setScheme = set
  }
  const result = render(
    <>
      {ui}
      <SchemeHandle onSetter={onSetter} />
    </>,
    { wrapper: Providers },
  )
  return {
    ...result,
    setColorScheme: (next: Scheme) =>
      act(() => {
        setScheme?.(next)
      }),
  }
}
