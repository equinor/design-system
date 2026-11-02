import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Toolbar } from './_components/Toolbar'
import {
  COLOR_SCHEME_COOKIE,
  DENSITY_COOKIE,
  toColorScheme,
  toDensity,
} from './_lib/preferences'
import './globals.css'

export const metadata: Metadata = {
  title: 'EDS beta tokens demo',
  description:
    'A dashboard built with the beta design tokens from the Equinor Design System',
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const store = await cookies()
  const colorScheme = toColorScheme(store.get(COLOR_SCHEME_COOKIE)?.value)
  const density = toDensity(store.get(DENSITY_COOKIE)?.value)

  return (
    // The server renders both attributes, so the first paint already has the
    // right colours and spacing. data-color-scheme has to be on <html>: the
    // elevation shadows only resolve when it is set on the root element.
    <html lang="en" data-color-scheme={colorScheme} data-density={density}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.eds.equinor.com/font/equinor-font.css"
        />
      </head>
      <body>
        <Toolbar colorScheme={colorScheme} density={density} />
        {children}
      </body>
    </html>
  )
}
