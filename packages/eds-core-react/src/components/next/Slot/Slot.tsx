import {
  forwardRef,
  isValidElement,
  cloneElement,
  useMemo,
  Fragment,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react'
import { getElementRef } from '@equinor/eds-utils'
import type { SlotProps } from './Slot.types'

function mergeClassNames(...classNames: (string | undefined)[]) {
  return classNames.filter(Boolean).join(' ')
}

function isPrevented(event: unknown) {
  return (
    typeof event === 'object' &&
    event !== null &&
    (event as { defaultPrevented?: boolean }).defaultPrevented === true
  )
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
      // Child first; calling preventDefault() there skips the slot's handler
      merged[key] = (...args: unknown[]) => {
        const wasPrevented = isPrevented(args[0])
        ;(childValue as (...a: unknown[]) => void)(...args)
        if (!wasPrevented && isPrevented(args[0])) return
        ;(slotValue as (...a: unknown[]) => void)(...args)
      }
    } else if (slotValue !== undefined) {
      merged[key] = slotValue
    }
  }

  return merged
}

type RefCleanup = void | (() => void)

function setRef<T>(ref: Ref<T> | undefined, node: T | null): RefCleanup {
  if (typeof ref === 'function') return ref(node) as RefCleanup
  if (ref) (ref as { current: T | null }).current = node
}

// Like mergeRefs, but passes on React 19 callback-ref cleanups
function composeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return (node: T | null): RefCleanup => {
    const cleanups = refs.map((ref) => setRef(ref, node))
    if (!cleanups.some((cleanup) => typeof cleanup === 'function')) return

    // React 19 calls a returned cleanup instead of calling the ref with null
    return () =>
      refs.forEach((ref, index) => {
        const cleanup = cleanups[index]
        if (typeof cleanup === 'function') cleanup()
        else setRef(ref, null)
      })
  }
}

function describeInvalidChild(children: ReactNode) {
  if (typeof children === 'string' || typeof children === 'number') {
    return 'text'
  }
  if (Array.isArray(children)) {
    return children.length > 1 ? 'multiple children' : 'an array'
  }
  if (isValidElement(children) && children.type === Fragment) {
    return 'a Fragment'
  }
  return typeof children
}

export const Slot = forwardRef<HTMLElement, SlotProps>(function Slot(
  { children, ...slotProps },
  ref,
) {
  const child =
    isValidElement(children) && children.type !== Fragment
      ? (children as ReactElement<Record<string, unknown>>)
      : null
  const childRef = child ? getElementRef<HTMLElement>(child) : null

  const mergedRef = useMemo(
    () => (childRef ? composeRefs<HTMLElement>(ref, childRef) : ref),
    [ref, childRef],
  )

  if (!child) {
    // Rendering nothing is intended for conditional children like {flag && <a />}
    if (children !== null && children !== undefined && children !== false) {
      console.error(
        `Slot: asChild needs a single React element as its child, got ${describeInvalidChild(children)}. Wrap the content in an element, for example <a href="…">Save</a>.`,
      )
    }
    return null
  }

  const merged = mergeProps(slotProps, child.props)

  return cloneElement(child, { ...merged, ref: mergedRef })
})

Slot.displayName = 'Slot'
