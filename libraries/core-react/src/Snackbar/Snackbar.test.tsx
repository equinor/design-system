/* eslint-disable no-undef */

import React from 'react'
import {
  render,
  cleanup,
  waitForElementToBeRemoved,
} from '@testing-library/react'

import '@testing-library/jest-dom'

import 'jest-styled-components'
import styled from 'styled-components'

import { Snackbar } from './index'

const { SnackbarAction } = Snackbar

afterEach(cleanup)

const StyledSnackbar = styled(Snackbar)`
  clip-path: unset;
`
const message = "Hi, I'm the snackbar"

describe('Snackbar', () => {
  it('Can extend the css for the component', () => {
    const { container } = render(
      <StyledSnackbar open>{message}</StyledSnackbar>,
    )
    expect(container.firstChild).toHaveStyleRule('clip-path', 'unset')
  })
  it('Sets the message', () => {
    const { getByText } = render(<Snackbar open>{message}</Snackbar>)
    const snackbar = getByText(message)
    expect(snackbar).toBeDefined()
  })
  it('Is only visible when the open prop is true', () => {
    const { rerender, container } = render(
      <StyledSnackbar open={false}>{message}</StyledSnackbar>,
    )
    expect(container.firstChild).toBe(null)
    rerender(<StyledSnackbar open>{message}</StyledSnackbar>)
    expect(container.firstChild).not.toBe(null)
  })
  it('Disappears automatically after a provided timeout', async () => {
    const { queryByText } = render(
      <Snackbar open autoHideDuration={1000}>
        {message}
      </Snackbar>,
    )
    expect(queryByText(message)).toBeDefined()
    await waitForElementToBeRemoved(() => queryByText(message))
  })
  it('Can have one button attached', () => {
    const buttonText = "I'm the button"
    const { queryByText } = render(
      <Snackbar open>
        {message}
        <SnackbarAction>
          <button type="button">{buttonText}</button>
        </SnackbarAction>
      </Snackbar>,
    )
    expect(queryByText(buttonText)).toBeDefined()
  })
})
