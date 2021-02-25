import * as React from 'react'
import {
  useEffect,
  useState,
  useRef,
  ReactNode,
  HTMLAttributes,
  MutableRefObject,
} from 'react'
// import * as PopperJS from '@popperjs/core'
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
): {
  styles: { [key: string]: any }
  attributes: { [key: string]: { [key: string]: string } }
  //   state: PopperJS.State | null
  //   update: PopperJS.Instance['update'] | null
  //   forceUpdate: PopperJS.Instance['forceUpdate'] | null
} => {
  if (placement === undefined) {
    placement = 'auto'
  }

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
          offset: [0, 10],
        },
      },
    ],
  })

  return { styles, attributes }
}
