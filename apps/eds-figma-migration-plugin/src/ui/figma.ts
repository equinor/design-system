import { useEffect, useState } from 'react'
import type { PluginToUi, UiToPlugin } from '../shared/messages'

/** Sends a message to the plugin main thread. */
export function send(message: UiToPlugin) {
  parent.postMessage({ pluginMessage: message }, '*')
}

/** Calls `handler` for every message from the plugin main thread. */
export function usePluginMessages(handler: (message: PluginToUi) => void) {
  useEffect(() => {
    const listener = (event: MessageEvent<{ pluginMessage?: PluginToUi }>) => {
      const message = event.data?.pluginMessage
      if (message) handler(message)
    }
    window.addEventListener('message', listener)
    return () => window.removeEventListener('message', listener)
  }, [handler])
}

function figmaScheme(): 'light' | 'dark' {
  return document.documentElement.classList.contains('figma-dark')
    ? 'dark'
    : 'light'
}

/**
 * Follows Figma's light or dark theme. With `themeColors: true`, Figma puts
 * the class `figma-dark` or `figma-light` on <html>; the EDS tokens switch on
 * `data-color-scheme`, so this copies the one to the other.
 */
export function useFigmaColorScheme(): 'light' | 'dark' {
  const [scheme, setScheme] = useState(figmaScheme)
  useEffect(() => {
    const observer = new MutationObserver(() => setScheme(figmaScheme()))
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    document.documentElement.dataset.colorScheme = scheme
  }, [scheme])
  return scheme
}
