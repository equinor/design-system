import type { Metadata } from 'next'
import './preview.css'
import './structure.css'

export const metadata: Metadata = {
  title: 'Preview: EDS beta tokens demo',
}

/* Sets the colour scheme and density from the URL before the first paint,
   so the frame never shows the wrong scheme while it loads. The editor app
   sends later changes as messages. */
const settingsFromUrl = `(() => {
  const params = new URLSearchParams(location.search)
  const scheme = params.get('scheme')
  const density = params.get('density')
  const html = document.documentElement
  if (scheme === 'light' || scheme === 'dark') html.dataset.colorScheme = scheme
  if (density === 'compact' || density === 'comfortable' || density === 'relaxed') html.dataset.density = density
})()`

export default function PreviewLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // data-color-scheme has to be on <html>: the elevation shadows only
    // resolve when it is set on the root element.
    <html
      lang="en"
      data-color-scheme="light"
      data-density="comfortable"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: settingsFromUrl }} />
        {/* The EDS variable font stylesheet declares Inter and Equinor under
            the family names the font tokens resolve to, with Equinor sized to
            Inter's x-height. */}
        <link
          rel="stylesheet"
          href="https://cdn.eds.equinor.com/font/eds-uprights-vf.css"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
