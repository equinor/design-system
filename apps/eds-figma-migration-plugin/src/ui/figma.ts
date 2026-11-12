import { useEffect, useState } from 'react'
import type { PluginToUi, UiToPlugin } from '../shared/messages'
import type { WindowTheme } from '../shared/window'

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
 * The window's theme. It follows Figma's light or dark theme unless the
 * person chose one in Settings. With `themeColors: true`, Figma puts the
 * class `figma-dark` or `figma-light` on <html>; the EDS tokens switch on
 * `data-color-scheme`, so this sets that.
 */
export function useFigmaColorScheme(
  theme: WindowTheme = 'figma',
): 'light' | 'dark' {
  const [figma, setScheme] = useState(figmaScheme)
  const scheme = theme === 'figma' ? figma : theme
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
