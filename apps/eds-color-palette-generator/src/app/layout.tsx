import type { Metadata } from 'next'
import './globals.css'
import '@/styles/print.css' // Import print styles globally
import { ColorSchemeProvider } from '@/context/ColorSchemeContext'
import { DensityProvider } from '@/context/DensityContext'
import { COLOR_SCHEME_SCRIPT } from '@/context/colorSchemeScript'

export const metadata: Metadata = {
  title: 'EDS Colour Palette Generator',
  description:
    'Internal tool for proposing and checking colour palettes for the Equinor Design System. Tokens Studio is the source of truth.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // The pre-paint script may change data-color-scheme before hydration.
    <html lang="en" data-color-scheme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: COLOR_SCHEME_SCRIPT }} />
        {/* EDS fonts: Inter for UI text, Equinor for headings */}
        <link
          rel="stylesheet"
          href="https://cdn.eds.equinor.com/font/eds-uprights-vf.css"
        />
      </head>
      <body className="antialiased">
        <ColorSchemeProvider>
          <DensityProvider>{children}</DensityProvider>
        </ColorSchemeProvider>
      </body>
    </html>
  )
}
