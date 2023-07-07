import { useEffect, useRef } from 'react'

type Styles = {
  overflow: string
  paddingRight: string
}

export const useHideBodyScroll = (active: boolean): void => {
  const originalStyles = useRef<Styles | undefined>()
  useEffect(() => {
    if (typeof document === 'undefined') return
    const html = document.documentElement
    const { body } = document

    if (active) {
      const scrollBarWidth = window.innerWidth - html.clientWidth
      const bodyPaddingRight =
        parseInt(
          window.getComputedStyle(body).getPropertyValue('padding-right'),
        ) || 0
      const oldStyle: Styles = {
        overflow: body.style.overflow,
        paddingRight: body.style.paddingRight,
      }
      originalStyles.current = oldStyle

      body.style.overflow = 'hidden'
      body.style.paddingRight = `${bodyPaddingRight + scrollBarWidth}px`
    } else if (originalStyles.current) {
      body.style.overflow = originalStyles.current.overflow
      body.style.paddingRight = originalStyles.current.paddingRight
    }
    const originalState = originalStyles.current
    return () => {
      body.style.overflow = originalState?.overflow
      body.style.paddingRight = originalState?.paddingRight
    }
  }, [active])
}
