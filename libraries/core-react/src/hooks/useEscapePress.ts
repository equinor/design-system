import { useEffect, MutableRefObject } from 'react'

export const useOutsideClick = (
  ref: MutableRefObject<HTMLElement>,
  callback: () => void,
): void => {
  const handleGlobalKeyPress = (e: KeyboardEvent) => {
    const { key } = e

    switch (key) {
      case 'Escape':
        callback()
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
  }, [ref.current])
}
