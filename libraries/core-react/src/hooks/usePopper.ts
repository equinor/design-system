import type { CSSProperties } from 'react'
import { usePopper as reactPopper } from 'react-popper'
import * as PopperJS from '@popperjs/core'

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
  //state: PopperJS.State | null
  update: PopperJS.Instance['update']
  //forceUpdate: PopperJS.Instance['forceUpdate'] | null
} => {
  if (placement === undefined) {
    placement = 'auto'
  }

  const { styles, attributes, update } = reactPopper(anchorEl, popperEl, {
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

  return { styles, attributes, update }
}
