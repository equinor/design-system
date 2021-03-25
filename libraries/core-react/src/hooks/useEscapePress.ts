import { useEffect } from 'react'

export const useEscapePress = (callback: (e: KeyboardEvent) => void): void => {
  const handleGlobalKeyPress = (e: KeyboardEvent) => {
    const { key } = e

    switch (key) {
      case 'Escape':
        callback(e)
        break
      default:
        break
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleGlobalKeyPress, true)

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyPress, true)
    }
  }, [])
}
