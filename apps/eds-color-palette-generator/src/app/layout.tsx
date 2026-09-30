import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '@equinor/eds-tokens/css/variables'
import './globals.css'
import '@/styles/dialog.css' // Import dialog styles globally
import '@/styles/print.css' // Import print styles globally
import { ColorSchemeProvider } from '@/context/ColorSchemeContext'
import { COLOR_SCHEME_SCRIPT } from '@/context/colorSchemeScript'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'EDS Theme Builder',
  description:
    'Build accessible colour themes and palettes for the Equinor Design System',
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ColorSchemeProvider>{children}</ColorSchemeProvider>
      </body>
    </html>
  )
}
