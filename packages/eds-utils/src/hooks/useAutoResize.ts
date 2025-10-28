import { useCallback, useState, useEffect } from 'react'

export const useAutoResize = <T extends HTMLElement = HTMLElement>(
  // Height in pixels
  maxHeight?: number,
) => {
  const [element, setElement] = useState<T | null>(null)

  const refCallback = useCallback((node: T | null) => {
    setElement(node)
  }, [])

  useEffect(() => {
    if (!element || !maxHeight) return

    const handleResize = () => {
      element.style.height = 'auto'
      const { scrollHeight, clientHeight } = element
      let newHeight = clientHeight

      if (maxHeight > newHeight) {
        newHeight = Math.min(maxHeight, Math.max(scrollHeight, newHeight))

        if (scrollHeight > maxHeight) {
          element.style.overflow = 'auto'
        } else {
          element.style.overflow = 'hidden'
        }

        if (newHeight > clientHeight) {
          element.style.height = `${newHeight}px`
        }
      }
    }

    handleResize()
    element.addEventListener('keyup', handleResize, true)

    return () => {
      element.removeEventListener('keyup', handleResize, true)
    }
  }, [element, maxHeight])

  return refCallback
}
