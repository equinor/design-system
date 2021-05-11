import type { CSSProperties } from 'react'
import { usePopper as reactPopper } from 'react-popper'

export type Placement =
  | 'auto'
  | 'auto-start'
  | 'auto-end'
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'left'
  | 'left-start'
  | 'left-end'

export const usePopper = (
  anchorEl: HTMLElement,
  popperEl: HTMLElement,
  arrowRef?: HTMLElement | string,
  placement?: Placement,
  offset = 10,
): {
  styles: { [key: string]: CSSProperties }
  attributes: { [key: string]: { [key: string]: string } }
} => {
  if (placement === undefined) {
    placement = 'auto'
  }
  console.log('a', anchorEl, 'p', popperEl)
  const { styles, attributes } = reactPopper(anchorEl, popperEl, {
    placement,
    modifiers: [
      {
        name: 'arrow',
        options: {
          element: arrowRef,
        },
      },
      {
        name: 'offset',
        options: {
          offset: [0, offset],
        },
      },
    ],
  })

  return { styles, attributes }
}
