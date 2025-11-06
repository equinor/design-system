import { useState, useLayoutEffect } from 'react'

/**
 * Hook to check if the component has mounted on the client.
 * Useful for preventing hydration mismatches in Next.js SSR.
 *
 * @returns {boolean} True if the component has mounted, false otherwise
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isMounted = useMounted()
 *
 *   if (!isMounted) {
 *     return <div>Loading...</div>
 *   }
 *
 *   return <div>Client-only content</div>
 * }
 * ```
 */
export function useMounted(): boolean {
  const [isMounted, setMounted] = useState(false)

  useLayoutEffect(() => {
    // eslint-disable-next-line
    setMounted(true)
  }, [])

  return isMounted
}
