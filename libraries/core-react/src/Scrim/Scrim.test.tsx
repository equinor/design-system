/* eslint-disable no-undef */
import React, { useState } from 'react'
import { render, cleanup, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { scrim as tokens } from './Scrim.tokens'
import { Scrim } from './Scrim'

const StyledScrim = styled(Scrim)`
  background: red;
`

const { width, height } = tokens

afterEach(cleanup)

const DismissableScrim = () => {
  const [visibleScrim, setVisibleScrim] = useState(true)

  const handleClose = (event, closed) => {
    if (closed !== undefined) {
      setVisibleScrim(closed)
    } else {
      setVisibleScrim(!visibleScrim)
    }
  }

  return visibleScrim ? (
    <Scrim onClose={handleClose} isDismissable={true}>
      <button type="button" onClick={() => setVisibleScrim(false)}>
        OK
      </button>
    </Scrim>
  ) : null
}

describe('Scrim', () => {
  it('Is dismissable with button click', () => {
    const { container } = render(<DismissableScrim />)
    const scrim = container.firstChild

    expect(scrim).toBeInTheDocument()
    expect(screen.queryByText('OK')).toBeVisible()
    const targetButton = screen.queryByText('OK')
    fireEvent.click(targetButton)
    expect(scrim).not.toBeInTheDocument()
  })

  it('Is dismissable with component click', () => {
    const { container } = render(<DismissableScrim />)
    const scrim = container.firstChild

    expect(scrim).toBeInTheDocument()
    expect(screen.queryByText('OK')).toBeVisible()
    fireEvent.click(scrim)
    expect(scrim).not.toBeInTheDocument()
  })

  it('Is dismissable with Esc', () => {
    const { container } = render(<DismissableScrim />)
    const scrim = container.firstChild

    expect(scrim).toBeInTheDocument()
    expect(screen.queryByText('OK')).toBeVisible()
    fireEvent.keyDown(scrim, {
      key: 'Escape',
      keyCode: 27,
    })
    expect(scrim).not.toBeInTheDocument()
  })

  it('Has correct style rules when visible', () => {
    const { container } = render(<StyledScrim />)
    const scrim = container.firstChild
    expect(scrim).toHaveStyleRule('display', 'flex')
  })
  it('Can extend the css for the component', () => {
    const { container } = render(<StyledScrim />)
    const scrim = container.firstChild
    expect(scrim).toHaveStyleRule('background', 'red')
    expect(scrim).toHaveStyleRule('width', width)
    expect(scrim).toHaveStyleRule('height', height)
  })
})
