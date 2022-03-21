import { useEffect } from 'react'

export const useOutsideClick = (
  el: HTMLElement | null,
  callback: (e: MouseEvent) => void,
): void => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (el && !el.contains(e.target as Node)) {
        callback(e)
      }
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [el, callback])
}
