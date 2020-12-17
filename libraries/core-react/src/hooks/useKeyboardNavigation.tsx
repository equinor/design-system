import { useState, useEffect, MutableRefObject } from 'react'

export const useKeyboardNavigation = (
  ref: MutableRefObject<HTMLElement>,
  size: number,
  // callback: () => void,
): number => {
  const [activeIndex, setActiveIndex] = useState(0)

  const handleKeyPress = (event) => {
    if (event.key === 'ArrowDown') {
      setActiveIndex((prev) => (prev < size ? prev + 1 : 0))
    } else if (event.key === 'ArrowUp') {
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : size))
    }
  }

  useEffect(() => setActiveIndex(0), [size])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress)

    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [size, activeIndex])

  return activeIndex
}
