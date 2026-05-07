import type { ReactElement, Ref } from 'react'

// React 18 stores the ref on `element.ref`; React 19 stores it on `element.props.ref`.
// Read props.ref first to avoid the React 19 deprecation warning on element.ref access.
export const getElementRef = <T = unknown>(
  element: ReactElement,
): Ref<T> | undefined => {
  const propsRef = (element as { props?: { ref?: Ref<T> } }).props?.ref
  if (propsRef != null) return propsRef
  return (element as unknown as { ref?: Ref<T> }).ref
}
