// test-utils.js
import React from 'react'
import { render } from '@testing-library/react'

// eslint-disable-next-line react/prop-types
const AllTheProviders = ({ children }) => {
  const anchorRef = React.useRef()
  const [anchorEl, setAnchorEl] = React.useState(null)

  React.useEffect(() => {
    setAnchorEl(anchorRef.current)
  }, [anchorRef])

  const updatedChildren = React.Children.map(children, (child) =>
    React.cloneElement(child, { anchorEl }),
  )

  return (
    <>
      <button style={{ top: 0, right: 0, float: 'right' }} ref={anchorRef}>
        Anchor
      </button>
      {updatedChildren}
    </>
  )
}

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }
