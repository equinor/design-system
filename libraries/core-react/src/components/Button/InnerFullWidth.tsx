import { forwardRef, Children as ReactChildren, HTMLAttributes } from 'react'
import './button.inner.css'

export const InnerFullWidth = forwardRef<
  HTMLSpanElement,
  HTMLAttributes<HTMLSpanElement>
>(function InnerFullWidth({ children }, ref) {
  // We need everything in elements for proper flexing 💪
  const updatedChildren = ReactChildren.map(children, (child) =>
    typeof child !== 'object' ? (
      <span style={{ textAlign: 'center', flex: 1 }}>{child}</span>
    ) : (
      child
    ),
  )

  return (
    <span className="eds-btn-inner--full-width" ref={ref}>
      {updatedChildren}
    </span>
  )
})
