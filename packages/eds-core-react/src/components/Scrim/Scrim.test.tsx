/* eslint-disable no-undef */
import { useState } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import { axe } from 'jest-axe'
import { styled } from 'styled-components'
import { scrim as tokens } from './Scrim.tokens'
import { Scrim } from '.'

const StyledScrim = styled(Scrim)`
  background: red;
`

const { width, height } = tokens

const DismissableScrim = (props) => {
  const [visibleScrim, setVisibleScrim] = useState(true)

  const handleClose = () => {
    setVisibleScrim(false)
  }

  return (
    <Scrim onClose={handleClose} open={visibleScrim} isDismissable {...props}>
      <button type="button" onClick={handleClose}>
        OK
      </button>
    </Scrim>
  )
}

describe('Scrim', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(<DismissableScrim />)
    expect(asFragment()).toMatchSnapshot()
  })
  it('Shoud pass a11y test', async () => {
    const { container } = render(<DismissableScrim />)
    expect(await axe(container)).toHaveNoViolations()
  })
  it('Is dismissable with button click', () => {
    render(<DismissableScrim data-testid="scrim" />)
    const scrim = screen.getByTestId('scrim')

    expect(scrim).toBeInTheDocument()
    expect(screen.queryByText('OK')).toBeVisible()
    const targetButton = screen.queryByText('OK')
    fireEvent.click(targetButton)
    expect(scrim).not.toBeInTheDocument()
  })
  it('Is dismissable with Esc', () => {
    render(<DismissableScrim data-testid="scrim" />)
    const scrim = screen.getByTestId('scrim')

    expect(scrim).toBeInTheDocument()
    expect(screen.queryByText('OK')).toBeVisible()
    fireEvent.keyDown(scrim, {
      key: 'Escape',
    })
    expect(scrim).not.toBeInTheDocument()
  })

  it('Has correct style rules when visible', () => {
    render(<StyledScrim open={true} data-testid="scrim" />)
    const scrim = screen.getByTestId('scrim')

    expect(scrim).toHaveStyleRule('display', 'flex')
  })
  it('Can extend the css for the component', () => {
    render(<StyledScrim open={true} data-testid="scrim" />)
    const scrim = screen.getByTestId('scrim')

    expect(scrim).toHaveStyleRule('background', 'red')
    expect(scrim).toHaveStyleRule('width', width)
    expect(scrim).toHaveStyleRule('height', height)
  })

  it('Is scroll disabled when scrim is open', () => {
    render(<DismissableScrim data-testid="scrim" />)
    expect(screen.queryByText('OK')).toBeVisible()
    const overflow = document.body.style.overflow
    expect(overflow).toEqual('hidden')
  })
  it('Is scroll enabled with Esc', () => {
    const defaultOverflow = document.body.style.overflow
    render(<DismissableScrim data-testid="scrim" />)
    const scrim = screen.getByTestId('scrim')
    expect(screen.queryByText('OK')).toBeVisible()
    fireEvent.keyDown(scrim, {
      key: 'Escape',
    })
    const overflow = document.body.style.overflow
    expect(overflow).toEqual(defaultOverflow)
  })
  it('Is scroll enabled with button click', () => {
    const defaultOverflow = document.body.style.overflow
    render(<DismissableScrim data-testid="scrim" />)
    const targetButton = screen.queryByText('OK')
    fireEvent.click(targetButton)
    const overflow = document.body.style.overflow
    expect(overflow).toEqual(defaultOverflow)
  })
})
