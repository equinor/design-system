import { useEffect } from 'react'

enum KEY {
  Escape = 'Escape',
  Enter = 'Enter',
  Tab = 'Tab',
  ArrowDown = 'ArrowDown',
  ArrowUp = 'ArrowUp',
}

type KEYTYPES = keyof typeof KEY

export const useGlobalKeyPress = (
  targetKey: KEYTYPES,
  callback: (e: KeyboardEvent) => void,
): void => {
  const handleGlobalKeyPress = (e: KeyboardEvent) => {
    const { key } = e
    switch (key) {
      case targetKey:
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
