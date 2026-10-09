import type { ReactElement, Ref } from 'react'

type RefDescriptor = { get?: { isReactWarning?: boolean } }

// In development React puts a warning getter on the location it doesn't use
const isWarningGetter = (target: object): boolean => {
  const descriptor = Object.getOwnPropertyDescriptor(target, 'ref') as
    RefDescriptor | undefined
  return descriptor?.get?.isReactWarning === true
}

// React 18 stores the ref on `element.ref`; React 19 stores it on `element.props.ref`.
// Reading the location a version doesn't use logs a warning, so skip it when it's a warning getter.
export const getElementRef = <T = unknown>(
  element: ReactElement,
): Ref<T> | null => {
  const props = (element as { props?: { ref?: Ref<T> } }).props
  const elementWithRef = element as unknown as { ref?: Ref<T> }

  if (props && isWarningGetter(props)) return elementWithRef.ref ?? null
  if (isWarningGetter(element)) return props?.ref ?? null

  return props?.ref ?? elementWithRef.ref ?? null
}
