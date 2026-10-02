'use client'

import type { ComponentPropsWithoutRef } from 'react'
import { useIsMounted } from '@equinor/eds-utils'
import { useColorScheme } from '@/context/ColorSchemeContext'
import { useDensity } from '@/context/DensityContext'

/**
 * The page's <main>, carrying the chosen Tokens Studio density.
 *
 * The Tokens Studio semantic layer (`--eds-spacing-*`, `--eds-typography-*`
 * and the colour roles) is declared on `:root, [data-color-scheme]`. Its
 * values are resolved where they are declared, so a `data-density` on <main>
 * alone would not reach them. Repeating the page's colour scheme on <main>
 * makes that layer resolve again here, with this element's density.
 *
 * Both attributes are left out until mount: the server does not know the
 * saved choices, and <main> inherits the scheme the pre-paint script set on
 * <html> in the meantime.
 */
export function Main(props: ComponentPropsWithoutRef<'main'>) {
  const { colorScheme } = useColorScheme()
  const { density } = useDensity()
  const isMounted = useIsMounted()

  return (
    <main
      data-density={isMounted ? density : undefined}
      data-color-scheme={isMounted ? colorScheme : undefined}
      {...props}
    />
  )
}
