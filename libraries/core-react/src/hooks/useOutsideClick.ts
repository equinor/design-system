import { useEffect, MutableRefObject } from 'react'

export const useOutsideClick = (
  ref: MutableRefObject<HTMLElement>,
  callback: (e: MouseEvent) => void,
): void => {
  const handleClick = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      callback(e)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  })
}
