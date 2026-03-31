import {
  forwardRef,
  isValidElement,
  cloneElement,
  type ReactElement,
} from 'react'
import type { SlotProps } from './Slot.types'

function mergeClassNames(...classNames: (string | undefined)[]) {
  return classNames.filter(Boolean).join(' ')
}

function mergeProps(
  slotProps: Record<string, unknown>,
  childProps: Record<string, unknown>,
) {
  const merged: Record<string, unknown> = { ...childProps }

  for (const key of Object.keys(slotProps)) {
    const slotValue = slotProps[key]
    const childValue = childProps[key]

    if (key === 'className') {
      merged[key] = mergeClassNames(
        slotValue as string | undefined,
        childValue as string | undefined,
      )
    } else if (key === 'style') {
      merged[key] = { ...(slotValue as object), ...(childValue as object) }
    } else if (
      typeof slotValue === 'function' &&
      typeof childValue === 'function'
    ) {
      merged[key] = (...args: unknown[]) => {
        ;(childValue as (...a: unknown[]) => void)(...args)
        ;(slotValue as (...a: unknown[]) => void)(...args)
      }
    } else if (slotValue !== undefined) {
      merged[key] = slotValue
    }
  }

  return merged
}

export const Slot = forwardRef<HTMLElement, SlotProps>(function Slot(
  { children, ...slotProps },
  ref,
) {
  if (!isValidElement(children)) {
    return null
  }

  const child = children as ReactElement<Record<string, unknown>>
  const merged = mergeProps(slotProps, child.props)

  return cloneElement(child, { ...merged, ref })
})

Slot.displayName = 'Slot'
