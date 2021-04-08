import { usePopper as reactPopper } from 'react-popper'

export const PlacementValues = [
  'auto',
  'auto-start',
  'auto-end',
  'top',
  'top-start',
  'top-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'right',
  'right-start',
  'right-end',
  'left',
  'left-start',
  'left-end',
] as const

export type Placement = typeof PlacementValues[number]

export const usePopper = (
  anchorEl: HTMLElement,
  popperEl: HTMLElement,
  arrowRef?: HTMLElement | string,
  placement?: Placement,
  offset = 10,
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
          offset: [0, offset],
        },
      },
    ],
  })

  return { styles, attributes }
}
