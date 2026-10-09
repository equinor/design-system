import type { ReactElement, Ref } from 'react'

type RefDescriptor = { get?: { isReactWarning?: boolean } }

// React 18 stores the ref on `element.ref`; React 19 stores it on `element.props.ref`.
// In development React 18 also puts a warning getter on `props.ref`, so skip it when present.
// React 19's `element.ref` getter is only defined when `props.ref` is set, which is read first.
export const getElementRef = <T = unknown>(
  element: ReactElement,
): Ref<T> | null => {
  const props = (element as { props?: { ref?: Ref<T> } }).props
  const elementWithRef = element as unknown as { ref?: Ref<T> }

  const propsDescriptor = props
    ? (Object.getOwnPropertyDescriptor(props, 'ref') as
        RefDescriptor | undefined)
    : undefined
  if (propsDescriptor?.get?.isReactWarning) return elementWithRef.ref ?? null

  return props?.ref ?? elementWithRef.ref ?? null
}
