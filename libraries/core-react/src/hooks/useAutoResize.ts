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
      if (!maxHeight || maxHeight > newHeight) {
        newHeight = Math.max(targetEl.scrollHeight, newHeight)
        if (maxHeight) {
          newHeight = Math.min(maxHeight, newHeight)
        }
        if (newHeight > targetEl.clientHeight) {
          targetEl.style.height = `${newHeight}px`
        }
      }
    }

    targetEl?.addEventListener('keyup', handleResize, true)

    return () => {
      targetEl?.removeEventListener('keyup', handleResize, true)
    }
  }, [targetEl, maxHeight])
}
