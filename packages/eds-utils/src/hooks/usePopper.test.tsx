import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useState, useRef } from 'react'
import { usePopper } from './usePopper'

const TestComponent = ({ ...rest }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>(null)
  const anchorRef = useRef<HTMLButtonElement>(null)
  const [popperEl, setPopperEl] = useState<HTMLDivElement>(null)
  const { styles, attributes } = usePopper(anchorEl, popperEl)

  const handleClick = () => {
    if (!isOpen) {
      setIsOpen(true)
      setAnchorEl(anchorRef.current)
    } else {
      setIsOpen(false)
      setAnchorEl(null)
    }
  }

  const containerProps = {
    ...attributes.popper,
  }
  const stylesProps = {
    style: { ...styles.popper },
  }
  return (
    <div {...rest}>
      <button onClick={handleClick} ref={anchorRef}>
        click
      </button>
      <div role="menu" ref={setPopperEl} {...containerProps}>
        <div {...stylesProps}>content</div>
      </div>
    </div>
  )
}

describe('usePopper', () => {
  it('Should add popper attributes and styles after usePopper recieves anchor element', async () => {
    render(<TestComponent />)
    const button = screen.getByText('click')
    const menu = screen.getByRole('menu')
    const content = screen.getByText('content')

    expect(menu).not.toHaveAttribute('data-popper-placement')
    fireEvent.click(button)

    await waitFor(() => {
      expect(menu).toHaveAttribute('data-popper-placement', 'top')
      expect(content).toHaveAttribute('style')
    })
  })
})
