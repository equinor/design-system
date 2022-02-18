import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import { ModifierPhases, Modifier } from '@popperjs/core'
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

  const modifiers = useMemo(
    () => [
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
      {
        name: 'sameWidth',
        enabled: true,
        phase: 'beforeWrite' as ModifierPhases,
        requires: ['computeStyles'],
        fn({ state }) {
          state.styles.popper.width = `${state.rects.reference.width}px`
        },
        effect({ state }) {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          state.elements.popper.style.width = `${state.elements.reference.clientWidth}px`
        },
      } as Modifier<string, Record<string, unknown>>,
    ],
    [],
  )

  const { styles, attributes } = reactPopper(anchorEl, popperEl, {
    placement,
    modifiers,
  })

  return { styles, attributes }
}
