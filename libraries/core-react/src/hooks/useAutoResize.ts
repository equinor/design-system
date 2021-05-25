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
      let newHeight = targetEl.clientHeight

      if (maxHeight > newHeight) {
        newHeight = Math.min(
          maxHeight,
          Math.max(targetEl.scrollHeight, newHeight),
        )

        if (targetEl.scrollHeight > maxHeight) {
          targetEl.style.overflow = 'auto'
        } else {
          targetEl.style.overflow = 'hidden'
        }

        if (newHeight > targetEl.clientHeight) {
          targetEl.style.height = `${newHeight}px`
        }
      }
    }

    if (targetEl) {
      handleResize()
    }

    targetEl?.addEventListener('keyup', handleResize, true)

    return () => {
      targetEl?.removeEventListener('keyup', handleResize, true)
    }
  }, [targetEl, maxHeight])
}
