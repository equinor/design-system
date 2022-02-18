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

type PopperModifier = Modifier<string, Record<string, unknown>>

const autoWidthModifier = {
  name: 'sameWidth',
  enabled: true,
  phase: 'beforeWrite' as ModifierPhases,
  requires: ['computeStyles'],
  fn({ state }) {
    state.styles.popper.width = `${state.rects.reference.width}px`
  },
  effect({ state }) {
    state.elements.popper.style.width = `${
      (state.elements.reference as Element).clientWidth
    }px`
  },
} as PopperModifier

export const usePopper = (
  anchorEl: HTMLElement,
  popperEl: HTMLElement,
  arrowRef?: HTMLElement | string,
  placement?: Placement,
  offset = 10,
  autoWidth?: boolean,
): {
  styles: { [key: string]: CSSProperties }
  attributes: { [key: string]: { [key: string]: string } }
} => {
  if (placement === undefined) {
    placement = 'auto'
  }

  const modifiers = useMemo(() => {
    let modifiers: Partial<PopperModifier>[] = [
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
    ]

    if (autoWidth) {
      modifiers = [...modifiers, autoWidthModifier]
    }

    return modifiers
  }, [arrowRef, offset, autoWidth])

  const { styles, attributes } = reactPopper(anchorEl, popperEl, {
    placement,
    modifiers,
  })

  return { styles, attributes }
}
