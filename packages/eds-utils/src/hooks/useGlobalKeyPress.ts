import { useEffect } from 'react'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  useEffect(() => {
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

    document.addEventListener('keydown', handleGlobalKeyPress, true)

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyPress, true)
    }
  }, [targetKey, callback])
}
