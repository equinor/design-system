/* eslint-disable no-undef */
import { useState } from 'react'
import { render, cleanup, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { scrim as tokens } from './Scrim.tokens'
import { Scrim } from '.'

const StyledScrim = styled(Scrim)`
  background: red;
`

const { width, height } = tokens

afterEach(cleanup)

const DismissableScrim = (props) => {
  const [visibleScrim, setVisibleScrim] = useState(true)

  const handleClose = (event, closed) => {
    if (closed !== undefined) {
      setVisibleScrim(closed)
    } else {
      setVisibleScrim(!visibleScrim)
    }
  }

  return visibleScrim ? (
    <Scrim onClose={handleClose} isDismissable {...props}>
      <button type="button" onClick={() => setVisibleScrim(false)}>
        OK
      </button>
    </Scrim>
  ) : null
}

describe('Scrim', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(<DismissableScrim />)
    expect(asFragment()).toMatchSnapshot()
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
      keyCode: 27,
    })
    expect(scrim).not.toBeInTheDocument()
  })

  it('Has correct style rules when visible', () => {
    render(<StyledScrim data-testid="scrim" />)
    const scrim = screen.getByTestId('scrim')

    expect(scrim).toHaveStyleRule('display', 'flex')
  })
  it('Can extend the css for the component', () => {
    render(<StyledScrim data-testid="scrim" />)
    const scrim = screen.getByTestId('scrim')

    expect(scrim).toHaveStyleRule('background', 'red')
    expect(scrim).toHaveStyleRule('width', width)
    expect(scrim).toHaveStyleRule('height', height)
  })
})
