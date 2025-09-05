import { forwardRef, ReactNode } from 'react'

export type BannerContentProps = {
  /** Complex content with any HTML elements */
  children: ReactNode
} & React.HTMLAttributes<HTMLDivElement>

export const BannerContent = forwardRef<HTMLDivElement, BannerContentProps>(
  function BannerContent({ children, ...rest }, ref) {
    return (
      <div ref={ref} {...rest}>
        {children}
      </div>
    )
  },
)
