/* eslint-disable react/require-default-props */
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react'
import { useState, useRef, HTMLAttributes } from 'react'
import { usePopper, Placement } from './usePopper'

type MenuProps = {
  placement?: Placement
  offset?: number
} & HTMLAttributes<HTMLDivElement>

const TestComponent = ({
  placement = 'auto',
  offset = 10,
  ...rest
}: MenuProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>(null)
  const anchorRef = useRef<HTMLButtonElement>(null)
  const [popperEl, setPopperEl] = useState<HTMLDivElement>(null)
  const { styles, attributes } = usePopper(
    anchorEl,
    popperEl,
    null,
    placement,
    offset,
  )

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
afterEach(cleanup)

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

  it('Should forward placement and offset to popper', async () => {
    render(<TestComponent placement="left" offset={20} />)
    const button = screen.getByText('click')
    const menu = screen.getByRole('menu')
    const content = screen.getByText('content')

    fireEvent.click(button)

    await waitFor(() => {
      expect(menu).toHaveAttribute('data-popper-placement', 'left')
      expect(content.style.transform).toBe('translate(-20px, 0px)')
    })
  })
})
