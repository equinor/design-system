import { useEffect } from 'react'

export const useAutoResize = (
  // Target element to resize
  targetEl: HTMLElement,
  // Height in pixels
  maxHeight?: number,
): void => {
  useEffect(() => {
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

    if (targetEl && maxHeight) {
      handleResize()
      targetEl.addEventListener('keyup', handleResize, true)
    }

    return () => {
      targetEl?.removeEventListener('keyup', handleResize, true)
    }
  }, [targetEl, maxHeight])
}
