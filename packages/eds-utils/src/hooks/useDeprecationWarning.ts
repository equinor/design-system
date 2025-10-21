import { useEffect, useRef } from 'react'

/**
 * Hook that displays a deprecation warning in the console during development.
 * The warning is only shown once per component instance and only in development mode.
 *
 * @param message - The deprecation warning message to display
 * @param componentName - Optional component name to prefix the warning
 *
 * @example
 * ```tsx
 * function MyDeprecatedComponent() {
 *   useDeprecationWarning(
 *     'MyComponent is deprecated. Use NewComponent instead.',
 *     'MyComponent'
 *   )
 *   return <div>Content</div>
 * }
 * ```
 */
export const useDeprecationWarning = (
  message: string,
  componentName?: string,
): void => {
  const hasWarned = useRef(false)

  useEffect(() => {
    // Check if we're in development mode
    // Support both Node.js (process.env) and browser/Vite (import.meta.env) environments
    let isDevelopment = false

    // Check Node.js environment (for tests and SSR)
    if (
      typeof process !== 'undefined' &&
      process.env?.NODE_ENV === 'development'
    ) {
      isDevelopment = true
    }

    // Check Vite/browser environment (for Storybook and browser builds)
    // Using type assertion as import.meta.env is a Vite-specific extension
    if (
      typeof import.meta !== 'undefined' &&
      (import.meta as { env?: { MODE?: string } }).env?.MODE === 'development'
    ) {
      isDevelopment = true
    }

    if (isDevelopment && !hasWarned.current) {
      const prefix = componentName ? `[EDS ${componentName}] ` : '[EDS] '
      console.warn(`${prefix}${message}`)
      hasWarned.current = true
    }
  }, [message, componentName])
}
