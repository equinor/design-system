import { useEffect, MutableRefObject } from 'react'

export const useOutsideClick = (
  ref: MutableRefObject<HTMLElement> | MutableRefObject<HTMLDivElement>,
  callback: (e: MouseEvent) => void,
): void => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback(e)
      }
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [ref, callback])
}
