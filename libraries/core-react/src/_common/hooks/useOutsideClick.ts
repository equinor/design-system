import { useEffect, MutableRefObject } from 'react'

export const useOutsideClick = (
  ref: MutableRefObject<HTMLElement>,
  callback: () => void,
): void => {
  const handleClick = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      callback()
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  })
}
