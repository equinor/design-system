/**
 * Detects if the current browser is Firefox
 * @returns true if Firefox, false otherwise
 */
export const isFirefox = (): boolean => {
  return (
    typeof window !== 'undefined' && navigator.userAgent.includes('Firefox')
  )
}
