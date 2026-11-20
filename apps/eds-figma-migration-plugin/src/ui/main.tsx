import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { watchClipping } from './fit'
import '@equinor/eds-tokens/next/css/variables.css'
import '@equinor/eds-core-react/next/index.css'
import './ui.css'

watchClipping()

const root = document.getElementById('root')
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
