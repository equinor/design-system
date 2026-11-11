import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import '@equinor/eds-tokens/next/css/variables.css'
import '@equinor/eds-core-react/next/index.css'
import './ui.css'

// In the prototype, the shell sets Figma's theme with a message, since a
// page opened from disk cannot reach into the iframe. Figma itself sets the
// figma-dark and figma-light classes on <html>.
window.addEventListener('message', (event: MessageEvent) => {
  const theme = (event.data as { prototypeTheme?: string } | null)
    ?.prototypeTheme
  if (theme !== 'dark' && theme !== 'light') return
  document.documentElement.classList.toggle('figma-dark', theme === 'dark')
  document.documentElement.classList.toggle('figma-light', theme === 'light')
})

const root = document.getElementById('root')
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
