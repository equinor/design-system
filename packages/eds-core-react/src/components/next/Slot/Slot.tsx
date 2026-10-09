import {
  forwardRef,
  isValidElement,
  cloneElement,
  useMemo,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react'
import { mergeRefs } from '@equinor/eds-utils'
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
        ;(childValue as (...a: unknown[]) => void)(...args)
        if (isPrevented(args[0])) return
        ;(slotValue as (...a: unknown[]) => void)(...args)
      }
    } else if (slotValue !== undefined) {
      merged[key] = slotValue
    }
  }

  return merged
}

type RefDescriptor = { get?: { isReactWarning?: boolean } }

function isWarningGetter(target: object) {
  const descriptor = Object.getOwnPropertyDescriptor(target, 'ref') as
    RefDescriptor | undefined
  return descriptor?.get?.isReactWarning === true
}

// React 19 reads the ref from props and React 18 from the element, and each
// warns when the other location is read, so check which one is the real ref
function getChildRef(
  child: ReactElement<{ ref?: Ref<HTMLElement> }>,
): Ref<HTMLElement> | undefined {
  const elementWithRef = child as typeof child & { ref?: Ref<HTMLElement> }

  if (isWarningGetter(child.props)) return elementWithRef.ref
  if (isWarningGetter(child)) return child.props.ref

  return child.props.ref ?? elementWithRef.ref
}

function describeInvalidChild(children: ReactNode) {
  if (typeof children === 'string' || typeof children === 'number') {
    return 'text'
  }
  if (Array.isArray(children)) return 'multiple children'
  return typeof children
}

export const Slot = forwardRef<HTMLElement, SlotProps>(function Slot(
  { children, ...slotProps },
  ref,
) {
  const child = isValidElement(children)
    ? (children as ReactElement<Record<string, unknown>>)
    : null
  const childRef = child ? getChildRef(child) : undefined

  const mergedRef = useMemo(
    () => (childRef ? mergeRefs<HTMLElement>(ref, childRef) : ref),
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
