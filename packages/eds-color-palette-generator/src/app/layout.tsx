import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '@equinor/eds-tokens/css/variables-static.css'
import './globals.css'
import '@/styles/dialog.css' // Import dialog styles globally
import { ColorSchemeProvider } from '@/context/ColorSchemeContext'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Color Generator',
  description: 'Generate color scales with gaussian distribution',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ColorSchemeProvider>{children}</ColorSchemeProvider>
      </body>
    </html>
  )
}
