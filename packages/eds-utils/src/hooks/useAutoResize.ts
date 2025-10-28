import { useEffect, RefObject } from 'react'

export const useAutoResize = <T extends HTMLElement = HTMLElement>(
  // Target element ref to resize
  targetRef: RefObject<T>,
  // Height in pixels
  maxHeight?: number,
): void => {
  useEffect(() => {
    const targetEl = targetRef.current
    if (!targetEl || !maxHeight) return

    const handleResize = () => {
      targetEl.style.height = 'auto'
      const { scrollHeight, clientHeight } = targetEl
      let newHeight = clientHeight

      if (maxHeight > newHeight) {
        newHeight = Math.min(maxHeight, Math.max(scrollHeight, newHeight))

        if (scrollHeight > maxHeight) {
          targetEl.style.overflow = 'auto'
        } else {
          targetEl.style.overflow = 'hidden'
        }

        if (newHeight > clientHeight) {
          targetEl.style.height = `${newHeight}px`
        }
      }
    }

    handleResize()
    targetEl.addEventListener('keyup', handleResize, true)

    return () => {
      targetEl.removeEventListener('keyup', handleResize, true)
    }
  }, [targetRef, maxHeight])
}
