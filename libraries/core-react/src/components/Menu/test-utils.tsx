import * as React from 'react'
import { ElementType, ReactElement, ReactNode, MutableRefObject } from 'react'
import { render, RenderOptions, RenderResult } from '@testing-library/react'

const AllTheProviders = ({ children }: { children: ReactNode }) => {
  const anchorRef = React.useRef(null)
  const [anchorEl, setAnchorEl] = React.useState<ElementType>(null)

  React.useEffect(() => {
    if (anchorRef.current) {
      setAnchorEl(anchorRef.current)
    }
  }, [anchorRef])

  const updatedChildren = React.Children.map(children, (child) =>
    React.cloneElement(child as ReactElement, {
      anchorEl,
    }),
  ) as ReactNode

  return (
    <>
      <button style={{ top: 0, right: 0, float: 'right' }} ref={anchorRef}>
        Anchor
      </button>
      {updatedChildren}
    </>
  )
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'queries'>,
): RenderResult => render(ui, { wrapper: AllTheProviders, ...options })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }
