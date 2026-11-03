import type { Metadata } from 'next'
import './app.css'

export const metadata: Metadata = {
  title: 'EDS beta tokens demo',
  description:
    'Edit the CSS of a dashboard built with the beta design tokens from the Equinor Design System',
}

/* Sets the saved colour scheme before the first paint, so a reload in the
   dark scheme does not flash light. The workbench keeps it in step after
   that. */
const savedColorScheme = `(() => {
  try {
    const scheme = localStorage.getItem('eds-demo:color-scheme')
    if (scheme === 'light' || scheme === 'dark') document.documentElement.dataset.colorScheme = scheme
  } catch {}
})()`

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // The app around the frame follows the colour scheme switch, like the
    // dashboard; only the editor keeps its own dark theme. Density only
    // changes the dashboard, so the strip stays the same size.
    <html
      lang="en"
      data-color-scheme="light"
      data-density="comfortable"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: savedColorScheme }} />
        <link
          rel="stylesheet"
          href="https://cdn.eds.equinor.com/font/eds-uprights-vf.css"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
