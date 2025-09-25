/* eslint-disable import/export */
import {
  ReactElement,
  ReactNode,
  cloneElement,
  useRef,
  Children as ReactChildren,
  useState,
  useEffect,
} from 'react'
import { render, RenderOptions, RenderResult } from '@testing-library/react'

const AllTheProviders = ({ children }: { children: ReactNode }) => {
  const anchorRef = useRef<HTMLButtonElement>(null)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>(null)

  useEffect(() => {
    if (anchorRef.current) {
      setAnchorEl(anchorRef.current)
    }
  }, [anchorRef])

  const updatedChildren = ReactChildren.map(children, (child) =>
    cloneElement(
      child as ReactElement<{ anchorEl?: HTMLButtonElement | null }>,
      {
        anchorEl,
      },
    ),
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
