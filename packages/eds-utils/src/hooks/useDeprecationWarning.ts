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
    // @ts-expect-error - import.meta.env is available in Vite but not standard in TypeScript
    if (
      typeof import.meta !== 'undefined' &&
      import.meta.env?.MODE === 'development'
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
