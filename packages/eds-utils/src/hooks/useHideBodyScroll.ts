import { useEffect, useRef } from 'react'

interface DialogState {
  count: number
  originalOverflow: string
  originalPaddingRight: string
}

export const dialogState: DialogState = {
  count: 0,
  originalOverflow: '',
  originalPaddingRight: '',
}

export const useHideBodyScroll = (active: boolean): void => {
  const wasActive = useRef(false)
  useEffect(() => {
    if (typeof document === 'undefined') return

    const { body } = document
    const html = document.documentElement

    if (active && !wasActive.current) {
      wasActive.current = true

      if (dialogState.count === 0) {
        dialogState.originalOverflow = body.style.overflow || ''
        dialogState.originalPaddingRight = body.style.paddingRight || ''
        const scrollBarWidth = window.innerWidth - html.clientWidth
        const bodyPaddingRight =
          parseInt(
            window.getComputedStyle(body).getPropertyValue('padding-right'),
          ) || 0
        body.style.overflow = 'hidden'
        body.style.paddingRight = `${bodyPaddingRight + scrollBarWidth}px`
      }
      dialogState.count += 1
    } else if (!active && wasActive.current) {
      wasActive.current = false
      dialogState.count = Math.max(0, dialogState.count - 1)

      if (dialogState.count === 0) {
        body.style.overflow = dialogState.originalOverflow
        body.style.paddingRight = dialogState.originalPaddingRight
      }
    }
    return () => {
      if (wasActive.current) {
        wasActive.current = false
        dialogState.count = Math.max(0, dialogState.count - 1)

        if (dialogState.count === 0) {
          body.style.overflow = dialogState.originalOverflow
          body.style.paddingRight = dialogState.originalPaddingRight
        }
      }
    }
  }, [active])
}
