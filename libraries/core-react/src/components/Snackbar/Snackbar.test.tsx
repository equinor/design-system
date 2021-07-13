/* eslint-disable no-undef */
import {
  render,
  cleanup,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { Snackbar, SnackbarProps } from '.'

afterEach(cleanup)

const StyledSnackbar = styled(Snackbar)<SnackbarProps>`
  clip-path: unset;
`
const message = "Hi, I'm the snackbar"
const TestSnackbar = (open: boolean) => {
  return (
    <StyledSnackbar open={open} data-testid="test-snackbar">
      {message}
    </StyledSnackbar>
  )
}

describe('Snackbar', () => {
  it('Can extend the css for the component', () => {
    render(
      <StyledSnackbar open data-testid="test-snackbar">
        {message}
      </StyledSnackbar>,
    )
    expect(screen.getByTestId('test-snackbar')).toHaveStyleRule(
      'clip-path',
      'unset',
    )
  })
  it('Sets the message', () => {
    render(<Snackbar open>{message}</Snackbar>)
    const snackbar = screen.getByText(message)
    expect(snackbar).toBeDefined()
  })
  it('Is only visible when the open prop is true', () => {
    const { rerender } = render(
      <StyledSnackbar open={false} data-testid="test-snackbar-1">
        {message}
      </StyledSnackbar>,
    )
    expect(screen.queryAllByTestId('test-snackbar-1')).toHaveLength(0)
    rerender(
      <StyledSnackbar open data-testid="test-snackbar-2">
        {message}
      </StyledSnackbar>,
    )
    expect(screen.getByTestId('test-snackbar-2')).toBeDefined()
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
        <Snackbar.Action>
          <button type="button">{buttonText}</button>
        </Snackbar.Action>
      </Snackbar>,
    )
    expect(queryByText(buttonText)).toBeDefined()
  })
})
