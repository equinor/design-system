import { useEffect, MutableRefObject } from 'react'

type Ref<T> = MutableRefObject<T>

export const useOutsideClick = <T extends HTMLElement>(
  ref: Ref<T>,
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
