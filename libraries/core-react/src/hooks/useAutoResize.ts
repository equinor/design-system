import { useEffect } from 'react'

export const useAutoResize = (
  // Target element to resize
  targetEl: HTMLElement,
  // Height in pixels
  maxHeight?: number,
): number => {
  let newHeight = 0

  useEffect(() => {
    const handleResize = () => {
      newHeight = targetEl.clientHeight
      console.log(targetEl, maxHeight)
      if (!maxHeight || maxHeight > newHeight) {
        newHeight = Math.max(targetEl.scrollHeight, newHeight)
        console.log('first call', newHeight)

        if (maxHeight) {
          newHeight = Math.min(maxHeight, newHeight)
          console.log('maxheight is set', newHeight)
        }
        if (newHeight > targetEl.clientHeight) {
          targetEl.style.height = `${newHeight}px`
          console.log('newheight added to style', newHeight)
        }
      }
    }

    targetEl?.addEventListener('keyup', handleResize, true)
    return () => {
      targetEl?.removeEventListener('keyup', handleResize, true)
    }
  }, [targetEl, maxHeight])

  return newHeight
}
